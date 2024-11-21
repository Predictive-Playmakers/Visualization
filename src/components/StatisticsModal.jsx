import React, { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plot } from "react-plotly.js"; // Example for visualization library

const StatisticsModal = ({ apiEndpoint }) => {
  const [shapData, setShapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch SHAP data when the modal is rendered
    const fetchShapData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error("Failed to fetch SHAP data");
        const data = await response.json();
        setShapData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShapData();
  }, [apiEndpoint]);

  return (
    <DialogContent className="max-w-[80vw] max-h-[80vh] h-[80vh] w-[80vw]">
      <DialogHeader className="h-min">
        <DialogTitle className="text-3xl">Statistics</DialogTitle>
        <DialogDescription className="text-lg text-gray-500">
          Explore your SHAP visualization
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col h-full justify-center items-center">
        {loading ? (
          <p>Loading SHAP data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : shapData ? (
          // Example visualization with Plotly
          <div className="w-full h-full">
            <Plot
              data={shapData.data} // Replace with your SHAP visualization data structure
              layout={shapData.layout || { title: "SHAP Values" }}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        ) : (
          <p>No SHAP data available</p>
        )}
      </div>
      <DialogFooter className="absolute bottom-8 right-8">
        <DialogClose asChild>
          <Button size="lg">Ok</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default StatisticsModal;
