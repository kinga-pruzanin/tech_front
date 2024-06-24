import * as React from 'react';
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
import { Button, Snackbar } from '@mui/material';
import { LoanDto } from '../api/dto/loan.dto';
import { useState } from 'react';
import backgroundImage from '../Klosterbibliothek_cStefan-Leitner-1920x1368.jpg';
import Box from '@mui/material/Box';
//import SearchBar from 'material-ui-search-bar';

interface Column {
  id:
    | 'isbn'
    | 'title'
    | 'author'
    | 'publisher'
    | 'publishYear'
    | 'availableCopies'
    | 'actions';
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
  { id: 'actions', label: 'Actions', minWidth: 100 },
];

export default function UserBooks() {
  const [snackbarText, setSnackbarText] = useState('');
  const [open, setOpen] = React.useState(false);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const apiClient = useApi();

  const [books, setBooks] = React.useState<BookDto[]>([]);
  const [userId, setUserId] = React.useState<number | null>(0);

  React.useEffect(() => {
    apiClient.getId().then((response) => {
      if (response.success && response.data !== null) {
        console.log(response.data);
        setUserId(response.data);
      }
    });
  }, [apiClient]);

  React.useEffect(() => {
    apiClient.getAllBooks().then((response) => {
      if (response.success && response.data !== null) {
        const booksArray = Array.isArray(response.data)
          ? response.data.filter((book) => !book.deleted)
          : [response.data].filter((book) => !book.deleted);

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

  const handleBorrow = async (book: BookDto) => {
    try {
      if (!book.id) {
        console.error('Invalid book object or book ID is missing.');
        return;
      }

      const loanRequest: LoanDto = {
        user: {
          id: userId!.toString(),
        },
        book: {
          id: book.id.toString(),
          title: book.title || '', // Ensure title is not undefined
        },
        loanDate: '',
        loanEnd: '',
        accepted: false,
      };

      const response = await apiClient.addLoan(loanRequest);

      const handleClick = () => {
        setOpen(true);
        if (response.success) {
          setSnackbarText('Rental successfully requested!');
        } else {
          setSnackbarText('Failed to send request');
        }
      };

      if (response.success) {
        handleClick();
        console.log('Loan requested successfully:', response.data);
      } else {
        handleClick();
        console.error('Failed to request loan. Status code:');
      }
    } catch (error) {
      console.error('Error requesting loan:', error);
    }
  };

  return (
    <div>
      <MenuAppBar title={'Books'} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '20px',
        }}
      >
        {/*<SearchBar*/}
        {/*  value={this.state.value}*/}
        {/*  onChange={(newValue) => this.setState({ value: newValue })}*/}
        {/*  onRequestSearch={() => doSomethingWith(this.state.value)}*/}
        {/*/>*/}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {/*<h1>All Books</h1>*/}
          <TableContainer sx={{ maxHeight: '80vh' }}>
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
                          if (column.id === 'actions') {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => handleBorrow(book)}
                                >
                                  Borrow
                                </Button>
                              </TableCell>
                            );
                          }
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
        <div>
          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            message={snackbarText}
          />
        </div>
      </Box>
    </div>
  );
}
