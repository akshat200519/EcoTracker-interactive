
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

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
            <NavLink to="/" active={isActive("/")}>Home</NavLink>
            <NavLink to="/about" active={isActive("/about")}>About</NavLink>
            <NavLink to="/contact" active={isActive("/contact")}>Contact</NavLink>
          </nav>
          
          <div className="flex items-center space-x-4">
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
