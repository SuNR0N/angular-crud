import 'reflect-metadata';
import { Container } from 'inversify';
import { types } from './types.config';
import { IBooksService, BooksService } from '../services/books.service';
import { IBooksRepository, BooksRepository} from '../repositories/books.repository';
import { IRoutableController, BooksController } from '../controllers';

export const container = new Container();

container.bind<IRoutableController>(types.Controller).to(BooksController);
container.bind<IBooksService>(types.BooksService).to(BooksService);
container.bind<IBooksRepository>(types.BooksRepository).to(BooksRepository);
