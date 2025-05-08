'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function RiskFactorsChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!data?.agentPredictions || !chartRef.current) return;
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Count occurrences of each risk factor
    const factorCounts = {};
    data.agentPredictions.forEach(agent => {
      if (agent.top_factors && agent.top_factors.length) {
        agent.top_factors.forEach(factor => {
          factorCounts[factor] = (factorCounts[factor] || 0) + 1;
        });
      }
    });
    
    // Convert to array and sort by count
    const factorsArray = Object.entries(factorCounts)
      .map(([factor, count]) => ({ factor, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Top 6 factors
    
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: factorsArray.map(item => item.factor),
        datasets: [{
          label: 'Occurrence Count',
          data: factorsArray.map(item => item.count),
          backgroundColor: [
            'rgba(239, 68, 68, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(139, 92, 246, 0.7)'
          ],
          borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(249, 115, 22, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(139, 92, 246, 1)'
          ],
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
            text: 'Top Risk Factors',
            font: { size: 16 }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Agents'
            }
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);
  
  if (!data?.agentPredictions) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No risk factor data available</p>
      </div>
    );
  }
  
  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}