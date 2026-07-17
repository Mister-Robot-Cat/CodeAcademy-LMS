using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Groups.Commands.DeleteGroup;

public record DeleteGroupCommand(Guid Id) : IRequest<bool>;

public class DeleteGroupCommandHandler : IRequestHandler<DeleteGroupCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteGroupCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
    {
        var group = await _context.Groups
            .FirstOrDefaultAsync(g => g.Id == request.Id, cancellationToken);

        if (group == null)
        {
            throw new Exception($"Group with ID {request.Id} was not found.");
        }

        _context.Groups.Remove(group);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
