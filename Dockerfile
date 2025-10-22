FROM node:22.0.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
# RUN npm run build
EXPOSE 3000
# CMD ["npm", "start"]
CMD ["sh", "-c", "npx prisma migrate deploy && exec npm start"]
# CMD ["sh", "-c", "npx prisma migrate deploy && exec node dist/main.js"]
