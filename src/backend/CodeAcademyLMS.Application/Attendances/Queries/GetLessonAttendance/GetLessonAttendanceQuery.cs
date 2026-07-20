using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodeAcademyLMS.Application.Attendances.Queries.GetLessonAttendance;

public record LessonAttendanceDto(
    Guid StudentProfileId,
    string StudentName,
    AttendanceStatus? Status,
    string? Notes
);

public record GetLessonAttendanceQuery(Guid LessonId) : IRequest<List<LessonAttendanceDto>>;

public class GetLessonAttendanceQueryHandler : IRequestHandler<GetLessonAttendanceQuery, List<LessonAttendanceDto>>
{
    private readonly IApplicationDbContext _context;

    public GetLessonAttendanceQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<LessonAttendanceDto>> Handle(GetLessonAttendanceQuery request, CancellationToken cancellationToken)
    {
        var lesson = await _context.Lessons
            .Include(l => l.Group)
                .ThenInclude(g => g.Enrollments)
                    .ThenInclude(e => e.Student)
                        .ThenInclude(s => s.User)
            .Include(l => l.Attendances)
            .FirstOrDefaultAsync(l => l.Id == request.LessonId, cancellationToken);

        if (lesson == null)
            throw new Exception("Lesson not found");

        var result = new List<LessonAttendanceDto>();

        // Create a list with ALL students in the group, showing their attendance (or null if not marked)
        foreach (var enrollment in lesson.Group!.Enrollments)
        {
            var student = enrollment.Student;
            if (student == null) continue;

            var attendanceRecord = lesson.Attendances.FirstOrDefault(a => a.StudentProfileId == student.Id);
            
            result.Add(new LessonAttendanceDto(
                student.Id,
                student.User != null ? student.User.FirstName + " " + student.User.LastName : "Unknown",
                attendanceRecord?.Status,
                attendanceRecord?.Notes
            ));
        }

        return result.OrderBy(x => x.StudentName).ToList();
    }
}
