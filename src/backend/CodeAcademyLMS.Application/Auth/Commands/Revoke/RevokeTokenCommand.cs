using MediatR;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Auth.Commands.Revoke;

public record RevokeTokenCommand : IRequest<bool>
{
    public string RefreshToken { get; init; } = string.Empty;
    public string IpAddress { get; init; } = string.Empty;
}

public class RevokeTokenCommandHandler : IRequestHandler<RevokeTokenCommand, bool>
{
    private readonly IIdentityService _identityService;

    public RevokeTokenCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<bool> Handle(RevokeTokenCommand request, CancellationToken cancellationToken)
    {
        return await _identityService.RevokeTokenAsync(request.RefreshToken, request.IpAddress);
    }
}
