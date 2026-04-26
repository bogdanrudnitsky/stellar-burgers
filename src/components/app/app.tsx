import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredientsThunk } from '../../services/slices/ingredients-slice';
import {
  closeOrder,
  resetConstructorAfterOrder
} from '../../services/slices/order-slice';
import { checkUser } from '../../services/slices/user-slice';
import { resetConstructor } from '../../services/slices/ingredients-slice';
import styles from './app.module.css';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;
  const orderModalData = useSelector((state) => state.orders.orderModalData);
  const shouldResetConstructor = useSelector(
    (state) => state.orders.shouldResetConstructor
  );

  // Загрузка ингредиентов при старте
  useEffect(() => {
    dispatch(getIngredientsThunk());
  }, [dispatch]);

  // Проверка пользователя при старте
  useEffect(() => {
    dispatch(checkUser());
  }, [dispatch]);

  // Очистка конструктора после успешного создания заказа
  useEffect(() => {
    if (shouldResetConstructor) {
      dispatch(resetConstructor());
      dispatch(resetConstructorAfterOrder());
    }
  }, [shouldResetConstructor, dispatch]);

  const handleCloseOrderModal = () => {
    dispatch(closeOrder());
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route path='/profile'>
          <Route
            index
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleCloseOrderModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Детали заказа' onClose={handleCloseOrderModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
