
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CarbonScore from "@/components/carbon/CarbonScore";
import CarbonActivityForm from "@/components/carbon/CarbonActivityForm";
import CarbonActivityHistory from "@/components/carbon/CarbonActivityHistory";
import SustainabilityTips from "@/components/carbon/SustainabilityTips";

const Dashboard = () => {
  const { user, profile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [refreshData, setRefreshData] = useState(0);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!user || !profile) {
    return null;
  }
  
  const handleLogout = () => {
    logout();
    // No need to navigate here as it's now handled in the logout function
  };

  const handleActivityUpdate = () => {
    setRefreshData(prev => prev + 1);
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
              <h1 className="text-3xl font-bold">Welcome, {profile.name}</h1>
              <Button variant="outline" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <CarbonScore key={`carbon-score-${refreshData}`} />
              </div>
              <div>
                <SustainabilityTips key={`sustainability-tips-${refreshData}`} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <CarbonActivityForm onSuccess={handleActivityUpdate} />
              </div>
              <div className="lg:col-span-2">
                <CarbonActivityHistory 
                  key={`activity-history-${refreshData}`}
                  onUpdate={handleActivityUpdate} 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
