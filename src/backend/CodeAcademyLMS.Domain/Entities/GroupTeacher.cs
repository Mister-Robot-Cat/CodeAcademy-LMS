namespace CodeAcademyLMS.Domain.Entities;

public class GroupTeacher
{
    public Guid Id { get; set; }

    public Guid TeacherProfileId { get; set; }
    public TeacherProfile? Teacher { get; set; }

    public Guid GroupId { get; set; }
    public Group? Group { get; set; }

    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public string Subject { get; set; } = string.Empty;
}
