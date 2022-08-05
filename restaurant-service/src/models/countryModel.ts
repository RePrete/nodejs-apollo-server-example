export default class CountryModel {
    public code: string;
    public locales: string[];
    constructor(
        {
            code,
            locales,
        }: {
            code: string,
            locales: string[],
        }
    ) {
        this.code = code;
        this.locales = locales;
    }
}