using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Domain.Entities;

namespace CodeAcademyLMS.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<StudentProfile> StudentProfiles { get; }
    DbSet<TeacherProfile> TeacherProfiles { get; }
    DbSet<Group> Groups { get; }
    DbSet<Semester> Semesters { get; }
    DbSet<Lesson> Lessons { get; }
    DbSet<Attendance> Attendances { get; }
    DbSet<Grade> Grades { get; }
    DbSet<Enrollment> Enrollments { get; }
    DbSet<GroupTeacher> GroupTeachers { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
