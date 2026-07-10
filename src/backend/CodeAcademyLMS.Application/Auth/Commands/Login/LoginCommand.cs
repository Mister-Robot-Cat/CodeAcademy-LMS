using MediatR;
using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Application.Common.Models;

namespace CodeAcademyLMS.Application.Auth.Commands.Login;

public record LoginCommand : IRequest<AuthResponse?>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string IpAddress { get; init; } = string.Empty;
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse?>
{
    private readonly IIdentityService _identityService;

    public LoginCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<AuthResponse?> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        return await _identityService.LoginAsync(
            request.Email,
            request.Password,
            request.IpAddress);
    }
}
