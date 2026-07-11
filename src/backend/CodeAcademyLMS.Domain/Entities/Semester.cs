namespace CodeAcademyLMS.Domain.Entities;

public class Semester
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }

    // Navigation properties
    public ICollection<Group> Groups { get; set; } = new List<Group>();
}
