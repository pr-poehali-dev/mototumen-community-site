import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Vite + React + TypeScript
        </h1>
        <p className="text-gray-300 mb-8">
          Get started by editing <code className="bg-gray-700 px-2 py-1 rounded">src/App.tsx</code>
        </p>
        <div className="space-x-4">
          <a
            href="https://vitejs.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Learn Vite
          </a>
          <a
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Learn React
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;