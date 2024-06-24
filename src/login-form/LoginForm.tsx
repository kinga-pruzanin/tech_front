import React, { useCallback, useMemo } from 'react';
import './LoginForm.css';
import { Formik } from 'formik';
import { Button, TextField } from '@mui/material';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApi } from '../api/ApiProvider';
import Box from '@mui/material/Box';
import backgroundImage from '../Klosterbibliothek_cStefan-Leitner-1920x1368.jpg';

function LoginForm() {
  const navigate = useNavigate();
  const apiClient = useApi();

  const onSubmit = useCallback(
    (values: { login: string; password: string }, formik: any) => {
      apiClient.login(values).then((response) => {
        if (response.success) {
          navigate('/home');
        } else {
          formik.setFieldError('login', 'Invalid login credentials');
        }
      });
    },
    [apiClient, navigate],
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        login: yup.string().required('Username is required'),
        password: yup
          .string()
          .required('Password is required')
          .min(7, 'Password must be at least 7 characters'),
      }),
    [],
  );

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`, // Ustawienie zdjęcia jako tło
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh', // Minimalna wysokość aby obejmować całą stronę
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Przezroczystość tła
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Cień
          backdropFilter: 'blur(5px)', // Efekt rozmycia
        }}
      >
        <h1>Library Service</h1>
        <Formik
          initialValues={{ login: '', password: '' }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          validateOnChange
          validateOnBlur
        >
          {(formik) => (
            <form
              className="Login-form"
              id="sign-in-form"
              onSubmit={formik.handleSubmit}
              noValidate
            >
              <TextField
                id="login"
                label="Username"
                variant="outlined"
                name="login"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.login}
                error={formik.touched.login && Boolean(formik.errors.login)}
                helperText={formik.touched.login && formik.errors.login}
              />
              <TextField
                id="password"
                type="password"
                label="Password"
                variant="outlined"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
              <Button
                variant="outlined"
                type="submit"
                disabled={!(formik.isValid && formik.dirty)}
              >
                Log in
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default LoginForm;
