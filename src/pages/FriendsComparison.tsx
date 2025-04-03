
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

// Sample suggested friends that can be added with the Add button
const SAMPLE_SUGGESTED_FRIENDS = [
  {
    id: 'sample-friend-1',
    name: 'Eco Jessica'
  },
  {
    id: 'sample-friend-2',
    name: 'Green Robert'
  }
];

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
  const [allUsers, setAllUsers] = useState<{id: string, name: string}[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Fetch all users from the database
    const fetchUsers = async () => {
      try {
        console.log("Fetching all profiles for friends comparison");
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name');
          
        if (error) {
          console.error("Error fetching profiles:", error);
          throw error;
        }
        
        console.log(`Fetched ${data?.length || 0} profiles`);
        
        // Filter out the current user
        const otherUsers = data?.filter(u => u.id !== user?.id) || [];
        console.log(`Found ${otherUsers.length} other users (excluding current user)`);
        
        // Add our sample suggested friends
        const combinedUsers = [...otherUsers, ...SAMPLE_SUGGESTED_FRIENDS];
        
        setAllUsers(combinedUsers);
        
        // For demo purposes, convert some users to friends with random carbon scores
        const initialFriends = otherUsers.slice(0, Math.min(3, otherUsers.length)).map(u => {
          const randomScore = Math.floor(Math.random() * 300) + 150;
          const randomComparison = Math.floor(Math.random() * 60) - 30;
          
          return {
            id: u.id,
            name: u.name || 'Anonymous User',
            carbon_score: randomScore,
            compared_to_you: randomComparison
          };
        });
        
        console.log(`Created ${initialFriends.length} initial friends`);
        setFriendsList(initialFriends);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error loading users",
          description: "Could not load users from the database.",
          variant: "destructive"
        });
      }
    };
    
    fetchUsers();
  }, [isAuthenticated, navigate, user?.id, toast]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // If search is empty, show sample suggested friends
      setSearchResults(SAMPLE_SUGGESTED_FRIENDS.filter(user => 
        !friendsList.some(friend => friend.id === user.id)
      ));
      return;
    }
    
    setSearchLoading(true);
    
    try {
      // Search users by name
      const filteredUsers = allUsers.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Filter out users that are already friends
      const newUsers = filteredUsers.filter(user => 
        !friendsList.some(friend => friend.id === user.id)
      );
      
      setSearchResults(newUsers);
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

  // Show sample suggested friends on component mount
  useEffect(() => {
    const notAddedSampleFriends = SAMPLE_SUGGESTED_FRIENDS.filter(user => 
      !friendsList.some(friend => friend.id === user.id)
    );
    setSearchResults(notAddedSampleFriends);
  }, [friendsList]);

  const addFriend = (id: string, name: string) => {
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
    
    // Filter out the added friend from search results
    setSearchResults(prev => prev.filter(user => user.id !== id));
    setSearchTerm("");
    
    toast({
      title: "Friend added!",
      description: `${name} has been added to your friends.`,
    });
  };

  const viewComparison = async (friendId: string, friendName: string) => {
    setLoading(true);
    
    try {
      // In a real app, fetch actual carbon data for this user and friend
      // For demo, we'll generate realistic comparison data
      
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
      
      // For demo, simulate friend's carbon data based on their carbon_score
      const friendFromList = friendsList.find(f => f.id === friendId);
      const friendMultiplier = friendFromList ? 
        (friendFromList.carbon_score / Object.values(userCategories).reduce((sum, val) => sum + val, 100)) : 0.8;
      
      // Generate comparison data
      const categoryComparisons = Object.entries(userCategories).map(([category, impact]) => {
        // Slight variation per category for realism
        const categoryVariation = Math.random() * 0.4 + 0.8; // 0.8 - 1.2
        return {
          category,
          your_impact: impact,
          friend_impact: impact * friendMultiplier * categoryVariation
        };
      });
      
      // If user has no categories yet, create some sample ones
      if (categoryComparisons.length === 0) {
        const sampleCategories = ['transportation', 'food', 'energy', 'waste'];
        sampleCategories.forEach(category => {
          const yourImpact = Math.random() * 50 + 30;
          categoryComparisons.push({
            category,
            your_impact: yourImpact,
            friend_impact: yourImpact * (Math.random() * 0.6 + 0.7)
          });
        });
      }
      
      // Calculate total scores
      const yourScore = categoryComparisons.reduce((sum, item) => sum + item.your_impact, 0);
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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Friends & Comparison</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users size={18} />
                <span>{allUsers.length} Users Available</span>
              </div>
            </div>
            
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
                        placeholder="Search by name"
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
                              <span>{result.name || 'Anonymous User'}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => addFriend(result.id, result.name || 'Anonymous User')}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Your Friends ({friendsList.length})</h3>
                      
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
                            Search for users to add them to your friends list
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
