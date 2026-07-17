using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeAcademyLMS.Application.Students.Queries.GetStudents;
using CodeAcademyLMS.Application.Students.Queries.GetPaginatedStudents;
using CodeAcademyLMS.Application.Students.Queries.GetStudentDetail;
using CodeAcademyLMS.Application.Students.Queries.GetStudentProfile;
using CodeAcademyLMS.Application.Students.Commands.UpdateStudentProfile;

namespace CodeAcademyLMS.WebApi.Controllers;

[Authorize(Roles = "SuperAdmin,Admin")]
public class StudentController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetStudents([FromQuery] GetPaginatedStudentsQuery query)
    {
        var result = await Mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("all")]
    public async Task<ActionResult> GetAllStudents()
    {
        var result = await Mediator.Send(new GetStudentsQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetStudent(Guid id)
    {
        var result = await Mediator.Send(new GetStudentDetailQuery(id));
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, UpdateStudentProfileCommand command)
    {
        if (id != command.StudentProfileId) return BadRequest();
        await Mediator.Send(command);
        return NoContent();
    }
}
