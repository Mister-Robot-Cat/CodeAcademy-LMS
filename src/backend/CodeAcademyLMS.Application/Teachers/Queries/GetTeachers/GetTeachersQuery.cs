using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Teachers.Queries.GetTeachers;

public record GetTeachersQuery : IRequest<List<TeacherDto>>;

public record TeacherDto(
    Guid Id,
    string FullName,
    string Email,
    string Specialization
);

public class GetTeachersQueryHandler : IRequestHandler<GetTeachersQuery, List<TeacherDto>>
{
    private readonly IApplicationDbContext _context;

    public GetTeachersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TeacherDto>> Handle(GetTeachersQuery request, CancellationToken cancellationToken)
    {
        var teachers = await _context.TeacherProfiles
            .Include(t => t.User)
            .Select(t => new TeacherDto(
                t.Id,
                t.User != null ? $"{t.User.FirstName} {t.User.LastName}" : "Unknown Teacher",
                t.User != null ? t.User.Email ?? "" : "",
                t.Specialization
            ))
            .ToListAsync(cancellationToken);

        return teachers;
    }
}
