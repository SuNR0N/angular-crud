import { injectable, inject } from 'inversify';
import { books } from '../data/books';
import { IBookDocument, BookDTO } from '../models';
import { BooksRepository } from '../repositories/books.repository';
import { types } from '../config/types.config';

export interface IBooksService {
    getBooks(): Promise<BookDTO[]>;
    getBook(id: string): Promise<BookDTO>;
    createBook(book: BookDTO): Promise<BookDTO>;
    updateBook(book: BookDTO): Promise<BookDTO>;
    deleteBook(id: string): Promise<BookDTO>;
}

@injectable()
export class BooksService implements IBooksService {
    constructor(@inject(types.BooksRepository) private booksRepository: BooksRepository) {
        this.booksRepository.init(books);
    }

    public async getBooks(): Promise<BookDTO[]> {
        const books: BookDTO[] = await this.booksRepository.findAll()
            .then((b) => b.map(this.toBookDTO));

        return books;
    }

    public async getBook(id: string): Promise<BookDTO> {
        const book = await this.booksRepository.findOne(id)
            .then((b) => this.toBookDTO(b));

        return book;
    }

    public async createBook(book: BookDTO): Promise<BookDTO> {
        const bookDocument: IBookDocument = this.toBookDocument(book);

        const createdBook: IBookDocument = await this.booksRepository.create(bookDocument);

        return this.toBookDTO(createdBook);
    }

    public async updateBook(book: BookDTO): Promise<BookDTO> {
        const bookDocument: IBookDocument = this.toBookDocument(book);
        const existingBookDocumentId: string = await this.booksRepository.findOne(book.isbn)
            .then((b) => b._id);
        bookDocument._id = existingBookDocumentId;

        const updatedBook: IBookDocument = await this.booksRepository.update(bookDocument);

        return this.toBookDTO(updatedBook);
    }

    public async deleteBook(id: string): Promise<BookDTO> {
        const deletedBook: IBookDocument = await this.booksRepository.delete(id);

        return this.toBookDTO(deletedBook);
    }

    private toBookDocument(bookDTO: BookDTO): IBookDocument {
        return {
            isbn: bookDTO.isbn,
            title: bookDTO.title,
            authors: bookDTO.authors,
            description: bookDTO.description,
            publicationDate: new Date(bookDTO.publicationDate)
        };
    }

    private toBookDTO(bookDocument: IBookDocument): BookDTO {
        return new BookDTO(
            bookDocument.isbn,
            bookDocument.title,
            bookDocument.authors,
            bookDocument.description,
            bookDocument.publicationDate.toISOString()
        );
    }
}
