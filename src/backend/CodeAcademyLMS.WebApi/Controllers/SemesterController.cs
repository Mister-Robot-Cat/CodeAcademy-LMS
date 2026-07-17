using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeAcademyLMS.Application.Semesters.Queries.GetSemesters;
using CodeAcademyLMS.Application.Semesters.Commands.CreateSemester;
using CodeAcademyLMS.Application.Semesters.Commands.UpdateSemester;
using CodeAcademyLMS.Application.Semesters.Commands.DeleteSemester;

namespace CodeAcademyLMS.WebApi.Controllers;

[Authorize(Roles = "SuperAdmin,Admin")]
public class SemesterController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<SemesterDto>>> GetSemesters()
    {
        var result = await Mediator.Send(new GetSemestersQuery());
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create(CreateSemesterCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, UpdateSemesterCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await Mediator.Send(new DeleteSemesterCommand(id));
        return NoContent();
    }
}
