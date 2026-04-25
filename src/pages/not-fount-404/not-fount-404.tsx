import { FC } from 'react';

export const NotFound404: FC = () => (
  <div className='pt-30 pb-30'>
    <h3 className='pb-6 text text_type_main-large text-center'>
      Страница не найдена
    </h3>
    <p className='text text_type_main-default text_color_inactive text-center'>
      Ошибка 404. Проверьте правильность адреса.
    </p>
  </div>
);
