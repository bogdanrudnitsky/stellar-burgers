import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { ProfileUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/user-slice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const error = useSelector((state) => state.user.error);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const hasChanges = () =>
    formData.name !== user?.name ||
    formData.email !== user?.email ||
    formData.password !== '';

  const handleSaveChanges = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formData));
  };

  const handleCancelChanges = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ProfileUI
      formValue={formData}
      isFormChanged={hasChanges()}
      updateUserError={error}
      handleSubmit={handleSaveChanges}
      handleCancel={handleCancelChanges}
      handleInputChange={handleInputChange}
    />
  );
};
