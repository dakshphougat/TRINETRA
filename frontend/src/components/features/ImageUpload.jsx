import { useState } from "react";
import { Upload, Loader } from "lucide-react";
import PropTypes from 'prop-types';

const ImageUpload = ({ onUploadSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/process-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      onUploadSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-indigo-500 cursor-pointer hover:bg-indigo-50">
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-indigo-500" />
          )}
          <span className="text-indigo-500">Select an image</span>
        </div>
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          accept="image/*"
        />
      </label>
      {error && <p className="mt-2 text-red-500 text-center">{error}</p>}
    </div>
  );
};

ImageUpload.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired
};

export default ImageUpload;
