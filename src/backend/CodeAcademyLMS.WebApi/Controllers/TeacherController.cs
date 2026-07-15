using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeAcademyLMS.Application.Teachers.Queries.GetTeachers;

namespace CodeAcademyLMS.WebApi.Controllers;

[Authorize]
public class TeacherController : ApiControllerBase
{
    [HttpGet]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<ActionResult<List<TeacherDto>>> GetList()
    {
        var result = await Mediator.Send(new GetTeachersQuery());
        return Ok(result);
    }
}
