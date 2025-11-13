# Tan & Co CRM - Dockerfile
# מתאים לפריסה על Railway, Render, Fly.io, או כל פלטפורמת Docker

FROM node:20-alpine AS builder

# עבודה בתיקיית /app
WORKDIR /app

# העתקת קבצי package
COPY package*.json ./

# התקנת תלויות
RUN npm ci

# העתקת כל הקבצים
COPY . .

# בניית האפליקציה
RUN npm run build

# ============================================
# שלב Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# העתקת package files
COPY package*.json ./

# התקנת רק production dependencies
RUN npm ci --only=production

# העתקת קבצים שנבנו
COPY --from=builder /app/dist ./dist

# יצירת משתמש לא-root לביטחון
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# שינוי בעלות על הקבצים
RUN chown -R nodejs:nodejs /app

# מעבר למשתמש nodejs
USER nodejs

# חשיפת הפורט
EXPOSE 5000

# משתנה סביבה
ENV NODE_ENV=production
ENV PORT=5000

# הפעלת השרת
CMD ["node", "dist/index.js"]

