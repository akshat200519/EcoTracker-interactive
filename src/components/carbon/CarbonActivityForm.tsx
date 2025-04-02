
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";

// Define emissions factors for different activities (simplified values for demo)
const EMISSION_FACTORS = {
  electricity: {
    kwh: 0.92, // kg CO2 per kWh
  },
  transportation: {
    car_gasoline: 0.12, // kg CO2 per mile
    car_diesel: 0.13, // kg CO2 per mile
    bus: 0.05, // kg CO2 per mile
    train: 0.03, // kg CO2 per mile
  },
  water: {
    gallon: 0.004, // kg CO2 per gallon
  },
  diet: {
    meat_meal: 3.0, // kg CO2 per meal
    vegetarian_meal: 1.5, // kg CO2 per meal
    vegan_meal: 1.0, // kg CO2 per meal
  }
};

// Form schema
const formSchema = z.object({
  category: z.enum(["electricity", "transportation", "water", "diet"], {
    required_error: "Please select a category",
  }),
  activity: z.string().min(1, "Please select an activity"),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid positive number",
  }),
  unit: z.string().min(1, "Please select a unit"),
});

type FormValues = z.infer<typeof formSchema>;

const CarbonActivityForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activityOptions, setActivityOptions] = useState<string[]>([]);
  const [unitOptions, setUnitOptions] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: undefined,
      activity: "",
      quantity: "",
      unit: "",
    },
  });

  const handleCategoryChange = (category: string) => {
    // Reset form fields
    form.setValue("activity", "");
    form.setValue("unit", "");

    // Set available activities based on category
    switch (category) {
      case "electricity":
        setActivityOptions(["household_usage"]);
        setUnitOptions(["kwh"]);
        break;
      case "transportation":
        setActivityOptions(["car_gasoline", "car_diesel", "bus", "train"]);
        setUnitOptions(["miles"]);
        break;
      case "water":
        setActivityOptions(["household_usage"]);
        setUnitOptions(["gallon"]);
        break;
      case "diet":
        setActivityOptions(["meat_meal", "vegetarian_meal", "vegan_meal"]);
        setUnitOptions(["meals"]);
        break;
      default:
        setActivityOptions([]);
        setUnitOptions([]);
    }
  };

  const calculateCarbonImpact = (data: FormValues): number => {
    const quantity = Number(data.quantity);
    
    switch(data.category) {
      case "electricity":
        return quantity * EMISSION_FACTORS.electricity.kwh;
      case "transportation":
        return quantity * EMISSION_FACTORS.transportation[data.activity as keyof typeof EMISSION_FACTORS.transportation];
      case "water":
        return quantity * EMISSION_FACTORS.water.gallon;
      case "diet":
        return quantity * EMISSION_FACTORS.diet[data.activity as keyof typeof EMISSION_FACTORS.diet];
      default:
        return 0;
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to log your carbon activities",
        variant: "destructive",
      });
      return;
    }

    try {
      const carbonImpact = calculateCarbonImpact(data);
      
      const { error } = await supabase.from("carbon_logs").insert({
        user_id: user.id,
        category: data.category,
        activity: data.activity,
        quantity: Number(data.quantity),
        unit: data.unit,
        carbon_impact: carbonImpact,
      });

      if (error) throw error;

      toast({
        title: "Activity logged successfully",
        description: `You've added ${carbonImpact.toFixed(2)} kg of CO2 to your carbon footprint.`,
      });

      form.reset({
        category: undefined,
        activity: "",
        quantity: "",
        unit: "",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error logging activity:", error);
      toast({
        title: "Failed to log activity",
        description: "There was an error logging your activity. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <GlassmorphicCard>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Log Carbon Activity</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCategoryChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="diet">Diet</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("category") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="activity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an activity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activityOptions.map((activity) => (
                            <SelectItem key={activity} value={activity}>
                              {activity.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter amount" 
                          min="0"
                          step="0.01"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {unitOptions.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Log Activity
                </Button>
              </motion.div>
            )}
          </form>
        </Form>
      </div>
    </GlassmorphicCard>
  );
};

export default CarbonActivityForm;
