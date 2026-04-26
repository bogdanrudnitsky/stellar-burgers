import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { ResetPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { resetPassword } from '../../services/slices/user-slice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../services/store';
import { UnknownAction } from '@reduxjs/toolkit';

export const ResetPassword: FC = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const resetEmail = localStorage.getItem('resetPasswordEmail');
    if (!resetEmail) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(resetPassword({ password, token })).then(
      (result: UnknownAction) => {
        if (result.type === resetPassword.fulfilled.type) {
          localStorage.removeItem('resetPasswordEmail');
          navigate('/login');
        }
      }
    );
  };

  return (
    <ResetPasswordUI
      errorText=''
      password={password}
      setPassword={setPassword}
      token={token}
      setToken={setToken}
      handleSubmit={handleFormSubmit}
    />
  );
};
