namespace CodeAcademyLMS.Domain.Entities;

public class StudentProfile
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }
    public Guid? GroupId { get; set; }
    public Group? Group { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public double GPA { get; set; }
}
