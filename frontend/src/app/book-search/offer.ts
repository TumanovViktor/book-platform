import { EBookGenre } from './book-genre';

export interface Offer {
  id: number;
  userId?: number;
  userName?: string;
  genre: EBookGenre;
  date: string;
  author?: string;
  bookName: string;
  rating?: number;
}
