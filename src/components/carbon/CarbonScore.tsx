
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import { Tables } from "@/integrations/supabase/schema";

// Colors for different categories
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];
const CATEGORIES = ["electricity", "transportation", "water", "diet"];
const CATEGORY_NAMES: Record<string, string> = {
  electricity: "Electricity",
  transportation: "Transportation",
  water: "Water",
  diet: "Diet"
};

const CarbonScore = () => {
  const { user } = useAuth();
  const [totalFootprint, setTotalFootprint] = useState(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCarbonData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Get all user's carbon logs
        const { data, error } = await supabase
          .from('carbon_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
          setCategoryData([]);
          setTotalFootprint(0);
          setIsLoading(false);
          return;
        }

        // Calculate total footprint
        const total = data.reduce((sum, log) => sum + Number(log.carbon_impact), 0);
        setTotalFootprint(total);

        // Calculate footprint by category
        const categoryTotals: Record<string, number> = CATEGORIES.reduce((acc, cat) => ({ 
          ...acc, 
          [cat]: 0 
        }), {});

        data.forEach(log => {
          categoryTotals[log.category] += Number(log.carbon_impact);
        });

        // Format data for the pie chart
        const chartData = Object.keys(categoryTotals).map(category => ({
          name: CATEGORY_NAMES[category],
          value: categoryTotals[category]
        })).filter(item => item.value > 0);

        setCategoryData(chartData);
      } catch (error) {
        console.error("Error fetching carbon data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarbonData();
  }, [user]);

  if (isLoading) {
    return (
      <GlassmorphicCard>
        <div className="p-6 text-center">
          <p>Loading your carbon data...</p>
        </div>
      </GlassmorphicCard>
    );
  }

  return (
    <GlassmorphicCard>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Carbon Footprint</h2>
        
        {totalFootprint > 0 ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">Total CO2 Emissions</p>
              <p className="text-4xl font-bold text-primary">
                {totalFootprint.toFixed(2)} kg
              </p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(2)} kg CO2`} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid gap-2">
              {categoryData.map((category, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-md" 
                  style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                >
                  <span className="font-medium">{category.name}</span>
                  <span className="font-bold">{category.value.toFixed(2)} kg</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">
              You haven't logged any carbon activities yet.
            </p>
            <p>Start logging your daily activities to track your carbon footprint.</p>
          </div>
        )}
      </div>
    </GlassmorphicCard>
  );
};

export default CarbonScore;
