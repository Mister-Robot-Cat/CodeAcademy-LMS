using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Students.Queries.GetStudentDetail;

public record GetStudentDetailQuery(Guid Id) : IRequest<StudentDetailDto?>;

public record StudentDetailDto(Guid Id, string UserId, string FirstName, string LastName, string Email, double GPA, List<StudentEnrollmentDto> Enrollments);
public record StudentEnrollmentDto(Guid GroupId, string GroupName, string SemesterName, DateTime EnrolledAt, string Status);

public class GetStudentDetailQueryHandler : IRequestHandler<GetStudentDetailQuery, StudentDetailDto?>
{
    private readonly IApplicationDbContext _context;

    public GetStudentDetailQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StudentDetailDto?> Handle(GetStudentDetailQuery request, CancellationToken cancellationToken)
    {
        var student = await _context.StudentProfiles
            .Include(s => s.User)
            .Include(s => s.Enrollments)
            .ThenInclude(e => e.Group)
            .ThenInclude(g => g!.Semester)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (student == null) return null;

        var enrollments = student.Enrollments
            .Select(e => new StudentEnrollmentDto(
                e.GroupId,
                e.Group?.Name ?? "Unknown Group",
                e.Group?.Semester?.Name ?? "Unknown Semester",
                e.EnrolledAt,
                e.Status.ToString()
            )).ToList();

        return new StudentDetailDto(
            student.Id,
            student.UserId,
            student.User?.FirstName ?? "",
            student.User?.LastName ?? "",
            student.User?.Email ?? "",
            student.GPA,
            enrollments
        );
    }
}
