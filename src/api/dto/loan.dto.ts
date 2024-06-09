export class LoanDto {
  loanDate: string | undefined;
  loanEnd: string | undefined;
  returnDate: string | undefined;
  user:
    | {
        id: string | undefined;
        fullUsername: string | undefined;
      }
    | undefined;
  book:
    | {
        id: string | undefined;
        title: string | undefined;
      }
    | undefined;
}
