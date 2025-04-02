
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, profile, logout } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  
  // Generate a consistent color for the user's avatar
  const generateAvatarColor = (name: string) => {
    if (!name) return '#64748b'; // Default color
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    
    return color;
  };
  
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "py-4 glass" 
          : "py-6 bg-transparent"
      )}
    >
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            aria-label="EcoTracker homepage"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-eco-leaf to-eco-dark flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 text-white"
              >
                <path d="M2 22c1.25-1.25 2.5-2.5 3.5-2.5 1.34 0 1.5.5 3 .5 1.5 0 1.75-.5 3-.5 1.25 0 1.5.5 3 .5 1.25 0 2.25-1.25 3.5-2.5"/>
                <path d="M12 10v12"/>
                <path d="M5 8.5c0-.5-1.167-1.7-2-2C2.5 6.167 2 5 2 5s0 2.75 2 4c1.686 1.452 2 2 2 2l1-1s.5-2-1-3c-.5-.5-1.019-.464-1.5-1-1-1.121-1-3.5-1-3.5s1.5.5 2 2c.5 1.5.500 2.5 1 3.500C6 9 8 8.5 8 8.5c.5-.5.5-1.5.5-2C9.5 7 11 8.5 11 9c0 .5-1 1-2 1"/>
              </svg>
            </div>
            <span className="font-medium text-xl">
              <span className="font-bold text-eco-leaf">Eco</span>Tracker
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/dashboard" active={isActive("/dashboard")}>Dashboard</NavLink>
            <NavLink to="/global-comparison" active={isActive("/global-comparison")}>Global Comparison</NavLink>
            <NavLink to="/friends-comparison" active={isActive("/friends-comparison")}>Friends & Comparison</NavLink>
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all">
                    <AvatarFallback 
                      style={{ backgroundColor: generateAvatarColor(profile?.name || '') }}
                      className="text-white"
                    >
                      {getInitials(profile?.name)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="py-2 px-3">
                    <p className="text-sm font-medium">Hello, {profile?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">Welcome back!</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/login"
                  className={cn(
                    "text-sm font-medium px-4 py-2 rounded-full transition-all duration-300",
                    "hover:bg-secondary"
                  )}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className={cn(
                    "text-sm font-medium px-4 py-2 rounded-full",
                    "bg-primary text-primary-foreground",
                    "transition-all duration-300 hover:shadow-md hover:translate-y-[-1px]",
                    "active:translate-y-[1px]"
                  )}
                >
                  Sign up
                </Link>
              </>
            )}
            
            <button 
              className="block md:hidden"
              aria-label="Open menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, active, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "relative text-sm font-medium transition-colors",
        "before:absolute before:bottom-[-4px] before:left-0 before:h-[2px] before:w-full before:origin-right before:scale-x-0",
        "before:bg-primary before:transition-transform before:duration-300",
        "hover:text-foreground hover:before:origin-left hover:before:scale-x-100",
        active ? "text-foreground before:origin-left before:scale-x-100" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
};

export default Navbar;
