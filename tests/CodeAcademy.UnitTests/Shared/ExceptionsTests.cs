using CodeAcademy.Shared.Exceptions;

namespace CodeAcademy.UnitTests.Shared;

public class ExceptionsTests
{
    [Fact]
    public void NotFoundException_BuildsMessage_FromNameAndKey()
    {
        var exception = new NotFoundException("Student", 42);

        Assert.Equal("Entity \"Student\" (42) was not found.", exception.Message);
    }

    [Fact]
    public void ForbiddenAccessException_HasDefaultMessage()
    {
        var exception = new ForbiddenAccessException();

        Assert.Equal("You do not have permission to perform this action.", exception.Message);
    }

    [Fact]
    public void ValidationException_DefaultsToEmptyErrors()
    {
        var exception = new ValidationException();

        Assert.Empty(exception.Errors);
    }

    [Fact]
    public void ValidationException_ExposesGivenErrors()
    {
        var errors = new Dictionary<string, string[]>
        {
            ["Email"] = ["Email is required."]
        };

        var exception = new ValidationException(errors);

        Assert.Same(errors, exception.Errors);
    }
}
