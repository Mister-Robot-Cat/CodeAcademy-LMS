using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Students.Queries.GetStudentProfile;

public record GetStudentProfileQuery : IRequest<StudentProfileDto?>
{
    public Guid StudentProfileId { get; init; }
}

public class GetStudentProfileQueryHandler : IRequestHandler<GetStudentProfileQuery, StudentProfileDto?>
{
    private readonly IApplicationDbContext _context;

    public GetStudentProfileQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StudentProfileDto?> Handle(GetStudentProfileQuery request, CancellationToken cancellationToken)
    {
        var student = await _context.StudentProfiles
            .Include(s => s.User)
            .Include(s => s.Group)
            .FirstOrDefaultAsync(s => s.Id == request.StudentProfileId, cancellationToken);

        if (student == null)
        {
            return null;
        }

        return new StudentProfileDto
        {
            Id = student.Id,
            UserId = student.UserId,
            FirstName = student.User?.FirstName ?? string.Empty,
            LastName = student.User?.LastName ?? string.Empty,
            Email = student.User?.Email ?? string.Empty,
            GroupId = student.GroupId,
            GroupName = student.Group?.Name ?? string.Empty,
            GPA = student.GPA
        };
    }
}

public class StudentProfileDto
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid? GroupId { get; set; }
    public string GroupName { get; set; } = string.Empty;
    public double GPA { get; set; }
}
