using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Semesters.Queries.GetSemesters;

public record GetSemestersQuery : IRequest<List<SemesterDto>>;

public record SemesterDto(Guid Id, string Name, DateTime StartDate, DateTime EndDate, bool IsActive, int GroupCount);

public class GetSemestersQueryHandler : IRequestHandler<GetSemestersQuery, List<SemesterDto>>
{
    private readonly IApplicationDbContext _context;

    public GetSemestersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<SemesterDto>> Handle(GetSemestersQuery request, CancellationToken cancellationToken)
    {
        var semesters = await _context.Semesters
            .Include(s => s.Groups)
            .OrderByDescending(s => s.StartDate)
            .Select(s => new SemesterDto(s.Id, s.Name, s.StartDate, s.EndDate, s.IsActive, s.Groups.Count))
            .ToListAsync(cancellationToken);

        return semesters;
    }
}
