import { BookRepository } from "../../../application/ports/repositories/BookRepository";
import { Book } from "../../../domain/entities/Book";

export class InMemoryBookRepository implements BookRepository {
  public constructor(private readonly books: Array<Book>) {}

  public async addBook(book: Book): Promise<void> {
    this.books.push(book);
  }

  public async getBooks(): Promise<Book[]> {
    return this.books;
  }
}
