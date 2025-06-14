import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Film, Music, Mic, BarChart3, Download, Share2, Grid, Zap, Settings, Home, Brain } from 'lucide-react';
import MovieProduction from '@/components/MovieProduction';
import MusicProduction from '@/components/MusicProduction';
import VoiceGeneration from '@/components/VoiceGeneration';
import AIAnalysis from '@/components/AIAnalysis';
import ProjectDashboard from '@/components/ProjectDashboard';
import Timeline from '@/components/Timeline';
import AIModelPanel from '@/components/AIModelPanel';
import { Project } from '@/../../shared/schema';

export default function Studio() {
  const [activeView, setActiveView] = useState<'dashboard' | 'production'>('dashboard');
  const [activeTab, setActiveTab] = useState('movie');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setActiveView('production');
    // Set the active tab based on project type
    if (['movie', 'series'].includes(project.type)) {
      setActiveTab('movie');
    } else if (['music', 'album'].includes(project.type)) {
      setActiveTab('music');
    } else if (project.type === 'voice') {
      setActiveTab('voice');
    } else if (project.type === 'analysis') {
      setActiveTab('analysis');
    }
  };

  const handleCreateProject = (type: string) => {
    setActiveTab(type);
    setActiveView('production');
  };

  const handleModelChange = (model: string) => {
    console.log('Model changed to:', model);
  };

  const handleQualityChange = (quality: string) => {
    console.log('Quality changed to:', quality);
  };

  const handleGenerate = (settings: any) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate generation progress
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 1000);
  };

  const mockTracks = [
    {
      id: 'video-1',
      name: 'Main Video',
      type: 'video' as const,
      segments: [
        { start: 0, end: 30, content: 'Opening Scene' },
        { start: 30, end: 90, content: 'Main Content' },
        { start: 90, end: 120, content: 'Closing' }
      ]
    },
    {
      id: 'audio-1',
      name: 'Background Music',
      type: 'audio' as const,
      segments: [
        { start: 0, end: 120, content: 'Cinematic Score' }
      ]
    },
    {
      id: 'subtitle-1',
      name: 'Subtitles',
      type: 'subtitle' as const,
      segments: [
        { start: 5, end: 25, content: 'Welcome to our story...' },
        { start: 35, end: 85, content: 'The adventure begins...' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="flex h-screen">
        {/* Navigation Sidebar */}
        <div className="w-20 border-r border-cyan-500/20 bg-black/50 backdrop-blur-sm flex flex-col items-center py-6 space-y-6">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          
          <div className="space-y-4">
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('dashboard')}
              className={`w-12 h-12 p-0 ${activeView === 'dashboard' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-cyan-400'}`}
            >
              <Home className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/quantum-ml'}
              className="w-12 h-12 p-0 text-gray-400 hover:text-purple-400"
              title="Quantum ML System"
            >
              <Brain className="w-5 h-5" />
            </Button>
            <Button
              variant={activeView === 'production' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('production')}
              className={`w-12 h-12 p-0 ${activeView === 'production' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-cyan-400'}`}
            >
              <Grid className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-cyan-500/20 bg-black/30 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  AI Studio Pro
                </h1>
                {selectedProject && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-white font-medium">{selectedProject.name}</span>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                      {selectedProject.type}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                  Unlimited Creation
                </Badge>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeView === 'dashboard' ? (
              <div className="p-6 h-full overflow-auto">
                <ProjectDashboard 
                  onProjectSelect={handleProjectSelect}
                  onCreateProject={handleCreateProject}
                />
              </div>
            ) : (
              <div className="flex h-full">
                {/* Production Interface */}
                <div className="flex-1 flex flex-col">
                  {/* Production Tabs */}
                  <div className="border-b border-cyan-500/20 bg-black/20 backdrop-blur-sm p-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full max-w-md grid-cols-4 bg-black/50 backdrop-blur-sm border border-cyan-500/20">
                        <TabsTrigger value="movie" className="flex items-center space-x-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                          <Film className="w-4 h-4" />
                          <span className="hidden sm:inline">Movie</span>
                        </TabsTrigger>
                        <TabsTrigger value="music" className="flex items-center space-x-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                          <Music className="w-4 h-4" />
                          <span className="hidden sm:inline">Music</span>
                        </TabsTrigger>
                        <TabsTrigger value="voice" className="flex items-center space-x-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                          <Mic className="w-4 h-4" />
                          <span className="hidden sm:inline">Voice</span>
                        </TabsTrigger>
                        <TabsTrigger value="analysis" className="flex items-center space-x-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                          <BarChart3 className="w-4 h-4" />
                          <span className="hidden sm:inline">Analysis</span>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Production Content */}
                  <div className="flex-1 p-6 overflow-auto">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsContent value="movie" className="mt-0 h-full">
                        <MovieProduction />
                      </TabsContent>
                      <TabsContent value="music" className="mt-0 h-full">
                        <MusicProduction />
                      </TabsContent>
                      <TabsContent value="voice" className="mt-0 h-full">
                        <VoiceGeneration />
                      </TabsContent>
                      <TabsContent value="analysis" className="mt-0 h-full">
                        <AIAnalysis />
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Timeline */}
                  <div className="border-t border-cyan-500/20 bg-black/20 backdrop-blur-sm p-4">
                    <Timeline
                      duration={120}
                      currentTime={currentTime}
                      onTimeChange={setCurrentTime}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      isPlaying={isPlaying}
                      tracks={mockTracks}
                    />
                  </div>
                </div>

                {/* AI Model Panel */}
                <div className="w-80 border-l border-cyan-500/20 bg-black/30 backdrop-blur-sm p-4 overflow-auto">
                  <AIModelPanel
                    onModelChange={handleModelChange}
                    onQualityChange={handleQualityChange}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    progress={generationProgress}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
