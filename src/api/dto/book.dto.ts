export class BookDto {
  id: number | undefined;
  isbn: string | undefined;
  title: string | undefined;
  author: string | undefined;
  publisher: string | undefined;
  publishYear: number | undefined;
  availableCopies: number | undefined;
  deleted: boolean | undefined;
  isNew?: boolean;
}
