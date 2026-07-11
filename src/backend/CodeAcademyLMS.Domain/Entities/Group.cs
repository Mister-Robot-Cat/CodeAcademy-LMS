namespace CodeAcademyLMS.Domain.Entities;

public class Group
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid SemesterId { get; set; }
    public Semester? Semester { get; set; }

    // Navigation properties
    public ICollection<StudentProfile> Students { get; set; } = new List<StudentProfile>();
}
