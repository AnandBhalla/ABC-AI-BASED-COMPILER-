
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/main');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-96 bg-accent/5 rounded-full filter blur-3xl"></div>
      </div>

      {/* Code Lines Background */}
      <div className="absolute inset-0 opacity-5 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="absolute font-mono text-xs">
            {[...Array(Math.floor(Math.random() * 30) + 10)].map((_, j) => (
              <div 
                key={j} 
                className="my-1" 
                style={{ 
                  left: `${Math.random() * 100}%`,
                  top: `${i * 7}%` 
                }}
              >
                {'{'.repeat(Math.floor(Math.random() * 2))}
                {`const func${Math.floor(Math.random() * 10)} = () => ${Math.random() > 0.5 ? '{' : ';'}`}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 glow purple-gradient animate-fade-in">
          ABC: AI BASED COMPILER
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground animate-fade-in delay-200">
          Transform your code with the power of artificial intelligence
        </p>
        
        <div className="animate-fade-in delay-300">
          <Button 
            onClick={handleGetStarted}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-md transition-all duration-300 button-glow hover:scale-105"
          >
            Let's Start
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {title: "Smart Compilation", description: "AI-powered code analysis and optimization", delay: "delay-400"},
            {title: "Intelligent Debugging", description: "Automatic error detection and fixing suggestions", delay: "delay-500"},
            {title: "Code Enhancement", description: "Get recommendations to improve your code", delay: "delay-600"}
          ].map((feature, index) => (
            <div key={index} className={`bg-muted/30 p-6 rounded-lg backdrop-blur-sm animate-fade-in ${feature.delay}`}>
              <h3 className="text-xl font-semibold mb-2 text-primary">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
