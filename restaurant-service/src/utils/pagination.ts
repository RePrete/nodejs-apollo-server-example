export class InputPagination {
    page: number;
    limit: number;
    offset: number;

    constructor(pagination: {
        page: number,
        limit: number
    } = {page: 1, limit: 10}) {
        this.page = pagination.page;
        this.limit = pagination.limit;
        this.offset = (this.page - 1) * this.limit;
    }
}

export class PageInfo {
    total: number;
    pageCount: number;
    currentPage: number;

    constructor(total: number, pageCount: number, currentPage: number) {
        this.total = total;
        this.pageCount = pageCount;
        this.currentPage = currentPage;
    }
}

export class PaginatedData {
    data: any[];
    pageInfo: PageInfo;

    constructor(data: any[], pageInfo: PageInfo) {
        this.data = data;
        this.pageInfo = pageInfo;
    }
}