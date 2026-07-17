using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Groups.Commands.UpdateGroup;

public record UpdateGroupCommand(Guid Id, string Name, Guid SemesterId) : IRequest<bool>;

public class UpdateGroupCommandHandler : IRequestHandler<UpdateGroupCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateGroupCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
    {
        var group = await _context.Groups.FirstOrDefaultAsync(g => g.Id == request.Id, cancellationToken);

        if (group == null)
        {
            throw new Exception($"Group with ID {request.Id} was not found.");
        }

        var semesterExists = await _context.Semesters.AnyAsync(s => s.Id == request.SemesterId, cancellationToken);
        if (!semesterExists)
        {
            throw new Exception($"Semester with ID {request.SemesterId} was not found.");
        }

        group.Name = request.Name;
        group.SemesterId = request.SemesterId;

        _context.Groups.Update(group);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
