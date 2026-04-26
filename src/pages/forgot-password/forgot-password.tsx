import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { forgotPassword } from '../../services/slices/user-slice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../services/store';
import { UnknownAction } from '@reduxjs/toolkit';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword({ email })).then((result: UnknownAction) => {
      if (result.type === forgotPassword.fulfilled.type) {
        localStorage.setItem('resetPasswordEmail', email);
        navigate('/reset-password');
      }
    });
  };

  return (
    <ForgotPasswordUI
      errorText=''
      email={email}
      setEmail={setEmail}
      handleSubmit={handleFormSubmit}
    />
  );
};
