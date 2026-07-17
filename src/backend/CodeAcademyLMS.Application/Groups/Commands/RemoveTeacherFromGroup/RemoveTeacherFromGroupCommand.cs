using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Groups.Commands.RemoveTeacherFromGroup;

public record RemoveTeacherFromGroupCommand(Guid GroupId, Guid TeacherProfileId) : IRequest<bool>;

public class RemoveTeacherFromGroupCommandHandler : IRequestHandler<RemoveTeacherFromGroupCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public RemoveTeacherFromGroupCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(RemoveTeacherFromGroupCommand request, CancellationToken cancellationToken)
    {
        var assignment = await _context.GroupTeachers
            .FirstOrDefaultAsync(gt => gt.GroupId == request.GroupId && gt.TeacherProfileId == request.TeacherProfileId, cancellationToken);

        if (assignment == null)
        {
            throw new Exception("Assignment not found.");
        }

        _context.GroupTeachers.Remove(assignment);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
