namespace CodeAcademyLMS.Domain.Entities;

public class TeacherProfile
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }
    public string Specialization { get; set; } = string.Empty;

    // Navigation properties
    public ICollection<GroupTeacher> GroupAssignments { get; set; } = new List<GroupTeacher>();
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}
