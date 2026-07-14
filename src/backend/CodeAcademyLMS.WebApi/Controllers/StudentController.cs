using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeAcademyLMS.Application.Students.Queries.GetStudentProfile;

namespace CodeAcademyLMS.WebApi.Controllers;

[Authorize]
public class StudentController : ApiControllerBase
{
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
