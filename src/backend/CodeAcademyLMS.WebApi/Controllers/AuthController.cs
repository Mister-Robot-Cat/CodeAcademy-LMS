using Microsoft.AspNetCore.Mvc;
using CodeAcademyLMS.Application.Auth.Commands.Login;
using CodeAcademyLMS.Application.Auth.Commands.Refresh;
using CodeAcademyLMS.Application.Auth.Commands.Register;
using CodeAcademyLMS.Application.Auth.Commands.Revoke;
using CodeAcademyLMS.Application.Common.Models;

namespace CodeAcademyLMS.WebApi.Controllers;

public class AuthController : ApiControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequestDto request)
    {
        var command = new RegisterCommand
        {
            Email = request.Email,
            Password = request.Password,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Role = request.Role,
            IpAddress = GetIpAddress()
        };

        var response = await Mediator.Send(command);
        if (response == null)
        {
            return BadRequest(new { message = "Registration failed. User may already exist." });
        }

        SetRefreshTokenCookie(response.RefreshToken, response.RefreshTokenExpiration);
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequestDto request)
    {
        var command = new LoginCommand
        {
            Email = request.Email,
            Password = request.Password,
            IpAddress = GetIpAddress()
        };

        var response = await Mediator.Send(command);
        if (response == null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        SetRefreshTokenCookie(response.RefreshToken, response.RefreshTokenExpiration);
        return Ok(response);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> Refresh(RefreshRequestDto request)
    {
        var refreshToken = Request.Cookies["refreshToken"] ?? request.RefreshToken;
        if (string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest(new { message = "Refresh token is required." });
        }

        var command = new RefreshTokenCommand
        {
            AccessToken = request.AccessToken,
            RefreshToken = refreshToken,
            IpAddress = GetIpAddress()
        };

        var response = await Mediator.Send(command);
        if (response == null)
        {
            return Unauthorized(new { message = "Invalid refresh token session." });
        }

        SetRefreshTokenCookie(response.RefreshToken, response.RefreshTokenExpiration);
        return Ok(response);
    }

    [HttpPost("revoke")]
    public async Task<IActionResult> Revoke(RevokeRequestDto request)
    {
        var refreshToken = Request.Cookies["refreshToken"] ?? request.RefreshToken;
        if (string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest(new { message = "Token is required." });
        }

        var command = new RevokeTokenCommand
        {
            RefreshToken = refreshToken,
            IpAddress = GetIpAddress()
        };

        var result = await Mediator.Send(command);
        if (!result)
        {
            return BadRequest(new { message = "Invalid or expired token." });
        }

        Response.Cookies.Delete("refreshToken");
        return Ok(new { message = "Token revoked successfully." });
    }

    private void SetRefreshTokenCookie(string token, DateTime expires)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = expires,
            SameSite = SameSiteMode.Lax,
            Secure = true
        };
        Response.Cookies.Append("refreshToken", token, cookieOptions);
    }
}

public record RegisterRequestDto(string Email, string Password, string FirstName, string LastName, string Role);
public record LoginRequestDto(string Email, string Password);
public record RefreshRequestDto(string AccessToken, string? RefreshToken);
public record RevokeRequestDto(string? RefreshToken);
