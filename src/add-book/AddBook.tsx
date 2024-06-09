import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import MenuAppBar from '../app-bar/MenuAppBar';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../api/ApiProvider';
import './AddBook.css';

export default function AddBook() {
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [availableCopies, setAvailableCopies] = useState('');
  const navigate = useNavigate();
  const apiClient = useApi();

  const handleAddBook = async () => {
    // Konwertuj wartości pól na liczby
    const parsedPublishYear = parseInt(publishYear);
    const parsedAvailableCopies = parseInt(availableCopies);

    // Sprawdź, czy konwersja zakończyła się sukcesem
    if (isNaN(parsedPublishYear) || isNaN(parsedAvailableCopies)) {
      console.error(
        'Invalid numeric values for publishYear or availableCopies',
      );
      return;
    }

    // Wywołaj funkcję apiClient.addBook() z przekonwertowanymi wartościami
    const response = await apiClient.addBook({
      isbn,
      title,
      author,
      publisher,
      publishYear: parsedPublishYear,
      availableCopies: parsedAvailableCopies,
    });

    console.log('Adding book:', {
      isbn,
      title,
      author,
      publisher,
      publishYear: parsedPublishYear, // Używamy przekonwertowanej wartości
      availableCopies: parsedAvailableCopies, // Używamy przekonwertowanej wartości
    });

    try {
      if (response.success) {
        // Czyszczenie pól po dodaniu książki
        setIsbn('');
        setTitle('');
        setAuthor('');
        setPublisher('');
        setPublishYear('');
        setAvailableCopies('');
        // Nawigacja do poprzedniej strony
        navigate(-1);
      } else {
        // Obsługa błędów, np. wyświetlenie komunikatu użytkownikowi
        console.error('Failed to add book:', response.statusCode);
      }
    } catch (error) {
      // Obsługa błędów związanych z wywołaniem API
      console.error('Error adding book:', error);
    }
  };

  return (
    <div>
      <MenuAppBar title={'add book'} />
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <div style={{ width: '75%', overflow: 'auto' }}>
          <TextField
            label="ISBN"
            variant="outlined"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Author"
            variant="outlined"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Publisher"
            variant="outlined"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Publication Year"
            variant="outlined"
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Available copies"
            variant="outlined"
            value={availableCopies}
            onChange={(e) => setAvailableCopies(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {' '}
        <Button variant="contained" color="primary" onClick={handleAddBook}>
          Submit
        </Button>
      </div>
    </div>
  );
}
