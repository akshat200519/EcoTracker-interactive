
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import AnimatedButton from "@/components/ui-custom/AnimatedButton";
import { cn } from "@/lib/utils";

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:py-40 overflow-hidden">
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at top right, rgba(76, 175, 80, 0.1), transparent 60%), radial-gradient(circle at bottom left, rgba(100, 181, 246, 0.08), transparent 40%)"
            }}
          />
          
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Measure & Reduce Your{" "}
                    <span className="text-eco-leaf">Carbon Footprint</span>
                  </h1>
                </motion.div>
                
                <motion.p 
                  className="text-lg text-muted-foreground max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  EcoTracker helps you understand your environmental impact and provides personalized recommendations to live more sustainably.
                </motion.p>
                
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <AnimatedButton 
                    size="lg" 
                    variant="shine"
                    className="px-8"
                    asChild
                  >
                    <Link to="/signup">Start Calculating</Link>
                  </AnimatedButton>
                  
                  <AnimatedButton 
                    size="lg" 
                    variant="outline"
                    className="px-8"
                    asChild
                  >
                    <Link to="/about">Learn More</Link>
                  </AnimatedButton>
                </motion.div>
                
                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <p className="text-sm text-muted-foreground">
                    Join over 10,000+ users making a difference
                  </p>
                </motion.div>
              </div>
              
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative z-10"
                >
                  <div className="relative">
                    <GlassmorphicCard className="relative z-20">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-r from-eco-light to-eco-water/20 flex items-center justify-center">
                        <div className="w-full max-w-md p-4">
                          <div className="rounded-lg bg-white/70 p-4 mb-4 shadow-sm">
                            <h3 className="text-lg font-medium mb-1">Your Carbon Footprint</h3>
                            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-eco-leaf rounded-full" style={{ width: "65%" }}></div>
                            </div>
                            <div className="mt-2 flex justify-between text-sm">
                              <span>4.2 tonnes CO₂e</span>
                              <span className="text-eco-leaf">-35% vs. average</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { name: "Transportation", value: "1.8t", percentage: 43 },
                              { name: "Home", value: "1.3t", percentage: 31 },
                              { name: "Food", value: "0.7t", percentage: 17 },
                              { name: "Goods", value: "0.4t", percentage: 9 },
                            ].map((category, index) => (
                              <div key={index} className="bg-white/70 rounded-lg p-3 shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{category.name}</span>
                                  <span className="text-sm">{category.value}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-eco-leaf rounded-full" 
                                    style={{ width: `${category.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </GlassmorphicCard>
                    
                    <div 
                      className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-eco-leaf/10 z-0 animate-pulse-subtle"
                      style={{
                        animationDelay: "0.5s"
                      }}
                    ></div>
                    
                    <div 
                      className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-eco-water/10 z-0 animate-pulse-subtle"
                    ></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-24 bg-secondary/30">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How EcoTracker Works</h2>
              <p className="text-muted-foreground">
                Our simple 3-step process helps you understand and reduce your environmental impact
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  ),
                  title: "Calculate",
                  description: "Answer simple questions about your lifestyle habits and daily activities."
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="20" x2="12" y2="10"></line>
                      <line x1="18" y1="20" x2="18" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="16"></line>
                    </svg>
                  ),
                  title: "Analyze",
                  description: "Get a detailed breakdown of your carbon footprint across different categories."
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5"></path>
                      <path d="M5 12l7-7 7 7"></path>
                    </svg>
                  ),
                  title: "Improve",
                  description: "Receive personalized recommendations to reduce your environmental impact."
                }
              ].map((feature, index) => (
                <GlassmorphicCard 
                  key={index}
                  className={cn(
                    "text-center p-8 relative overflow-hidden",
                    index === 1 && "md:translate-y-4"
                  )}
                >
                  <div 
                    className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary/10 text-primary"
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  
                  <div 
                    className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-primary/5 z-0"
                  ></div>
                </GlassmorphicCard>
              ))}
              
              <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-primary/20 -translate-y-1/2 z-0"></div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-24">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Make a Real <span className="text-eco-leaf">Impact</span>
                </h2>
                <p className="text-muted-foreground mb-8">
                  Understanding your carbon footprint is the first step toward a more sustainable lifestyle. EcoTracker helps you take meaningful action to reduce your environmental impact.
                </p>
                
                <div className="space-y-6">
                  {[
                    {
                      title: "Track Progress Over Time",
                      description: "Monitor your carbon emissions and see improvements as you make lifestyle changes."
                    },
                    {
                      title: "Personalized Recommendations",
                      description: "Get actionable tips tailored to your lifestyle and circumstances."
                    },
                    {
                      title: "Community Impact",
                      description: "Join a community of environmentally conscious individuals making a difference."
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-eco-leaf/20 text-eco-leaf flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">{benefit.title}</h3>
                        <p className="text-muted-foreground text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <GlassmorphicCard className="overflow-hidden">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <div className="w-full max-w-md p-4">
                      <div className="bg-white/70 rounded-lg shadow-sm p-4 mb-4">
                        <h3 className="text-lg font-medium mb-2">Your Impact</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-accent rounded-lg p-4 text-center">
                            <div className="text-3xl font-semibold text-eco-leaf">2.5t</div>
                            <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                          </div>
                          <div className="bg-accent rounded-lg p-4 text-center">
                            <div className="text-3xl font-semibold text-eco-leaf">125</div>
                            <div className="text-sm text-muted-foreground">Trees Equivalent</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/70 rounded-lg shadow-sm p-4">
                        <h3 className="text-lg font-medium mb-2">Monthly Progress</h3>
                        <div className="h-40 flex items-end gap-2">
                          {[35, 42, 38, 45, 60, 55, 47, 50, 65, 58, 70, 62].map((value, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-eco-leaf/80 rounded-t-sm" 
                                style={{ height: `${value}%` }}
                              ></div>
                              <div className="text-xs mt-1 text-muted-foreground">
                                {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassmorphicCard>
                
                <div 
                  className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-eco-water/10 z-0 animate-pulse-subtle"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-accent relative overflow-hidden">
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at center right, rgba(76, 175, 80, 0.15), transparent 60%)"
            }}
          ></div>
          
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Join thousands of individuals and businesses taking action to reduce their carbon footprint.
              </p>
              
              <AnimatedButton 
                size="lg" 
                variant="shine"
                className="px-8"
                asChild
              >
                <Link to="/signup">Get Started Now</Link>
              </AnimatedButton>
            </div>
          </div>
          
          <div 
            className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-eco-leaf/10 z-0"
          ></div>
          <div 
            className="absolute top-0 right-0 w-60 h-60 rounded-full bg-eco-sky/10 z-0 animate-pulse-subtle"
            style={{ animationDelay: "0.7s" }}
          ></div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
