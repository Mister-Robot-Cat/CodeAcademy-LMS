using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Teachers.Commands.UpdateTeacherProfile;

public record UpdateTeacherProfileCommand(Guid TeacherProfileId, string FirstName, string LastName, string Specialization) : IRequest<bool>;

public class UpdateTeacherProfileCommandHandler : IRequestHandler<UpdateTeacherProfileCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateTeacherProfileCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateTeacherProfileCommand request, CancellationToken cancellationToken)
    {
        var teacher = await _context.TeacherProfiles
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == request.TeacherProfileId, cancellationToken);

        if (teacher == null || teacher.User == null)
        {
            throw new Exception("Teacher profile or user not found.");
        }

        teacher.User.FirstName = request.FirstName;
        teacher.User.LastName = request.LastName;
        teacher.Specialization = request.Specialization;

        _context.TeacherProfiles.Update(teacher);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
