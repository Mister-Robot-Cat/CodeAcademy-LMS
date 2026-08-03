using CodeAcademy.Shared.Pagination;

namespace CodeAcademy.UnitTests.Shared;

public class PagedRequestTests
{
    [Fact]
    public void PageSize_IsClampedToMax_WhenSetAboveLimit()
    {
        var request = new PagedRequest { PageSize = 500 };

        Assert.Equal(100, request.PageSize);
    }

    [Fact]
    public void PageSize_KeepsGivenValue_WhenWithinLimit()
    {
        var request = new PagedRequest { PageSize = 25 };

        Assert.Equal(25, request.PageSize);
    }

    [Fact]
    public void Defaults_AreFirstPageWithTenItems()
    {
        var request = new PagedRequest();

        Assert.Equal(1, request.PageNumber);
        Assert.Equal(10, request.PageSize);
        Assert.False(request.SortDescending);
    }
}
