export class BookDto {
  id?: string | number;
  isbn: string | undefined;
  title: string | undefined;
  author: string | undefined;
  publisher: string | undefined;
  publishYear: number | undefined;
  availableCopies: number | undefined;
  deleted: boolean | undefined;
  isNew?: boolean;
  actions?: undefined;
}
