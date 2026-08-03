namespace CodeAcademy.Shared.Results;

public class Result
{
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public IReadOnlyList<string> Errors { get; }

    protected Result(bool isSuccess, IReadOnlyList<string> errors)
    {
        IsSuccess = isSuccess;
        Errors = errors;
    }

    public static Result Success() => new(true, []);

    public static Result Failure(params string[] errors) => new(false, errors);

    public static Result Failure(IReadOnlyList<string> errors) => new(false, errors);
}

public class Result<T> : Result
{
    private readonly T? _value;

    public T Value => IsSuccess
        ? _value!
        : throw new InvalidOperationException("Cannot access the value of a failed result.");

    private Result(T value) : base(true, [])
    {
        _value = value;
    }

    private Result(IReadOnlyList<string> errors) : base(false, errors)
    {
        _value = default;
    }

    public static Result<T> Success(T value) => new(value);

    public static new Result<T> Failure(params string[] errors) => new((IReadOnlyList<string>)errors);

    public static new Result<T> Failure(IReadOnlyList<string> errors) => new(errors);

    public static implicit operator Result<T>(T value) => Success(value);
}
