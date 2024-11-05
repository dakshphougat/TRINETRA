import { useState, useEffect } from "react";
import { api } from "../../utils/api";

const History = () => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await api.get("/readings");
        setReadings(response.data);
      } catch (err) {
        setError("Failed to load reading history"+err);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  if (loading)
    return <div className="text-center py-4">Loading history...</div>;
  if (error)
    return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Reading History</h2>
      {readings.length === 0 ? (
        <p className="text-gray-500">No readings found</p>
      ) : (
        <div className="space-y-4">
          {readings.map((reading) => (
            <div key={reading._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    {new Date(reading.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-gray-700">
                    {reading.processedText.substring(0, 100)}...
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {reading.confidence}% confidence
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
