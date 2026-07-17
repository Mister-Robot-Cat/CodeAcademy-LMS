using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Groups.Commands.UnenrollStudent;

public record UnenrollStudentCommand(Guid GroupId, Guid StudentProfileId) : IRequest<bool>;

public class UnenrollStudentCommandHandler : IRequestHandler<UnenrollStudentCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UnenrollStudentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UnenrollStudentCommand request, CancellationToken cancellationToken)
    {
        var enrollment = await _context.Enrollments
            .FirstOrDefaultAsync(e => e.GroupId == request.GroupId && e.StudentProfileId == request.StudentProfileId && e.Status == Domain.Enums.EnrollmentStatus.Active, cancellationToken);

        if (enrollment == null)
        {
            throw new Exception("Active enrollment not found.");
        }

        enrollment.Status = Domain.Enums.EnrollmentStatus.Dropped;
        enrollment.DroppedAt = DateTime.UtcNow;

        _context.Enrollments.Update(enrollment);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
