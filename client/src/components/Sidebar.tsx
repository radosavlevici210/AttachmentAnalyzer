import { Project } from "@shared/schema";

interface SidebarProps {
  projects: Project[];
}

export default function Sidebar({ projects }: SidebarProps) {
  return (
    <aside className="space-y-4">
      {/* Production Stats */}
      <div className="glass-effect rounded-xl p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4 text-neon-green">
          <i className="fas fa-chart-line mr-2"></i>Production Stats
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Content Generated</span>
            <span className="text-white font-bold">{projects.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Hours Created</span>
            <span className="text-neon-blue font-bold">23.4h</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">AI Models</span>
            <span className="text-neon-pink font-bold">8 Active</span>
          </div>
        </div>
      </div>

      {/* Quick Tools */}
      <div className="glass-effect rounded-xl p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4 text-neon-green">
          <i className="fas fa-tools mr-2"></i>Quick Tools
        </h3>
        <div className="space-y-2">
          <button className="w-full p-3 bg-card hover:bg-muted rounded-lg text-left transition-colors">
            <i className="fas fa-magic mr-2 text-neon-green"></i>AI Script Analyzer
          </button>
          <button className="w-full p-3 bg-card hover:bg-muted rounded-lg text-left transition-colors">
            <i className="fas fa-waveform-lines mr-2 text-neon-blue"></i>Audio Enhancer
          </button>
          <button className="w-full p-3 bg-card hover:bg-muted rounded-lg text-left transition-colors">
            <i className="fas fa-palette mr-2 text-neon-pink"></i>Style Transfer
          </button>
          <button className="w-full p-3 bg-card hover:bg-muted rounded-lg text-left transition-colors">
            <i className="fas fa-shield-alt mr-2 text-neon-purple"></i>Policy Center
          </button>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="glass-effect rounded-xl p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4 text-neon-green">
          <i className="fas fa-folder-open mr-2"></i>Recent Projects
        </h3>
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="p-3 bg-card rounded-lg text-center text-gray-400">
              No projects yet
            </div>
          ) : (
            projects.slice(0, 3).map((project) => (
              <div key={project.id} className="p-3 bg-card rounded-lg">
                <div className="font-medium text-sm">{project.name}</div>
                <div className="text-xs text-gray-400 capitalize">
                  {project.type} • {project.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
