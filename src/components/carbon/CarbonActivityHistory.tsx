
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CarbonActivityHistory = ({ onUpdate }: { onUpdate?: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadActivities = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("carbon_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setActivities(data || []);
    } catch (error) {
      console.error("Error loading activities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("carbon_logs")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setActivities(activities.filter(activity => activity.id !== id));
      
      toast({
        title: "Activity deleted",
        description: "The carbon activity has been removed from your log.",
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the activity.",
        variant: "destructive",
      });
    }
  };

  const formatActivityName = (activity: string) => {
    return activity.replace(/_/g, " ");
  };

  if (isLoading) {
    return (
      <GlassmorphicCard>
        <div className="p-6 text-center">
          <p>Loading your carbon activities...</p>
        </div>
      </GlassmorphicCard>
    );
  }

  return (
    <GlassmorphicCard>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
        
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 rounded-lg border border-border bg-card/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {activity.category}
                    </span>
                    <h3 className="text-lg font-medium mt-2">
                      {formatActivityName(activity.activity)}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {activity.quantity} {activity.unit} • {format(new Date(activity.log_date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-lg">{Number(activity.carbon_impact).toFixed(2)} kg</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(activity.id)}
                      className="text-xs text-destructive hover:text-destructive/90 mt-2"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              You haven't logged any carbon activities yet.
            </p>
          </div>
        )}
      </div>
    </GlassmorphicCard>
  );
};

export default CarbonActivityHistory;
