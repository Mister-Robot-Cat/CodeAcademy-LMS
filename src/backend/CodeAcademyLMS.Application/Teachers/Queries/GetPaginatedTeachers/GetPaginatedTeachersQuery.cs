using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Application.Common.Models;

namespace CodeAcademyLMS.Application.Teachers.Queries.GetPaginatedTeachers;

public record GetPaginatedTeachersQuery(int PageNumber = 1, int PageSize = 20, string? Search = null, string? SortBy = null, string? SortDir = "asc") : IRequest<PaginatedList<TeacherListDto>>;

public record TeacherListDto(Guid Id, string FullName, string Email, string Specialization, List<string> AssignedGroups);

public class GetPaginatedTeachersQueryHandler : IRequestHandler<GetPaginatedTeachersQuery, PaginatedList<TeacherListDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPaginatedTeachersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<TeacherListDto>> Handle(GetPaginatedTeachersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.TeacherProfiles
            .Include(t => t.User)
            .Include(t => t.GroupAssignments)
            .ThenInclude(ga => ga.Group)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(t => 
                (t.User != null && t.User.FirstName.ToLower().Contains(search)) ||
                (t.User != null && t.User.LastName.ToLower().Contains(search)) ||
                (t.User != null && t.User.Email != null && t.User.Email.ToLower().Contains(search)) ||
                t.Specialization.ToLower().Contains(search)
            );
        }

        query = request.SortBy?.ToLower() switch
        {
            "name" => request.SortDir?.ToLower() == "desc" ? query.OrderByDescending(t => t.User!.FirstName) : query.OrderBy(t => t.User!.FirstName),
            "email" => request.SortDir?.ToLower() == "desc" ? query.OrderByDescending(t => t.User!.Email) : query.OrderBy(t => t.User!.Email),
            "specialization" => request.SortDir?.ToLower() == "desc" ? query.OrderByDescending(t => t.Specialization) : query.OrderBy(t => t.Specialization),
            _ => query.OrderBy(t => t.User!.FirstName)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(t => new TeacherListDto(
                t.Id,
                t.User != null ? $"{t.User.FirstName} {t.User.LastName}" : "Unknown",
                t.User != null ? t.User.Email ?? "" : "",
                t.Specialization,
                t.GroupAssignments.Where(ga => ga.Group != null).Select(ga => ga.Group!.Name).ToList()
            ))
            .ToListAsync(cancellationToken);

        return new PaginatedList<TeacherListDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
