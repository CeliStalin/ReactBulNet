#!/bin/bash
# Script mejorado para reestructurar el proyecto React con opción de eliminación

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con formato
print_message() {
  local color=$1
  local message=$2
  echo -e "${color}${message}${NC}"
}

# Función para solicitar confirmación
confirm() {
  local message=$1
  read -r -p "${message} [s/N]: " response
  case "$response" in
    [sS][iI]|[sS]) 
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

# Verificar si estamos en la raíz del proyecto
if [ ! -d "src" ]; then
  print_message "$RED" "Error: Este script debe ejecutarse desde la raíz del proyecto."
  exit 1
fi

print_message "$GREEN" "=== Iniciando reestructuración del proyecto ==="

# Solicitar confirmación antes de proceder
if ! confirm "Este script reestructurará tu proyecto. ¿Quieres continuar?"; then
  print_message "$YELLOW" "Operación cancelada por el usuario."
  exit 0
fi

# Crear la estructura de directorios
print_message "$YELLOW" "Creando estructura de directorios..."

mkdir -p src/core/{components,hooks,services,utils,styles,interfaces}
mkdir -p src/features/herederos/{components,hooks,services,interfaces}
mkdir -p src/features/documentos/{components,hooks,services,interfaces}

# Registrar los directorios y archivos originales para posible eliminación posterior
echo "src/components" > original_files.txt
echo "src/hooks" >> original_files.txt
echo "src/interfaces" >> original_files.txt
echo "src/services" >> original_files.txt
echo "src/Utils" >> original_files.txt
echo "src/styles" >> original_files.txt

# Variables para rastrear archivos copiados
total_files=0
copied_files=0

