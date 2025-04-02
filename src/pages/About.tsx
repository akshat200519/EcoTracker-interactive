
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About - EcoTracker</title>
        <meta name="description" content="Learn about EcoTracker, our mission, and how we help you reduce your carbon footprint." />
      </Helmet>
      
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <h1 className="text-4xl font-bold mb-6">About EcoTracker</h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            We're on a mission to help individuals and communities reduce their carbon footprint 
            through awareness, education, and actionable insights.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p>
            EcoTracker was founded with a simple but powerful mission: to empower individuals to 
            understand and reduce their environmental impact. We believe that meaningful change 
            starts with awareness, and that small, consistent actions can lead to significant 
            positive outcomes for our planet.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p>
            Our platform allows you to track your daily activities and their associated carbon 
            impact. By providing personalized insights and recommendations, we help you identify 
            areas where you can make the most significant improvements. The interactive dashboard 
            visualizes your progress over time, making sustainable living tangible and rewarding.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p>
            We're a passionate team of environmentalists, data scientists, and software developers 
            committed to creating technology that serves both people and planet. Our diverse 
            backgrounds and expertise allow us to approach environmental challenges from multiple 
            perspectives, resulting in innovative solutions that are both effective and user-friendly.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
          <p>
            We invite you to join our growing community of environmentally conscious individuals. 
            Together, we can make more informed choices and work towards a more sustainable future. 
            Sign up today to start your journey towards reducing your carbon footprint!
          </p>
        </motion.div>
      </main>
      
      <Footer />
    </>
  );
};

export default About;
