export enum EBookGenre {
  BIOGRAPHY = "BIOGRAPHY",
  CRIME = "CRIME",
  FANTASY = "FANTASY",
  HORROR = "HORROR",
  POETRY = "POETRY",
  SCI_FI = "SCI_FI"
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
  public static readonly Fantasy = new BookGenre(EBookGenre.FANTASY, "Fantasy", true);
  public static readonly Horror = new BookGenre(EBookGenre.HORROR, "Horor", true);
  public static readonly Poetry = new BookGenre(EBookGenre.POETRY, "Poezie");
  public static readonly SciFi = new BookGenre(EBookGenre.SCI_FI, "Sci-fi", true);

  /** Needs to be correctly map - translation */
  public static readonly GenreMap: Map<EBookGenre, BookGenre> = new Map([
    [ EBookGenre.BIOGRAPHY, BookGenre.Biography ],
    [ EBookGenre.CRIME, BookGenre.Crime ],
    [ EBookGenre.FANTASY, BookGenre.Fantasy ],
    [ EBookGenre.HORROR, BookGenre.Horror ],
    [ EBookGenre.POETRY, BookGenre.Poetry ],
    [ EBookGenre.SCI_FI, BookGenre.SciFi ],
  ]);
}
