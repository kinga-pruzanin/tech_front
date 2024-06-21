import { Box, Button } from '@mui/material';
import MenuAppBar from '../app-bar/MenuAppBar';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useApi } from '../api/ApiProvider';
import * as React from 'react';

function HomePage() {
  const apiClient = useApi();

  React.useEffect(() => {
    apiClient.getRole().then((response) => {
      if (response.success && response.data !== null) {
        console.log(response.data);
      }
    });
  }, [apiClient]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MenuAppBar title={'main page'} />
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
        <Button
          variant="contained"
          component={Link}
          to="users/add"
          sx={{ m: 1 }}
        >
          Add user
        </Button>
      </Box>
      <Outlet />
    </Box>
  );
}

export default HomePage;
