using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Semesters.Commands.DeleteSemester;

public record DeleteSemesterCommand(Guid Id) : IRequest<bool>;

public class DeleteSemesterCommandHandler : IRequestHandler<DeleteSemesterCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteSemesterCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteSemesterCommand request, CancellationToken cancellationToken)
    {
        var semester = await _context.Semesters.FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (semester == null)
        {
            throw new Exception($"Semester with ID {request.Id} was not found.");
        }

        _context.Semesters.Remove(semester);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
