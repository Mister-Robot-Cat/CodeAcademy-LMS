using System.Security.Claims;
using CodeAcademyLMS.Domain.Entities;

namespace CodeAcademyLMS.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(ApplicationUser user, IEnumerable<string> roles);
    RefreshToken GenerateRefreshToken(string ipAddress);
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
