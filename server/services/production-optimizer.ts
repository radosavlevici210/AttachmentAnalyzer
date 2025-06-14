import { quantumML } from "./quantum-ml-simple.js";

interface ProductionConfig {
  enableQuantumML: boolean;
  fallbackToOpenAI: boolean;
  cacheResults: boolean;
  optimizeMemory: boolean;
}

class ProductionOptimizer {
  private config: ProductionConfig = {
    enableQuantumML: true,
    fallbackToOpenAI: true,
    cacheResults: true,
    optimizeMemory: true
  };

  private resultCache = new Map<string, any>();

  async optimizeForNetlify() {
    console.log('Optimizing for Netlify production deployment...');
    
    // Enable production mode if models are ready
    const stats = quantumML.getStats();
    const readyModels = Object.values(stats).filter((model: any) => model.readyForProduction);
    
    if (readyModels.length > 0) {
      console.log(`${readyModels.length} models ready for production mode`);
      quantumML.enableProductionMode();
      this.config.fallbackToOpenAI = false;
    }

    // Optimize memory usage
    if (this.config.optimizeMemory) {
      this.cleanupMemory();
    }

    return {
      status: 'optimized',
      quantumMLEnabled: this.config.enableQuantumML,
      readyModels: readyModels.length,
      fallbackEnabled: this.config.fallbackToOpenAI
    };
  }

  async generateWithFallback(type: 'movie' | 'music' | 'voice' | 'analysis', input: string, fallbackFn: () => Promise<any>): Promise<any> {
    const cacheKey = `${type}-${this.hashInput(input)}`;
    
    // Check cache first
    if (this.config.cacheResults && this.resultCache.has(cacheKey)) {
      console.log(`Serving cached result for ${type}`);
      return this.resultCache.get(cacheKey);
    }

    // Try Quantum ML first
    if (this.config.enableQuantumML) {
      try {
        const quantumResult = await quantumML.generateWithQuantumML(type, input);
        if (quantumResult) {
          if (this.config.cacheResults) {
            this.resultCache.set(cacheKey, quantumResult);
          }
          return quantumResult;
        }
      } catch (error) {
        console.log(`Quantum ML failed for ${type}, falling back to OpenAI`);
      }
    }

    // Fallback to OpenAI if enabled
    if (this.config.fallbackToOpenAI) {
      try {
        const result = await fallbackFn();
        if (this.config.cacheResults) {
          this.resultCache.set(cacheKey, result);
        }
        return result;
      } catch (error) {
        throw new Error(`Both Quantum ML and OpenAI failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    throw new Error('Production mode enabled but Quantum ML failed and OpenAI fallback is disabled');
  }

  private hashInput(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString();
  }

  private cleanupMemory() {
    // Clean old cache entries
    if (this.resultCache.size > 100) {
      const entries = Array.from(this.resultCache.entries());
      const keepEntries = entries.slice(-50);
      this.resultCache.clear();
      keepEntries.forEach(([key, value]) => {
        this.resultCache.set(key, value);
      });
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }

  getStatus() {
    return {
      config: this.config,
      cacheSize: this.resultCache.size,
      quantumMLStats: quantumML.getStats()
    };
  }

  enableProductionMode() {
    this.config.fallbackToOpenAI = false;
    quantumML.enableProductionMode();
    console.log('Production mode enabled - OpenAI API independence achieved');
  }

  enableDevelopmentMode() {
    this.config.fallbackToOpenAI = true;
    quantumML.enableLearningMode();
    console.log('Development mode enabled - Learning from OpenAI');
  }
}

export const productionOptimizer = new ProductionOptimizer();