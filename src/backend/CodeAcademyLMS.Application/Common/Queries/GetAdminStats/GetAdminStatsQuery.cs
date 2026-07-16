using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Common.Queries.GetAdminStats;

public record GetAdminStatsQuery : IRequest<AdminStatsDto>;

public record AdminStatsDto(
    int TotalStudents,
    int TotalTeachers,
    int TotalGroups,
    int TotalSemesters
);

public class GetAdminStatsQueryHandler : IRequestHandler<GetAdminStatsQuery, AdminStatsDto>
{
    private readonly IApplicationDbContext _context;

    public GetAdminStatsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AdminStatsDto> Handle(GetAdminStatsQuery request, CancellationToken cancellationToken)
    {
        var totalStudents = await _context.StudentProfiles.CountAsync(cancellationToken);
        var totalTeachers = await _context.TeacherProfiles.CountAsync(cancellationToken);
        var totalGroups = await _context.Groups.CountAsync(cancellationToken);
        var totalSemesters = await _context.Semesters.CountAsync(cancellationToken);

        return new AdminStatsDto(totalStudents, totalTeachers, totalGroups, totalSemesters);
    }
}
