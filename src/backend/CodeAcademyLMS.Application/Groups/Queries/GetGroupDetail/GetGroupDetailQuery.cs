using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Groups.Queries.GetGroupDetail;

public record GetGroupDetailQuery(Guid Id) : IRequest<GroupDetailDto?>;

public record GroupDetailDto(Guid Id, string Name, Guid SemesterId, string? SemesterName, List<GroupStudentDto> Students, List<GroupTeacherDto> Teachers);
public record GroupStudentDto(Guid StudentProfileId, string FullName, string Email, DateTime EnrolledAt);
public record GroupTeacherDto(Guid TeacherProfileId, string FullName, string Email, string Subject);

public class GetGroupDetailQueryHandler : IRequestHandler<GetGroupDetailQuery, GroupDetailDto?>
{
    private readonly IApplicationDbContext _context;

    public GetGroupDetailQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<GroupDetailDto?> Handle(GetGroupDetailQuery request, CancellationToken cancellationToken)
    {
        var group = await _context.Groups
            .Include(g => g.Semester)
            .Include(g => g.Enrollments.Where(e => e.Status == Domain.Enums.EnrollmentStatus.Active))
            .ThenInclude(e => e.Student)
            .ThenInclude(s => s!.User)
            .Include(g => g.Teachers)
            .ThenInclude(gt => gt.Teacher)
            .ThenInclude(t => t!.User)
            .FirstOrDefaultAsync(g => g.Id == request.Id, cancellationToken);

        if (group == null) return null;

        var students = group.Enrollments
            .Where(e => e.Student?.User != null)
            .Select(e => new GroupStudentDto(
                e.StudentProfileId,
                $"{e.Student!.User!.FirstName} {e.Student.User.LastName}",
                e.Student.User.Email ?? "",
                e.EnrolledAt
            )).ToList();

        var teachers = group.Teachers
            .Where(gt => gt.Teacher?.User != null)
            .Select(gt => new GroupTeacherDto(
                gt.TeacherProfileId,
                $"{gt.Teacher!.User!.FirstName} {gt.Teacher.User.LastName}",
                gt.Teacher.User.Email ?? "",
                gt.Subject
            )).ToList();

        return new GroupDetailDto(
            group.Id,
            group.Name,
            group.SemesterId,
            group.Semester?.Name,
            students,
            teachers
        );
    }
}
