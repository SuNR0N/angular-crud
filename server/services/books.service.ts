import { injectable, inject } from 'inversify';
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
    @inject(types.BooksRepository)
    private booksRepository: BooksRepository;

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

        const updatedBook: IBookDocument = await this.booksRepository.update(bookDocument);

        return this.toBookDTO(updatedBook);
    }

    public async deleteBook(id: string): Promise<BookDTO> {
        const deletedBook: IBookDocument = await this.booksRepository.delete(id);

        return this.toBookDTO(deletedBook);
    }

    private toBookDocument(bookDTO: BookDTO): IBookDocument {
        return {
            _id: bookDTO.isbn,
            title: bookDTO.title,
            authors: bookDTO.authors,
            description: bookDTO.description,
            publicationDate: bookDTO.publicationDate
        };
    }

    private toBookDTO(bookDocument: IBookDocument): BookDTO {
        return new BookDTO(
            bookDocument._id,
            bookDocument.title,
            bookDocument.authors,
            bookDocument.description,
            bookDocument.publicationDate
        );
    }
}
