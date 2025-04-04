import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        server: {
            allowedHosts: "all",
            host: "0.0.0.0",
            port: 3000,
            strictPort: true,
            hmr: {
                host: "code-interview.smartway.today",
                protocol: "wss" // добавьте, если используете HTTPS
            },
        },
        plugins: [
            react(),
            mode === 'development' && componentTagger()
        ].filter(Boolean),
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        define: {
            // Правильное определение process.env
            'process.env': env,
            // Для глобальных переменных
            __APP_ENV__: JSON.stringify(env.APP_ENV),
        },
        // Опционально: настройки для сборки
        build: {
            outDir: "dist",
            emptyOutDir: true,
            sourcemap: mode === 'development'
        }
    }
});