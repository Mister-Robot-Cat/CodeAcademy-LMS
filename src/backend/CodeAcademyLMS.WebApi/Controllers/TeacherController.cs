using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeAcademyLMS.Application.Teachers.Queries.GetTeachers;
using CodeAcademyLMS.Application.Teachers.Queries.GetPaginatedTeachers;
using CodeAcademyLMS.Application.Teachers.Commands.UpdateTeacherProfile;

namespace CodeAcademyLMS.WebApi.Controllers;

[Authorize(Roles = "SuperAdmin,Admin")]
public class TeacherController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetTeachers([FromQuery] GetPaginatedTeachersQuery query)
    {
        var result = await Mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("all")]
    public async Task<ActionResult> GetAllTeachers()
    {
        var result = await Mediator.Send(new GetTeachersQuery());
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, UpdateTeacherProfileCommand command)
    {
        if (id != command.TeacherProfileId) return BadRequest();
        await Mediator.Send(command);
        return NoContent();
    }
}
