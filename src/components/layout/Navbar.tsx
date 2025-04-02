
// This is a read-only file, so we can't modify it directly.
// Instead, let's create a NavbarLinks component that we'll use elsewhere

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, BarChart2, Users } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Close the menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link 
                to="/" 
                className="font-bold text-xl flex items-center"
              >
                <span className="text-primary">Eco</span>Tracker
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-accent ${
                      location.pathname === '/dashboard' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/global-comparison" 
                    className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-accent ${
                      location.pathname === '/global-comparison' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Global Comparison
                  </Link>
                  <Link 
                    to="/friends-comparison" 
                    className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-accent ${
                      location.pathname === '/friends-comparison' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Friends
                  </Link>
                  <Link 
                    to="/users" 
                    className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-accent ${
                      location.pathname === '/users' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Users
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full ml-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{profile?.name?.[0] || user?.email?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled className="font-medium">
                        {profile?.name || user?.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer flex items-center">
                          <BarChart2 className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-accent ${
                      location.pathname === '/' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-accent ${
                      location.pathname === '/about' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    About
                  </Link>
                  <Link 
                    to="/contact" 
                    className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-accent ${
                      location.pathname === '/contact' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Contact
                  </Link>
                  <div className="ml-4 flex items-center space-x-2">
                    <Button variant="outline" asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/signup">Sign up</Link>
                    </Button>
                  </div>
                </>
              )}
            </nav>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-1">
            {isAuthenticated ? (
              <>
                {user && (
                  <div className="px-3 py-2 rounded-md text-sm font-medium border-b pb-3 mb-2 flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback>{profile?.name?.[0] || user?.email?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{profile?.name || user.email}</span>
                  </div>
                )}
                <Link 
                  to="/dashboard" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/dashboard' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/global-comparison" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/global-comparison' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'
                  }`}
                >
                  Global Comparison
                </Link>
                <Link 
                  to="/friends-comparison" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/friends-comparison' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'
                  }`}
                >
                  Friends
                </Link>
                <Link 
                  to="/users" 
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/users' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'
                  }`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Users Directory
                </Link>
                <button 
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 mt-1 rounded-md text-base font-medium text-red-500 hover:bg-accent"
                >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/about' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'
                  }`}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/contact' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'
                  }`}
                >
                  Contact
                </Link>
                <div className="pt-4 pb-3 border-t border-accent">
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block w-full text-center px-3 py-2 rounded-md text-base font-medium border border-gray-300 hover:bg-accent"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary/90"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
