using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeAcademyLMS.Application.Common.Queries.GetAdminStats;
using CodeAcademyLMS.Application.Dashboard.Queries.GetDashboardAlerts;

namespace CodeAcademyLMS.WebApi.Controllers;

[Authorize(Roles = "SuperAdmin,Admin")]
public class AdminController : ApiControllerBase
{
    [HttpGet("stats")]
    public async Task<ActionResult> GetStats()
    {
        var result = await Mediator.Send(new GetAdminStatsQuery());
        return Ok(result);
    }

    [HttpGet("alerts")]
    public async Task<ActionResult> GetAlerts()
    {
        var result = await Mediator.Send(new GetDashboardAlertsQuery());
        return Ok(result);
    }
}
