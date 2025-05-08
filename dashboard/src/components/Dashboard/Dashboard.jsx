'use client';

import { useState, useEffect } from 'react';
import { loadCsvFile, processData } from '../../utils/dataProcessor';
import ModelSelector from './ModelSelector';
import CSVUploader from './CSVUploader';
import PerformanceMetrics from './PerformanceMetrics';
import FeatureImportanceChart from '../Charts/FeatureImportanceChart';
import AgentRiskTable from './AgentRiskTable';
import TimeSeriesChart from '../Charts/TimeSeriesChart';
import ConversionRatesChart from '../Charts/ConversionRatesChart';
import PredictionDistributionChart from '../Charts/PredictionDistributionChart';
import AgentPerformanceByExperience from '../Charts/AgentPerformanceByExperience';
import SingleEntryPredictor from './SingleEntryPredictor';
import AdvancedAnalytics from './AdvancedAnalytics';
import RiskFactorsChart from '../Charts/RiskFactorsChart';

export default function Dashboard() {
  const [selectedModel, setSelectedModel] = useState('championship');
  const [trainData, setTrainData] = useState(null);
  const [testData, setTestData] = useState(null);
  const [processedResults, setProcessedResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);
  const [isProcessingSingleEntry, setIsProcessingSingleEntry] = useState(false);
  
  // Models available in the dashboard
  const models = [
    { id: 'championship', name: 'Championship Model (SMOTE & Optuna)', filename: '/models/094400-public.py' },
    { id: 'ceiling-breaker', name: 'Ceiling-Breaking Model', filename: '/models/094508-public.py' },
    { id: 'ultra-optimized', name: 'Ultra-Optimized Champion Model', filename: '/models/094640-public.py' }
  ];
  
  // Check if the viewport is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Load default datasets on component mount
  useEffect(() => {
    const loadDefaultData = async () => {
      setIsLoading(true);
      try {
        // Load CSV files
        const train = await loadCsvFile('/dataset/train_storming_round.csv');
        const test = await loadCsvFile('/dataset/test_storming_round.csv');
        
        setTrainData(train);
        setTestData(test);
        
        // Process data with selected model
        const results = await processData(train, test, selectedModel);
        setProcessedResults(results);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load default datasets. Please check that CSV files are in the public/dataset folder.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDefaultData();
  }, []);
  
  // Handle model change
  const handleModelChange = async (modelId) => {
    if (!trainData || !testData) return;
    
    setSelectedModel(modelId);
    setIsLoading(true);
    
    try {
      const results = await processData(trainData, testData, modelId);
      setProcessedResults(results);
    } catch (err) {
      console.error('Error processing data with model:', err);
      setError(`Failed to process data with model: ${modelId}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle CSV upload (replace test data)
  const handleCsvUpload = async (data) => {
    if (!trainData) return;
    
    setIsLoading(true);
    
    try {
      setTestData(data);
      const results = await processData(trainData, data, selectedModel);
      setProcessedResults(results);
      setError(null);
    } catch (err) {
      console.error('Error processing uploaded data:', err);
      setError('Failed to process uploaded data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle single entry prediction
  const handleSingleEntryPredict = async (entryData) => {
    setIsProcessingSingleEntry(true);
    
    // For demo purposes, we'll use the generateAgentPredictions function directly
    try {
      // Create a single-item array with the entry
      const singlePrediction = await processData.generateAgentPredictions([entryData], selectedModel);
      setIsProcessingSingleEntry(false);
      return singlePrediction[0]; // Return the prediction
    } catch (error) {
      console.error('Error processing single entry:', error);
      setIsProcessingSingleEntry(false);
      throw error;
    }
  };
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Feature Importance' },
    { id: 'time-series', label: 'Time Series' },
    { id: 'agents', label: 'Agent Predictions' },
    { id: 'experience', label: 'Experience Analysis' },
    { id: 'conversion', label: 'Conversion Rates' },
    { id: 'demo', label: 'Demo Predictor' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-indigo-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Insurance Agent NILL Prediction</h1>
          <div className="flex items-center space-x-4">
            {!isMobile && (
              <div className="text-sm px-2 py-1 bg-indigo-900 rounded">
                Model: {models.find(m => m.id === selectedModel)?.name.split('(')[0]}
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-6">
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-12'} gap-6`}>
          {/* Sidebar */}
          <div className={isMobile ? 'order-2' : 'col-span-3'}>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <ModelSelector 
                models={models} 
                selectedModel={selectedModel} 
                onSelectModel={handleModelChange}
              />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <CSVUploader 
                onUpload={handleCsvUpload} 
                isLoading={isLoading}
              />
            </div>
          </div>
          
          {/* Main Content */}
          <div className={isMobile ? 'order-1' : 'col-span-9'}>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p>{error}</p>
              </div>
            )}
            
            {/* Tabs */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`py-3 px-4 text-sm font-medium ${
                        activeTab === tab.id
                          ? 'border-b-2 border-indigo-500 text-indigo-600'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Tab Content */}
              <div className="p-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    <p className="ml-4 text-gray-600">Processing data...</p>
                  </div>
                ) : !processedResults ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">No data available</p>
                  </div>
                ) : (
                  <>
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <PerformanceMetrics metrics={processedResults.metrics} />
                        
                        <AdvancedAnalytics data={processedResults} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <PredictionDistributionChart data={processedResults.predictionDistribution} />
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <RiskFactorsChart data={processedResults} />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'features' && (
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <FeatureImportanceChart data={processedResults.featureImportance} />
                      </div>
                    )}
                    
                    {activeTab === 'time-series' && (
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <TimeSeriesChart data={processedResults.timeSeriesData} />
                      </div>
                    )}
                    
                    {activeTab === 'agents' && (
                      <AgentRiskTable agents={processedResults.agentPredictions} />
                    )}
                    
                    {activeTab === 'experience' && (
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <AgentPerformanceByExperience data={processedResults.agentPerformance} />
                      </div>
                    )}
                    
                    {activeTab === 'conversion' && (
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <ConversionRatesChart data={processedResults.conversionRates} />
                      </div>
                    )}
                    
                    {activeTab === 'demo' && (
                      <SingleEntryPredictor 
                        onPredict={handleSingleEntryPredict}
                        selectedModel={selectedModel}
                        isProcessing={isProcessingSingleEntry}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}