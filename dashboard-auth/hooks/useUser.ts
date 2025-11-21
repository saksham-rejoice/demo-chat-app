import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUser } from '../store/slices/userSlice';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.user);

  const loadUser = () => {
    dispatch(fetchUser());
  };

  useEffect(() => {
    if (!user) {
      loadUser();
    }
  }, []);

  return {
    user,
    loading,
    error,
    loadUser,
  };
};