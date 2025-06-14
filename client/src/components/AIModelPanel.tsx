import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Zap, Crown, Star, Settings, Download, Share2 } from 'lucide-react';

interface AIModelPanelProps {
  onModelChange?: (model: string) => void;
  onQualityChange?: (quality: string) => void;
  onGenerate?: (settings: any) => void;
  isGenerating?: boolean;
  progress?: number;
}

export default function AIModelPanel({
  onModelChange,
  onQualityChange,
  onGenerate,
  isGenerating = false,
  progress = 0
}: AIModelPanelProps) {
  const [selectedModel, setSelectedModel] = useState('cinematic-pro');
  const [quality, setQuality] = useState('4k');
  const [duration, setDuration] = useState([60]);
  const [audioEnhancement, setAudioEnhancement] = useState('dolby-atmos');
  const [enableRealTime, setEnableRealTime] = useState(false);
  const [batchProcessing, setBatchProcessing] = useState(false);

  const models = [
    {
      id: 'cinematic-pro',
      name: 'Cinematic Pro',
      description: 'Hollywood-grade video production',
      icon: <Crown className="w-4 h-4" />,
      badge: 'PRO',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'indie-master',
      name: 'Indie Master',
      description: 'Independent film aesthetics',
      icon: <Star className="w-4 h-4" />,
      badge: 'CREATIVE',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'music-genius',
      name: 'Music Genius',
      description: 'Professional music composition',
      icon: <Zap className="w-4 h-4" />,
      badge: 'AUDIO',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'documentary-ai',
      name: 'Documentary AI',
      description: 'Real-world storytelling',
      icon: <Settings className="w-4 h-4" />,
      badge: 'FACTUAL',
      color: 'from-green-500 to-teal-500'
    }
  ];

  const qualityOptions = [
    { value: '8k', label: '8K Ultra HD', description: 'Maximum quality' },
    { value: '4k', label: '4K Cinema', description: 'Professional grade' },
    { value: 'imax', label: 'IMAX Format', description: 'Theater ready' },
    { value: 'hd', label: 'HD Standard', description: 'Fast processing' }
  ];

  const audioOptions = [
    { value: 'dolby-atmos', label: 'Dolby Atmos' },
    { value: 'dtsx', label: 'DTS:X' },
    { value: 'surround', label: '5.1 Surround' },
    { value: 'stereo', label: 'Stereo' }
  ];

  const handleGenerate = () => {
    const settings = {
      model: selectedModel,
      quality,
      duration: duration[0],
      audioEnhancement,
      enableRealTime,
      batchProcessing
    };
    onGenerate?.(settings);
  };

  return (
    <div className="space-y-6">
      {/* AI Model Selection */}
      <Card className="bg-black/50 backdrop-blur-sm border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI Production Models
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {models.map((model) => (
              <div
                key={model.id}
                className={`relative p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedModel === model.id
                    ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                    : 'border-cyan-500/20 bg-gray-900/30 hover:bg-gray-800/50'
                }`}
                onClick={() => {
                  setSelectedModel(model.id);
                  onModelChange?.(model.id);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${model.color}`}>
                      {model.icon}
                    </div>
                    <div>
                      <div className="font-medium text-white">{model.name}</div>
                      <div className="text-sm text-gray-400">{model.description}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {model.badge}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Production Settings */}
      <Card className="bg-black/50 backdrop-blur-sm border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Production Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="quality" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quality">Quality</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quality" className="space-y-4">
              <div>
                <label className="text-sm font-medium text-cyan-400 mb-2 block">
                  Output Quality
                </label>
                <Select value={quality} onValueChange={(value) => {
                  setQuality(value);
                  onQualityChange?.(value);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-400">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-cyan-400 mb-2 block">
                  Duration: {duration[0]}s
                </label>
                <Slider
                  value={duration}
                  onValueChange={setDuration}
                  max={300}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="audio" className="space-y-4">
              <div>
                <label className="text-sm font-medium text-cyan-400 mb-2 block">
                  Audio Enhancement
                </label>
                <Select value={audioEnhancement} onValueChange={setAudioEnhancement}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audioOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-cyan-400">Real-time Preview</div>
                  <div className="text-xs text-gray-400">Generate preview while processing</div>
                </div>
                <Switch checked={enableRealTime} onCheckedChange={setEnableRealTime} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-cyan-400">Batch Processing</div>
                  <div className="text-xs text-gray-400">Process multiple projects simultaneously</div>
                </div>
                <Switch checked={batchProcessing} onCheckedChange={setBatchProcessing} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Generate Button & Progress */}
      <Card className="bg-black/50 backdrop-blur-sm border-cyan-500/20">
        <CardContent className="pt-6 space-y-4">
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cyan-400">Generating...</span>
                <span className="text-cyan-400">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium"
            >
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-cyan-400 border-cyan-500/20">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="text-cyan-400 border-cyan-500/20">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Info */}
      <Card className="bg-black/50 backdrop-blur-sm border-cyan-500/20">
        <CardContent className="pt-6">
          <div className="text-xs text-gray-400 space-y-1">
            <div>Model: {models.find(m => m.id === selectedModel)?.name}</div>
            <div>Quality: {qualityOptions.find(q => q.value === quality)?.label}</div>
            <div>Audio: {audioOptions.find(a => a.value === audioEnhancement)?.label}</div>
            <div>Duration: {duration[0]}s</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}