# Función para copiar archivos y rastrear progreso
copy_files() {
  local src=$1
  local dest=$2
  
  if [ ! -d "$src" ] && [ ! -f "$src" ]; then
    return
  fi
  
  if [ -d "$src" ]; then
    # Es un directorio, contar archivos dentro
    local count=$(find "$src" -type f | wc -l)
    total_files=$((total_files + count))
    
    # Crear directorio de destino si no existe
    mkdir -p "$dest"
    
    # Copiar todo el contenido
    cp -r "$src"/* "$dest" 2>/dev/null || true
    
    # Contar archivos copiados
    local copied=$(find "$dest" -type f | wc -l)
    copied_files=$((copied_files + copied))
  elif [ -f "$src" ]; then
    # Es un archivo individual
    total_files=$((total_files + 1))
    cp "$src" "$dest" 2>/dev/null && copied_files=$((copied_files + 1)) || true
  fi
}

# Mover componentes comunes
print_message "$YELLOW" "Moviendo componentes core..."

# 1. Componentes comunes
if [ -d "src/components/common" ]; then
  mkdir -p src/core/components
  copy_files "src/components/common" "src/core/components"
fi

if [ -d "src/components/styles" ]; then
  mkdir -p src/core/styles
  copy_files "src/components/styles" "src/core/styles"
fi

# 2. Componentes de Layout y otros
for DIR in Layout Login MainPage NavMenu Dashboard UserLogin SecureLayout; do
  if [ -d "src/components/$DIR" ]; then
    mkdir -p "src/core/components/$DIR"
    copy_files "src/components/$DIR" "src/core/components/$DIR"
  fi
done

# 3. Componentes individuales
for FILE in NotFound.tsx Counter.tsx Unauthorized.tsx HomePage.tsx MainPage.tsx; do
  if [ -f "src/components/$FILE" ]; then
    copy_files "src/components/$FILE" "src/core/components/"
  fi
done

# Mover hooks, interfaces, servicios, etc.
print_message "$YELLOW" "Moviendo hooks, interfaces, servicios y utilidades..."

if [ -d "src/hooks" ]; then
  copy_files "src/hooks" "src/core/hooks"
fi

if [ -d "src/interfaces" ]; then
  copy_files "src/interfaces" "src/core/interfaces"
fi

if [ -d "src/services" ]; then
  copy_files "src/services" "src/core/services"
fi

if [ -d "src/Utils" ]; then
  copy_files "src/Utils" "src/core/utils"
fi

if [ -d "src/styles" ]; then
  copy_files "src/styles" "src/core/styles"
fi

# Mover características específicas
print_message "$YELLOW" "Moviendo features específicas..."

if [ -d "src/components/IngresoHerederos" ]; then
  copy_files "src/components/IngresoHerederos" "src/features/herederos/components"
  echo "src/components/IngresoHerederos" >> original_files.txt
fi

if [ -d "src/components/IngresoDocumentos" ]; then
  copy_files "src/components/IngresoDocumentos" "src/features/documentos/components"
  echo "src/components/IngresoDocumentos" >> original_files.txt
fi

print_message "$GREEN" "Estructura de directorios creada y archivos copiados."
print_message "$BLUE" "Se copiaron $copied_files de $total_files archivos."

# Crear archivo de ejemplo para tsconfig.json
cat > tsconfig.paths.json << EOF
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@core/*": ["src/core/*"],
      "@features/*": ["src/features/*"],
      "@context/*": ["src/context/*"],
      "@assets/*": ["src/assets/*"],
      "@/*": ["src/*"]
    }
  }
}
EOF

print_message "$GREEN" "Se ha creado un archivo tsconfig.paths.json con la configuración recomendada para paths."
print_message "$YELLOW" "Fusiona este archivo con tu tsconfig.json existente."

# Crear archivo de ejemplo para vite.config.ts
cat > vite.config.example.js << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@features': path.resolve(__dirname, './src/features'),
      '@context': path.resolve(__dirname, './src/context'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
EOF

print_message "$GREEN" "Se ha creado un archivo vite.config.example.js con la configuración recomendada para alias."
print_message "$YELLOW" "Actualiza tu archivo vite.config.ts con estos cambios."

# Preguntar si se deben actualizar automáticamente los archivos de configuración
if confirm "¿Quieres actualizar automáticamente tu tsconfig.json y vite.config.ts con los alias de path?"; then
  print_message "$YELLOW" "Actualizando archivos de configuración..."
  
  # Actualizar tsconfig.json si existe
  if [ -f "tsconfig.json" ]; then
    # Crear backup
    cp tsconfig.json tsconfig.json.bak
    
    # Insertar paths en tsconfig.json
    # Esto es un método simple, podría fallar en algunos casos
    if grep -q "\"paths\"" tsconfig.json; then
      print_message "$YELLOW" "Ya existe una configuración de paths en tsconfig.json. Por favor, actualízala manualmente."
    else
      # Insertar paths antes del último corchete de compilerOptions
      sed -i -e '/compilerOptions/,/}/s/}/,\n    "paths": {\n      "@core\/*": ["src\/core\/*"],\n      "@features\/*": ["src\/features\/*"],\n      "@context\/*": ["src\/context\/*"],\n      "@assets\/*": ["src\/assets\/*"],\n      "@\/*": ["src\/*"]\n    }\n}/g' tsconfig.json || print_message "$RED" "No se pudo actualizar tsconfig.json automáticamente. Por favor, actualízalo manualmente."
    fi
  fi
  
  # Actualizar vite.config.ts si existe
  if [ -f "vite.config.ts" ]; then
    # Crear backup
    cp vite.config.ts vite.config.ts.bak
    
    # Insertar alias en vite.config.ts
    # Esto es un método simple, podría fallar en algunos casos
    if grep -q "alias:" vite.config.ts; then
      print_message "$YELLOW" "Ya existe una configuración de alias en vite.config.ts. Por favor, actualízala manualmente."
    else
      # Insertar alias después de la línea de plugins
      sed -i -e '/plugins:/a\  resolve: {\n    alias: {\n      "@core": path.resolve(__dirname, "./src/core"),\n      "@features": path.resolve(__dirname, "./src/features"),\n      "@context": path.resolve(__dirname, "./src/context"),\n      "@assets": path.resolve(__dirname, "./src/assets"),\n      "@": path.resolve(__dirname, "./src"),\n    },\n  },' vite.config.ts || print_message "$RED" "No se pudo actualizar vite.config.ts automáticamente. Por favor, actualízalo manualmente."
    fi
    
    # Añadir importación de path si no existe
    if ! grep -q "import path from 'path'" vite.config.ts; then
      sed -i '1i import path from "path"' vite.config.ts || print_message "$RED" "No se pudo añadir la importación de path. Por favor, actualiza vite.config.ts manualmente."
    fi
  fi
fi

# Ofrecer opciones para probar y eliminar
print_message "$GREEN" "=== Reestructuración completada ==="
print_message "$YELLOW" "IMPORTANTE: Ahora debes actualizar todas las rutas de importación en tus archivos."
print_message "$YELLOW" "Recomendación: Ejecuta 'npm run dev' o 'npm start' para verificar que todo funcione correctamente."

while true; do
  print_message "$BLUE" "\nOpciones:"
  print_message "$BLUE" "1. Ejecutar 'npm run dev' para probar"
  print_message "$BLUE" "2. Eliminar archivos originales"
  print_message "$BLUE" "3. Salir sin eliminar archivos"
  read -r -p "Selecciona una opción (1-3): " option
  
  case $option in
    1)
      print_message "$YELLOW" "Ejecutando 'npm run dev'..."
      npm run dev
      ;;
    2)
      if confirm "¿Estás SEGURO de que quieres eliminar los archivos originales? Esta acción NO SE PUEDE DESHACER"; then
        if confirm "¿Has verificado que todo funciona correctamente y has hecho un backup o commit?"; then
          print_message "$RED" "Eliminando archivos originales..."
          
          # Eliminar archivos originales
          while read -r file; do
            if [ -e "$file" ]; then
              rm -rf "$file"
              print_message "$YELLOW" "Eliminado: $file"
            fi
          done < original_files.txt
          
          print_message "$GREEN" "Archivos originales eliminados. La reestructuración está completa."
          rm original_files.txt
          break
        else
          print_message "$YELLOW" "Operación cancelada. Verifica que todo funcione antes de eliminar."
        fi
      else
        print_message "$YELLOW" "Operación cancelada."
      fi
      ;;
    3)
      print_message "$GREEN" "Saliendo sin eliminar archivos originales."
      print_message "$YELLOW" "Los archivos originales permanecen en su ubicación. Puedes eliminarlos manualmente cuando estés seguro."
      break
      ;;
    *)
      print_message "$RED" "Opción no válida. Por favor, selecciona 1, 2 o 3."
      ;;
  esac
done

print_message "$GREEN" "Gracias por usar el script de reestructuración. ¡Buena suerte con tu proyecto!"