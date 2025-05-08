'use client';

import { useState, useEffect } from 'react';
import { loadDefaultDatasets, processUploadedCsv } from '../../utils/dataLoader';
import { processCsvData } from '../../utils/dataProcessor';
import ModelSelector from './ModelSelector';
import CSVUploader from './CSVUploader';
import PerformanceMetrics from './PerformanceMetrics';
import AgentTable from './AgentTable';
import FeatureImportanceChart from '../Charts/FeatureImportanceChart';
import AgentPerformanceChart from '../Charts/AgentPerformanceChart';
import TimeSeriesAnalysis from '../Charts/TimeSeriesAnalysis';
import ConversionRatesChart from '../Charts/ConversionRatesChart';
import NILLPredictionDistribution from '../Charts/NILLPredictionDistribution';
import AgentClassification from './AgentClassification';
import ActionPlans from './ActionPlans';

export default function Dashboard() {
  const [selectedModel, setSelectedModel] = useState('championship');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [trainData, setTrainData] = useState(null);
  const [testData, setTestData] = useState(null);
  const [processedResults, setProcessedResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadedCsv, setUploadedCsv] = useState(null);
  
  // Available models
  const models = [
    { id: 'championship', name: 'Championship Model (SMOTE & Optuna)', filename: '094400-public.py', accuracy: 0.918 },
    { id: 'ceiling-breaker', name: 'Ceiling-Breaking Model', filename: '094508-public.py', accuracy: 0.932 },
    { id: 'ultra-optimized', name: 'Ultra-Optimized Champion Model', filename: '094640-public.py', accuracy: 0.945 }
  ];
  
  // Load default datasets on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { trainData, testData, error } = await loadDefaultDatasets();
        
        if (error) {
          setLoadError(error);
          setIsLoading(false);
          return;
        }
        
        setTrainData(trainData);
        setTestData(testData);
        setDataLoaded(true);
        
        // Process data with the default model
        const results = await processCsvData(trainData, selectedModel);
        setProcessedResults(results);
      } catch (err) {
        console.error("Error in initial data loading:", err);
        setLoadError("Failed to load or process data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle model change
  const handleModelChange = async (modelId) => {
    setSelectedModel(modelId);
    setIsLoading(true);
    
    try {
      // Use uploaded data if available, otherwise use default test data
      const dataToProcess = uploadedCsv || testData;
      
      // Process data with the new model
      const results = await processCsvData(dataToProcess, modelId);
      setProcessedResults(results);
    } catch (err) {
      console.error("Error processing data with new model:", err);
      setLoadError(`Failed to process data with ${modelId} model.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle CSV upload
  const handleCsvUpload = async (file) => {
    setIsLoading(true);
    setLoadError(null);
    
    try {
      // Parse the uploaded CSV
      const parsedData = await processUploadedCsv(file);
      setUploadedCsv(parsedData);
      
      // Process with the selected model
      const results = await processCsvData(parsedData, selectedModel);
      setProcessedResults(results);
    } catch (err) {
      console.error("Error processing uploaded CSV:", err);
      setLoadError("Failed to process the uploaded CSV file. Please check the file format.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Multiple visualization tabs
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="h-96 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Processing data with {models.find(m => m.id === selectedModel)?.name}...</p>
          </div>
        </div>
      );
    }
    
    if (loadError) {
      return (
        <div className="h-96 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
            <h3 className="text-red-700 font-medium mb-2">Error Loading Data</h3>
            <p className="text-red-600">{loadError}</p>
            <button 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    
    if (!processedResults) {
      return (
        <div className="h-96 flex items-center justify-center">
          <p className="text-gray-500">No data available. Please wait for the default datasets to load or upload a CSV file.</p>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <PerformanceMetrics metrics={processedResults.metrics} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <NILLPredictionDistribution data={processedResults.predictionDistribution} />
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <TimeSeriesAnalysis data={processedResults.timeSeriesData} />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <ConversionRatesChart data={processedResults.conversionRates} />
            </div>
          </div>
        );
        
      case 'feature-importance':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Key Factors Influencing NILL Prediction</h2>
              <div className="h-96">
                <FeatureImportanceChart data={processedResults.featureImportance} />
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Feature Explanations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {processedResults.featureImportance?.slice(0, 6).map((feature, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-blue-700">{feature.feature}</h4>
                      <p className="text-sm text-gray-600 mt-1">{getFeatureExplanation(feature.feature)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'agent-performance':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Agent Performance Analysis</h2>
              <div className="h-96">
                <AgentPerformanceChart data={processedResults.agentPerformance} />
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-700">New Agents (0-3 months)</h3>
                  <p className="mt-2 text-sm">New agents require consistent mentoring and structured onboarding. Focus on building fundamental skills and product knowledge.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-700">Developing Agents (4-12 months)</h3>
                  <p className="mt-2 text-sm">Developing agents show improving patterns. Focus on conversion optimization and expanding client networks.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-700">Experienced Agents (1+ years)</h3>
                  <p className="mt-2 text-sm">Veteran agents should focus on maintaining consistency and can mentor newer agents. Look for potential burnout signs.</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'classification':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <AgentClassification 
              classifications={processedResults.agentClassifications} 
              metrics={processedResults.classificationMetrics} 
            />
          </div>
        );
        
      case 'action-plans':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <ActionPlans 
              recommendations={processedResults.actionPlans} 
              agentTypes={processedResults.agentTypes} 
            />
          </div>
        );
        
      case 'predictions':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <AgentTable 
              agents={processedResults.agentPredictions} 
              modelName={models.find(m => m.id === selectedModel)?.name} 
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Helper function to get feature explanations
  const getFeatureExplanation = (feature) => {
    const explanations = {
      'unique_proposal': 'Number of unique proposals submitted by the agent directly impacts their sales pipeline.',
      'unique_quotations': 'Quotations represent advancing client interactions and are strong predictors of sales.',
      'agent_age': 'Agent age correlates with experience and communication skills that affect sales outcomes.',
      'months_with_company': 'Tenure with the company indicates experience level and familiarity with products.',
      'proposal_momentum': 'Recent proposal activity compared to historical activity - indicates current engagement.',
      'quotation_conversion_rate': 'The rate at which proposals convert to quotations - measures agent effectiveness.',
      'hist_nill_rate': 'Historical frequency of months with zero sales - past performance predicts future outcomes.',
      'hist_current_nill_streak': 'Number of consecutive months with zero sales - indicates declining performance.',
      'months_to_first_sale': 'Time taken to achieve first sale - early success predicts long-term performance.',
      'proposal_consistency': 'Consistency in proposal generation activity - stable work patterns predict success.',
      // Add more explanations as needed
    };
    
    return explanations[feature] || 'This feature influences agent performance and NILL risk prediction.';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Insurance Agent NILL Prediction Dashboard</h1>
          <p className="text-gray-600">
            Analyze agent performance and predict which agents are at risk of going NILL (not selling any policies) next month.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Model Selection</h2>
              <ModelSelector 
                models={models} 
                selectedModel={selectedModel} 
                onSelectModel={handleModelChange}
              />
            </div>
            
            {processedResults && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Accuracy</p>
                    <p className="text-2xl font-bold text-blue-800">{(processedResults.metrics.accuracy * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Precision</p>
                    <p className="text-2xl font-bold text-green-800">{(processedResults.metrics.precision * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-indigo-600">Recall</p>
                    <p className="text-2xl font-bold text-indigo-800">{(processedResults.metrics.recall * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600">At-Risk Agents</p>
                    <p className="text-2xl font-bold text-red-800">{processedResults.metrics.atRiskCount}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <CSVUploader 
              onUpload={handleCsvUpload} 
              isProcessing={isLoading}
              selectedModel={selectedModel}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('feature-importance')}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'feature-importance'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Feature Importance
              </button>
              <button
                onClick={() => setActiveTab('agent-performance')}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'agent-performance'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Agent Performance
              </button>
              <button
                onClick={() => setActiveTab('classification')}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'classification'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Agent Classification
              </button>
              <button
                onClick={() => setActiveTab('action-plans')}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'action-plans'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Action Plans
              </button>
              <button
                onClick={() => setActiveTab('predictions')}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'predictions'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Agent Predictions
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
        
        <footer className="text-center text-gray-500 text-sm mt-12">
          <p>Data Storm v6.0 Dashboard • Insurance Agent NILL Prediction</p>
        </footer>
      </div>
    </div>
  );
}