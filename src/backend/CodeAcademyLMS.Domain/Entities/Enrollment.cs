using CodeAcademyLMS.Domain.Enums;

namespace CodeAcademyLMS.Domain.Entities;

public class Enrollment
{
    public Guid Id { get; set; }

    public Guid StudentProfileId { get; set; }
    public StudentProfile? Student { get; set; }

    public Guid GroupId { get; set; }
    public Group? Group { get; set; }

    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    public DateTime? DroppedAt { get; set; }

    public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Active;
}
