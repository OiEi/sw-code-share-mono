import { defineConfig } from '@rsbuild/core';
import { pluginSolid } from '@rsbuild/plugin-solid';

export default defineConfig({
  plugins: [pluginSolid()],
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [require('tailwindcss')]
      }
    }
  },
  source: {
    transformImport: false // Полностью отключаем автоматические импорты
  }
}); 