export enum EBookGenre {
  BIOGRAPHY,
  CRIME,
  FANTASY,
  HORROR,
  POETRY,
  SCI_FI
}

export class BookGenre {
  val: EBookGenre; // for BE filter
  nameCz: string;
  isFiction?: Boolean; // null = both

  private constructor(val: EBookGenre, nameCz: string, isFiction?: Boolean) {
    this.val = val;
    this.nameCz = nameCz;
    this.isFiction = isFiction;
  }

  public static readonly Biography = new BookGenre(EBookGenre.BIOGRAPHY, "Biografie", false);
  public static readonly Crime = new BookGenre(EBookGenre.CRIME, "Krimi");
  public static readonly Fantasy = new BookGenre(EBookGenre.FANTASY, "Fantazie", true);
  public static readonly Horror = new BookGenre(EBookGenre.HORROR, "Horor", true);
  public static readonly Poetry = new BookGenre(EBookGenre.POETRY, "Poezie");
  public static readonly SciFi = new BookGenre(EBookGenre.SCI_FI, "Sci-fi", true);

  public static readonly Genres: BookGenre[] = [BookGenre.Biography, BookGenre.Crime, BookGenre.Fantasy, BookGenre.Horror, BookGenre.Poetry, BookGenre.SciFi];
}
