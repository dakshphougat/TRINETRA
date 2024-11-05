const Footer = () => {
  return (
    <footer className="bg-white shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">TriNetra</h3>
            <p className="text-gray-500 text-sm">
              Making print media accessible to all
            </p>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} TriNetra. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
