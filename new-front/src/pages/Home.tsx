import type { Component } from 'solid-js';

const Home: Component = () => {
  return (
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">
          SolidJS + TypeScript
        </h1>
        <p class="text-gray-600">
          Tailwind + Rsbuild + Bun
        </p>
      </div>
    </div>
  );
};

export default Home;