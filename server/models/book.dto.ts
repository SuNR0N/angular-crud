export class BookDTO {
    constructor(
        public isbn: string,
        public title: string,
        public authors: string[],
        public description?: string,
        public publicationDate?: string
    ) { }
}
