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
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

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

const formatDate = (dateArray: number[] | null): string => {
  if (!dateArray || dateArray.length !== 3) {
    return ''; // Invalid date array format or null value
  }
  const [year, month, day] = dateArray;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-GB');
};

export default function Loans() {
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
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {' '}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="add"
          sx={{ m: 1 }}
        >
          Add loan
        </Button>
      </div>
    </div>
  );
}
