# ============================================
# Tan & Co CRM - Fullstack Dockerfile (Vite + Node)
# ============================================

FROM node:20-alpine AS builder
WORKDIR /app

# התקנת תלויות
COPY package*.json ./
RUN npm install --legacy-peer-deps

# העתקת כל הקבצים
COPY . .

# בנייה של צד הלקוח בלבד
RUN npm run build

# ============================================
# Production Stage
# ============================================

FROM node:20-alpine AS production
WORKDIR /app

COPY package*.json ./
# התקנת כל התלויות (כולל tsx להרצת TypeScript)
RUN npm install --legacy-peer-deps

# העתקת שרת (TypeScript)
COPY server ./server

# העתקת shared (נדרש לשרת)
COPY shared ./shared

# העתקת קבצי ה-client שנבנו
COPY --from=builder /app/dist ./dist

# העתקת client (נדרש ל-serveStatic)
COPY --from=builder /app/client ./client

# יצירת משתמש לא-root
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs

EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000

# הפעלת השרת עם tsx (TypeScript)
CMD ["npx", "tsx", "server/index.ts"]
