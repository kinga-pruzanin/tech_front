import React, { useState } from 'react';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from '@mui/material';
import MenuAppBar from '../app-bar/MenuAppBar';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api/ApiProvider';
import './AddUser.css';

export default function AddUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [fullUsername, setFullUsername] = useState('');
  const [email, setEmail] = useState('');
  const [snackbarText, setSnackbarText] = useState('');

  const navigate = useNavigate();
  const apiClient = useApi();

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

  const handleAddUser = async () => {
    const response = await apiClient.addUser({
      username,
      password,
      role,
      fullUsername,
      email,
    });

    console.log('Adding user:', {
      username,
      password,
      role,
      fullUsername,
      email,
    });

    const handleClick = () => {
      setOpen(true);
      if (response.success) {
        setSnackbarText('User successfully saved!');
      } else {
        setSnackbarText('Failed to add user');
      }
    };

    try {
      if (response.success) {
        setUsername('');
        setPassword('');
        setFullUsername('');
        setEmail('');
        setRole('');
        handleClick();
        setTimeout(() => navigate(-1), 3000);
      } else {
        handleClick();
        console.error('Failed to add user:', response.statusCode);
      }
    } catch (error) {
      handleClick();
      console.error('Error adding user:', error);
    }
  };

  return (
    <div>
      <MenuAppBar title={'Add user'} />
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <div style={{ width: '75%', overflow: 'auto' }}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="E-mail"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Full username"
            variant="outlined"
            value={fullUsername}
            onChange={(e) => setFullUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value={'ROLE_LIBRARIAN'}>Librarian</MenuItem>
              <MenuItem value={'ROLE_READER'}>Reader</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleAddUser}>
          Submit
        </Button>
      </div>
      <div>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message={snackbarText}
        />
      </div>
      ;
    </div>
  );
}
