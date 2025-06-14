import { users, projects, generations, type User, type InsertUser, type Project, type InsertProject, type Generation, type InsertGeneration } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  getGeneration(id: number): Promise<Generation | undefined>;
  getGenerationsByProjectId(projectId: number): Promise<Generation[]>;
  createGeneration(generation: InsertGeneration): Promise<Generation>;
  updateGeneration(id: number, updates: Partial<Generation>): Promise<Generation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private generations: Map<number, Generation>;
  private currentUserId: number;
  private currentProjectId: number;
  private currentGenerationId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.generations = new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentGenerationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId,
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id,
      createdAt: now,
      updatedAt: now,
      output: null,
      content: insertProject.content || null,
      settings: insertProject.settings || null,
      status: insertProject.status || 'idle',
      duration: insertProject.duration || null,
      quality: insertProject.quality || null,
      genre: insertProject.genre || null,
      userId: insertProject.userId ?? null,
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { 
      ...project, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getGeneration(id: number): Promise<Generation | undefined> {
    return this.generations.get(id);
  }

  async getGenerationsByProjectId(projectId: number): Promise<Generation[]> {
    return Array.from(this.generations.values()).filter(
      (generation) => generation.projectId === projectId,
    );
  }

  async createGeneration(insertGeneration: InsertGeneration): Promise<Generation> {
    const id = this.currentGenerationId++;
    const generation: Generation = { 
      ...insertGeneration, 
      id,
      createdAt: new Date(),
      result: insertGeneration.result || null,
      status: insertGeneration.status || 'pending',
      duration: insertGeneration.duration || null,
      projectId: insertGeneration.projectId || null,
    };
    this.generations.set(id, generation);
    return generation;
  }

  async updateGeneration(id: number, updates: Partial<Generation>): Promise<Generation | undefined> {
    const generation = this.generations.get(id);
    if (!generation) return undefined;
    
    const updatedGeneration = { ...generation, ...updates };
    this.generations.set(id, updatedGeneration);
    return updatedGeneration;
  }
}

export const storage = new MemStorage();
