import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertGenerationSchema } from "@shared/schema";
import { generateMovie, generateMusic, analyzeContent, generateVoice } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all projects for a user (using userId 1 for demo)
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsByUserId(1);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Create a new project
  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject({
        ...projectData,
        userId: 1, // Default user for demo
      });
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get a specific project
  app.get("/api/projects/:id", async (req, res) => {
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

  // Update project status
  app.patch("/api/projects/:id", async (req, res) => {
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

  // Generate movie content
  app.post("/api/generate/movie", async (req, res) => {
    try {
      const { projectId, ...movieRequest } = req.body;
      
      // Update project status to processing
      await storage.updateProject(projectId, { status: 'processing' });
      
      // Create generation record
      const generation = await storage.createGeneration({
        projectId,
        type: 'movie',
        prompt: movieRequest.script,
        status: 'processing',
      });

      // Generate movie (this would be async in production)
      const result = await generateMovie(movieRequest);
      
      // Update generation with result
      await storage.updateGeneration(generation.id, {
        result,
        status: 'completed',
        duration: result.duration,
      });

      // Update project status
      await storage.updateProject(projectId, { 
        status: 'completed',
        output: result,
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate music content
  app.post("/api/generate/music", async (req, res) => {
    try {
      const { projectId, ...musicRequest } = req.body;
      
      await storage.updateProject(projectId, { status: 'processing' });
      
      const generation = await storage.createGeneration({
        projectId,
        type: 'music',
        prompt: musicRequest.lyrics,
        status: 'processing',
      });

      const result = await generateMusic(musicRequest);
      
      await storage.updateGeneration(generation.id, {
        result,
        status: 'completed',
        duration: result.duration,
      });

      await storage.updateProject(projectId, { 
        status: 'completed',
        output: result,
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Analyze content
  app.post("/api/analyze", async (req, res) => {
    try {
      const analysisRequest = req.body;
      const result = await analyzeContent(analysisRequest);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate voice
  app.post("/api/generate/voice", async (req, res) => {
    try {
      const { projectId, ...voiceRequest } = req.body;
      
      await storage.updateProject(projectId, { status: 'processing' });
      
      const generation = await storage.createGeneration({
        projectId,
        type: 'voice',
        prompt: voiceRequest.text,
        status: 'processing',
      });

      const result = await generateVoice(voiceRequest);
      
      await storage.updateGeneration(generation.id, {
        result,
        status: 'completed',
        duration: result.duration,
      });

      await storage.updateProject(projectId, { 
        status: 'completed',
        output: result,
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get generations for a project
  app.get("/api/projects/:id/generations", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const generations = await storage.getGenerationsByProjectId(projectId);
      res.json(generations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Serve generated content files
  app.get("/api/generated/:filename", (req, res) => {
    const filename = req.params.filename;
    
    // Determine content type based on file extension
    let contentType = "application/octet-stream";
    if (filename.endsWith(".mp4")) {
      contentType = "video/mp4";
    } else if (filename.endsWith(".wav") || filename.endsWith(".mp3")) {
      contentType = "audio/mpeg";
    } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    }

    // For demo purposes, create a minimal valid file response
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", "1024");
    res.setHeader("Accept-Ranges", "bytes");
    
    if (filename.endsWith(".mp4")) {
      // Create minimal MP4 header for video playback
      const mp4Header = Buffer.from([
        0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, // ftyp box
        0x69, 0x73, 0x6F, 0x6D, 0x00, 0x00, 0x02, 0x00,
        0x69, 0x73, 0x6F, 0x6D, 0x69, 0x73, 0x6F, 0x32,
        0x61, 0x76, 0x63, 0x31, 0x6D, 0x70, 0x34, 0x31
      ]);
      res.end(mp4Header);
    } else if (filename.endsWith(".wav")) {
      // Create minimal WAV header for audio playback
      const wavHeader = Buffer.from([
        0x52, 0x49, 0x46, 0x46, 0x24, 0x08, 0x00, 0x00, // RIFF header
        0x57, 0x41, 0x56, 0x45, 0x66, 0x6D, 0x74, 0x20, // WAVE format
        0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02, 0x00,
        0x22, 0x56, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00
      ]);
      res.end(wavHeader);
    } else {
      res.end(Buffer.alloc(1024, 0));
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
