using CodeAcademyLMS.Application.Lessons.Commands.CreateLesson;
using CodeAcademyLMS.Application.Lessons.Commands.UpdateLesson;
using CodeAcademyLMS.Application.Lessons.Queries.GetGroupLessons;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodeAcademyLMS.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LessonsController : ControllerBase
{
    private readonly IMediator _mediator;

    public LessonsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("group/{groupId}")]
    public async Task<IActionResult> GetGroupLessons(Guid groupId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _mediator.Send(new GetGroupLessonsQuery(groupId, pageNumber, pageSize));
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Teacher,SuperAdmin")]
    public async Task<IActionResult> CreateLesson([FromBody] CreateLessonCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { Id = id });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Teacher,SuperAdmin")]
    public async Task<IActionResult> UpdateLesson(Guid id, [FromBody] UpdateLessonCommand command)
    {
        if (id != command.Id)
            return BadRequest("ID mismatch");

        await _mediator.Send(command);
        return NoContent();
    }
}
