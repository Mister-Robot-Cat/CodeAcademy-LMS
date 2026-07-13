using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Groups.Commands.AssignTeacherToGroup;

public record AssignTeacherCommand : IRequest<bool>
{
    public Guid TeacherProfileId { get; init; }
    public string Specialization { get; init; } = string.Empty;
}

public class AssignTeacherCommandHandler : IRequestHandler<AssignTeacherCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public AssignTeacherCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(AssignTeacherCommand request, CancellationToken cancellationToken)
    {
        var teacher = await _context.TeacherProfiles
            .FirstOrDefaultAsync(t => t.Id == request.TeacherProfileId, cancellationToken);

        if (teacher == null)
        {
            throw new Exception($"Teacher profile with ID {request.TeacherProfileId} was not found.");
        }

        teacher.Specialization = request.Specialization;
        _context.TeacherProfiles.Update(teacher);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
