using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Students.Queries.GetStudents;

public record GetStudentsQuery : IRequest<List<StudentDto>>;

public record StudentDto(
    Guid Id,
    string FullName,
    string Email,
    string? GroupName,
    double GPA,
    DateTime EnrollmentDate
);

public class GetStudentsQueryHandler : IRequestHandler<GetStudentsQuery, List<StudentDto>>
{
    private readonly IApplicationDbContext _context;

    public GetStudentsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<StudentDto>> Handle(GetStudentsQuery request, CancellationToken cancellationToken)
    {
        var students = await _context.StudentProfiles
            .Include(s => s.User)
            .Include(s => s.Group)
            .Select(s => new StudentDto(
                s.Id,
                s.User != null ? $"{s.User.FirstName} {s.User.LastName}" : "Unknown Student",
                s.User != null ? s.User.Email ?? "" : "",
                s.Group != null ? s.Group.Name : null,
                s.GPA,
                s.EnrollmentDate
            ))
            .ToListAsync(cancellationToken);

        return students;
    }
}
