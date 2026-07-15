namespace CodeAcademyLMS.Domain.Entities;

public class Lesson
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    
    public Guid TeacherProfileId { get; set; }
    public TeacherProfile? Teacher { get; set; }
    
    public Guid GroupId { get; set; }
    public Group? Group { get; set; }

    // Navigation properties
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    public ICollection<Grade> Grades { get; set; } = new List<Grade>();
}
