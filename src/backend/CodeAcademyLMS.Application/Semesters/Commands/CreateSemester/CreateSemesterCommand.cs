using MediatR;
using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Domain.Entities;

namespace CodeAcademyLMS.Application.Semesters.Commands.CreateSemester;

public record CreateSemesterCommand(string Name, DateTime StartDate, DateTime EndDate) : IRequest<Guid>;

public class CreateSemesterCommandHandler : IRequestHandler<CreateSemesterCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateSemesterCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateSemesterCommand request, CancellationToken cancellationToken)
    {
        var semester = new Semester
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            StartDate = request.StartDate.ToUniversalTime(),
            EndDate = request.EndDate.ToUniversalTime(),
            IsActive = true
        };

        _context.Semesters.Add(semester);
        await _context.SaveChangesAsync(cancellationToken);

        return semester.Id;
    }
}
