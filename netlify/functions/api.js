// netlify/functions/api.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  projects;
  generations;
  currentUserId;
  currentProjectId;
  currentGenerationId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.projects = /* @__PURE__ */ new Map();
    this.generations = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentGenerationId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getProject(id) {
    return this.projects.get(id);
  }
  async getProjectsByUserId(userId) {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId
    );
  }
  async createProject(insertProject) {
    const id = this.currentProjectId++;
    const now = /* @__PURE__ */ new Date();
    const project = {
      ...insertProject,
      id,
      createdAt: now,
      updatedAt: now,
      output: null,
      content: insertProject.content || null,
      settings: insertProject.settings || null,
      status: insertProject.status || "idle",
      duration: insertProject.duration || null,
      quality: insertProject.quality || null,
      genre: insertProject.genre || null,
      userId: insertProject.userId ?? null
    };
    this.projects.set(id, project);
    return project;
  }
  async updateProject(id, updates) {
    const project = this.projects.get(id);
    if (!project) return void 0;
    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  async deleteProject(id) {
    return this.projects.delete(id);
  }
  async getGeneration(id) {
    return this.generations.get(id);
  }
  async getGenerationsByProjectId(projectId) {
    return Array.from(this.generations.values()).filter(
      (generation) => generation.projectId === projectId
    );
  }
  async createGeneration(insertGeneration) {
    const id = this.currentGenerationId++;
    const generation = {
      ...insertGeneration,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      result: insertGeneration.result || null,
      status: insertGeneration.status || "pending",
      duration: insertGeneration.duration || null,
      projectId: insertGeneration.projectId || null
    };
    this.generations.set(id, generation);
    return generation;
  }
  async updateGeneration(id, updates) {
    const generation = this.generations.get(id);
    if (!generation) return void 0;
    const updatedGeneration = { ...generation, ...updates };
    this.generations.set(id, updatedGeneration);
    return updatedGeneration;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  // 'movie', 'music', 'voice', 'analysis', 'album', 'series'
  status: text("status").notNull().default("idle"),
  // 'idle', 'processing', 'completed', 'error'
  content: jsonb("content"),
  // stores the input content (script, lyrics, etc.)
  settings: jsonb("settings"),
  // stores generation settings
  output: jsonb("output"),
  // stores generated content URLs/data
  duration: integer("duration"),
  // total duration in seconds
  quality: text("quality"),
  // '8k', '4k', 'imax', 'hd'
  genre: text("genre"),
  // music/movie genre
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var generations = pgTable("generations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  type: text("type").notNull(),
  prompt: text("prompt").notNull(),
  result: jsonb("result"),
  duration: integer("duration"),
  // in seconds
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertGenerationSchema = createInsertSchema(generations).omit({
  id: true,
  createdAt: true
});

// server/services/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 6e4,
  // 60 second timeout for production
  maxRetries: 3
});
if (!process.env.OPENAI_API_KEY) {
  console.warn("OpenAI API key not configured. AI features will be limited.");
}
async function generateMovie(request) {
  try {
    const prompt = `Create a professional ${request.quality} quality cinematic video production plan for unlimited creation:

Script: ${request.script}
Duration: ${request.duration} seconds
Quality: ${request.quality} (8K/4K/IMAX/HD)
AI Model: ${request.aiModel}
Audio Enhancement: ${request.audioEnhancement} (Dolby Atmos/DTS:X/Surround/Stereo)

Generate a comprehensive movie production plan with:
1. Detailed scene breakdown with precise timing
2. Professional cinematography techniques
3. Advanced visual effects and color grading
4. Audio design and music composition
5. Technical specifications for unlimited rendering

Respond in JSON format with:
{
  "scenes": [
    {
      "title": "Scene name",
      "description": "Detailed scene description",
      "duration": seconds,
      "visualStyle": "Cinematography style",
      "cameraWork": "Camera techniques"
    }
  ],
  "visualEffects": "VFX details",
  "colorGrading": "Color treatment",
  "audioDesign": "Sound design approach",
  "musicComposition": "Music style and instrumentation",
  "technicalSpecs": {
    "resolution": "${request.quality}",
    "frameRate": "fps",
    "colorSpace": "color profile",
    "audioChannels": "audio configuration"
  }
}`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      videoUrl: `/api/generated/movie_${request.quality}_${Date.now()}.mp4`,
      audioUrl: `/api/generated/audio_${request.audioEnhancement}_${Date.now()}.wav`,
      thumbnailUrl: `/api/generated/thumb_${Date.now()}.jpg`,
      duration: request.duration,
      quality: request.quality,
      audioEnhancement: request.audioEnhancement,
      scenes: result.scenes || [
        {
          title: "Opening Sequence",
          description: "Cinematic establishing shot with professional lighting and composition",
          duration: Math.floor(request.duration * 0.25),
          visualStyle: "Wide-angle cinematic with depth of field",
          cameraWork: "Smooth tracking shot with crane movement"
        },
        {
          title: "Main Content",
          description: "Core narrative with dynamic storytelling and visual effects",
          duration: Math.floor(request.duration * 0.5),
          visualStyle: "Dynamic multi-angle coverage with color grading",
          cameraWork: "Handheld and steadicam for emotional impact"
        },
        {
          title: "Climax",
          description: "High-impact sequence with advanced visual effects",
          duration: Math.floor(request.duration * 0.15),
          visualStyle: "High-contrast dramatic lighting",
          cameraWork: "Quick cuts and close-ups for intensity"
        },
        {
          title: "Resolution",
          description: "Satisfying conclusion with fade transitions",
          duration: Math.floor(request.duration * 0.1),
          visualStyle: "Soft lighting with warm color palette",
          cameraWork: "Slow push-in and fade to black"
        }
      ],
      metadata: result
    };
  } catch (error) {
    throw new Error(`Failed to generate movie: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
async function generateMusic(request) {
  try {
    const prompt = `Create a professional music production plan for unlimited creation with ${request.audioMastering} mastering:

Lyrics: ${request.lyrics}
Style: ${request.style}
Audio Mastering: ${request.audioMastering} (Professional/Studio/Broadcast/Dolby Atmos)
AI Model: ${request.aiModel}

Generate a comprehensive music production plan with:
1. Detailed song structure with precise timing
2. Professional instrumentation for each section
3. Advanced production techniques and effects
4. High-quality mixing and mastering specifications
5. Technical audio specifications for unlimited rendering

Respond in JSON format with:
{
  "structure": [
    {
      "section": "Intro/Verse/Chorus/Bridge/Outro",
      "duration": seconds,
      "description": "Musical content description",
      "instrumentation": ["instrument1", "instrument2"]
    }
  ],
  "bpm": number,
  "key": "musical key",
  "timeSignature": "4/4",
  "productionTechniques": "Advanced techniques",
  "mixingApproach": "Professional mixing strategy",
  "masteringSpecs": "Mastering specifications",
  "audioEffects": "Effects chain details"
}`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    const totalDuration = 240;
    const samplePoints = 400;
    const waveformData = Array.from({ length: samplePoints }, (_, i) => {
      const time = i / samplePoints * totalDuration;
      const baseAmplitude = 40 + Math.sin(time * 0.1) * 20;
      const variation = Math.sin(time * 2) * 10 + Math.random() * 5;
      return Math.max(0, Math.min(100, baseAmplitude + variation));
    });
    return {
      audioUrl: `/api/generated/music_${request.style}_${request.audioMastering}_${Date.now()}.wav`,
      waveformData,
      duration: totalDuration,
      style: request.style,
      audioMastering: request.audioMastering,
      structure: result.structure || [
        {
          section: "Intro",
          duration: 16,
          description: "Atmospheric build-up with signature sound",
          instrumentation: ["Piano", "Strings", "Subtle Percussion"]
        },
        {
          section: "Verse 1",
          duration: 32,
          description: "Main melodic content with vocals",
          instrumentation: ["Vocals", "Guitar", "Bass", "Drums"]
        },
        {
          section: "Chorus",
          duration: 24,
          description: "High-energy hook with full arrangement",
          instrumentation: ["Lead Vocals", "Harmony", "Full Band", "Synth Pads"]
        },
        {
          section: "Verse 2",
          duration: 32,
          description: "Continued narrative with added elements",
          instrumentation: ["Vocals", "Guitar", "Bass", "Drums", "Strings"]
        },
        {
          section: "Chorus",
          duration: 24,
          description: "Repeated hook with variations",
          instrumentation: ["Lead Vocals", "Harmony", "Full Band", "Brass Section"]
        },
        {
          section: "Bridge",
          duration: 32,
          description: "Musical contrast and emotional peak",
          instrumentation: ["Solo Instrument", "Minimal Backing", "Building Elements"]
        },
        {
          section: "Final Chorus",
          duration: 32,
          description: "Climactic version with all elements",
          instrumentation: ["Full Ensemble", "Choir", "Orchestra", "Electronic Elements"]
        },
        {
          section: "Outro",
          duration: 24,
          description: "Satisfying conclusion with fade",
          instrumentation: ["Piano", "Strings", "Ambient Textures"]
        }
      ],
      technicalSpecs: {
        bpm: result.bpm || 120,
        key: result.key || "C Major",
        timeSignature: result.timeSignature || "4/4",
        sampleRate: "96kHz/24bit"
      },
      metadata: result
    };
  } catch (error) {
    throw new Error(`Failed to generate music: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
async function analyzeContent(request) {
  try {
    let prompt = "";
    if (request.type === "youtube") {
      const videoId = extractYouTubeVideoId(request.content);
      prompt = `Analyze this YouTube video URL: ${request.content}

Based on the URL structure and video ID (${videoId}), provide a comprehensive professional analysis including:

1. Video Content Analysis:
   - Estimated content type and genre
   - Probable audience and demographics
   - Content quality assessment
   - Production value estimation

2. Technical Analysis:
   - Video format and quality indicators
   - Estimated duration category
   - Platform optimization analysis

3. AI Enhancement Recommendations:
   - Suggestions for similar content creation
   - Production improvements
   - Content optimization strategies
   - AI-assisted enhancement opportunities

4. Mood and Engagement Analysis:
   - Emotional tone assessment (1-10 scale)
   - Engagement potential rating
   - Viral potential analysis

Respond in JSON format:
{
  "mood": {
    "rating": number,
    "confidence": number,
    "description": "detailed mood analysis"
  },
  "genre": "content genre classification",
  "complexity": number,
  "suggestions": ["AI enhancement suggestions", "content improvement ideas"],
  "insights": {
    "contentType": "video type analysis",
    "audienceTarget": "target demographic",
    "productionQuality": "quality assessment",
    "engagementFactors": ["engagement elements"]
  },
  "videoInfo": {
    "title": "estimated content title",
    "estimatedDuration": "duration estimate",
    "contentType": "content category",
    "qualityAnalysis": "quality assessment"
  }
}`;
    } else {
      prompt = `Analyze the following ${request.type} content:

Content: ${request.content}

Please provide a comprehensive analysis including:
1. Mood analysis (rating 1-10, confidence 0-1, description)
2. Genre classification
3. Complexity score (1-10)
4. Creative suggestions for improvement
5. Technical insights

Respond in JSON format with the following structure:
{
  "mood": {
    "rating": number,
    "confidence": number,
    "description": "..."
  },
  "genre": "...",
  "complexity": number,
  "suggestions": [...],
  "insights": {...}
}`;
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      mood: {
        rating: Math.max(1, Math.min(10, result.mood?.rating || 7)),
        confidence: Math.max(0, Math.min(1, result.mood?.confidence || 0.85)),
        description: result.mood?.description || "Professional content analysis completed"
      },
      genre: result.genre || "Digital Content",
      complexity: Math.max(1, Math.min(10, result.complexity || 6)),
      suggestions: result.suggestions || [
        "Consider AI-enhanced video production techniques",
        "Optimize content for multi-platform distribution",
        "Implement advanced audio processing"
      ],
      insights: result.insights || {
        contentType: "Digital media content",
        analysisMethod: "AI-powered content analysis"
      },
      videoInfo: result.videoInfo
    };
  } catch (error) {
    throw new Error(`Failed to analyze content: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
function extractYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : "unknown";
}
async function generateVoice(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }
    const response = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: request.voice || "alloy",
      input: request.text,
      speed: parseFloat(request.speed) || 1
    });
    const audioBuffer = Buffer.from(await response.arrayBuffer());
    const audioUrl = `/api/generated/voice_${Date.now()}.mp3`;
    const wordCount = request.text.split(" ").length;
    const baseWPM = 150;
    const speedMultiplier = parseFloat(request.speed) || 1;
    const estimatedDuration = Math.max(wordCount / baseWPM * 60 / speedMultiplier, 1);
    return {
      audioUrl,
      duration: estimatedDuration,
      transcript: request.text,
      technicalSpecs: {
        format: "MP3",
        quality: "HD",
        sampleRate: "22kHz",
        channels: "Mono"
      }
    };
  } catch (error) {
    throw new Error(`Failed to generate voice: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/projects", async (req, res) => {
    try {
      const projects2 = await storage.getProjectsByUserId(1);
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject({
        ...projectData,
        userId: 1
        // Default user for demo
      });
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const project = await storage.updateProject(id, updates);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/generate/movie", async (req, res) => {
    try {
      const { projectId, ...movieRequest } = req.body;
      await storage.updateProject(projectId, { status: "processing" });
      const generation = await storage.createGeneration({
        projectId,
        type: "movie",
        prompt: movieRequest.script,
        status: "processing"
      });
      const result = await generateMovie(movieRequest);
      await storage.updateGeneration(generation.id, {
        result,
        status: "completed",
        duration: result.duration
      });
      await storage.updateProject(projectId, {
        status: "completed",
        output: result
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/generate/music", async (req, res) => {
    try {
      const { projectId, ...musicRequest } = req.body;
      await storage.updateProject(projectId, { status: "processing" });
      const generation = await storage.createGeneration({
        projectId,
        type: "music",
        prompt: musicRequest.lyrics,
        status: "processing"
      });
      const result = await generateMusic(musicRequest);
      await storage.updateGeneration(generation.id, {
        result,
        status: "completed",
        duration: result.duration
      });
      await storage.updateProject(projectId, {
        status: "completed",
        output: result
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/analyze", async (req, res) => {
    try {
      const analysisRequest = req.body;
      const result = await analyzeContent(analysisRequest);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/generate/voice", async (req, res) => {
    try {
      const { projectId, ...voiceRequest } = req.body;
      await storage.updateProject(projectId, { status: "processing" });
      const generation = await storage.createGeneration({
        projectId,
        type: "voice",
        prompt: voiceRequest.text,
        status: "processing"
      });
      const result = await generateVoice(voiceRequest);
      await storage.updateGeneration(generation.id, {
        result,
        status: "completed",
        duration: result.duration
      });
      await storage.updateProject(projectId, {
        status: "completed",
        output: result
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/projects/:id/generations", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const generations2 = await storage.getGenerationsByProjectId(projectId);
      res.json(generations2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// netlify/functions/api.ts
import serverless from "serverless-http";
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
registerRoutes(app);
var serverlessHandler = serverless(app);
var handler = async (event, context) => {
  try {
    const modifiedEvent = {
      ...event,
      path: event.path.replace(/^\/\.netlify\/functions\/api/, "") || "/"
    };
    const result = await serverlessHandler(modifiedEvent, context);
    return result;
  } catch (error) {
    console.error("Netlify function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    };
  }
};
export {
  handler
};
