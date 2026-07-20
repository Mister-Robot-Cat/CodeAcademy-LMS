using CodeAcademyLMS.Application.Common.Interfaces;
using MediatR;

namespace CodeAcademyLMS.Application.Lessons.Commands.UpdateLesson;

public record UpdateLessonCommand(
    Guid Id,
    string Title,
    DateTime Date,
    string? Homework
) : IRequest<Unit>;

public class UpdateLessonCommandHandler : IRequestHandler<UpdateLessonCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public UpdateLessonCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateLessonCommand request, CancellationToken cancellationToken)
    {
        var lesson = await _context.Lessons.FindAsync(new object[] { request.Id }, cancellationToken);
        if (lesson == null)
            throw new Exception("Lesson not found");

        lesson.Title = request.Title;
        lesson.Date = request.Date;
        lesson.Homework = request.Homework;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
