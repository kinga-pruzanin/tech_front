import React, { useState } from 'react';
import './AddLoan.css';
import { Button, TextField } from '@mui/material';
import MenuAppBar from '../app-bar/MenuAppBar';
import { useApi } from '../api/ApiProvider';
import { useNavigate } from 'react-router-dom';

export default function AddLoan() {
  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');
  const navigate = useNavigate();
  const apiClient = useApi();

  const handleAddLoan = async () => {
    const response = await apiClient.addLoan({
      id: 0,
      loanDate: '',
      loanEnd: '',
      returnDate: '',
      user: {
        id: userId,
        fullUsername: '',
      },
      book: {
        id: bookId,
        title: '',
      },
      accepted: false,
    });

    try {
      if (response.success) {
        // Czyszczenie pól po dodaniu wypożyczenia
        setUserId('');
        setBookId('');
        // Możesz dodać dodatkowe operacje po udanym dodaniu wypożyczenia
        navigate(-1);
      } else {
        // Obsługa błędów, np. wyświetlenie komunikatu użytkownikowi
        console.error('Failed to add loan:', response.statusCode);
      }
    } catch (error) {
      // Obsługa błędów związanych z wywołaniem API
      console.error('Error adding loan:', error);
    }
  };

  return (
    <div>
      <MenuAppBar title={'add rental'} />
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <div style={{ width: '75%', overflow: 'auto' }}>
          <TextField
            label="User ID"
            variant="outlined"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Book ID"
            variant="outlined"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleAddLoan}>
          Submit
        </Button>
      </div>
    </div>
  );
}
