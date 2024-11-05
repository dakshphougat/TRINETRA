import { useState } from "react";
import { Play, Square } from "lucide-react";
import PropTypes from "prop-types";

const TextReader = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const handleSpeak = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(newUtterance);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Extracted Text
          </h3>
          <button
            onClick={handleSpeak}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {isPlaying ? <Square size={16} /> : <Play size={16} />}
            <span>{isPlaying ? "Stop" : "Read Aloud"}</span>
          </button>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 whitespace-pre-wrap">
            {text || "No text to display"}
          </p>
        </div>
      </div>
    </div>
  );
};

TextReader.propTypes = {
  text: PropTypes.string.isRequired,
};

TextReader.defaultProps = {
  text: "",
};

export default TextReader;
