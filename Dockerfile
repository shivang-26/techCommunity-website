# ---- Stage 1: Build frontend ----
    FROM node:18 AS build-frontend
    WORKDIR /app/frontend
    COPY frontend/package*.json ./
    RUN npm install
    COPY frontend ./
    RUN npm run build
    
    # ---- Stage 2: Setup backend + copy frontend build ----
    FROM node:18
    WORKDIR /app
    
    # Copy backend code
    COPY backend/package*.json ./backend/
    WORKDIR /app/backend
    RUN npm install
    COPY backend ./
    
    # Copy frontend build into backend's public folder
    RUN mkdir -p /app/backend/public
    COPY --from=build-frontend /app/frontend/dist /app/backend/public

    
    # Expose port (Render will map it automatically)
    EXPOSE 8080
    
    # Start backend (Express)
    CMD ["node", "src/app.js"]
    