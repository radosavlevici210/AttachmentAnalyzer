import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import MovieProduction from "@/components/MovieProduction";
import MusicProduction from "@/components/MusicProduction";
import AIAnalysis from "@/components/AIAnalysis";
import VoiceGeneration from "@/components/VoiceGeneration";
import Timeline from "@/components/ui/timeline";

export default function Studio() {
  const [currentProject, setCurrentProject] = useState<any>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
  });

  return (
    <div className="bg-dark-bg text-white min-h-screen">
      {/* Header */}
      <header className="glass-effect border-b border-dark-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                  <i className="fas fa-film mr-2"></i>AI Studio Pro
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-6 ml-8">
                <button className="flex items-center space-x-2 text-gray-300 hover:text-neon-green transition-colors">
                  <i className="fas fa-video"></i>
                  <span>Movies</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-300 hover:text-neon-blue transition-colors">
                  <i className="fas fa-music"></i>
                  <span>Music</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-300 hover:text-neon-pink transition-colors">
                  <i className="fas fa-microphone"></i>
                  <span>Voice</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="status-dot bg-neon-green"></div>
                  <span className="text-gray-400">AI Engine: Active</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="status-dot bg-neon-blue"></div>
                  <span className="text-gray-400">Cloud: Ready</span>
                </div>
              </div>
              <button className="btn-gradient px-4 py-2 rounded-lg text-white font-medium">
                <i className="fas fa-cloud-upload-alt mr-2"></i>Deploy
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="container mx-auto px-6 py-6">
        <div className="production-grid">
          {/* Sidebar */}
          <Sidebar projects={projects} />

          {/* Main Content */}
          <section className="space-y-6 overflow-auto">
            {/* Hero Section */}
            <div className="glass-effect rounded-xl p-8 neon-border text-center">
              <h1 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-neon-green via-neon-blue to-neon-pink bg-clip-text text-transparent">
                  Professional AI Production Studio
                </span>
              </h1>
              <p className="text-gray-400 text-lg mb-6">
                Create cinematic movies and professional music with advanced AI technology
              </p>
              
              <Timeline />
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <MovieProduction />
              <MusicProduction />
              <AIAnalysis />
              <VoiceGeneration />
            </div>
          </section>

          {/* Right Panel */}
          <RightPanel />
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t border-dark-border mt-8">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span>© 2024 AI Production Studio Pro</span>
              <span>•</span>
              <span>Professional Grade AI Content Creation</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-neon-green rounded-full mr-2 animate-pulse"></div>
                System Status: Optimal
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
