'use client';

import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

export default function TimeSeriesChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedMetric, setSelectedMetric] = useState('avgPolicies');
  
  useEffect(() => {
    if (!data || !data.length || !chartRef.current) return;
    
    // Cleanup previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Sort data by month
    const sortedData = [...data].sort((a, b) => a.month.localeCompare(b.month));
    
    // Format month labels to be more readable
    const labels = sortedData.map(item => {
      const [year, month] = item.month.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    const datasetConfigs = {
      avgPolicies: {
        label: 'Average Policies Sold',
        color: 'rgb(59, 130, 246)',
        data: sortedData.map(item => item.avgPolicies)
      },
      avgProposals: {
        label: 'Average Proposals',
        color: 'rgb(16, 185, 129)',
        data: sortedData.map(item => item.avgProposals)
      },
      avgQuotations: {
        label: 'Average Quotations',
        color: 'rgb(249, 115, 22)',
        data: sortedData.map(item => item.avgQuotations)
      },
      nillRate: {
        label: 'NILL Rate (%)',
        color: 'rgb(239, 68, 68)',
        data: sortedData.map(item => item.nillRate * 100)
      }
    };
    
    // Create chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: datasetConfigs[selectedMetric].label,
          data: datasetConfigs[selectedMetric].data,
          backgroundColor: `${datasetConfigs[selectedMetric].color}33`,
          borderColor: datasetConfigs[selectedMetric].color,
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Monthly Performance Trends',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month'
            },
            grid: {
              display: false
            }
          },
          y: {
            title: {
              display: true,
              text: datasetConfigs[selectedMetric].label
            },
            beginAtZero: true
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
  }, [data, selectedMetric]);
  
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No time series data available</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 text-sm rounded-md ${
            selectedMetric === 'avgPolicies' 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedMetric('avgPolicies')}
        >
          Policies
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-md ${
            selectedMetric === 'avgProposals' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedMetric('avgProposals')}
        >
          Proposals
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-md ${
            selectedMetric === 'avgQuotations' 
              ? 'bg-orange-100 text-orange-700 border border-orange-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedMetric('avgQuotations')}
        >
          Quotations
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-md ${
            selectedMetric === 'nillRate' 
              ? 'bg-red-100 text-red-700 border border-red-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedMetric('nillRate')}
        >
          NILL Rate
        </button>
      </div>
      
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}