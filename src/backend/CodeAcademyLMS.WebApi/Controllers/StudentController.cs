using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeAcademyLMS.Application.Students.Queries.GetStudentProfile;
using CodeAcademyLMS.Application.Students.Queries.GetStudents;

namespace CodeAcademyLMS.WebApi.Controllers;

[Authorize]
public class StudentController : ApiControllerBase
{
    [HttpGet]
    [Authorize(Roles = "SuperAdmin,Admin,Teacher")]
    public async Task<ActionResult<List<StudentDto>>> GetList()
    {
        var result = await Mediator.Send(new GetStudentsQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StudentProfileDto>> GetProfile(Guid id)
    {
        var query = new GetStudentProfileQuery { StudentProfileId = id };
        var result = await Mediator.Send(query);

        if (result == null)
        {
            return NotFound(new { message = $"Student profile with ID {id} was not found." });
        }

        return Ok(result);
    }
}
