using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;

namespace CodeAcademyLMS.Application.Groups.Queries.GetGroups;

public record GetGroupsQuery : IRequest<List<GroupDto>>;

public record GroupDto(Guid Id, string Name, string? SemesterName, int StudentCount);

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
            .Include(g => g.Students)
            .Select(g => new GroupDto(
                g.Id, 
                g.Name, 
                g.Semester != null ? g.Semester.Name : null,
                g.Students.Count
            ))
            .ToListAsync(cancellationToken);

        return groups;
    }
}
