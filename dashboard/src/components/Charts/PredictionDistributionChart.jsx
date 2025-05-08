'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

export default function PredictionDistributionChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!data || !chartRef.current) return;
    
    // Cleanup previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Prepare data
    const labels = ['Non-NILL Agents', 'NILL Agents'];
    const values = [data.nonNill || 0, data.nill || 0];
    const total = values.reduce((sum, val) => sum + val, 0);
    const percentages = values.map(val => ((val / (total || 1)) * 100).toFixed(1));
    
    // Create chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: [
            'rgba(52, 211, 153, 0.7)', // Green for Non-NILL
            'rgba(239, 68, 68, 0.7)'   // Red for NILL
          ],
          borderColor: [
            'rgba(52, 211, 153, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'NILL vs Non-NILL Prediction Distribution',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const percentage = percentages[context.dataIndex] || 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '60%'
      }
    });
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);
  
  if (!data) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No prediction data available</p>
      </div>
    );
  }
  
  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}