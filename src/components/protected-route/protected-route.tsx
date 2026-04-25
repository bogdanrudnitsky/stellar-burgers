import { ReactElement, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { checkUser } from '../../services/slices/user-slice';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: ReactElement;
}

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(checkUser());
  }, [location.pathname, dispatch]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const redirectPath = location.state?.from?.pathname || '/';
    return <Navigate replace to={redirectPath} />;
  }

  return children;
};
