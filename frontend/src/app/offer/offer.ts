import { EBookGenre } from './book-genre';

export interface Offer {
  id: number;
  userId?: number;
  userName?: string;
  genre: EBookGenre;
  createdDate: string;
  author?: string;
  bookName: string;
  rating?: number;
  review?: string;
  favourite: boolean; // value depends on current user
}
