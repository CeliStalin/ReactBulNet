import { Sistema } from '../interfaces/ISistema';
import { FetchTimeoutOptions } from '../interfaces/IFectTimeOutOptions'

const GetAmbiente = ():string => {
    const ambiente = import.meta.env.VITE_AMBIENTE || import.meta.env.VITE_APP_AMBIENTE;
    return ambiente!;
};

const GetApiArquitectura = ():string => {
    const apiUrl = import.meta.env.VITE_API_ARQUITECTURA_URL || import.meta.env.VITE_APP_API_ARQUITECTURA_URL;
    return apiUrl;
};

const GetNameApiKey = ():string => {
    const apiKeyName = import.meta.env.VITE_NAME_API_KEY || import.meta.env.VITE_APP_NAME_API_KEY;
    return apiKeyName!;
};

const GetKeyApiKey = ():string => {
    const apiKey = import.meta.env.VITE_KEY_PASS_API_ARQ || import.meta.env.VITE_APP_KEY_PASS_API_ARQ;
    // No logueamos el API key por seguridad
    return apiKey!;
};

const GetSistema = ():Sistema => {
    const sistema = {
        codigo: import.meta.env.VITE_SISTEMA! || import.meta.env.VITE_APP_SISTEMA!,
        nombre: import.meta.env.VITE_NOMBRE_SISTEMA! || import.meta.env.VITE_APP_NOMBRE_SISTEMA!,
    };
    return sistema;
}

const FetchWithTimeout = async (resource: RequestInfo | URL,
                          options: FetchTimeoutOptions = {}):Promise<Response> =>
{
    const defaultTimeout = Number(import.meta.env.VITE_TIMEOUT || import.meta.env.VITE_APP_TIMEOUT) || 10000;
    const { timeout = defaultTimeout, ...fetchOptions } = options;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
                            
    try {
        const response = await fetch(resource, {
                                ...fetchOptions,
                                signal: controller.signal,
                          });
        return response;
    } catch (error) {
        const errorMessage = (error as Error).name === 'AbortError' 
        ? new Error(`La petición ha excedido el tiempo límite de ${timeout}ms`)
        : error;
        
        console.error(`[FetchWithTimeout] Error en petición: ${errorMessage}`);
        throw errorMessage;
    } finally {
        clearTimeout(timeoutId);
    }
}


export {
    GetAmbiente,
    GetApiArquitectura,
    GetSistema,
    FetchWithTimeout,
    GetNameApiKey,
    GetKeyApiKey
}