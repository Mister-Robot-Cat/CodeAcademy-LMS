using MediatR;
using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Application.Common.Models;

namespace CodeAcademyLMS.Application.Auth.Commands.Register;

public record RegisterCommand : IRequest<AuthResponse?>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public string IpAddress { get; init; } = string.Empty;
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse?>
{
    private readonly IIdentityService _identityService;

    public RegisterCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<AuthResponse?> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        return await _identityService.RegisterAsync(
            request.Email,
            request.Password,
            request.FirstName,
            request.LastName,
            request.Role,
            request.IpAddress);
    }
}
