using CodeAcademyLMS.Application.Attendances.Commands.MarkAttendance;
using CodeAcademyLMS.Application.Attendances.Queries.GetLessonAttendance;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodeAcademyLMS.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttendancesController : ControllerBase
{
    private readonly IMediator _mediator;

    public AttendancesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("lesson/{lessonId}")]
    [Authorize(Roles = "Admin,Teacher,SuperAdmin")]
    public async Task<IActionResult> GetLessonAttendance(Guid lessonId)
    {
        var result = await _mediator.Send(new GetLessonAttendanceQuery(lessonId));
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Teacher,SuperAdmin")]
    public async Task<IActionResult> MarkAttendance([FromBody] MarkAttendanceCommand command)
    {
        await _mediator.Send(command);
        return Ok();
    }
}
