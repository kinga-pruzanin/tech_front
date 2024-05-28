import * as React from 'react';
import './Loans.css';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import MenuAppBar from '../app-bar/MenuAppBar';

interface Column {
  id: 'loanDate' | 'loanEnd' | 'returnDate' | 'user' | 'book';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: any) => string;
}

const columns: readonly Column[] = [
  { id: 'loanDate', label: 'Rental start date', minWidth: 170 },
  { id: 'loanEnd', label: 'Rental end date', minWidth: 100 },
  { id: 'returnDate', label: 'Date of return', minWidth: 170 },
  { id: 'user', label: 'User', minWidth: 170 },
  { id: 'book', label: 'Book title', minWidth: 170 },
];

interface Loan {
  loanDate: Date;
  loanEnd: Date;
  returnDate: Date;
  user: string;
  book: string;
}

function createLoan(
  loanDate: Date,
  loanEnd: Date,
  returnDate: Date,
  user: string,
  book: string,
): Loan {
  return { loanDate, loanEnd, returnDate, user, book };
}

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const loans: Loan[] = [
  createLoan(
    new Date(2024, 1, 1),
    new Date(2024, 1, 10),
    new Date(2024, 1, 15),
    'John Doe',
    'Crime and Punishment',
  ),
  createLoan(
    new Date(2024, 2, 5),
    new Date(2024, 2, 15),
    new Date(2024, 2, 20),
    'Alice Smith',
    'To Kill a Mockingbird',
  ),
  createLoan(
    new Date(2024, 3, 10),
    new Date(2024, 3, 20),
    new Date(2024, 3, 25),
    'Bob Johnson',
    'The Great Gatsby',
  ),
  // Add more loan objects...
  createLoan(
    new Date(2024, 4, 1),
    new Date(2024, 4, 10),
    new Date(2024, 4, 15),
    'Emma Watson',
    'The Catcher in the Rye',
  ),
  createLoan(
    new Date(2024, 5, 5),
    new Date(2024, 5, 15),
    new Date(2024, 5, 20),
    'Michael Jordan',
    'One Hundred Years of Solitude',
  ),
  createLoan(
    new Date(2024, 6, 10),
    new Date(2024, 6, 20),
    new Date(2024, 6, 25),
    'Jennifer Lopez',
    'The Girl with the Dragon Tattoo',
  ),
  createLoan(
    new Date(2024, 7, 1),
    new Date(2024, 7, 10),
    new Date(2024, 7, 15),
    'Tom Cruise',
    "One Flew Over the Cuckoo's Nest",
  ),
  createLoan(
    new Date(2024, 8, 5),
    new Date(2024, 8, 15),
    new Date(2024, 8, 20),
    'Scarlett Johansson',
    "Midnight's Children",
  ),
  createLoan(
    new Date(2024, 9, 10),
    new Date(2024, 9, 20),
    new Date(2024, 9, 25),
    'Leonardo DiCaprio',
    'The Help',
  ),
  createLoan(
    new Date(2024, 10, 1),
    new Date(2024, 10, 10),
    new Date(2024, 10, 15),
    'Angelina Jolie',
    'Norwegian Wood',
  ),
  createLoan(
    new Date(2024, 11, 5),
    new Date(2024, 11, 15),
    new Date(2024, 11, 20),
    'Brad Pitt',
    'Dune',
  ),
  createLoan(
    new Date(2024, 12, 10),
    new Date(2024, 12, 20),
    new Date(2024, 12, 25),
    'Johnny Depp',
    'Pride and Prejudice',
  ),
  createLoan(
    new Date(2025, 1, 1),
    new Date(2025, 1, 10),
    new Date(2025, 1, 15),
    'Natalie Portman',
    "Harry Potter and the Philosopher's Stone",
  ),
  createLoan(
    new Date(2025, 2, 5),
    new Date(2025, 2, 15),
    new Date(2025, 2, 20),
    'Robert Downey Jr.',
    'The Hobbit',
  ),
];

export default function Loans() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <MenuAppBar title={'Loans'} />
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <h1>All Loans</h1>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    style={{
                      minWidth: column.minWidth,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loans
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((loan, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = loan[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align || 'left'}
                          >
                            {column.format
                              ? column.format(value)
                              : typeof value === 'object'
                                ? formatDate(value)
                                : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={loans.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
