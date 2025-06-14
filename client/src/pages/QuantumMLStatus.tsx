import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Brain, Zap, Database, TrendingUp } from 'lucide-react';

interface MLStats {
  accuracy: string;
  trainingCount: number;
  patternsLearned: number;
  readyForProduction: boolean;
}

interface QuantumMLData {
  status: string;
  models: {
    movie: MLStats;
    music: MLStats;
    voice: MLStats;
    analysis: MLStats;
  };
  message: string;
}

export default function QuantumMLStatus() {
  const [data, setData] = useState<QuantumMLData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'learning' | 'production'>('learning');
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/quantum/stats');
      const result = await response.json();
      setData(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch quantum ML statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = async (newMode: 'learning' | 'production') => {
    try {
      const endpoint = newMode === 'production' ? '/api/quantum/production-mode' : '/api/quantum/learning-mode';
      const response = await fetch(endpoint, { method: 'POST' });
      const result = await response.json();
      
      setMode(newMode);
      toast({
        title: "Mode Changed",
        description: result.message,
        variant: "default"
      });
      
      fetchStats();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to switch quantum ML mode",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-500" />
            Quantum ML System
          </h1>
          <p className="text-muted-foreground mt-2">
            Self-learning AI system for OpenAI API independence
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={mode === 'learning' ? 'default' : 'outline'}
            onClick={() => switchMode('learning')}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Learning Mode
          </Button>
          <Button
            variant={mode === 'production' ? 'default' : 'outline'}
            onClick={() => switchMode('production')}
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Production Mode
          </Button>
        </div>
      </div>

      {data && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                System Overview
              </CardTitle>
              <CardDescription>
                Current status: <Badge variant="outline">{data.status}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{data.message}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(data.models).map(([type, stats]) => (
              <Card key={type} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg capitalize flex items-center justify-between">
                    {type}
                    {stats.readyForProduction && (
                      <Badge variant="default" className="text-xs">
                        Ready
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Accuracy: {stats.accuracy}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Training Progress</span>
                      <span>{stats.trainingCount} sessions</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (stats.trainingCount / 20) * 100)} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Patterns</span>
                      <div className="font-semibold">{stats.patternsLearned}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Accuracy</span>
                      <div className="font-semibold">{stats.accuracy}</div>
                    </div>
                  </div>
                </CardContent>
                
                {stats.readyForProduction && (
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-green-500"></div>
                )}
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How Quantum ML Works</CardTitle>
              <CardDescription>
                Self-learning system that reduces OpenAI API dependency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Database className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold">Learning Phase</h3>
                  <p className="text-sm text-muted-foreground">
                    System learns from OpenAI responses and builds internal patterns
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-semibold">Pattern Recognition</h3>
                  <p className="text-sm text-muted-foreground">
                    Neural networks analyze and store successful generation patterns
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <h3 className="font-semibold">Independent Generation</h3>
                  <p className="text-sm text-muted-foreground">
                    System generates content without OpenAI API calls
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}