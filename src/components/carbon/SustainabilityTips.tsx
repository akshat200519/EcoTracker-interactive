
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import { Tables } from "@/integrations/supabase/schema";

// General sustainability tips
const GENERAL_TIPS = [
  {
    title: "Use public transport",
    description: "Taking public transport instead of driving can reduce your carbon footprint significantly.",
    category: "transportation"
  },
  {
    title: "Switch to LED bulbs",
    description: "LED bulbs use up to 85% less energy than traditional bulbs and last longer.",
    category: "electricity"
  },
  {
    title: "Install a low-flow showerhead",
    description: "This can reduce your water consumption by 50% without affecting shower quality.",
    category: "water"
  },
  {
    title: "Try plant-based meals",
    description: "Having plant-based meals just a few days a week can significantly reduce your carbon footprint.",
    category: "diet"
  },
  {
    title: "Use reusable shopping bags",
    description: "Avoid single-use plastic bags by bringing your own bags when shopping.",
    category: "general"
  },
  {
    title: "Turn off appliances when not in use",
    description: "Many appliances consume electricity even in standby mode.",
    category: "electricity"
  },
  {
    title: "Carpool with colleagues",
    description: "Share your commute with colleagues to reduce emissions and transportation costs.",
    category: "transportation"
  },
  {
    title: "Fix water leaks promptly",
    description: "A dripping faucet can waste over 3,000 gallons of water annually.",
    category: "water"
  },
  {
    title: "Buy local and seasonal food",
    description: "This reduces the carbon footprint associated with food transportation and storage.",
    category: "diet"
  },
  {
    title: "Use a refillable water bottle",
    description: "Avoid single-use plastic bottles by carrying a refillable bottle.",
    category: "general"
  }
];

const SustainabilityTips = () => {
  const { user } = useAuth();
  const [highestCategories, setHighestCategories] = useState<string[]>([]);
  const [personalTips, setPersonalTips] = useState<any[]>([]);
  const [generalTips, setGeneralTips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Get all user's carbon logs
        const { data, error } = await supabase
          .from('carbon_logs')
          .select('category, carbon_impact')
          .eq('user_id', user.id);

        if (error) throw error;

        if (!data || data.length === 0) {
          // No data yet, show general tips
          const randomTips = [...GENERAL_TIPS]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
          
          setGeneralTips(randomTips);
          setPersonalTips([]);
          setHighestCategories([]);
          setIsLoading(false);
          return;
        }

        // Calculate footprint by category
        const categoryTotals: Record<string, number> = {};
        data.forEach(log => {
          categoryTotals[log.category] = (categoryTotals[log.category] || 0) + Number(log.carbon_impact);
        });

        // Get top 2 categories with highest emissions
        const sortedCategories = Object.entries(categoryTotals)
          .sort((a, b) => b[1] - a[1])
          .map(([category]) => category)
          .slice(0, 2);

        setHighestCategories(sortedCategories);

        // Get personalized tips for the highest emission categories
        const personalized = GENERAL_TIPS
          .filter(tip => sortedCategories.includes(tip.category))
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);

        // Get some general tips as well
        const general = GENERAL_TIPS
          .filter(tip => !sortedCategories.includes(tip.category))
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        setPersonalTips(personalized);
        setGeneralTips(general);
      } catch (error) {
        console.error("Error fetching user data for tips:", error);
        // Fall back to general tips
        const randomTips = [...GENERAL_TIPS]
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        
        setGeneralTips(randomTips);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (isLoading) {
    return (
      <GlassmorphicCard>
        <div className="p-6 text-center">
          <p>Loading sustainability tips...</p>
        </div>
      </GlassmorphicCard>
    );
  }

  return (
    <GlassmorphicCard>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Sustainability Tips</h2>
        
        {personalTips.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              Personal Recommendations
            </h3>
            <div className="space-y-3">
              {personalTips.map((tip, index) => (
                <div 
                  key={`personal-${index}`}
                  className="p-3 rounded-md bg-primary/10"
                >
                  <h4 className="font-medium text-primary">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-3">
            General Tips
          </h3>
          <div className="space-y-3">
            {generalTips.map((tip, index) => (
              <div 
                key={`general-${index}`}
                className="p-3 rounded-md bg-secondary/10"
              >
                <h4 className="font-medium">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default SustainabilityTips;
