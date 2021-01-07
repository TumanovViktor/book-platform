export enum EBookGenre {
  BIOGRAPHY = "BIOGRAPHY",
  CRIME = "CRIME",
  FANTASY = "FANTASY",
  HORROR = "HORROR",
  POETRY = "POETRY",
  SCI_FI = "SCI_FI",
  TRAVEL = "TRAVEL",
  COMICS = "COMICS",
  KIDS = "KIDS",
  DRAMA = "DRAMA",
  NOVEL = "NOVEL",
  TALE = "TALE",
  SATIRE = "SATIRE",
  WESTERN = "WESTERN",
  EDUCATION = "EDUCATION"
}

export class BookGenre {
  val: EBookGenre; // for BE filter
  nameCz: string;

  private constructor(val: EBookGenre, nameCz: string,) {
    this.val = val;
    this.nameCz = nameCz;
  }

  public static readonly Biography = new BookGenre(EBookGenre.BIOGRAPHY, "Biografie");
  public static readonly Crime = new BookGenre(EBookGenre.CRIME, "Krimi");
  public static readonly Fantasy = new BookGenre(EBookGenre.FANTASY, "Fantasy");
  public static readonly Horror = new BookGenre(EBookGenre.HORROR, "Horor");
  public static readonly Poetry = new BookGenre(EBookGenre.POETRY, "Poezie");
  public static readonly SciFi = new BookGenre(EBookGenre.SCI_FI, "Sci-fi");
  public static readonly Travel = new BookGenre(EBookGenre.TRAVEL, "Cestopis");
  public static readonly Comics = new BookGenre(EBookGenre.COMICS, "Komiks");
  public static readonly Kids = new BookGenre(EBookGenre.KIDS, "Pro děti");
  public static readonly Drama = new BookGenre(EBookGenre.DRAMA, "Drama");
  public static readonly Novel = new BookGenre(EBookGenre.NOVEL, "Román");
  public static readonly Tale = new BookGenre(EBookGenre.TALE, "Příběh");
  public static readonly Satire = new BookGenre(EBookGenre.SATIRE, "Satira");
  public static readonly Western = new BookGenre(EBookGenre.WESTERN, "Western");
  public static readonly Education = new BookGenre(EBookGenre.EDUCATION, "Vzdělání");

  /** Needs to be correctly map - translation */
  public static readonly GenreMap: Map<EBookGenre, BookGenre> = new Map([
    [ EBookGenre.BIOGRAPHY, BookGenre.Biography ],
    [ EBookGenre.CRIME, BookGenre.Crime ],
    [ EBookGenre.FANTASY, BookGenre.Fantasy ],
    [ EBookGenre.HORROR, BookGenre.Horror ],
    [ EBookGenre.POETRY, BookGenre.Poetry ],
    [ EBookGenre.SCI_FI, BookGenre.SciFi ],
    [ EBookGenre.TRAVEL, BookGenre.Travel ],
    [ EBookGenre.COMICS, BookGenre.Comics ],
    [ EBookGenre.KIDS, BookGenre.Kids ],
    [ EBookGenre.DRAMA, BookGenre.Drama ],
    [ EBookGenre.NOVEL, BookGenre.Novel ],
    [ EBookGenre.TALE, BookGenre.Tale ],
    [ EBookGenre.SATIRE, BookGenre.Satire ],
    [ EBookGenre.WESTERN, BookGenre.Western ],
    [ EBookGenre.EDUCATION, BookGenre.Education ],
  ]);
}
