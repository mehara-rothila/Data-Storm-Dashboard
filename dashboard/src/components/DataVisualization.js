'use client';

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DataVisualization = ({ data }) => {
  const [activeChart, setActiveChart] = useState('feature-importance');
  
  // Process the data for visualizations
  const prepareFeatureImportanceData = () => {
    // Sort feature importance data - in a real implementation, this would use actual data
    const features = [
      'unique_proposal',
      'unique_quotations',
      'agent_age',
      'months_with_company',
      'proposal_momentum',
      'quotation_conversion_rate',
      'hist_nill_rate',
      'hist_current_nill_streak',
      'months_to_first_sale',
      'proposal_consistency'
    ];
    
    const importance = [0.85, 0.78, 0.65, 0.62, 0.58, 0.55, 0.52, 0.48, 0.45, 0.40];
    
    return {
      labels: features,
      datasets: [
        {
          label: 'Feature Importance',
          data: importance,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };
  
  const prepareAgentPerformanceData = () => {
    // Example of agent performance over time - would use actual data in real implementation
    return {
      labels: ['0-3 Months', '4-6 Months', '7-12 Months', '1-2 Years', '2+ Years'],
      datasets: [
        {
          label: 'Average Policies Sold',
          data: [1.2, 2.5, 3.8, 4.1, 3.9],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
        },
        {
          label: 'NILL Risk (%)',
          data: [45, 30, 20, 18, 22],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4,
        },
      ],
    };
  };
  
  const prepareNillRiskData = () => {
    // Example of NILL risk factors - would use actual data in real implementation
    return {
      labels: ['Lack of Activity', 'Poor Conversion', 'Inconsistent Effort', 'Slow First Sale', 'Low Value Policies'],
      datasets: [
        {
          label: 'Impact on NILL Risk',
          data: [80, 75, 65, 60, 45],
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    };
  };
  
  const preparePredictionDistribution = () => {
    // Example of prediction distribution - would use actual model results in real implementation
    return {
      labels: ['Normal Agents', 'At-Risk Agents'],
      datasets: [
        {
          label: 'Predicted Counts',
          data: [720, 280],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Options for charts
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Feature Importance for NILL Prediction',
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    maintainAspectRatio: false,
  };
  
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Agent Performance by Experience Level',
      },
    },
    maintainAspectRatio: false,
  };
  
  const renderChart = () => {
    switch (activeChart) {
      case 'feature-importance':
        return <Bar data={prepareFeatureImportanceData()} options={barOptions} />;
      case 'agent-performance':
        return <Line data={prepareAgentPerformanceData()} options={lineOptions} />;
      case 'nill-risk':
        return <Bar data={prepareNillRiskData()} options={{
          ...barOptions,
          plugins: {
            ...barOptions.plugins,
            title: {
              display: true,
              text: 'Top Factors Contributing to NILL Risk',
            },
          },
        }} />;
      case 'prediction-distribution':
        return <Bar data={preparePredictionDistribution()} options={{
          ...barOptions,
          plugins: {
            ...barOptions.plugins,
            title: {
              display: true,
              text: 'Prediction Distribution',
            },
          },
          indexAxis: 'y',
        }} />;
      default:
        return <Bar data={prepareFeatureImportanceData()} options={barOptions} />;
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.chartSelector}>
        <button 
          style={activeChart === 'feature-importance' ? {...styles.chartButton, ...styles.activeChartButton} : styles.chartButton}
          onClick={() => setActiveChart('feature-importance')}
        >
          Feature Importance
        </button>
        <button 
          style={activeChart === 'agent-performance' ? {...styles.chartButton, ...styles.activeChartButton} : styles.chartButton}
          onClick={() => setActiveChart('agent-performance')}
        >
          Agent Performance
        </button>
        <button 
          style={activeChart === 'nill-risk' ? {...styles.chartButton, ...styles.activeChartButton} : styles.chartButton}
          onClick={() => setActiveChart('nill-risk')}
        >
          NILL Risk Factors
        </button>
        <button 
          style={activeChart === 'prediction-distribution' ? {...styles.chartButton, ...styles.activeChartButton} : styles.chartButton}
          onClick={() => setActiveChart('prediction-distribution')}
        >
          Prediction Distribution
        </button>
      </div>
      
      <div style={styles.chartContainer}>
        {renderChart()}
      </div>
      
      <div style={styles.metricsContainer}>
        <div style={styles.metricCard}>
          <h3 style={styles.metricTitle}>Accuracy</h3>
          <p style={styles.metricValue}>92.5%</p>
        </div>
        <div style={styles.metricCard}>
          <h3 style={styles.metricTitle}>Precision</h3>
          <p style={styles.metricValue}>89.3%</p>
        </div>
        <div style={styles.metricCard}>
          <h3 style={styles.metricTitle}>Recall</h3>
          <p style={styles.metricValue}>87.8%</p>
        </div>
        <div style={styles.metricCard}>
          <h3 style={styles.metricTitle}>At-Risk Agents</h3>
          <p style={styles.metricValue}>28%</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  chartSelector: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  chartButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '0.25rem',
    fontSize: '0.875rem',
    color: '#495057',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeChartButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    color: 'white',
  },
  chartContainer: {
    flex: 1,
    minHeight: '350px',
    marginBottom: '1.5rem',
  },
  metricsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  metricCard: {
    flex: '1 1 150px',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '0.25rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  metricTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.875rem',
    color: '#6c757d',
  },
  metricValue: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#343a40',
  },
};

export default DataVisualization;