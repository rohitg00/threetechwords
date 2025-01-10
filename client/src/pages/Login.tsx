import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 border-2 border-primary/20 backdrop-blur-sm bg-black/50 glow-box">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-mono glow">Sign in to TechMind</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center font-mono">
            Sign in to track your learning progress and maintain your streaks
          </p>
          <Button
            variant="outline"
            size="lg"
            className="w-full font-mono flex items-center justify-center gap-2 hover:bg-primary/10"
            onClick={() => window.location.href = '/api/auth/github'}
          >
            <SiGithub className="w-5 h-5" />
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
