import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Brain, Loader2, Laugh, Frown, Book, Baby, Terminal, Code, Flame, LogOut, LogIn, Download } from "lucide-react";
import { transformText, matrixify, asciiFrames } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import type { Mode } from "@/lib/types";

export default function Home() {
  const [term, setTerm] = useState("");
  const [mode, setMode] = useState<Mode>('normal');
  const [isTransformed, setIsTransformed] = useState(false);
  const [asciiFrame, setAsciiFrame] = useState(0);
  const [showAscii, setShowAscii] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  // Get user-specific streaks
  const streaks = useQuery({
    queryKey: ['/api/streaks'],
    queryFn: async () => {
      const response = await fetch('/api/streaks', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch streaks');
      }
      const data = await response.json();
      console.log('Streaks data:', data); // Debug log
      return data;
    },
    enabled: !!user // Only fetch if user is logged in
  });

  // Calculate total searches
  const totalSearches = streaks.data ? streaks.data.reduce((sum: number, streak: { count: number }) => {
    console.log('Adding streak count:', streak.count); // Debug log
    return sum + streak.count;
  }, 0) : 0;

  // Handle term input with transformer mode
  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith('/t ') || value.startsWith('/transform ')) {
      setIsTransformed(true);
      setTerm(value); // Keep the entire input including /t or /transform
    } else {
      setIsTransformed(false);
      setShowAscii(false);
      setTerm(value);
    }
  };

  const explanation = useMutation({
    mutationFn: async (term: string) => {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ term, mode }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();

      // If user is authenticated, streaks are handled server-side
      if (user) {
        // Invalidate streaks query to get updated counts
        streaks.refetch();
      }

      // Transform the explanation if in transformer mode
      if (isTransformed) {
        return [{
          ...result[0],
          explanation: matrixify(result[0].explanation),
          provider: `${result[0].provider} [MATRIX MODE]`
        }];
      }

      return result;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getModeIcon = (currentMode: Mode) => {
    switch (currentMode) {
      case 'fun':
        return <Laugh className="h-4 w-4" />;
      case 'frustrated':
        return <Frown className="h-4 w-4" />;
      case 'kid':
        return <Baby className="h-4 w-4" />;
      default:
        return <Terminal className="h-4 w-4" />;
    }
  };

  const getModeDescription = (currentMode: Mode) => {
    switch (currentMode) {
      case 'fun':
        return "(Clever & Witty)";
      case 'frustrated':
        return "(Developer Pain)";
      case 'kid':
        return "(Kid-Friendly)";
      default:
        return "(Expert View)";
    }
  };

  // Get streak count for current term
  const currentTermStreak = term && streaks.data 
    ? streaks.data.find((s: any) => s.term.toLowerCase() === term.toLowerCase())?.count || 0
    : 0;

  // Add function to generate and download stats card
  const downloadStats = async () => {
    if (!user) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size for mobile-friendly portrait orientation
      canvas.width = 600;
      canvas.height = 800;

      // Set background with deeper gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0a0a0a');
      bgGradient.addColorStop(0.5, '#000000');
      bgGradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add tech circuit pattern
      ctx.strokeStyle = '#00ff0022';
      ctx.lineWidth = 1;

      // Horizontal circuit lines
      for (let y = 40; y < canvas.height; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        
        // Create a zigzag pattern
        let x = 0;
        while (x < canvas.width) {
          const randomHeight = Math.random() * 20 - 10;
          ctx.lineTo(x + 20, y + randomHeight);
          x += 40;
        }
        ctx.stroke();
      }

      // Vertical circuit lines with nodes
      for (let x = 40; x < canvas.width; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        
        // Create a zigzag pattern with nodes
        let y = 0;
        while (y < canvas.height) {
          const randomOffset = Math.random() * 20 - 10;
          ctx.lineTo(x + randomOffset, y + 40);
          
          // Add circuit nodes
          if (Math.random() > 0.7) {
            ctx.arc(x + randomOffset, y + 40, 3, 0, Math.PI * 2);
          }
          
          y += 80;
        }
        ctx.stroke();
      }

      // Add matrix-style binary rain effect
      ctx.font = '10px monospace';
      ctx.fillStyle = '#00ff0011';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, y);
      }

      // Add stronger glow effect border
      const borderGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      borderGradient.addColorStop(0, '#00ff0088');
      borderGradient.addColorStop(0.5, '#00ff00');
      borderGradient.addColorStop(1, '#00ff0088');
      
      // Create outer glow
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Add inner glow
      ctx.shadowBlur = 15;
      ctx.strokeStyle = '#00ff0044';
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Reset shadow for text
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00ff00';
      ctx.textAlign = 'center';
      
      // Add TechMind logo with stronger glow
      ctx.font = 'bold 48px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('TechMind_', canvas.width / 2, 80);

      // Add username with terminal style
      ctx.font = '28px monospace';
      ctx.fillStyle = '#00ff00';
      ctx.fillText(`@${user.username}`, canvas.width / 2, 130);

      // Add decorative lines
      ctx.strokeStyle = '#00ff0044';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 160);
      ctx.lineTo(canvas.width - 50, 160);
      // Add small vertical ticks
      ctx.moveTo(50, 155);
      ctx.lineTo(50, 165);
      ctx.moveTo(canvas.width - 50, 155);
      ctx.lineTo(canvas.width - 50, 165);
      ctx.stroke();

      // Add stats with enhanced terminal-style prefix
      ctx.font = '32px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('> Total Searches:', 50, 220);
      ctx.fillText('> Unique Terms:', 50, 280);
      
      ctx.fillStyle = '#00ff00';
      ctx.textAlign = 'right';
      ctx.fillText(`${totalSearches}`, canvas.width - 50, 220);
      ctx.fillText(`${streaks.data?.length || 0}`, canvas.width - 50, 280);

      // Add decorative line with nodes
      ctx.strokeStyle = '#00ff0044';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 320);
      ctx.lineTo(canvas.width - 50, 320);
      // Add circuit nodes
      ctx.arc(50, 320, 4, 0, Math.PI * 2);
      ctx.arc(canvas.width - 50, 320, 4, 0, Math.PI * 2);
      ctx.arc(canvas.width / 2, 320, 4, 0, Math.PI * 2);
      ctx.stroke();

      // Add recent terms section with enhanced styling
      ctx.font = '24px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('Recent Tech Terms:', canvas.width / 2, 370);

      if (streaks.data && streaks.data.length > 0) {
        const terms = streaks.data
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 5)
          .map((s: any) => `${s.term} (${s.count}x)`);

        terms.forEach((term: string, index: number) => {
          // Create enhanced pill-style background for each term
          const textWidth = ctx.measureText(term).width;
          const pillX = canvas.width / 2 - textWidth / 2 - 20;
          const pillY = 400 + index * 60;
          const pillWidth = textWidth + 40;
          const pillHeight = 36;

          // Add pill shadow
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#00ff0011';
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 18);
          ctx.fill();

          // Add pill border
          ctx.strokeStyle = '#00ff0044';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 18);
          ctx.stroke();

          // Add term text with enhanced glow
          ctx.shadowBlur = 8;
          ctx.fillStyle = '#00ff00';
          ctx.textAlign = 'center';
          ctx.fillText(term, canvas.width / 2, pillY + 25);
        });
      }

      // Add enhanced footer with stronger glow
      ctx.shadowBlur = 6;
      ctx.font = '16px monospace';
      ctx.fillStyle = '#ffffff99';
      ctx.textAlign = 'center';
      ctx.fillText('Generated by TechMind', canvas.width / 2, canvas.height - 70);
      ctx.fillText('Tech, Explained Simply', canvas.width / 2, canvas.height - 45);
      
      // Add website link with special styling
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#00ff00';
      ctx.shadowBlur = 10;
      ctx.fillText('threetechwords.com', canvas.width / 2, canvas.height - 20);

      // Convert to image and download
      const link = document.createElement('a');
      link.download = `techmind-stats-${user.username}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Stats Downloaded",
        description: "Your TechMind stats card has been downloaded!",
        variant: "default",
      });
    } catch (error) {
      console.error('Error generating stats card:', error);
      toast({
        title: "Error",
        description: "Failed to generate stats card",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Terminal scanlines effect */}
      <div className="scanlines" />

      <div className="max-w-3xl mx-auto space-y-8 pt-8 md:pt-16 p-4">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight glow-strong cursor">
              TechMind_
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-md mx-auto font-mono">
          Tech, Explained Simply
          "three-word explanations"
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono">
            <Terminal className="h-4 w-4" />
            <span className="opacity-70">v1.0.0 | system: online</span>
          </div>

          {/* User authentication status */}
          <div className="flex items-center justify-center gap-4 mt-4">
            {user ? (
              <>
                <span className="text-primary font-mono">@{user.username}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/api/auth/logout'}
                  className="font-mono"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/api/auth/github'}
                className="font-mono"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login with GitHub
              </Button>
            )}
          </div>

          {user && (
            <div className="flex flex-col items-center justify-center gap-2 mt-4">
              <div className="flex flex-col items-center justify-center gap-2 text-primary font-mono">
                {streaks.data && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5" />
                        <span className="text-lg font-bold">
                          Achievement: {totalSearches} searches
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Book className="h-5 w-5" />
                        <span className="text-lg font-bold">
                          Terms: {streaks.data.length}
                        </span>
                      </div>
                    </div>
                    {currentTermStreak > 0 && (
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5" />
                        <span className="text-lg font-bold">{currentTermStreak} searches for "{term}"</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={downloadStats}
                className="mt-4 font-mono border-primary text-primary hover:bg-primary/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Stats Card
              </Button>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 border-primary/20 backdrop-blur-sm bg-black/50 glow-box">
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {(['normal', 'fun', 'frustrated', 'kid'] as Mode[]).map((m) => (
                  <Button
                    key={m}
                    variant={mode === m ? "default" : "outline"}
                    onClick={() => setMode(m)}
                    className={`capitalize transition-all font-mono ${mode === m ? 'shadow-lg glow' : ''}`}
                  >
                    {getModeIcon(m)}
                    <span className="ml-2">{m}</span>
                    <span className="hidden sm:inline ml-2 text-xs opacity-70">
                      {getModeDescription(m)}
                    </span>
                  </Button>
                ))}
              </div>

              <div className="text-center mb-4 text-sm text-muted-foreground font-mono">
                <p>Type "/t" or "/transform" before your term for Matrix mode! 🎮</p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!term.trim()) return;
                
                if (isTransformed) {
                  // Extract the actual term without the prefix
                  const actualTerm = term.startsWith('/transform ') 
                    ? term.slice('/transform '.length)
                    : term.slice('/t '.length);
                  
                  // Apply matrix transformation on submit
                  const transformedTerm = matrixify(actualTerm);
                  setTerm(transformedTerm);
                  
                  // Show ASCII animation
                  setShowAscii(true);
                  setAsciiFrame(0);
                  let frame = 0;
                  const interval = setInterval(() => {
                    frame++;
                    setAsciiFrame(prev => (prev + 1) % asciiFrames.length);
                    if (frame >= asciiFrames.length * 2) {
                      clearInterval(interval);
                      setTimeout(() => setShowAscii(false), 1000);
                    }
                  }, 500);

                  toast({
                    title: "Transformer Mode Activated",
                    description: "01001101 01000001 01010100 01010010 01001001 01011000",
                    variant: "default",
                  });
                  
                  // Use the actual term for the API call
                  explanation.mutate(actualTerm);
                } else {
                  explanation.mutate(term);
                }
              }} className="flex gap-2 w-full">
                <Input
                  value={term}
                  onChange={handleTermChange}
                  placeholder=">_ Enter your term..."
                  className="text-lg font-mono bg-black/50 flex-1"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={explanation.isPending}
                  className="bg-primary hover:bg-primary/90 transition-all font-mono glow"
                >
                  {explanation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Terminal className="h-4 w-4" />
                  )}
                  <span className="ml-2">Execute</span>
                </Button>
              </form>
              
              <div className="sm:hidden text-center text-muted-foreground text-sm font-mono">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {getModeDescription(mode)}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {showAscii && (
            <motion.pre
              key="ascii"
              className="text-primary text-xs leading-none font-mono whitespace-pre overflow-x-auto mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {asciiFrames[asciiFrame]}
            </motion.pre>
          )}

          {explanation.data && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-primary/20 backdrop-blur-sm bg-black/50 glow-box">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                    <Terminal className="h-4 w-4" />
                    <span className="opacity-70">[OUTPUT]</span> {explanation.data[0].provider}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl md:text-3xl font-bold font-mono glow">
                    {explanation.data[0].explanation}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {explanation.isPending && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-primary/20 backdrop-blur-sm bg-black/50">
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm font-mono pb-8 space-y-2">
          <p>Made with ❤️ by <a href="https://x.com/ghumare64" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Rohit Ghumare</a></p>
          <p>
            <a 
              href="https://github.com/rohitg00/threetechwords.git" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-mono glow"
            >
              ⭐ Star us on GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}