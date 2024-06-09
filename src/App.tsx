import React from 'react';
//import logo from './logo.svg';
import './App.css';
import LoginForm from './login-form/LoginForm';
import AllBooks from './all-books/AllBooks';
import Loans from './loans/Loans';
import { Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import Homepage from './homepage/Homepage';
import ApiProvider from './api/ApiProvider';

function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/home/books" element={<AllBooks />} />
          <Route path="/home/loans" element={<Loans />} />
        </Routes>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
