using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Application.Common.Models;

namespace CodeAcademyLMS.Application.Groups.Queries.GetPaginatedGroups;

public record GetPaginatedGroupsQuery(int PageNumber = 1, int PageSize = 20, string? Search = null, string? SortBy = null, string? SortDir = "asc") : IRequest<PaginatedList<GroupListDto>>;

public record GroupListDto(Guid Id, string Name, string? SemesterName, int StudentCount, int TeacherCount);

public class GetPaginatedGroupsQueryHandler : IRequestHandler<GetPaginatedGroupsQuery, PaginatedList<GroupListDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPaginatedGroupsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<GroupListDto>> Handle(GetPaginatedGroupsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Groups
            .Include(g => g.Semester)
            .Include(g => g.Enrollments)
            .Include(g => g.Teachers)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(g => g.Name.ToLower().Contains(search) || (g.Semester != null && g.Semester.Name.ToLower().Contains(search)));
        }

        query = request.SortBy?.ToLower() switch
        {
            "name" => request.SortDir?.ToLower() == "desc" ? query.OrderByDescending(g => g.Name) : query.OrderBy(g => g.Name),
            "semester" => request.SortDir?.ToLower() == "desc" ? query.OrderByDescending(g => g.Semester!.Name) : query.OrderBy(g => g.Semester!.Name),
            "students" => request.SortDir?.ToLower() == "desc" ? query.OrderByDescending(g => g.Enrollments.Count(e => e.Status == Domain.Enums.EnrollmentStatus.Active)) : query.OrderBy(g => g.Enrollments.Count(e => e.Status == Domain.Enums.EnrollmentStatus.Active)),
            _ => query.OrderBy(g => g.Name)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(g => new GroupListDto(
                g.Id,
                g.Name,
                g.Semester != null ? g.Semester.Name : null,
                g.Enrollments.Count(e => e.Status == Domain.Enums.EnrollmentStatus.Active),
                g.Teachers.Count
            ))
            .ToListAsync(cancellationToken);

        return new PaginatedList<GroupListDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
