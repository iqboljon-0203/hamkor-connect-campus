
import { NavLink } from 'react-router-dom';
import { Home, List, Calendar, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MobileNavigationProps {
  role: 'teacher' | 'student';
}

const MobileNavigation = ({ role }: MobileNavigationProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const basePath = role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';
  
  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        <NavLink 
          to={basePath} 
          className={({ isActive }) => `flex flex-col items-center justify-center text-xs p-2 rounded-md ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`}
          end
        >
          <Home className="h-5 w-5 mb-1" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to={`${basePath}/${role === 'teacher' ? 'groups' : 'tasks'}`} 
          className={({ isActive }) => `flex flex-col items-center justify-center text-xs p-2 rounded-md ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <List className="h-5 w-5 mb-1" />
          <span>{role === 'teacher' ? 'Groups' : 'Tasks'}</span>
        </NavLink>
        
        <NavLink 
          to={`${basePath}/calendar`} 
          className={({ isActive }) => `flex flex-col items-center justify-center text-xs p-2 rounded-md ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Calendar className="h-5 w-5 mb-1" />
          <span>Calendar</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `flex flex-col items-center justify-center text-xs p-2 rounded-md ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <User className="h-5 w-5 mb-1" />
          <span>Profile</span>
        </NavLink>
        
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center text-xs p-2 rounded-md text-red-500"
        >
          <LogOut className="h-5 w-5 mb-1" />
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;
