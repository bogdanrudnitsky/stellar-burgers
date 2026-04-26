import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/user-slice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector((state: RootState) => state.user.error);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleFormSubmit}
    />
  );
};
