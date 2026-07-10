namespace CodeAcademyLMS.Application.Common.Models;

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime RefreshTokenExpiration { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public IList<string> Roles { get; set; } = new List<string>();
}
