using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Semesters.Queries.GetSemesters;

public record GetSemestersQuery : IRequest<List<SemesterDto>>;

public record SemesterDto(Guid Id, string Name);

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
            .Select(s => new SemesterDto(s.Id, s.Name))
            .ToListAsync(cancellationToken);

        return semesters;
      }
}
