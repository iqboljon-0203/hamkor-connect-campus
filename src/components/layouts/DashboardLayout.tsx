
import { Outlet } from 'react-router-dom';
import NavigationMenu from '../NavigationMenu';
import { useAuthStore } from '@/store/authStore';

export const DashboardLayout = () => {
  const { role } = useAuthStore();

  if (!role) return null;

  return (
    <div className="dashboard-layout">
      <div className="w-64 h-screen sticky top-0">
        <NavigationMenu role={role} />
      </div>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
