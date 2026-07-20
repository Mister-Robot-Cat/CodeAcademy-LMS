using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Domain.Entities;
using MediatR;

namespace CodeAcademyLMS.Application.Lessons.Commands.CreateLesson;

public record CreateLessonCommand(
    Guid GroupId,
    Guid TeacherProfileId,
    string Title,
    DateTime Date,
    string? Homework
) : IRequest<Guid>;

public class CreateLessonCommandHandler : IRequestHandler<CreateLessonCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateLessonCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateLessonCommand request, CancellationToken cancellationToken)
    {
        var lesson = new Lesson
        {
            Id = Guid.NewGuid(),
            GroupId = request.GroupId,
            TeacherProfileId = request.TeacherProfileId,
            Title = request.Title,
            Date = request.Date,
            Homework = request.Homework
        };

        _context.Lessons.Add(lesson);
        await _context.SaveChangesAsync(cancellationToken);

        return lesson.Id;
    }
}
