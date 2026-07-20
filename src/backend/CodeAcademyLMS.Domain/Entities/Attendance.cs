using CodeAcademyLMS.Domain.Enums;

namespace CodeAcademyLMS.Domain.Entities;

public class Attendance
{
    public Guid Id { get; set; }
    public Guid LessonId { get; set; }
    public Lesson? Lesson { get; set; }
    
    public Guid StudentProfileId { get; set; }
    public StudentProfile? Student { get; set; }
    
    public AttendanceStatus Status { get; set; }
    public string? Notes { get; set; }
}
