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
import { useApi } from '../api/ApiProvider';
import { LoanDto } from '../api/dto/loan.dto';
import { Button, Snackbar } from '@mui/material';
import { useState } from 'react';
import backgroundImage from '../Klosterbibliothek_cStefan-Leitner-1920x1368.jpg';
import Box from '@mui/material/Box';

interface Column {
  id: 'loanDate' | 'loanEnd' | 'returnDate' | 'user' | 'book' | 'actions';
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
  { id: 'actions', label: 'Actions', minWidth: 100 },
];

const formatDate = (dateArray: number[] | null): string => {
  if (!dateArray || dateArray.length !== 3) {
    return '';
  }
  const [year, month, day] = dateArray;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-GB');
};

export default function Loans() {
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

  const [loans, setLoans] = React.useState<LoanDto[]>([]);

  React.useEffect(() => {
    apiClient.getAllLoans().then((response) => {
      if (response.success && response.data !== null) {
        const loansArray = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setLoans(loansArray);
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

  const handleAccept = async (id: number) => {
    try {
      const response = await apiClient.acceptLoan(id);

      const handleClick = () => {
        setOpen(true);
        if (response.success) {
          setSnackbarText('Rental successfully accepted!');
        } else {
          setSnackbarText('Failed to accept request');
        }
      };

      if (response.success) {
        handleClick();
        console.log('Loan accepted successfully:', response.data);
      } else {
        handleClick();
        console.error(
          'Failed to accept loan. Status code:',
          response.statusCode,
        );
      }
    } catch (error) {
      console.error('Error accepting loan:', error);
    }
  };

  return (
    <div>
      <MenuAppBar title={'All loans'} />
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
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {/*<h1>All Loans</h1>*/}
          <TableContainer sx={{ maxHeight: '80vh' }}>
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
                          if (column.id === 'actions') {
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align || 'left'}
                              >
                                {!loan.accepted && loan.id !== undefined && (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAccept(loan.id!)}
                                  >
                                    Accept
                                  </Button>
                                )}
                              </TableCell>
                            );
                          }

                          let value: any;
                          if (column.id === 'user') {
                            value = loan.user?.fullUsername;
                          } else if (column.id === 'book') {
                            value = loan.book?.title;
                          } else {
                            value = loan[column.id];
                          }
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
