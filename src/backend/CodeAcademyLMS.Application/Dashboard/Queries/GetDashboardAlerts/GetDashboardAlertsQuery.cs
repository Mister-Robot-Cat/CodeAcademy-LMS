using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Dashboard.Queries.GetDashboardAlerts;

public record GetDashboardAlertsQuery : IRequest<List<DashboardAlertDto>>;

public record DashboardAlertDto(string Type, string Message, string Severity);

public class GetDashboardAlertsQueryHandler : IRequestHandler<GetDashboardAlertsQuery, List<DashboardAlertDto>>
{
    private readonly IApplicationDbContext _context;

    public GetDashboardAlertsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<DashboardAlertDto>> Handle(GetDashboardAlertsQuery request, CancellationToken cancellationToken)
    {
        var alerts = new List<DashboardAlertDto>();

        // 1. Check for groups without a teacher
        var groupsWithoutTeachers = await _context.Groups
            .Include(g => g.Teachers)
            .Where(g => !g.Teachers.Any())
            .ToListAsync(cancellationToken);

        foreach(var group in groupsWithoutTeachers)
        {
            alerts.Add(new DashboardAlertDto("Warning", $"Group '{group.Name}' has no assigned teachers.", "high"));
        }

        // 2. Check for active semesters
        var activeSemesters = await _context.Semesters.CountAsync(s => s.IsActive, cancellationToken);
        if (activeSemesters == 0)
        {
            alerts.Add(new DashboardAlertDto("Info", "There is no active semester.", "medium"));
        }
        else if (activeSemesters > 1)
        {
            alerts.Add(new DashboardAlertDto("Warning", "There are multiple active semesters. Check configuration.", "high"));
        }

        return alerts;
    }
}
