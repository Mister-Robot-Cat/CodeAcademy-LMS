using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Students.Commands.UpdateStudentProfile;

public record UpdateStudentProfileCommand(Guid StudentProfileId, string FirstName, string LastName) : IRequest<bool>;

public class UpdateStudentProfileCommandHandler : IRequestHandler<UpdateStudentProfileCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateStudentProfileCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateStudentProfileCommand request, CancellationToken cancellationToken)
    {
        var student = await _context.StudentProfiles
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == request.StudentProfileId, cancellationToken);

        if (student == null || student.User == null)
        {
            throw new Exception("Student profile or user not found.");
        }

        student.User.FirstName = request.FirstName;
        student.User.LastName = request.LastName;

        _context.StudentProfiles.Update(student);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
