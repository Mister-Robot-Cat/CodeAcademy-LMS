namespace CodeAcademyLMS.Domain.Entities;

public class Grade
{
    public Guid Id { get; set; }
    public double Value { get; set; }
    public string Comment { get; set; } = string.Empty;
    
    public Guid LessonId { get; set; }
    public Lesson? Lesson { get; set; }
    
    public Guid StudentProfileId { get; set; }
    public StudentProfile? Student { get; set; }
}
