import React, { FC, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Context } from './index';

import MainPage from './MainPage';
import CatalogPage from './components/catalog/CatalogPage/CatalogPage';
import CreatePostPage from './components/catalog/CreatePostPage/CreatePostPage';
import ViewDetailsPage from './components/catalog/ViewDetailsPage/ViewDetailsPage';
import ProfilePage from './components/catalog/ProfilePage/ProfilePage';
import MyProfilePage from './components/catalog/MyProfilePage/MyProfilePage';
import SettingsPage from './components/settings/settings';

import LoginPage from './components/auth/Login-page/Login-page';
import RegistrationPage from './components/auth/Registration-page/Registration-page';
import EmailConfirmationPage from './components/auth/confirmEmail/confirmEmail';
import EmailConfirmedPage from './components/auth/confirmedEmail/confirmedEmail';
import Loader from './components/auth/Loader/Loader';

const ProtectedRoute: FC = observer(() => {
  const { store } = useContext(Context);

  if (store.isLoading) {
    return <Loader />;
  }
  if (!store.isAuth) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
});

const App: FC = () => {
  const { store } = useContext(Context);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      store.checkAuth();
    } else {
      store.setLoading(false);
    }
  }, [store]);


  if (store.isLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/watch/:link" element={<ViewDetailsPage />} />

        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="registration" element={<RegistrationPage />} />
          <Route path="email-confirmation" element={<EmailConfirmationPage />} />
          <Route path="email-confirmed" element={<EmailConfirmedPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalog/posts/create" element={<CreatePostPage />} />
          <Route path="/profile" element={<MyProfilePage />} />
          <Route path="/profile/:link" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default observer(App);
