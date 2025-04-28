interface EnvVariables {
    apiUrl: string;
    apiKey: string;
    clientId: string;
    authority: string;
    ambiente: string;
    sistema: string;
    nombreSistema: string;
    timeout: number;
  }
  
  class Environment {
    private static instance: Environment;
    public readonly env: EnvVariables;
  
    private constructor() {
      this.env = {
        apiUrl: import.meta.env.VITE_APP_API_ARQUITECTURA_URL || '',
        apiKey: import.meta.env.VITE_APP_KEY_PASS_API_ARQ || '',
        clientId: import.meta.env.VITE_APP_CLIENT_ID || '',
        authority: import.meta.env.VITE_APP_AUTHORITY || '',
        ambiente: import.meta.env.VITE_APP_AMBIENTE || 'development',
        sistema: import.meta.env.VITE_APP_SISTEMA || '',
        nombreSistema: import.meta.env.VITE_APP_NOMBRE_SISTEMA || '',
        timeout: Number(import.meta.env.VITE_APP_TIMEOUT) || 10000,
      };
  
      this.validateEnv();
    }
  
    public static getInstance(): Environment {
      if (!Environment.instance) {
        Environment.instance = new Environment();
      }
      return Environment.instance;
    }
  
    private validateEnv(): void {
      const required = ['apiUrl', 'clientId', 'authority', 'sistema'];
      
      for (const key of required) {
        if (!this.env[key as keyof EnvVariables]) {
          throw new Error(`Variable de entorno requerida: ${key}`);
        }
      }
    }
  
    public get(key: keyof EnvVariables): any {
      return this.env[key];
    }
  
    public isDevelopment(): boolean {
      return this.env.ambiente === 'development' || this.env.ambiente === 'Desarrollo';
    }
  
    public isProduction(): boolean {
      return this.env.ambiente === 'production' || this.env.ambiente === 'Produccion';
    }
  
    public isTest(): boolean {
      return this.env.ambiente === 'test' || this.env.ambiente === 'Testing';
    }
  }
  
  export const env = Environment.getInstance();