using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodeAcademyLMS.Application.Lessons.Queries.GetGroupLessons;

public record LessonDto(
    Guid Id,
    Guid GroupId,
    Guid TeacherProfileId,
    string TeacherName,
    string Title,
    DateTime Date,
    string? Homework
);

public record GetGroupLessonsQuery(
    Guid GroupId,
    int PageNumber = 1,
    int PageSize = 10
) : IRequest<PaginatedList<LessonDto>>;

public class GetGroupLessonsQueryHandler : IRequestHandler<GetGroupLessonsQuery, PaginatedList<LessonDto>>
{
    private readonly IApplicationDbContext _context;

    public GetGroupLessonsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<LessonDto>> Handle(GetGroupLessonsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Lessons
            .Include(l => l.Teacher)
                .ThenInclude(t => t.User)
            .Where(l => l.GroupId == request.GroupId)
            .OrderByDescending(l => l.Date);

        var totalCount = await query.CountAsync(cancellationToken);
        
        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(l => new LessonDto(
                l.Id,
                l.GroupId,
                l.TeacherProfileId,
                l.Teacher != null && l.Teacher.User != null ? l.Teacher.User.FirstName + " " + l.Teacher.User.LastName : "Unknown",
                l.Title,
                l.Date,
                l.Homework
            ))
            .ToListAsync(cancellationToken);

        return new PaginatedList<LessonDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
