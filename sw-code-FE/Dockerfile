# Используем официальный образ Node.js на основе Alpine Linux
FROM node:20-alpine

# Устанавливаем pnpm глобально
RUN corepack enable && corepack prepare pnpm@latest --activate

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и pnpm-lock.yaml
COPY package.json ./

# Устанавливаем зависимости с помощью pnpm
RUN pnpm install

# Копируем исходный код проекта
COPY . .

# Собираем проект (опционально, если нужно для production)
RUN pnpm run build

EXPOSE 3000

# Запускаем Vite в режиме разработки или превью
CMD ["pnpm", "run", "preview"]