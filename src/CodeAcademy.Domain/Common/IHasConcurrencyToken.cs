namespace CodeAcademy.Domain.Common;

public interface IHasConcurrencyToken
{
    byte[] RowVersion { get; set; }
}
