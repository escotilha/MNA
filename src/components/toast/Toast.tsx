import { toast as hotToast } from 'react-hot-toast';

export const toast = {
  success: (message: string) => {
    hotToast.success(message, {
      style: {
        background: '#10B981',
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    });
  },
  error: (message: string) => {
    hotToast.error(message, {
      style: {
        background: '#EF4444',
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#EF4444',
      },
    });
  },
};
