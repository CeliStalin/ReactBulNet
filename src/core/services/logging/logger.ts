interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  timestamp: Date;
  userId?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  
  private constructor() {}
  
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  public log(level: LogEntry['level'], message: string, data?: any): void {
    try {
      const entry: LogEntry = {
        level,
        message,
        data: this.sanitizeData(data),
        timestamp: new Date(),
        userId: this.getCurrentUserId(),
      };
      
      this.logs.push(entry);
      
      // En desarrollo, mostrar en consola
      if (import.meta.env.DEV) {
        // No pasamos el objeto data directamente, sino que lo convertimos a string seguro
        const safeData = data ? this.getSafeString(data) : '';
        switch(level) {
          case 'info':
            console.info(message, safeData);
            break;
          case 'warn':
            console.warn(message, safeData);
            break;
          case 'error':
            console.error(message, safeData);
            break;
          case 'debug':
            console.log(message, safeData);
            break;
        }
      }
      
      // Enviar a servicio de logging externo en producción
      if (import.meta.env.PROD && level === 'error') {
        this.sendToExternalService(entry);
      }
    } catch (err) {
      // Fallback seguro en caso de error en el logger
      console.error('Error en sistema de logging:', 
        err instanceof Error ? err.message : 'Error desconocido');
    }
  }
  
  // Convertir cualquier dato a string de forma segura
  private getSafeString(data: any): string {
    try {
      if (typeof data === 'string') return data;
      if (data === null) return 'null';
      if (data === undefined) return 'undefined';
      
      if (typeof data === 'object') {
        // Usar descripción personalizada para evitar conversión directa
        return '[Objeto]';
      }
      
      return String(data);
    } catch (err) {
      return '[Error al convertir datos]';
    }
  }
  
  public info(message: string, data?: any): void {
    this.log('info', message, data);
  }
  
  public warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }
  
  public error(message: string, data?: any): void {
    this.log('error', message, data);
  }
  
  public debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }
  
  private sanitizeData(data: any): any {
    if (!data) return data;
    
    // Remover datos sensibles
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'iv', 'authorization'];
    
    if (typeof data === 'object') {
      try {
        // Crear copia segura
        const sanitized = {...data};
        
        for (const key in sanitized) {
          if (sensitiveKeys.some(sensitiveKey => 
            key.toLowerCase().includes(sensitiveKey.toLowerCase())
          )) {
            sanitized[key] = '[REDACTED]';
          } else if (typeof sanitized[key] === 'object') {
            sanitized[key] = this.sanitizeData(sanitized[key]);
          }
        }
        
        return sanitized;
      } catch (err) {
        // Si hay error en el procesamiento, devolver descripción genérica
        return '[Objeto Complejo]';
      }
    }
    
    return data;
  }
  
  private getCurrentUserId(): string | undefined {
    // Obtener ID de usuario del localStorage o contexto de auth
    try {
      const userString = localStorage.getItem('usuario');
      if (userString) {
        const user = JSON.parse(userString);
        return user.id;
      }
    } catch (e) {
      // Ignorar errores de parsing
    }
    return undefined;
  }
  
  private sendToExternalService(entry: LogEntry): void {
    // Aquí se implementa la integración con un servicio de logging externo
    // como Sentry, LogRocket, etc.
    console.log('Log externo pendiente de implementar:', entry.level, entry.message);
  }
}

export const logger = Logger.getInstance();