import * as React from 'react';
import './AllBooks.css';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

interface Column {
  id:
    | 'isbn'
    | 'title'
    | 'author'
    | 'publisher'
    | 'publishYear'
    | 'availableCopies';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: any) => string;
}

const columns: readonly Column[] = [
  { id: 'isbn', label: 'ISBN', minWidth: 170 },
  { id: 'title', label: 'Title', minWidth: 100 },
  { id: 'author', label: 'Author', minWidth: 170 },
  { id: 'publisher', label: 'Publisher', minWidth: 170 },
  { id: 'publishYear', label: 'Publication year', minWidth: 170 },
  { id: 'availableCopies', label: 'Available copies', minWidth: 170 },
];

interface Book {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  availableCopies: number;
}

function createBook(
  isbn: string,
  title: string,
  author: string,
  publisher: string,
  publishYear: number,
  availableCopies: number,
): Book {
  return { isbn, title, author, publisher, publishYear, availableCopies };
}

const books: Book[] = [
  createBook(
    '9783161484100',
    'Crime and Punishment',
    'Fyodor Dostoevsky',
    'The Russian Messenger',
    1866,
    500,
  ),
  createBook(
    '9780684800011',
    'To Kill a Mockingbird',
    'Harper Lee',
    'J. B. Lippincott & Co.',
    1960,
    700,
  ),
  createBook(
    '9780140449242',
    'The Brothers Karamazov',
    'Fyodor Dostoevsky',
    'The Russian Messenger',
    1880,
    450,
  ),
  createBook(
    '9780743273565',
    'The Great Gatsby',
    'F. Scott Fitzgerald',
    "Charles Scribner's Sons",
    1925,
    600,
  ),
  createBook(
    '9780451524935',
    '1984',
    'George Orwell',
    'Secker & Warburg',
    1949,
    350,
  ),
  createBook(
    '9780385492084',
    'The Catcher in the Rye',
    'J. D. Salinger',
    'Little, Brown and Company',
    1951,
    420,
  ),
  createBook(
    '9780061120084',
    'One Hundred Years of Solitude',
    'Gabriel García Márquez',
    'Harper & Row',
    1967,
    550,
  ),
  createBook(
    '9780307594000',
    'The Girl with the Dragon Tattoo',
    'Stieg Larsson',
    'Norstedts Förlag',
    2005,
    480,
  ),
  createBook(
    '9780141182551',
    "One Flew Over the Cuckoo's Nest",
    'Ken Kesey',
    'Viking Press',
    1962,
    400,
  ),
  createBook(
    '9780679764029',
    "Midnight's Children",
    'Salman Rushdie',
    'Jonathan Cape',
    1981,
    510,
  ),
  createBook(
    '9780307743657',
    'The Help',
    'Kathryn Stockett',
    'Amy Einhorn Books',
    2009,
    480,
  ),
  createBook(
    '9780099549482',
    'Norwegian Wood',
    'Haruki Murakami',
    'Kodansha',
    1987,
    420,
  ),
];

export default function AllBooks() {
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
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <h1>All Books</h1>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
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
            {books
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((book) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={book.isbn}>
                    {columns.map((column) => {
                      const value = book[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
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
        count={books.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
