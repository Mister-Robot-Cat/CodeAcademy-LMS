using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeAcademyLMS.Application.Groups.Queries.GetGroups;
using CodeAcademyLMS.Application.Groups.Queries.GetPaginatedGroups;
using CodeAcademyLMS.Application.Groups.Queries.GetGroupDetail;
using CodeAcademyLMS.Application.Groups.Commands.CreateGroup;
using CodeAcademyLMS.Application.Groups.Commands.UpdateGroup;
using CodeAcademyLMS.Application.Groups.Commands.DeleteGroup;
using CodeAcademyLMS.Application.Groups.Commands.AssignTeacherToGroup;
using CodeAcademyLMS.Application.Groups.Commands.RemoveTeacherFromGroup;
using CodeAcademyLMS.Application.Groups.Commands.AddStudentToGroup;
using CodeAcademyLMS.Application.Groups.Commands.UnenrollStudent;

namespace CodeAcademyLMS.WebApi.Controllers;

[Authorize(Roles = "SuperAdmin,Admin")]
public class GroupController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetGroups([FromQuery] GetPaginatedGroupsQuery query)
    {
        var result = await Mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("all")]
    public async Task<ActionResult> GetAllGroups()
    {
        var result = await Mediator.Send(new GetGroupsQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetGroup(Guid id)
    {
        var result = await Mediator.Send(new GetGroupDetailQuery(id));
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create(CreateGroupCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, UpdateGroupCommand command)
    {
        if (id != command.Id) return BadRequest();
        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await Mediator.Send(new DeleteGroupCommand(id));
        return NoContent();
    }

    [HttpPost("{id}/students")]
    public async Task<ActionResult> AddStudent(Guid id, AddStudentToGroupCommand command)
    {
        if (id != command.GroupId) return BadRequest();
        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}/students/{studentId}")]
    public async Task<ActionResult> RemoveStudent(Guid id, Guid studentId)
    {
        await Mediator.Send(new UnenrollStudentCommand(id, studentId));
        return NoContent();
    }

    [HttpPost("{id}/teachers")]
    public async Task<ActionResult> AssignTeacher(Guid id, AssignTeacherToGroupCommand command)
    {
        if (id != command.GroupId) return BadRequest();
        await Mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}/teachers/{teacherId}")]
    public async Task<ActionResult> RemoveTeacher(Guid id, Guid teacherId)
    {
        await Mediator.Send(new RemoveTeacherFromGroupCommand(id, teacherId));
        return NoContent();
    }
}
