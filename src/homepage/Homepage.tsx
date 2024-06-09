import { Box, Button } from '@mui/material';
import MenuAppBar from '../app-bar/MenuAppBar';
import { Link, Outlet } from 'react-router-dom';
import { useApi } from '../api/ApiProvider';

function HomePage() {
  const apiClient = useApi();

  apiClient.getAllBooks().then((response) => {
    console.log(response);
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MenuAppBar title={'Main page'} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)',
          padding: '10px',
        }}
      >
        <Button variant="contained" component={Link} to="books" sx={{ m: 1 }}>
          Books
        </Button>
        <Button variant="contained" component={Link} to="loans" sx={{ m: 1 }}>
          Loans
        </Button>
      </Box>
      <Outlet />
    </Box>
  );
}

export default HomePage;
