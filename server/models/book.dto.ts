export class BookDTO {
    constructor(
        private _isbn: string,
        private _title: string,
        private _authors: string[],
        private _description?: string,
        private _publicationDate?: Date
    ) { }

    public get isbn(): string {
        return this._isbn;
    }

    public get title(): string {
        return this._title;
    }

    public get authors(): string[] {
        return this._authors;
    }

    public get description(): string {
        return this._description;
    }

    public get publicationDate(): Date {
        return this._publicationDate;
    }
}
