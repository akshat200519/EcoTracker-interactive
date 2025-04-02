
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/schema";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Medal, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type UserRanking = {
  user_id: string;
  user_name: string | null;
  total_carbon: number;
  ranking: number;
};

const GlobalComparison = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leaderboard, setLeaderboard] = useState<UserRanking[]>([]);
  const [userRanking, setUserRanking] = useState<UserRanking | null>(null);
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        
        // First, fetch all carbon logs
        const { data: carbonData, error: carbonError } = await supabase
          .from('carbon_logs')
          .select('user_id, carbon_impact');
          
        if (carbonError) throw carbonError;
        
        // Then, fetch all profiles to get user names
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name');
          
        if (profilesError) throw profilesError;
        
        // Set the user count
        setUserCount(profilesData.length);
        
        // Create a map of user IDs to names for quick lookup
        const userNameMap: Record<string, string | null> = {};
        profilesData.forEach((profile) => {
          userNameMap[profile.id] = profile.name;
        });
        
        // Process the data to get user rankings
        const userTotals: Record<string, { total: number, name: string | null }> = {};
        
        carbonData.forEach(item => {
          const userId = item.user_id;
          const impact = item.carbon_impact || 0;
          const name = userNameMap[userId] || null;
          
          if (!userTotals[userId]) {
            userTotals[userId] = { total: 0, name };
          }
          
          userTotals[userId].total += impact;
        });
        
        // Convert to array and sort by carbon impact (lower is better)
        const rankings = Object.entries(userTotals)
          .map(([user_id, { total, name }]) => ({
            user_id,
            user_name: name,
            total_carbon: total,
            ranking: 0
          }))
          .sort((a, b) => a.total_carbon - b.total_carbon);
        
        // Assign rankings
        rankings.forEach((item, index) => {
          item.ranking = index + 1;
        });
        
        // Get top 10 users
        const topUsers = rankings.slice(0, 10);
        
        // Find current user's ranking
        const currentUserRanking = rankings.find(item => item.user_id === user?.id) || null;
        
        setLeaderboard(topUsers);
        setUserRanking(currentUserRanking);
      } catch (error) {
        console.error("Error fetching global comparison data:", error);
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "Could not load comparison data."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, [isAuthenticated, navigate, user?.id, toast]);
  
  const getRankingColor = (ranking: number): string => {
    if (ranking === 1) return "text-yellow-500";
    if (ranking === 2) return "text-slate-400";
    if (ranking === 3) return "text-amber-600";
    return "text-muted-foreground";
  };
  
  const getRankingIcon = (ranking: number) => {
    if (ranking === 1) return <Award className="h-5 w-5 text-yellow-500" />;
    if (ranking === 2) return <Award className="h-5 w-5 text-slate-400" />;
    if (ranking === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="h-5 w-5 flex items-center justify-center font-semibold">{ranking}</span>;
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
              <h1 className="text-3xl font-bold">Global Comparison</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users size={18} />
                <span>{userCount} Users Registered</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Carbon Footprint Leaderboard</span>
                      <Medal className="h-5 w-5 text-primary" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    ) : leaderboard.length > 0 ? (
                      <div className="space-y-4">
                        {leaderboard.map((entry) => (
                          <div 
                            key={entry.user_id}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              entry.user_id === user?.id ? 'bg-secondary/20' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 flex items-center justify-center">
                                {getRankingIcon(entry.ranking)}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {entry.user_name || 'Anonymous User'}
                                  {entry.user_id === user?.id && 
                                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>
                                  }
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {entry.total_carbon.toFixed(2)} kg CO₂
                                </p>
                              </div>
                            </div>
                            <div className="w-1/3">
                              <Progress 
                                value={100 - (entry.total_carbon / (leaderboard[leaderboard.length - 1]?.total_carbon || 100)) * 100} 
                                className="h-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No carbon data available yet.</p>
                        <p className="text-sm">Start logging activities to appear on the leaderboard!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Ranking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : userRanking ? (
                      <div className="text-center py-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                          <span className={`text-3xl font-bold ${getRankingColor(userRanking.ranking)}`}>
                            #{userRanking.ranking}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold">{profile?.name || 'You'}</h3>
                        <p className="text-muted-foreground mb-4">
                          Total: {userRanking.total_carbon.toFixed(2)} kg CO₂
                        </p>
                        
                        <div className="mt-6 text-left">
                          <h4 className="font-medium mb-2">Improve Your Ranking</h4>
                          <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                            <li>Log more sustainable activities</li>
                            <li>Reduce your transportation emissions</li>
                            <li>Choose renewable energy sources</li>
                            <li>Reduce meat consumption</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No ranking data available yet.</p>
                        <p className="text-sm">Start logging activities to appear on the leaderboard!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GlobalComparison;
