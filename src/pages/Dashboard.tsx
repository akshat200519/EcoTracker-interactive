
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!user) {
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
              <Button variant="outline" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
            
            <div className="mb-12">
              <GlassmorphicCard className="p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-4">
                    Your Carbon Footprint Dashboard
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Your journey toward a sustainable future starts here. 
                    This will be your personal dashboard to track and reduce your carbon footprint.
                  </p>
                  
                  <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm">
                    Coming Soon
                  </div>
                </div>
              </GlassmorphicCard>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassmorphicCard>
                <div className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 22c1.25-1.25 2.5-2.5 3.5-2.5 1.34 0 1.5.5 3 .5 1.5 0 1.75-.5 3-.5 1.25 0 1.5.5 3 .5 1.25 0 2.25-1.25 3.5-2.5"></path>
                      <path d="M12 10v12"></path>
                      <path d="M5 8.5c0-.5-1.167-1.7-2-2C2.5 6.167 2 5 2 5s0 2.75 2 4c1.686 1.452 2 2 2 2l1-1s.5-2-1-3c-.5-.5-1.019-.464-1.5-1-1-1.121-1-3.5-1-3.5s1.5.5 2 2c.5 1.5.500 2.5 1 3.500C6 9 8 8.5 8 8.5c.5-.5.5-1.5.5-2C9.5 7 11 8.5 11 9c0 .5-1 1-2 1"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Calculate Footprint</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Answer questions about your lifestyle to calculate your carbon footprint
                  </p>
                  <Button className="w-full">Start Calculation</Button>
                </div>
              </GlassmorphicCard>
              
              <GlassmorphicCard>
                <div className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="20" x2="12" y2="10"></line>
                      <line x1="18" y1="20" x2="18" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="16"></line>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">View Reports</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Analyze your carbon emissions and track your progress over time
                  </p>
                  <Button variant="outline" className="w-full">View Reports</Button>
                </div>
              </GlassmorphicCard>
              
              <GlassmorphicCard>
                <div className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 21h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1z"></path>
                      <path d="M21 11h-7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1z"></path>
                      <path d="M21 21h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Get Recommendations</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Receive personalized tips to reduce your environmental impact
                  </p>
                  <Button variant="outline" className="w-full">Get Tips</Button>
                </div>
              </GlassmorphicCard>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
