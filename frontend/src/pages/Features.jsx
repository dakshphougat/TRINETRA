import { useState } from "react";
import ImageUpload from "../components/features/ImageUpload";
import TextReader from "../components/features/TextReader";

const Features = () => {
  const [processedText, setProcessedText] = useState("");

  const handleUploadSuccess = (data) => {
    setProcessedText(data.text);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Try TriNetra
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Upload an image containing text and let TriNetra read it for you.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          <ImageUpload onUploadSuccess={handleUploadSuccess} />
          <TextReader text={processedText} />
        </div>
      </div>
    </div>
  );
};

export default Features;
