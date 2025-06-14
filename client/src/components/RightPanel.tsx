import { useState } from "react";

export default function RightPanel() {
  const [qualityLevel, setQualityLevel] = useState(85);
  const [processingSpeed, setProcessingSpeed] = useState(70);
  const [aiCreativity, setAiCreativity] = useState(60);

  return (
    <aside className="space-y-4">
      {/* AI Model Selection */}
      <div className="glass-effect rounded-xl p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4 text-neon-green">
          <i className="fas fa-robot mr-2"></i>AI Models
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-card rounded-lg">
            <div>
              <div className="font-medium text-sm">Cinematic Pro</div>
              <div className="text-xs text-gray-400">Hollywood Quality</div>
            </div>
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-card rounded-lg">
            <div>
              <div className="font-medium text-sm">Indie Master</div>
              <div className="text-xs text-gray-400">Creative & Artistic</div>
            </div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-card rounded-lg">
            <div>
              <div className="font-medium text-sm">Quantum Cinema</div>
              <div className="text-xs text-gray-400">Experimental</div>
            </div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Production Controls */}
      <div className="glass-effect rounded-xl p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4 text-neon-blue">
          <i className="fas fa-sliders-h mr-2"></i>Controls
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Quality Level</label>
            <input 
              type="range" 
              className="w-full accent-neon-blue" 
              min="0" 
              max="100" 
              value={qualityLevel}
              onChange={(e) => setQualityLevel(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>HD</span>
              <span>4K</span>
              <span>8K</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Processing Speed</label>
            <input 
              type="range" 
              className="w-full accent-neon-green" 
              min="0" 
              max="100" 
              value={processingSpeed}
              onChange={(e) => setProcessingSpeed(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Quality</span>
              <span>Balanced</span>
              <span>Speed</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">AI Creativity</label>
            <input 
              type="range" 
              className="w-full accent-neon-pink" 
              min="0" 
              max="100" 
              value={aiCreativity}
              onChange={(e) => setAiCreativity(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Conservative</span>
              <span>Experimental</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="glass-effect rounded-xl p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4 text-neon-pink">
          <i className="fas fa-eye mr-2"></i>Live Preview
        </h3>
        
        {/* Video Preview Window */}
        <div className="bg-card rounded-lg p-4 mb-4">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
            <i className="fas fa-play-circle text-4xl text-gray-600"></i>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">No preview</span>
            <button className="text-neon-green hover:text-green-400">
              <i className="fas fa-expand"></i>
            </button>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-2">
          <button className="w-full p-2 bg-card hover:bg-muted rounded-lg text-sm transition-colors">
            <i className="fas fa-download mr-2 text-neon-green"></i>Export MP4 (4K)
          </button>
          <button className="w-full p-2 bg-card hover:bg-muted rounded-lg text-sm transition-colors">
            <i className="fas fa-download mr-2 text-neon-blue"></i>Export Audio (WAV)
          </button>
          <button className="w-full p-2 bg-card hover:bg-muted rounded-lg text-sm transition-colors">
            <i className="fas fa-share mr-2 text-neon-pink"></i>Share Online
          </button>
        </div>
      </div>

      {/* Processing Status */}
      <div className="glass-effect rounded-xl p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4 text-yellow-400">
          <i className="fas fa-cogs mr-2"></i>Processing
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Current Task</span>
              <span className="text-gray-400">Idle</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-neon-green to-neon-blue h-2 rounded-full" style={{width: "0%"}}></div>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 space-y-1">
            <div>Queue: Empty</div>
            <div>Estimated: --</div>
            <div>GPU Usage: 12%</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
