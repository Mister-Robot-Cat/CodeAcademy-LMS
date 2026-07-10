using MediatR;
using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Application.Common.Models;

namespace CodeAcademyLMS.Application.Auth.Commands.Refresh;

public record RefreshTokenCommand : IRequest<AuthResponse?>
{
    public string AccessToken { get; init; } = string.Empty;
    public string RefreshToken { get; init; } = string.Empty;
    public string IpAddress { get; init; } = string.Empty;
}

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponse?>
{
    private readonly IIdentityService _identityService;

    public RefreshTokenCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<AuthResponse?> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        return await _identityService.RefreshTokenAsync(
            request.AccessToken,
            request.RefreshToken,
            request.IpAddress);
    }
}
