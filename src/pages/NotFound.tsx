const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-225px)] bg-black">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <h2 className="mt-4 text-2xl text-gray-400">Page Not Found</h2>
        <p className="mt-2 text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
