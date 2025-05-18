
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Home, List, LogOut, Settings, User } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-muted'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  </li>
);

interface NavigationMenuProps {
  role: 'teacher' | 'student';
}

export const NavigationMenu = ({ role }: NavigationMenuProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const basePath = role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';
  
  const teacherNavItems = [
    { to: `${basePath}`, icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { to: `${basePath}/groups`, icon: <List className="h-5 w-5" />, label: 'Groups' },
    { to: `${basePath}/calendar`, icon: <Calendar className="h-5 w-5" />, label: 'Calendar' },
    { to: `/profile`, icon: <User className="h-5 w-5" />, label: 'Profile' },
    { to: `/settings`, icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];
  
  const studentNavItems = [
    { to: `${basePath}`, icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { to: `${basePath}/tasks`, icon: <List className="h-5 w-5" />, label: 'My Tasks' },
    { to: `${basePath}/calendar`, icon: <Calendar className="h-5 w-5" />, label: 'Calendar' },
    { to: `/profile`, icon: <User className="h-5 w-5" />, label: 'Profile' },
  ];
  
  const navItems = role === 'teacher' ? teacherNavItems : studentNavItems;

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <nav className="bg-card border-r border-border h-full flex flex-col">
      <div className="py-6 px-4 border-b border-border">
        <h1 className="text-xl font-bold text-brand-600">Hamkor Talim</h1>
      </div>
      
      <div className="flex flex-col justify-between h-full py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </ul>
        
        <div className="px-2 mt-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;
