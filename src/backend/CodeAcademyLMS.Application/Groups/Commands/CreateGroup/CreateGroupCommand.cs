using MediatR;
using Microsoft.EntityFrameworkCore;
using CodeAcademyLMS.Application.Common.Interfaces;
using CodeAcademyLMS.Domain.Entities;

namespace CodeAcademyLMS.Application.Groups.Commands.CreateGroup;

public record CreateGroupCommand : IRequest<Guid>
{
    public string Name { get; init; } = string.Empty;
    public Guid SemesterId { get; init; }
}

public class CreateGroupCommandHandler : IRequestHandler<CreateGroupCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateGroupCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateGroupCommand request, CancellationToken cancellationToken)
    {
        var semesterExists = await _context.Semesters
            .AnyAsync(s => s.Id == request.SemesterId, cancellationToken);

        if (!semesterExists)
        {
            throw new Exception($"Semester with ID {request.SemesterId} was not found.");
        }

        var group = new Group
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            SemesterId = request.SemesterId
        };

        _context.Groups.Add(group);
        await _context.SaveChangesAsync(cancellationToken);

        return group.Id;
    }
}
