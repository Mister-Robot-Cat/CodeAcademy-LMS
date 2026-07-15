using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Application.Common.Models;
using CodeAcademyLMS.Domain.Entities;
using CodeAcademyLMS.Infrastructure.Data;

namespace CodeAcademyLMS.Infrastructure.Services;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ITokenService _tokenService;
    private readonly ApplicationDbContext _context;

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ITokenService tokenService,
        ApplicationDbContext context)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _tokenService = tokenService;
        _context = context;
    }

    public async Task<AuthResponse?> RegisterAsync(
        string email,
        string password,
        string firstName,
        string lastName,
        string role,
        string ipAddress)
    {
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser != null)
        {
            return null;
        }

        var roleExists = await _roleManager.RoleExistsAsync(role);
        if (!roleExists)
        {
            await _roleManager.CreateAsync(new IdentityRole(role));
        }

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new Exception($"User creation failed: {errors}");
        }

        await _userManager.AddToRoleAsync(user, role);

        if (role == "Student")
        {
            var studentProfile = new StudentProfile
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                EnrollmentDate = DateTime.UtcNow,
                GPA = 0.0
            };
            _context.StudentProfiles.Add(studentProfile);
            await _context.SaveChangesAsync();
        }
        else if (role == "Teacher")
        {
            var teacherProfile = new TeacherProfile
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Specialization = string.Empty
            };
            _context.TeacherProfiles.Add(teacherProfile);
            await _context.SaveChangesAsync();
        }

        var roles = new[] { role };
        var accessToken = _tokenService.GenerateAccessToken(user, roles);
        var refreshToken = _tokenService.GenerateRefreshToken(ipAddress);

        user.RefreshTokens.Add(refreshToken);
        await _userManager.UpdateAsync(user);

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token,
            RefreshTokenExpiration = refreshToken.Expires,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = roles
        };
    }

    public async Task<AuthResponse?> LoginAsync(string email, string password, string ipAddress)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || !user.IsActive)
        {
            return null;
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, password);
        if (!isPasswordValid)
        {
            return null;
        }

        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _tokenService.GenerateAccessToken(user, roles);
        var refreshToken = _tokenService.GenerateRefreshToken(ipAddress);

        var oldTokens = await _context.RefreshTokens
            .Where(t => t.UserId == user.Id && (t.Revoked != null || DateTime.UtcNow >= t.Expires) && t.Created < DateTime.UtcNow.AddDays(-30))
            .ToListAsync();
        _context.RefreshTokens.RemoveRange(oldTokens);

        user.RefreshTokens.Add(refreshToken);
        await _userManager.UpdateAsync(user);

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token,
            RefreshTokenExpiration = refreshToken.Expires,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = roles
        };
    }

    public async Task<AuthResponse?> RefreshTokenAsync(string accessToken, string refreshToken, string ipAddress)
    {
        var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
        if (principal == null)
        {
            return null;
        }

        var userId = _userManager.GetUserId(principal);
        if (string.IsNullOrEmpty(userId))
        {
            return null;
        }

        var user = await _context.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null || !user.IsActive)
        {
            return null;
        }

        var activeRefreshToken = user.RefreshTokens.FirstOrDefault(x => x.Token == refreshToken && x.Revoked == null && DateTime.UtcNow < x.Expires);
        if (activeRefreshToken == null)
        {
            return null;
        }

        var newRefreshToken = _tokenService.GenerateRefreshToken(ipAddress);
        activeRefreshToken.Revoked = DateTime.UtcNow;
        activeRefreshToken.RevokedByIp = ipAddress;
        activeRefreshToken.ReplacedByToken = newRefreshToken.Token;

        user.RefreshTokens.Add(newRefreshToken);
        _context.Update(user);
        await _context.SaveChangesAsync();

        var roles = await _userManager.GetRolesAsync(user);
        var newAccessToken = _tokenService.GenerateAccessToken(user, roles);

        return new AuthResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken.Token,
            RefreshTokenExpiration = newRefreshToken.Expires,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = roles
        };
    }

    public async Task<bool> RevokeTokenAsync(string token, string ipAddress)
    {
        var refreshToken = await _context.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == token && t.Revoked == null && DateTime.UtcNow < t.Expires);

        if (refreshToken == null)
        {
            return false;
        }

        refreshToken.Revoked = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;
        
        _context.Update(refreshToken);
        await _context.SaveChangesAsync();
        return true;
    }
}
