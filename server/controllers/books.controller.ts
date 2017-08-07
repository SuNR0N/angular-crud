import { Request, Response, NextFunction, Router } from 'express';
import { injectable, inject } from 'inversify';
import * as HttpStatus from 'http-status-codes';
import { types } from '../config/types.config';
import { RoutableController } from './routable-controller';
import { BooksService } from '../services/books.service';
import { BookDTO } from '../models/book.dto';

@injectable()
export class BooksController extends RoutableController {
    private booksService: BooksService;

    constructor(@inject(types.BooksService) booksService: BooksService) {
        super('books');
        this.booksService = booksService;
    }

    getRouter(): Router {
        this.router.get('/', async(req: Request, res: Response, next: NextFunction) => {
            const books = await this.booksService.getBooks()
                .catch(err => next(err));
            res.status(HttpStatus.OK).json(books);
        });
        this.router.post('/', async(req: Request, res: Response, next: NextFunction) => {
            const book = new BookDTO(
                req.body.isbn,
                req.body.title,
                req.body.authors,
                req.body.description,
                req.body.publicationDate
            );
            const newBook = await this.booksService.createBook(book)
                .catch(err => next(err));
            res.status(HttpStatus.CREATED).json(newBook);
        });
        this.router.delete('/:id', async(req: Request, res: Response, next: NextFunction) => {
            await this.booksService.deleteBook(<string> req.params.id)
                .catch(err => next(err));
            res.status(HttpStatus.NO_CONTENT).end();
        });
        this.router.get('/:id', async(req: Request, res: Response, next: NextFunction) => {
            const book = await this.booksService.getBook(<string> req.params.id)
                .catch(err => next(err));
            res.status(HttpStatus.OK).json(book);
        });
        this.router.put('/:id', async(req: Request, res: Response, next: NextFunction) => {
            const book = new BookDTO(
                req.body.isbn,
                req.body.title,
                req.body.authors,
                req.body.description,
                req.body.publicationDate
            );
            const updatedBook = await this.booksService.updateBook(book)
                .catch(err => next(err));
            res.status(HttpStatus.OK).json(updatedBook);
        });

        return this.router;
    }
}
