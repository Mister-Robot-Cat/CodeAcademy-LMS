using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Application.Common.Models;

namespace CodeAcademyLMS.Application.Students.Queries.GetPaginatedStudents;

public record GetPaginatedStudentsQuery(int PageNumber = 1, int PageSize = 20, string? Search = null, string? SortBy = null, string? SortDir = "asc") : IRequest<PaginatedList<StudentListDto>>;

public record StudentListDto(Guid Id, string FullName, string Email, string? GroupName, double GPA, DateTime EnrollmentDate);

public class GetPaginatedStudentsQueryHandler : IRequestHandler<GetPaginatedStudentsQuery, PaginatedList<StudentListDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPaginatedStudentsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<StudentListDto>> Handle(GetPaginatedStudentsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.StudentProfiles
            .Include(s => s.User)
            .Include(s => s.Enrollments)
            .ThenInclude(e => e.Group)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(s => 
                (s.User != null && s.User.FirstName.ToLower().Contains(search)) ||
                (s.User != null && s.User.LastName.ToLower().Contains(search)) ||
                (s.User != null && s.User.Email != null && s.User.Email.ToLower().Contains(search))
            );
        }

        query = request.SortBy?.ToLower() switch
        {
            "name" => request.SortDir?.ToLower() == "desc" ? query.OrderByDescending(s => s.User!.FirstName) : query.OrderBy(s => s.User!.FirstName),
            "email" => request.SortDir?.ToLower() == "desc" ? query.OrderByDescending(s => s.User!.Email) : query.OrderBy(s => s.User!.Email),
            "gpa" => request.SortDir?.ToLower() == "desc" ? query.OrderByDescending(s => s.GPA) : query.OrderBy(s => s.GPA),
            "date" => request.SortDir?.ToLower() == "desc" ? query.OrderByDescending(s => s.EnrollmentDate) : query.OrderBy(s => s.EnrollmentDate),
            _ => query.OrderByDescending(s => s.EnrollmentDate)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(s => new StudentListDto(
                s.Id,
                s.User != null ? $"{s.User.FirstName} {s.User.LastName}" : "Unknown",
                s.User != null ? s.User.Email ?? "" : "",
                s.Enrollments.FirstOrDefault(e => e.Status == Domain.Enums.EnrollmentStatus.Active) != null 
                    ? s.Enrollments.FirstOrDefault(e => e.Status == Domain.Enums.EnrollmentStatus.Active)!.Group!.Name 
                    : null,
                s.GPA,
                s.EnrollmentDate
            ))
            .ToListAsync(cancellationToken);

        return new PaginatedList<StudentListDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
