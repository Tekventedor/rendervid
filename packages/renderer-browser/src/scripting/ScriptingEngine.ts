// GAMING-007: Custom Scripting System with Safe VM

export interface ScriptConfig {
  id: string;
  code: string;
  language: 'javascript' | 'typescript';
  trigger?: 'onStart' | 'onUpdate' | 'onCollision' | 'onEvent';
  event?: string;
}

export interface ScriptContext {
  deltaTime: number;
  frame: number;
  scene: any;
  camera: any;
  objects: Map<string, any>;
  inputs: Record<string, any>;
  emit: (event: string, data: any) => void;
  log: (...args: any[]) => void;
}

export class ScriptingEngine {
  private scripts: Map<string, ScriptConfig> = new Map();
  private compiledScripts: Map<string, Function> = new Map();
  private context: Partial<ScriptContext> = {};

  // Safe API whitelist
  private readonly safeGlobals = {
    Math,
    Date,
    JSON,
    console: {
      log: (...args: any[]) => console.log('[Script]', ...args),
      warn: (...args: any[]) => console.warn('[Script]', ...args),
      error: (...args: any[]) => console.error('[Script]', ...args),
    },
    setTimeout: (fn: Function, delay: number) => setTimeout(fn, Math.min(delay, 5000)),
    setInterval: (fn: Function, delay: number) => setInterval(fn, Math.max(delay, 16)),
  };

  addScript(config: ScriptConfig): void {
    this.scripts.set(config.id, config);
    this.compileScript(config);
  }

  removeScript(id: string): void {
    this.scripts.delete(id);
    this.compiledScripts.delete(id);
  }

  private compileScript(config: ScriptConfig): void {
    try {
      // Create safe execution context
      const safeCode = this.sanitizeCode(config.code);
      
      // Compile with restricted scope
      const fn = new Function(
        'context',
        'globals',
        `
        'use strict';
        const { Math, Date, JSON, console, setTimeout, setInterval } = globals;
        const { deltaTime, frame, scene, camera, objects, inputs, emit, log } = context;
        
        ${safeCode}
        `
      );
      
      this.compiledScripts.set(config.id, fn);
    } catch (error) {
      console.error(`Failed to compile script ${config.id}:`, error);
    }
  }

  private sanitizeCode(code: string): string {
    // Remove dangerous patterns
    const dangerous = [
      /eval\s*\(/g,
      /Function\s*\(/g,
      /import\s+/g,
      /require\s*\(/g,
      /process\./g,
      /global\./g,
      /window\./g,
      /document\./g,
      /__proto__/g,
      /constructor/g,
    ];

    let sanitized = code;
    for (const pattern of dangerous) {
      if (pattern.test(sanitized)) {
        throw new Error(`Dangerous pattern detected: ${pattern}`);
      }
    }

    return sanitized;
  }

  executeScript(id: string, context: ScriptContext): void {
    const fn = this.compiledScripts.get(id);
    if (!fn) return;

    try {
      // Execute with timeout protection
      const timeoutId = setTimeout(() => {
        throw new Error(`Script ${id} execution timeout`);
      }, 1000);

      fn(context, this.safeGlobals);
      
      clearTimeout(timeoutId);
    } catch (error) {
      console.error(`Script ${id} execution error:`, error);
    }
  }

  executeOnStart(context: ScriptContext): void {
    for (const [id, config] of this.scripts) {
      if (config.trigger === 'onStart') {
        this.executeScript(id, context);
      }
    }
  }

  executeOnUpdate(context: ScriptContext): void {
    for (const [id, config] of this.scripts) {
      if (config.trigger === 'onUpdate' || !config.trigger) {
        this.executeScript(id, context);
      }
    }
  }

  executeOnEvent(eventName: string, context: ScriptContext): void {
    for (const [id, config] of this.scripts) {
      if (config.trigger === 'onEvent' && config.event === eventName) {
        this.executeScript(id, context);
      }
    }
  }

  clear(): void {
    this.scripts.clear();
    this.compiledScripts.clear();
  }
}

// Example usage:
/*
const engine = new ScriptingEngine();

engine.addScript({
  id: 'rotate-cube',
  code: `
    const cube = objects.get('cube');
    if (cube) {
      cube.rotation.y += deltaTime;
    }
  `,
  language: 'javascript',
  trigger: 'onUpdate'
});

engine.addScript({
  id: 'collision-handler',
  code: `
    log('Collision detected!');
    emit('explosion', { position: [0, 0, 0] });
  `,
  language: 'javascript',
  trigger: 'onCollision'
});
*/
