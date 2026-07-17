using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Groups.Commands.AssignTeacherToGroup;

public record AssignTeacherToGroupCommand(Guid GroupId, Guid TeacherProfileId, string Subject) : IRequest<bool>;

public class AssignTeacherToGroupCommandHandler : IRequestHandler<AssignTeacherToGroupCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public AssignTeacherToGroupCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(AssignTeacherToGroupCommand request, CancellationToken cancellationToken)
    {
        var teacherExists = await _context.TeacherProfiles.AnyAsync(t => t.Id == request.TeacherProfileId, cancellationToken);
        if (!teacherExists) throw new Exception("Teacher not found.");

        var groupExists = await _context.Groups.AnyAsync(g => g.Id == request.GroupId, cancellationToken);
        if (!groupExists) throw new Exception("Group not found.");

        var existingAssignment = await _context.GroupTeachers
            .FirstOrDefaultAsync(gt => gt.GroupId == request.GroupId && gt.TeacherProfileId == request.TeacherProfileId && gt.Subject == request.Subject, cancellationToken);

        if (existingAssignment != null)
        {
            throw new Exception("Teacher is already assigned to this group for this subject.");
        }

        var assignment = new CodeAcademyLMS.Domain.Entities.GroupTeacher
        {
            Id = Guid.NewGuid(),
            GroupId = request.GroupId,
            TeacherProfileId = request.TeacherProfileId,
            Subject = request.Subject,
            AssignedAt = DateTime.UtcNow
        };

        _context.GroupTeachers.Add(assignment);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
