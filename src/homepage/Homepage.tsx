import { Box, Button } from '@mui/material';
import MenuAppBar from '../app-bar/MenuAppBar';
import { Link, Outlet } from 'react-router-dom';
import { useApi } from '../api/ApiProvider';
import * as React from 'react';

import backgroundImage from '../Klosterbibliothek_cStefan-Leitner-1920x1368.jpg';
import Paper from '@mui/material/Paper';

function HomePage() {
  const apiClient = useApi();
  const [role, setRole] = React.useState<string | null>('');

  React.useEffect(() => {
    apiClient.getRole().then((response) => {
      if (response.success && response.data !== null) {
        console.log(response.data);
        setRole(response.data);
      }
    });
  }, [apiClient]);

  return (
    <div>
      <MenuAppBar title={'Main page'} />
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)', // białe tło z przezroczystością
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // cień
            }}
          >
            {role === 'ROLE_LIBRARIAN' ? (
              <>
                <Button
                  variant="contained"
                  component={Link}
                  to="books"
                  sx={{ m: 1 }}
                >
                  Books
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  to="loans"
                  sx={{ m: 1 }}
                >
                  Loans
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  to="users/add"
                  sx={{ m: 1 }}
                >
                  Add user
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  component={Link}
                  to="users/books"
                  sx={{ m: 1 }}
                >
                  User books
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  to="users/loans"
                  sx={{ m: 1 }}
                >
                  User loans
                </Button>
              </>
            )}
          </Paper>
        </Box>
        <Outlet />
      </Box>
    </div>
  );
}

export default HomePage;
