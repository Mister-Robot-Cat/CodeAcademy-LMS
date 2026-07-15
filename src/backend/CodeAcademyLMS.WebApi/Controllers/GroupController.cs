using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodeAcademyLMS.Application.Groups.Commands.AddStudentToGroup;
using CodeAcademyLMS.Application.Groups.Commands.AssignTeacherToGroup;
using CodeAcademyLMS.Application.Groups.Commands.CreateGroup;
using CodeAcademyLMS.Application.Groups.Queries.GetGroups;
using CodeAcademyLMS.Application.Semesters.Queries.GetSemesters;

namespace CodeAcademyLMS.WebApi.Controllers;

[Authorize]
public class GroupController : ApiControllerBase
{
    [HttpGet]
    [Authorize(Roles = "SuperAdmin,Admin,Teacher")]
    public async Task<ActionResult<List<GroupDto>>> GetList()
    {
        var result = await Mediator.Send(new GetGroupsQuery());
        return Ok(result);
    }

    [HttpGet("semesters")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<ActionResult<List<SemesterDto>>> GetSemesters()
    {
        var result = await Mediator.Send(new GetSemestersQuery());
        return Ok(result);
    }
    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<ActionResult<Guid>> Create(CreateGroupRequestDto request)
    {
        var command = new CreateGroupCommand
        {
            Name = request.Name,
            SemesterId = request.SemesterId
        };

        var result = await Mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("add-student")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<ActionResult<bool>> AddStudent(AddStudentToGroupRequestDto request)
    {
        var command = new AddStudentToGroupCommand
        {
            GroupId = request.GroupId,
            StudentProfileId = request.StudentProfileId
        };

        var result = await Mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("assign-teacher")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<ActionResult<bool>> AssignTeacher(AssignTeacherRequestDto request)
    {
        var command = new AssignTeacherCommand
        {
            TeacherProfileId = request.TeacherProfileId,
            Specialization = request.Specialization
        };

        var result = await Mediator.Send(command);
        return Ok(result);
    }
}

public record CreateGroupRequestDto(string Name, Guid SemesterId);
public record AddStudentToGroupRequestDto(Guid GroupId, Guid StudentProfileId);
public record AssignTeacherRequestDto(Guid TeacherProfileId, string Specialization);
