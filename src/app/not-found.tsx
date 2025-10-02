// app/not-found.tsx
export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <p className="mt-4 text-lg text-gray-700">Oops! The page you are looking for doesn’t exist.</p>
        <a
          href="/"
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
        >
          Go Back Home
        </a>
      </div>
    );
  }
  