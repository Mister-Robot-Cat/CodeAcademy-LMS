using CodeAcademy.Shared.Pagination;

namespace CodeAcademy.UnitTests.Shared;

public class PagedResultTests
{
    [Theory]
    [InlineData(25, 10, 3)]
    [InlineData(20, 10, 2)]
    [InlineData(1, 10, 1)]
    [InlineData(0, 10, 0)]
    public void TotalPages_IsCeilingOfTotalCountOverPageSize(int totalCount, int pageSize, int expectedPages)
    {
        var result = new PagedResult<string>([], totalCount, pageNumber: 1, pageSize);

        Assert.Equal(expectedPages, result.TotalPages);
    }

    [Fact]
    public void HasPreviousPage_IsFalseOnFirstPage()
    {
        var result = new PagedResult<string>([], totalCount: 30, pageNumber: 1, pageSize: 10);

        Assert.False(result.HasPreviousPage);
        Assert.True(result.HasNextPage);
    }

    [Fact]
    public void HasNextPage_IsFalseOnLastPage()
    {
        var result = new PagedResult<string>([], totalCount: 30, pageNumber: 3, pageSize: 10);

        Assert.True(result.HasPreviousPage);
        Assert.False(result.HasNextPage);
    }
}
