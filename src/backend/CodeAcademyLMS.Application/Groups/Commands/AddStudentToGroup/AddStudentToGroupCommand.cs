using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Groups.Commands.AddStudentToGroup;

public record AddStudentToGroupCommand : IRequest<bool>
{
    public Guid GroupId { get; init; }
    public Guid StudentProfileId { get; init; }
}

public class AddStudentToGroupCommandHandler : IRequestHandler<AddStudentToGroupCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public AddStudentToGroupCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(AddStudentToGroupCommand request, CancellationToken cancellationToken)
    {
        var groupExists = await _context.Groups
            .AnyAsync(g => g.Id == request.GroupId, cancellationToken);

        if (!groupExists)
        {
            throw new Exception($"Group with ID {request.GroupId} was not found.");
        }

        var student = await _context.StudentProfiles
            .FirstOrDefaultAsync(s => s.Id == request.StudentProfileId, cancellationToken);

        if (student == null)
        {
            throw new Exception($"Student profile with ID {request.StudentProfileId} was not found.");
        }

        var enrollment = new CodeAcademyLMS.Domain.Entities.Enrollment
        {
            GroupId = request.GroupId,
            StudentProfileId = request.StudentProfileId,
            EnrolledAt = DateTime.UtcNow,
            Status = CodeAcademyLMS.Domain.Enums.EnrollmentStatus.Active
        };

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
