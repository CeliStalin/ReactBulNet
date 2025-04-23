/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_AMBIENTE: string
    readonly VITE_SISTEMA: string
    readonly VITE_NOMBRE_SISTEMA: string
    readonly VITE_API_EXPLOTACION_URL: string
    readonly VITE_API_ARQUITECTURA_URL: string
    readonly VITE_TIMEOUT: string
    readonly VITE_NAME_API_KEY: string
    readonly VITE_KEY_PASS_API_ARQ: string
    // Otras variables que puedas necesitar
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
