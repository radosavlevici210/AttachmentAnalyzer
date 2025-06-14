import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Film, Music, Mic, BarChart3, Folder, Search, Filter, Grid, List, Trash2, Copy, Download, Share2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { apiRequest } from '@/lib/queryClient';
import { Project } from '@/../../shared/schema';
import { useToast } from '@/hooks/use-toast';
import VideoPlayer from './VideoPlayer';

interface ProjectDashboardProps {
  onProjectSelect?: (project: Project) => void;
  onCreateProject?: (type: string) => void;
}

export default function ProjectDashboard({ onProjectSelect, onCreateProject }: ProjectDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string; project: any } | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project deleted successfully",
        description: "The project has been removed from your workspace.",
      });
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: { name: string; type: string; settings?: any }) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) throw new Error('Failed to create project');
      return response.json();
    },
    onSuccess: (newProject: Project) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setShowNewProjectDialog(false);
      toast({
        title: "Project created successfully",
        description: "Your new project is ready for production.",
      });
      onProjectSelect?.(newProject);
    },
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || project.type === filterType;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const projectTypes = [
    { value: 'movie', label: 'Movie Production', icon: <Film className="w-4 h-4" />, color: 'from-red-500 to-orange-500' },
    { value: 'music', label: 'Music Creation', icon: <Music className="w-4 h-4" />, color: 'from-purple-500 to-pink-500' },
    { value: 'voice', label: 'Voice Generation', icon: <Mic className="w-4 h-4" />, color: 'from-green-500 to-teal-500' },
    { value: 'analysis', label: 'AI Analysis', icon: <BarChart3 className="w-4 h-4" />, color: 'from-blue-500 to-cyan-500' },
    { value: 'album', label: 'Album Production', icon: <Music className="w-4 h-4" />, color: 'from-indigo-500 to-purple-500' },
    { value: 'series', label: 'Video Series', icon: <Film className="w-4 h-4" />, color: 'from-yellow-500 to-red-500' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'completed': return 100;
      case 'processing': return 65;
      case 'error': return 0;
      default: return 0;
    }
  };

  const handleCreateProject = (type: string) => {
    const projectType = projectTypes.find(pt => pt.value === type);
    createProjectMutation.mutate({
      name: `New ${projectType?.label || 'Project'}`,
      type,
      settings: {
        quality: '4k',
        duration: 60,
        audioEnhancement: 'dolby-atmos'
      }
    });
  };

  const handleBatchAction = (action: string) => {
    // Implement batch actions
    toast({
      title: `Batch ${action}`,
      description: `Applied ${action} to ${selectedProjects.length} projects.`,
    });
    setSelectedProjects([]);
  };

  const handlePlayProject = (project: Project) => {
    if (project.type === 'movie' && project.output?.videoUrl) {
      setSelectedVideo({
        url: project.output.videoUrl,
        title: project.name,
        project: project
      });
      setVideoPlayerOpen(true);
    } else if (project.type === 'music' && project.output?.audioUrl) {
      // Handle music playback
      const audio = new Audio(project.output.audioUrl);
      audio.play().catch(console.error);
      toast({
        title: "Playing Music",
        description: `Now playing: ${project.name}`,
      });
    } else {
      toast({
        title: "No Media Available",
        description: "This project doesn't have playable content yet.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-cyan-400">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Studio Dashboard</h2>
          <p className="text-gray-400">Manage your unlimited music and video projects</p>
        </div>
        <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-cyan-500/20">
            <DialogHeader>
              <DialogTitle className="text-cyan-400">Create New Project</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 py-4">
              {projectTypes.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-400/10"
                  onClick={() => handleCreateProject(type.value)}
                  disabled={createProjectMutation.isPending}
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${type.color}`}>
                    {type.icon}
                  </div>
                  <span className="text-sm font-medium">{type.label}</span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 bg-black/50 border-cyan-500/20 text-white"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40 bg-black/50 border-cyan-500/20">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {projectTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-black/50 border-cyan-500/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {selectedProjects.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-cyan-400">{selectedProjects.length} selected</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBatchAction('delete')}
                className="text-red-400 border-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBatchAction('export')}
                className="text-cyan-400 border-cyan-500/20"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="text-cyan-400 border-cyan-500/20"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const projectType = projectTypes.find(pt => pt.value === project.type);
            return (
              <Card
                key={project.id}
                className="bg-black/50 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400 transition-all cursor-pointer"
                onClick={() => onProjectSelect?.(project)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {projectType && (
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${projectType.color}`}>
                          {projectType.icon}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-white text-sm">{project.name}</CardTitle>
                        <p className="text-xs text-gray-400">{projectType?.label}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${getStatusColor(project.status)} text-white border-0`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Progress</span>
                      <span>{getStatusProgress(project.status)}%</span>
                    </div>
                    <Progress value={getStatusProgress(project.status)} className="h-1" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      {project.duration && `${project.duration}s`}
                      {project.quality && ` • ${project.quality.toUpperCase()}`}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle play/preview
                        }}
                        className="text-cyan-400 hover:text-cyan-300 h-6 w-6 p-0"
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle copy
                        }}
                        className="text-cyan-400 hover:text-cyan-300 h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProjectMutation.mutate(project.id);
                        }}
                        className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProjects.map((project) => {
            const projectType = projectTypes.find(pt => pt.value === project.type);
            return (
              <Card
                key={project.id}
                className="bg-black/50 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400 transition-all cursor-pointer"
                onClick={() => onProjectSelect?.(project)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            setSelectedProjects([...selectedProjects, project.id]);
                          } else {
                            setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-cyan-500/20"
                      />
                      {projectType && (
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${projectType.color}`}>
                          {projectType.icon}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{project.name}</div>
                        <div className="text-sm text-gray-400">{projectType?.label}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-400">
                        {project.duration && `${project.duration}s`}
                        {project.quality && ` • ${project.quality.toUpperCase()}`}
                      </div>
                      <Badge 
                        variant="outline"
                        className={`text-xs ${getStatusColor(project.status)} text-white border-0`}
                      >
                        {project.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-cyan-400 hover:text-cyan-300 h-8 w-8 p-0"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-cyan-400 hover:text-cyan-300 h-8 w-8 p-0"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProjectMutation.mutate(project.id);
                          }}
                          className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No projects found matching your criteria.</p>
          <Button
            variant="outline"
            className="mt-4 text-cyan-400 border-cyan-500/20"
            onClick={() => setShowNewProjectDialog(true)}
          >
            Create your first project
          </Button>
        </div>
      )}
    </div>
  );
}