using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Groups.Queries.GetGroups;

public record GetGroupsQuery : IRequest<List<GroupDto>>;

public record GroupDto(Guid Id, string Name, string? SemesterName);

public class GetGroupsQueryHandler : IRequestHandler<GetGroupsQuery, List<GroupDto>>
{
    private readonly IApplicationDbContext _context;

    public GetGroupsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<GroupDto>> Handle(GetGroupsQuery request, CancellationToken cancellationToken)
    {
        var groups = await _context.Groups
            .Include(g => g.Semester)
            .Select(g => new GroupDto(g.Id, g.Name, g.Semester != null ? g.Semester.Name : null))
            .ToListAsync(cancellationToken);

        return groups;
    }
}
