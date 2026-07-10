using CodeAcademyLMS.Application.Common.Models;

namespace CodeAcademyLMS.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<AuthResponse?> RegisterAsync(string email, string password, string firstName, string lastName, string role, string ipAddress);
    Task<AuthResponse?> LoginAsync(string email, string password, string ipAddress);
    Task<AuthResponse?> RefreshTokenAsync(string accessToken, string refreshToken, string ipAddress);
    Task<bool> RevokeTokenAsync(string token, string ipAddress);
}
