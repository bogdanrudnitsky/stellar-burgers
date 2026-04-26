import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/user-slice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../services/store';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
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
    dispatch(registerUser({ email, name: userName, password }));
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      userName={userName}
      setUserName={setUserName}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleFormSubmit}
    />
  );
};
