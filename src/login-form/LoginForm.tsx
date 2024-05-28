import React, { useCallback, useMemo } from 'react';
import './LoginForm.css';
import { Formik } from 'formik';
import { Button, TextField } from '@mui/material';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (values: { username: string; password: string }) => {
      console.log(values);
      navigate('/home');
    },
    [navigate],
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        username: yup.string().required('Username is required'),
        password: yup
          .string()
          .required('Password is required')
          .min(7, 'Password must be at least 7 characters'),
      }),
    [],
  );

  return (
    <>
      <h1>Library Service</h1>
      <Formik
        initialValues={{ username: '', password: '' }}
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
              id="username"
              label="Username"
              variant="outlined"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
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
              error={formik.touched.password && Boolean(formik.errors.password)}
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
    </>
  );
}

export default LoginForm;
