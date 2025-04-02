
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UserData = {
  id: string;
  name: string | null;
  created_at: string;
  carbon_total?: number;
};

export const UsersList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "table">("grid");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch all user profiles
        const { data: profilesData, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Fetch carbon data
        const { data: carbonData } = await supabase
          .from('carbon_logs')
          .select('user_id, carbon_impact');
          
        // Calculate total carbon per user
        const userCarbonTotals: Record<string, number> = {};
        
        carbonData?.forEach(log => {
          const userId = log.user_id;
          if (!userCarbonTotals[userId]) {
            userCarbonTotals[userId] = 0;
          }
          userCarbonTotals[userId] += log.carbon_impact;
        });
        
        // Combine user data with carbon totals
        const usersWithCarbonData = profilesData.map((profile: UserData) => ({
          ...profile,
          carbon_total: userCarbonTotals[profile.id] || 0
        }));
        
        setUsers(usersWithCarbonData);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error loading users",
          description: "Could not load user data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Users ({users.length})</span>
          </CardTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "table")}>
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((userData) => (
                  <div 
                    key={userData.id} 
                    className={`p-4 rounded-lg border ${userData.id === user?.id ? 'bg-secondary/10 border-primary/20' : ''}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{userData.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {userData.name || 'Anonymous User'}
                          {userData.id === user?.id && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">Joined {formatDate(userData.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Carbon Score:</span>{' '}
                        <span className="font-medium">{userData.carbon_total?.toFixed(1) || '0'} kg</span>
                      </div>
                      {userData.id !== user?.id && (
                        <Button variant="ghost" size="sm">
                          <UserPlus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="table" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Carbon Score</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userData) => (
                      <TableRow key={userData.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{userData.name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <span>{userData.name || 'Anonymous User'}</span>
                            {userData.id === user?.id && (
                              <span className="ml-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(userData.created_at)}</TableCell>
                        <TableCell className="text-right">{userData.carbon_total?.toFixed(1) || '0'} kg</TableCell>
                        <TableCell>
                          {userData.id !== user?.id && (
                            <Button variant="ghost" size="sm">
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersList;
