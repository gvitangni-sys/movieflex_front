import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Navbar } from './Navbar';
import { GuestNavbar } from './GuestNavbar';

export const MainNavbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Si l'utilisateur est connecté, afficher la navbar complète
  // Sinon, afficher la navbar pour invités
  return user ? <Navbar /> : <GuestNavbar />;
};
