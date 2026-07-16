using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeAcademyLMS.Application.Common.Queries.GetAdminStats;

namespace CodeAcademyLMS.WebApi.Controllers;

[Authorize(Roles = "SuperAdmin,Admin")]
public class AdminController : ApiControllerBase
{
    [HttpGet("stats")]
    public async Task<ActionResult<AdminStatsDto>> GetStats()
    {
        var result = await Mediator.Send(new GetAdminStatsQuery());
        return Ok(result);
    }
}
