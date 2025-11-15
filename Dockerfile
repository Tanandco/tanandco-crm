# Tan & Co CRM - Dockerfile
# מתאים לפריסה על Google Cloud Run

FROM node:20-alpine AS builder

# עבודה בתיקיית /app
WORKDIR /app

# העתקת קבצי package
COPY package*.json ./

# התקנת תלויות (כולל dev dependencies לבנייה)
RUN npm ci

# העתקת כל הקבצים
COPY . .

# בניית האפליקציה (client + server)
RUN npm run build

# בדיקה שהקבצים קיימים
RUN ls -la dist/ || (echo "dist directory not found!" && exit 1)

# ============================================
# שלב Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# העתקת package files
COPY package*.json ./

# התקנת רק production dependencies
RUN npm ci --omit=dev

# העתקת קבצים שנבנו
COPY --from=builder /app/dist ./dist

# העתקת קבצים נוספים שנדרשים
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/server ./server
COPY --from=builder /app/client ./client

# בדיקה שהקבצים קיימים
RUN ls -la dist/ || (echo "dist directory not found!" && exit 1)
RUN test -f dist/index.js || (echo "dist/index.js not found!" && exit 1)

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

