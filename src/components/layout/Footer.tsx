
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/50 pt-16 pb-8">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          <div className="col-span-1 md:col-span-2">
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
            <p className="mt-4 text-muted-foreground text-sm max-w-md">
              EcoTracker helps you understand and reduce your carbon footprint through personalized insights and practical recommendations.
            </p>
            <div className="mt-6 flex space-x-4">
              <SocialLink href="https://twitter.com" label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://facebook.com" label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://instagram.com" label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </SocialLink>
              <SocialLink href="https://linkedin.com" label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </SocialLink>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm tracking-wide uppercase text-muted-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><FooterLink to="/blog">Blog</FooterLink></li>
              <li><FooterLink to="/resources">Resources</FooterLink></li>
              <li><FooterLink to="/faq">FAQ</FooterLink></li>
              <li><FooterLink to="/support">Support</FooterLink></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm tracking-wide uppercase text-muted-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li><FooterLink to="/about">About</FooterLink></li>
              <li><FooterLink to="/contact">Contact</FooterLink></li>
              <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-muted">
          <p className="text-muted-foreground text-sm text-center">
            &copy; {currentYear} EcoTracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

const SocialLink = ({ href, label, children }: SocialLinkProps) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-background text-muted-foreground hover:text-primary hover:bg-accent transition-colors duration-200"
    >
      {children}
    </a>
  );
};

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink = ({ to, children }: FooterLinkProps) => {
  return (
    <Link 
      to={to} 
      className="text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      {children}
    </Link>
  );
};

export default Footer;
