namespace CodeAcademyLMS.Domain.Entities;

public class Group
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid SemesterId { get; set; }
    public Semester? Semester { get; set; }

    // Navigation properties
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    public ICollection<GroupTeacher> Teachers { get; set; } = new List<GroupTeacher>();
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}
