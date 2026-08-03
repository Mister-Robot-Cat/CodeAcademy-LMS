using CodeAcademy.Shared.Results;

namespace CodeAcademy.UnitTests.Shared;

public class ResultTests
{
    [Fact]
    public void Success_ReturnsIsSuccessTrue_WithNoErrors()
    {
        var result = Result.Success();

        Assert.True(result.IsSuccess);
        Assert.False(result.IsFailure);
        Assert.Empty(result.Errors);
    }

    [Fact]
    public void Failure_ReturnsIsSuccessFalse_WithGivenErrors()
    {
        var result = Result.Failure("error one", "error two");

        Assert.False(result.IsSuccess);
        Assert.True(result.IsFailure);
        Assert.Equal(["error one", "error two"], result.Errors);
    }

    [Fact]
    public void GenericSuccess_ExposesValue()
    {
        var result = Result<int>.Success(42);

        Assert.True(result.IsSuccess);
        Assert.Equal(42, result.Value);
    }

    [Fact]
    public void GenericFailure_ThrowsWhenAccessingValue()
    {
        var result = Result<int>.Failure("bad input");

        Assert.False(result.IsSuccess);
        Assert.Throws<InvalidOperationException>(() => result.Value);
    }

    [Fact]
    public void ImplicitConversion_FromValue_ProducesSuccessResult()
    {
        Result<string> result = "hello";

        Assert.True(result.IsSuccess);
        Assert.Equal("hello", result.Value);
    }
}
