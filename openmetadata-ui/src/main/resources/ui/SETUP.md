# OpenMetadata UI - Development Setup Guide

This guide will help you set up and run the OpenMetadata UI frontend locally with a Docker backend.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Running the Development Server](#running-the-development-server)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

---

## Prerequisites

Before you start, ensure you have the following installed:

- **Node.js**: v22.0.0 or higher
- **Yarn**: v1.22.0 or higher (NOT Yarn 4.x)
- **Git**: For cloning and version control
- **Docker**: For running the OpenMetadata backend (optional if using existing backend)

### Check your versions:
```bash
node --version
yarn --version
git --version
```

---

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/open-metadata/OpenMetadata.git
cd OpenMetadata/openmetadata-ui/src/main/resources/ui
```

### 2. Install the Correct Yarn Version

This project requires **Yarn 1.22.x** (NOT Yarn 4.x). If you have Yarn 4 installed, use `corepack` to install the correct version:

```bash
# Enable corepack (comes with Node.js 16+)
corepack enable

# Prepare and activate Yarn 1.22.21
corepack prepare yarn@1.22.21 --activate

# Verify the version
yarn --version  # Should output 1.22.21
```

### 3. Install Dependencies

```bash
cd /path/to/openmetadata-ui/src/main/resources/ui

yarn install
```

**Note**: You may see warnings about peer dependencies. These are expected and safe to ignore. The project is designed to work with these version mismatches.

### 4. Setup Backend API Target (Optional)

The UI needs to communicate with the OpenMetadata backend API. By default, it points to `http://localhost:8585/`.

If your backend is running elsewhere, you can set the `VITE_DEV_SERVER_TARGET` environment variable:

```bash
export VITE_DEV_SERVER_TARGET=http://your-backend-url:8585/
```

---

## Running the Development Server

### Start the Dev Server

```bash
cd /path/to/openmetadata-ui/src/main/resources/ui

# Default: Backend at http://localhost:8585
yarn start

# OR with custom backend URL
VITE_DEV_SERVER_TARGET=http://localhost:8585/ yarn start
```

### Expected Output:
```
  VITE v7.3.1  ready in 449 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Access the UI:
Open your browser and navigate to: **http://localhost:3000/**

### Hot Module Replacement (HMR):
The dev server includes HMR, meaning any changes you make to the source code will automatically reload in the browser without losing state.

---

## Backend Setup (Using Docker)

If you don't have OpenMetadata backend running, you can start it using Docker:

```bash
# Pull the latest OpenMetadata image
docker pull openmetadata/server:latest

# Run the OpenMetadata backend
docker run -d \
  --name openmetadata \
  -p 8585:8585 \
  -e SERVER_PORT=8585 \
  openmetadata/server:latest
```

Then start the UI with:
```bash
VITE_DEV_SERVER_TARGET=http://localhost:8585/ yarn start
```

---

## Available Scripts

In the project directory, you can run:

### Development
```bash
yarn start          # Start dev server with HMR
yarn dev            # Alternative start command
```

### Building
```bash
yarn build          # Build for production (creates dist folder)
yarn build-check    # Run checks before build
```

### Testing & Code Quality
```bash
yarn test           # Run jest tests
yarn test:watch     # Run tests in watch mode
yarn test:coverage  # Generate coverage report
yarn lint           # Run ESLint
yarn lint:fix       # Fix ESLint issues automatically
yarn pretty         # Format code with Prettier
```

### Other
```bash
yarn preview        # Preview production build locally
yarn playwright:run # Run end-to-end tests with Playwright
yarn playwright:open # Open Playwright test UI
```

---

## Troubleshooting

### Issue: "Couldn't find a package.json file"

**Cause**: Yarn is trying to run from the wrong directory.

**Solution**: Make sure you're in the correct directory:
```bash
cd /path/to/openmetadata-ui/src/main/resources/ui
pwd  # Should show the correct path
yarn start
```

### Issue: "Failed to resolve entry for package '@openmetadata/ui-core-components'"

**Cause**: The core components package doesn't have built dist files, or the import path is wrong.

**Solution**: The vite.config.ts has been configured to use source files directly. If you still see this error, check that the path in `vite.config.ts` is correct:

```typescript
'@openmetadata/ui-core-components': path.resolve(
  __dirname,
  '../../../../../openmetadata-ui-core-components/src/main/resources/ui/src/index.ts'
),
```

### Issue: "Yarn 4.6.0" or version mismatch

**Cause**: Homebrew or system Yarn is v4, but the project needs v1.22.

**Solution**: Use corepack to switch versions:
```bash
corepack enable
corepack prepare yarn@1.22.21 --activate
yarn --version  # Should show 1.22.21
```

### Issue: "Module not found" or missing dependencies

**Cause**: Dependencies weren't fully installed or are corrupted.

**Solution**: Clean install:
```bash
rm -rf node_modules yarn.lock
yarn install
```

### Issue: Backend connection refused at http://localhost:8585

**Cause**: OpenMetadata backend is not running.

**Solution**: 
1. Check if the backend is running: `curl http://localhost:8585/api/v1/health`
2. If not, start it:
   ```bash
   # Using Docker
   docker run -d -p 8585:8585 openmetadata/server:latest
   
   # OR using your local installation
   # Follow OpenMetadata backend setup documentation
   ```

### Issue: Port 3000 is already in use

**Cause**: Another application is using port 3000.

**Solution**: 
- Option 1: Kill the process using port 3000
  ```bash
  lsof -i :3000  # Find the process
  kill -9 <PID>  # Kill it
  ```
- Option 2: Run Vite on a different port
  ```bash
  yarn start -- --port 3001
  ```

---

## Project Structure

```
openmetadata-ui/src/main/resources/ui/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── styles/             # Global styles
│   ├── constants/          # App constants
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Root component
│   └── index.tsx           # Entry point
├── public/                 # Static assets
├── node_modules/           # Dependencies (git-ignored)
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Project metadata & scripts
├── yarn.lock              # Locked dependency versions
└── README.md              # Project documentation
```

---

## Key Technologies

- **Vite 7.3.1**: Fast build tool and dev server
- **React 18.3.1**: UI library
- **TypeScript**: Type-safe JavaScript
- **Ant Design 4.24**: UI component library
- **Material-UI (MUI) 7.3**: Additional UI components
- **React Router**: Client-side routing
- **Zustand**: State management
- **Axios**: HTTP client
- **Jest**: Testing framework
- **ESLint & Prettier**: Code quality and formatting

---

## Environment Variables

Create a `.env` file in the project root to customize:

```bash
# Backend API target
VITE_DEV_SERVER_TARGET=http://localhost:8585/

# Development environment
VITE_APP_ENV=development
```

Available variables are loaded in `vite.config.ts` using `loadEnv()`.

---

## Next Steps

1. **Explore the codebase**: Start by checking out `src/App.tsx` and `src/pages/`
2. **Read the documentation**: See `README.md` for more information
3. **Check out components**: Browse `src/components/` to understand the component structure
4. **Review the API**: Look at `src/rest/` for API client implementations
5. **Contribute**: Make your changes and submit a pull request!

---

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [OpenMetadata Documentation](https://docs.open-metadata.org/)
- [Ant Design Documentation](https://ant.design/)

---

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review existing GitHub issues: https://github.com/open-metadata/OpenMetadata/issues
3. Check the project's DEVELOPER_HANDBOOK.md
4. Join the community: Check OpenMetadata's community channels

---

## License

This project is licensed under the Apache License 2.0. See LICENSE file for details.

---

**Last Updated**: January 22, 2026
