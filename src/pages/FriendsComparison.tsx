
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserPlus, Users } from "lucide-react";

// Note: In a real app, we would create a friends table in Supabase
// For demo purposes, we'll simulate some friends data
type Friend = {
  id: string;
  name: string;
  carbon_score: number;
  compared_to_you: number; // Percentage difference (-ve means better than you)
};

type FriendComparison = {
  friend_id: string;
  friend_name: string;
  your_score: number;
  friend_score: number;
  categories: {
    category: string;
    your_impact: number;
    friend_impact: number;
  }[];
};

const FriendsComparison = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [friendsList, setFriendsList] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<{id: string, name: string}[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<FriendComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Simulated friends data for demo purposes
    // In a real app, this would come from a friends table in Supabase
    const demoFriends: Friend[] = [
      {
        id: "demo-friend-1",
        name: "Alex Green",
        carbon_score: 215.5,
        compared_to_you: -15.2 // Friend is doing 15.2% better than you
      },
      {
        id: "demo-friend-2",
        name: "Jordan Rivera",
        carbon_score: 302.8,
        compared_to_you: 12.3 // Friend is doing 12.3% worse than you
      },
      {
        id: "demo-friend-3",
        name: "Morgan Taylor",
        carbon_score: 178.6,
        compared_to_you: -33.7
      }
    ];
    
    setFriendsList(demoFriends);
  }, [isAuthenticated, navigate]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setSearchLoading(true);
    
    try {
      // In a real app, you would search the profiles table using a fuzzy search
      // This is a simplified example
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .ilike('name', `%${searchTerm}%`)
        .limit(5);
      
      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (error) {
      console.error("Error searching for users:", error);
      toast({
        title: "Search failed",
        description: "Could not complete the search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const addFriend = (id: string, name: string) => {
    // In a real app, you would add this friend to a friends table
    // For demo purposes, we'll just add it to our local state
    
    // Check if friend already exists
    if (friendsList.some(friend => friend.id === id)) {
      toast({
        title: "Already friends",
        description: `You are already friends with ${name}.`,
      });
      return;
    }
    
    // Generate random comparison data for demo
    const randomScore = Math.floor(Math.random() * 300) + 150;
    const randomComparison = Math.floor(Math.random() * 60) - 30;
    
    const newFriend: Friend = {
      id,
      name,
      carbon_score: randomScore,
      compared_to_you: randomComparison
    };
    
    setFriendsList(prev => [...prev, newFriend]);
    setSearchResults([]);
    setSearchTerm("");
    
    toast({
      title: "Friend added!",
      description: `${name} has been added to your friends.`,
    });
  };

  const viewComparison = async (friendId: string, friendName: string) => {
    setLoading(true);
    
    try {
      // In a real app, you would fetch actual comparison data from the database
      // For demo purposes, we're generating random data
      
      // Get user's carbon data by category
      const { data: userCarbonData, error: userError } = await supabase
        .from('carbon_logs')
        .select('category, carbon_impact')
        .eq('user_id', user?.id);
        
      if (userError) throw userError;
      
      // Calculate user's impact by category
      const userCategories: Record<string, number> = {};
      userCarbonData?.forEach(log => {
        if (!userCategories[log.category]) {
          userCategories[log.category] = 0;
        }
        userCategories[log.category] += log.carbon_impact;
      });
      
      // Generate random friend data for demo purposes
      // In a real app, this would come from the database
      const categoryComparisons = Object.entries(userCategories).map(([category, impact]) => {
        const variationFactor = Math.random() * 0.6 + 0.7; // Between 70% and 130%
        return {
          category,
          your_impact: impact,
          friend_impact: impact * variationFactor
        };
      });
      
      // Calculate total scores
      const yourScore = Object.values(userCategories).reduce((sum, val) => sum + val, 0);
      const friendScore = categoryComparisons.reduce((sum, item) => sum + item.friend_impact, 0);
      
      setSelectedFriend({
        friend_id: friendId,
        friend_name: friendName,
        your_score: yourScore,
        friend_score: friendScore,
        categories: categoryComparisons
      });
      
    } catch (error) {
      console.error("Error generating comparison:", error);
      toast({
        title: "Failed to load comparison",
        description: "Could not load the comparison data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-3xl font-bold mb-8">Friends & Comparison</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Add Friends</span>
                      <UserPlus className="h-5 w-5" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Input 
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button onClick={handleSearch} disabled={searchLoading} variant="outline">
                        {searchLoading ? (
                          <div className="animate-spin h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {searchResults.length > 0 && (
                      <div className="border rounded-md overflow-hidden">
                        {searchResults.map(result => (
                          <div 
                            key={result.id}
                            className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-secondary/10"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{result.name?.[0] || 'U'}</AvatarFallback>
                              </Avatar>
                              <span>{result.name}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => addFriend(result.id, result.name || 'Unknown User')}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Your Friends</h3>
                      
                      {friendsList.length > 0 ? (
                        <div className="space-y-2">
                          {friendsList.map(friend => (
                            <div 
                              key={friend.id}
                              className="flex items-center justify-between p-3 rounded-md border hover:bg-secondary/5 cursor-pointer"
                              onClick={() => viewComparison(friend.id, friend.name)}
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div>{friend.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {friend.carbon_score.toFixed(1)} kg CO₂
                                  </div>
                                </div>
                              </div>
                              <div className={`text-xs font-medium ${
                                friend.compared_to_you < 0 
                                  ? 'text-red-500' 
                                  : 'text-green-500'
                              }`}>
                                {friend.compared_to_you < 0 
                                  ? `${Math.abs(friend.compared_to_you).toFixed(1)}% better` 
                                  : `${friend.compared_to_you.toFixed(1)}% worse`
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-6 bg-muted/20 rounded-lg">
                          <Users className="h-8 w-8 text-muted-foreground mb-2" />
                          <h4 className="font-medium">No friends yet</h4>
                          <p className="text-sm text-muted-foreground">
                            Search for friends to add them to your list
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                {selectedFriend ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>Comparison with {selectedFriend.friend_name}</span>
                        <Button variant="outline" onClick={() => setSelectedFriend(null)} size="sm">
                          Close
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="text-center p-4 bg-secondary/20 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                          <h3 className="text-2xl font-bold">
                            {selectedFriend.your_score.toFixed(1)} kg
                          </h3>
                        </div>
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            {selectedFriend.friend_name}'s Score
                          </p>
                          <h3 className="text-2xl font-bold">
                            {selectedFriend.friend_score.toFixed(1)} kg
                          </h3>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium mb-4">Category Breakdown</h3>
                      
                      <div className="space-y-6">
                        {selectedFriend.categories.map((category, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-2">
                              <h4 className="font-medium capitalize">{category.category}</h4>
                              <div className="text-sm">
                                <span className="font-medium">
                                  {Math.abs(
                                    ((category.friend_impact - category.your_impact) / category.your_impact) * 100
                                  ).toFixed(1)}%
                                </span>
                                <span className="text-muted-foreground ml-1">
                                  {category.friend_impact > category.your_impact ? 'worse' : 'better'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>You</span>
                                  <span>{category.your_impact.toFixed(1)} kg</span>
                                </div>
                                <Progress value={
                                  (category.your_impact / Math.max(category.your_impact, category.friend_impact)) * 100
                                } className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>{selectedFriend.friend_name}</span>
                                  <span>{category.friend_impact.toFixed(1)} kg</span>
                                </div>
                                <Progress value={
                                  (category.friend_impact / Math.max(category.your_impact, category.friend_impact)) * 100
                                } className="h-2" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 p-4 border border-dashed rounded-lg">
                        <h4 className="font-medium mb-2">Challenge</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {selectedFriend.your_score > selectedFriend.friend_score ? (
                            `${selectedFriend.friend_name} is more eco-friendly! Try to reduce your ${
                              selectedFriend.categories.sort((a, b) => 
                                (b.your_impact - b.friend_impact) - (a.your_impact - a.friend_impact)
                              )[0]?.category || 'overall'
                            } impact to catch up.`
                          ) : (
                            `You're doing better than ${selectedFriend.friend_name}! Share your sustainable habits with them to help them improve.`
                          )}
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          Send Challenge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-12 border-2 border-dashed rounded-lg border-muted">
                    <Users className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Select a Friend to Compare</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Click on a friend from your list to see a detailed comparison of your carbon footprints
                    </p>
                    {friendsList.length === 0 && (
                      <Button onClick={() => document.querySelector('input')?.focus()}>
                        Find Friends
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FriendsComparison;
