using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Semesters.Commands.UpdateSemester;

public record UpdateSemesterCommand(Guid Id, string Name, DateTime StartDate, DateTime EndDate, bool IsActive) : IRequest<bool>;

public class UpdateSemesterCommandHandler : IRequestHandler<UpdateSemesterCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateSemesterCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateSemesterCommand request, CancellationToken cancellationToken)
    {
        var semester = await _context.Semesters.FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (semester == null)
        {
            throw new Exception($"Semester with ID {request.Id} was not found.");
        }

        semester.Name = request.Name;
        semester.StartDate = request.StartDate.ToUniversalTime();
        semester.EndDate = request.EndDate.ToUniversalTime();
        semester.IsActive = request.IsActive;

        _context.Semesters.Update(semester);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
