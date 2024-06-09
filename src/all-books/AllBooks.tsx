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
import MenuAppBar from '../app-bar/MenuAppBar';
import { BookDto } from '../api/dto/book.dto';
import { useApi } from '../api/ApiProvider';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface Column {
  id: keyof BookDto;
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

export default function AllBooks() {
  const apiClient = useApi();

  const [books, setBooks] = React.useState<BookDto[]>([]);

  React.useEffect(() => {
    apiClient.getAllBooks().then((response) => {
      if (response.success && response.data !== null) {
        const booksArray = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setBooks(booksArray);
      }
    });
  }, [apiClient]);

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
      <MenuAppBar title={'Books'} />

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
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={book.isbn}
                    >
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
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {' '}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="add"
          sx={{ m: 1 }}
        >
          Add Book
        </Button>
      </div>
    </div>
  );
}
