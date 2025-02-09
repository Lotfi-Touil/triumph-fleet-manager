import { Book } from "@domain/entities/Book";

export interface BookNotificationService {
  sendBookAddedNotification(book: Book): Promise<void>;
}
