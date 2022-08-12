import {PageInfo} from "../../../src/utils/pagination";

test("PageIngo pageCount calculation", () => {
    let sut = new PageInfo(10, 10, 1);
    expect(sut.pageCount).toBe(1);
    expect(sut.currentPage).toBe(1);
    expect(sut.total).toBe(10);

    sut = new PageInfo(11, 10, 1);
    expect(sut.pageCount).toBe(2);

    sut = new PageInfo(19, 10, 1);
    expect(sut.pageCount).toBe(2);
});