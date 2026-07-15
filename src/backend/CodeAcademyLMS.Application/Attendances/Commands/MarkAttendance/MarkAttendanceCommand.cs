using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Domain.Entities;
using CodeAcademyLMS.Domain.Enums;

namespace CodeAcademyLMS.Application.Attendances.Commands.MarkAttendance;

public record MarkAttendanceCommand : IRequest<bool>
{
    public Guid LessonId { get; init; }
    public List<StudentAttendanceDto> StudentAttendances { get; init; } = new();
}

public record StudentAttendanceDto(Guid StudentProfileId, AttendanceStatus Status);

public class MarkAttendanceCommandHandler : IRequestHandler<MarkAttendanceCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public MarkAttendanceCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(MarkAttendanceCommand request, CancellationToken cancellationToken)
    {
        var lessonExists = await _context.Lessons
            .AnyAsync(l => l.Id == request.LessonId, cancellationToken);

        if (!lessonExists)
        {
            throw new Exception($"Lesson with ID {request.LessonId} was not found.");
        }

        var existingAttendances = await _context.Attendances
            .Where(a => a.LessonId == request.LessonId)
            .ToListAsync(cancellationToken);

        foreach (var studentAttendance in request.StudentAttendances)
        {
            var studentExists = await _context.StudentProfiles
                .AnyAsync(s => s.Id == studentAttendance.StudentProfileId, cancellationToken);

            if (!studentExists)
            {
                throw new Exception($"Student profile with ID {studentAttendance.StudentProfileId} was not found.");
            }

            var record = existingAttendances
                .FirstOrDefault(a => a.StudentProfileId == studentAttendance.StudentProfileId);

            if (record != null)
            {
                record.Status = studentAttendance.Status;
                _context.Attendances.Update(record);
            }
            else
            {
                var newAttendance = new Attendance
                {
                    Id = Guid.NewGuid(),
                    LessonId = request.LessonId,
                    StudentProfileId = studentAttendance.StudentProfileId,
                    Status = studentAttendance.Status
                };
                _context.Attendances.Add(newAttendance);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
