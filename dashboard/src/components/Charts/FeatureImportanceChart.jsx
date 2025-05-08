'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

export default function FeatureImportanceChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;
    
    // Cleanup previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Sort features by importance
    const sortedData = [...data].sort((a, b) => b.importance - a.importance);
    
    // Take top 15 features
    const topFeatures = sortedData.slice(0, 15);
    
    // Create chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topFeatures.map(item => item.feature),
        datasets: [{
          label: 'Feature Importance',
          data: topFeatures.map(item => item.importance),
          backgroundColor: 'rgba(99, 102, 241, 0.6)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Top Features Influencing NILL Prediction',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw;
                return `Importance: ${value.toFixed(3)}`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Importance Score'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Features'
            }
          }
        }
      }
    });
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);
  
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No feature importance data available</p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="h-96">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}