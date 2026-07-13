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

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure RefreshToken entity
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

        // Configure StudentProfile
        builder.Entity<StudentProfile>(entity =>
        {
            entity.HasKey(s => s.Id);
            
            entity.HasOne(s => s.User)
                .WithOne(u => u.StudentProfile)
                .HasForeignKey<StudentProfile>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(s => s.Group)
                .WithMany(g => g.Students)
                .HasForeignKey(s => s.GroupId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure TeacherProfile
        builder.Entity<TeacherProfile>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Specialization).HasMaxLength(150);

            entity.HasOne(t => t.User)
                .WithOne(u => u.TeacherProfile)
                .HasForeignKey<TeacherProfile>(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Group
        builder.Entity<Group>(entity =>
        {
            entity.HasKey(g => g.Id);
            entity.Property(g => g.Name).IsRequired().HasMaxLength(100);

            entity.HasOne(g => g.Semester)
                .WithMany(s => s.Groups)
                .HasForeignKey(g => g.SemesterId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Semester
        builder.Entity<Semester>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Name).IsRequired().HasMaxLength(100);
        });
    }
}
