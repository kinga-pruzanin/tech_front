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
import AddUser from './add-user/AddUser';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import UserBooks from './user-books/UserBooks';
import UserLoans from './user-loans/UserLoans';

function App() {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <ApiProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/home/books" element={<AllBooks />} />
            <Route path="/home/loans" element={<Loans />} />
            <Route path="/home/users/books" element={<UserBooks />} />
            <Route path="/home/users/loans" element={<UserLoans />} />
            <Route path="/home/users/add" element={<AddUser />} />
          </Routes>
        </ApiProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
}

export default App;
