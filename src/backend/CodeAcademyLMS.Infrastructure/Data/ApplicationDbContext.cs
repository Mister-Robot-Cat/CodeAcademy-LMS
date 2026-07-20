using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Domain.Entities;

namespace CodeAcademyLMS.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();
    public DbSet<TeacherProfile> TeacherProfiles => Set<TeacherProfile>();
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<Semester> Semesters => Set<Semester>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<Attendance> Attendances => Set<Attendance>();
    public DbSet<Grade> Grades => Set<Grade>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<GroupTeacher> GroupTeachers => Set<GroupTeacher>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // RefreshToken
        builder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Token).IsRequired().HasMaxLength(256);
            entity.Property(t => t.CreatedByIp).HasMaxLength(50);
            entity.Property(t => t.RevokedByIp).HasMaxLength(50);
            entity.Property(t => t.ReplacedByToken).HasMaxLength(256);
            entity.HasOne(t => t.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // StudentProfile: 1:1 with User
        builder.Entity<StudentProfile>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.HasOne(s => s.User)
                .WithOne(u => u.StudentProfile)
                .HasForeignKey<StudentProfile>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // TeacherProfile: 1:1 with User
        builder.Entity<TeacherProfile>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Specialization).HasMaxLength(150);
            entity.HasOne(t => t.User)
                .WithOne(u => u.TeacherProfile)
                .HasForeignKey<TeacherProfile>(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Semester
        builder.Entity<Semester>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Name).IsRequired().HasMaxLength(100);
        });

        // Group
        builder.Entity<Group>(entity =>
        {
            entity.HasKey(g => g.Id);
            entity.Property(g => g.Name).IsRequired().HasMaxLength(100);
            entity.HasOne(g => g.Semester)
                .WithMany(s => s.Groups)
                .HasForeignKey(g => g.SemesterId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Enrollment: M:N Student <-> Group
        builder.Entity<Enrollment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasConversion<string>(); // Store enum as string
            
            entity.HasOne(e => e.Student)
                .WithMany(s => s.Enrollments)
                .HasForeignKey(e => e.StudentProfileId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Group)
                .WithMany(g => g.Enrollments)
                .HasForeignKey(e => e.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // GroupTeacher: M:N Teacher <-> Group
        builder.Entity<GroupTeacher>(entity =>
        {
            entity.HasKey(gt => gt.Id);
            entity.Property(gt => gt.Subject).HasMaxLength(150);
            
            entity.HasOne(gt => gt.Teacher)
                .WithMany(t => t.GroupAssignments)
                .HasForeignKey(gt => gt.TeacherProfileId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(gt => gt.Group)
                .WithMany(g => g.Teachers)
                .HasForeignKey(gt => gt.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Lesson
        builder.Entity<Lesson>(entity =>
        {
            entity.HasKey(l => l.Id);
            entity.Property(l => l.Title).IsRequired().HasMaxLength(200);
            entity.Property(l => l.Homework).HasMaxLength(1000);
            
            entity.HasOne(l => l.Teacher)
                .WithMany(t => t.Lessons)
                .HasForeignKey(l => l.TeacherProfileId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(l => l.Group)
                .WithMany(g => g.Lessons)
                .HasForeignKey(l => l.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Attendance
        builder.Entity<Attendance>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Status).HasConversion<string>();
            entity.Property(a => a.Notes).HasMaxLength(500);
            
            entity.HasOne(a => a.Lesson)
                .WithMany(l => l.Attendances)
                .HasForeignKey(a => a.LessonId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(a => a.Student)
                .WithMany(s => s.Attendances)
                .HasForeignKey(a => a.StudentProfileId)
                .OnDelete(DeleteBehavior.Cascade); // Adjust to Restrict if multiple cascade paths issue in SQL Server
        });

        // Grade
        builder.Entity<Grade>(entity =>
        {
            entity.HasKey(g => g.Id);
            entity.Property(g => g.Comment).HasMaxLength(500);
            
            entity.HasOne(g => g.Lesson)
                .WithMany(l => l.Grades)
                .HasForeignKey(g => g.LessonId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(g => g.Student)
                .WithMany(s => s.Grades)
                .HasForeignKey(g => g.StudentProfileId)
                .OnDelete(DeleteBehavior.Cascade); // Adjust to Restrict if multiple cascade paths issue in SQL Server
        });
    }
}
