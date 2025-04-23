import { Sistema } from '../interfaces/ISistema';
import { FetchTimeoutOptions } from '../interfaces/IFectTimeOutOptions'

const GetAmbiente = ():string => import.meta.env.VITE_AMBIENTE!;


const GetApiArquitectura = ():string => import.meta.env.VITE_APP_API_ARQUITECTURA_URL;

const GetNameApiKey = ():string => import.meta.env.VITE_APP_NAME_API_KEY!;

const GetKeyApiKey = ():string => import.meta.env.VITE_APP_KEY_PASS_API_ARQ!;

const GetSistema = ():Sistema => {
    return{
        codigo: import.meta.env.VITE_APP_SISTEMA!,
	    nombre: import.meta.env.VITE_APP_NOMBRE_SISTEMA!,
    }
}

const FetchWithTimeout = async (resource: RequestInfo | URL,
                          options: FetchTimeoutOptions = {}):Promise<Response> =>
{
    const defaultTimeout = Number(import.meta.env.VITE_TIMEOUT) || 10000;
    const { timeout = defaultTimeout, ...fetchOptions } = options;
                            
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
                            
    try {
        const response = await fetch(resource, {
                                    ...fetchOptions,
                                    signal: controller.signal,
                              });
                              return response;
        } catch (error) 
                {
                    throw (error as Error).name === 'AbortError' 
                    ? new Error(`La petición ha excedido el tiempo límite de ${timeout}ms`)
                    : error;
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