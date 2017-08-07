import { Core, Model, Instance, Collection, Index, Property, ObjectID } from 'iridium';
import { config } from '../config/server.config';

export interface IBookDocument {
    _id?: string;
    isbn: string;
    title: string;
    authors: string[];
    description?: string;
    publicationDate?: Date;
}

@Index({ name: 1 })
@Collection('books')
export class Book extends Instance<IBookDocument, Book> implements IBookDocument {
    @ObjectID
    // tslint:disable-next-line:variable-name
    public _id: string;
    @Property(String, true)
    public isbn: string;
    @Property(String, true)
    public title: string;
    @Property(Array, true)
    public authors: string[];
    @Property(String, false)
    public description?: string;
    @Property(Date, false)
    public publicationDate?: Date;
}

class BooksDatabase extends Core {
    public books = new Model<IBookDocument, Book>(this, Book);
}

export const booksDatabase = new BooksDatabase({ database: config.databaseName });
