# ============================================
#  Tan & Co CRM - Dockerfile (updated for Cloud Run)
# ============================================

# שלב 1: Build (כולל client + server)
FROM node:20-alpine AS builder

# הגדרת תיקיית עבודה
WORKDIR /app

# העתקת קבצי package.json ו־lock
COPY package*.json ./

# התקנת תלויות (כולל dev) עם תמיכה ב־peer dependencies
RUN npm install --legacy-peer-deps

# העתקת כל הקבצים
COPY . .

# בנייה של האפליקציה
RUN npm run build

# בדיקה שקבצי build קיימים
RUN ls -la dist/ || (echo "❌ dist directory not found!" && exit 1)

# ============================================
# שלב 2: Production
# ============================================

FROM node:20-alpine AS production

WORKDIR /app

# העתקת קובצי package
COPY package*.json ./

# ✅ התקנת תלויות פרודקשן בלבד עם תמיכה ב־peer deps
RUN npm install --only=production --legacy-peer-deps

# העתקת הקבצים שנבנו בשלב הראשון
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/server ./server
COPY --from=builder /app/client ./client

# בדיקה שהקבצים קיימים
RUN ls -la dist/ || (echo "❌ dist directory not found!" && exit 1)
RUN test -f dist/index.js || (echo "❌ dist/index.js not found!" && exit 1)

# יצירת משתמש לא-root לצורכי אבטחה
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# שינוי בעלות על הקבצים
RUN chown -R nodejs:nodejs /app

# מעבר למשתמש nodejs
USER nodejs

# חשיפת הפורט שבו האפליקציה פועלת
EXPOSE 5000

# משתני סביבה
ENV NODE_ENV=production
ENV PORT=5000

# פקודת ההרצה הסופית של האפליקציה
CMD ["node", "dist/index.js"]
