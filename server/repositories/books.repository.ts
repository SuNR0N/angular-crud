import { injectable } from 'inversify';
import { booksDatabase, Book, IBookDocument } from '../models/book.schema';
import { logger } from '../utils/logger';

export interface IBooksRepository {
    findAll(): Promise<Book[]>;
    findOne(id: string): Promise<Book>;
    create(book: IBookDocument): Promise<Book>;
    update(book: IBookDocument): Promise<Book>;
    delete(id: string): Promise<Book>;
}

@injectable()
export class BooksRepository implements IBooksRepository {
    public async findAll(): Promise<Book[]> {
        const books = await booksDatabase.connect()
            .then(() => booksDatabase.books.find());
        return books.toArray();
    }

    public async findOne(id: string): Promise<Book> {
        return await booksDatabase.connect()
            .then(() => booksDatabase.books.findOne(id));
    }

    public async create(book: IBookDocument): Promise<Book> {
        return await booksDatabase.connect()
            .then(() => booksDatabase.books.create(book));
    }

    public async update(book: IBookDocument): Promise<Book> {
        const existingBook: Book = await booksDatabase.connect()
            .then(() => booksDatabase.books.findOne(book._id));

        existingBook._id = book._id;
        existingBook.title = book.title;
        existingBook.authors = book.authors;
        existingBook.description = book.description ? book.description : null;
        existingBook.publicationDate = book.publicationDate ? book.publicationDate : null;

        const updatedBook = await existingBook.save((err: Error, b: Book) => {
            if (err) {
                logger.error('Error updating book: ' + err);
                throw err;
            }
            return b;
        });

        return updatedBook;
    }

    public async delete(id: string): Promise<Book> {
        const existingBook: Book = await booksDatabase.connect()
            .then(() => booksDatabase.books.findOne(id));

        const deletedBook: Book = await existingBook.delete((err: Error, b: Book) => {
            if (err) {
                logger.error('Error deleting book: ' + err);
                throw err;
            }
            return b;
        });

        return deletedBook;
    }
}
