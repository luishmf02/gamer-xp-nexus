
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, Home, User, Settings, Menu, X, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminCheck();

  const baseNavItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/games', label: 'Jogos', icon: Gamepad2 },
  ];

  const userNavItems = user ? [
    { path: '/dashboard', label: 'Dashboard', icon: User }
  ] : [];

  const adminNavItems = (user && isAdmin) ? [
    { path: '/admin', label: 'Admin', icon: Settings }
  ] : [];

  const navItems = [...baseNavItems, ...userNavItems, ...adminNavItems];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Loja Gamer XP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={isActive(path) ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive(path) 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Button>
              </Link>
            ))}
            
            {/* Auth Button */}
            {user ? (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={isActive(path) ? "default" : "ghost"}
                    className={`w-full justify-start flex items-center space-x-2 ${
                      isActive(path) 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Button>
                </Link>
              ))}
              
              {/* Mobile Auth Button */}
              {user ? (
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Entrar</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
