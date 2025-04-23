# Plantilla React Consalud

Este proyecto es una plantilla de React utilizando TypeScript, React Router y autenticación con Azure AD.

## Requisitos previos

- Node.js (versión 18.x o superior)
- npm (versión 9.x o superior)

## Instalación

1. Clona este repositorio:
```bash
git clone [https://devops.consalud.net/Consalud/PlantillaReact/_git/PlantillaReactConsalud]
cd PlantillaReactConsalud
```

2. Instala las dependencias:
```bash
npm install
```


## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

## Construcción

Para crear una versión de producción:

```bash
npm run build
```

Para previsualizar la versión de producción:

```bash
npm run preview
```

## Tests

Para ejecutar los tests:

```bash
npm test
```

## Tecnologías principales

- React 19
- TypeScript
- Vite 6
- React Router DOM 7
- Jest + React Testing Library
- Microsoft Graph Toolkit
- Bulma CSS

## Estructura del proyecto

```
PlantillaReactConsalud/
├── public/             # Archivos estáticos
├── src/
│   ├── components/     # Componentes React
│   ├── hooks/          # Hooks personalizados
│   ├── utils/          # Utilidades
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Punto de entrada
├── test/
│   ├── components/     # Tests de componentes
│   ├── hooks/          # Tests de hooks
│   ├── utils/          # Tests de utilidades
│   └── test-utils.tsx  # Utilidades para testing
├── .env                # Variables de entorno (no incluido en repositorio)
├── .gitignore
├── jest.config.cjs     # Configuración de Jest
├── package.json
├── tsconfig.json       # Configuración de TypeScript
└── vite.config.ts      # Configuración de Vite
```

## Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Crea una versión de producción
- `npm run lint`: Ejecuta el linter
- `npm run preview`: Previsualiza la versión de producción
- `npm test`: Ejecuta los tests

