'use client';

import { useState } from 'react';

export default function SingleEntryPredictor({ onPredict, selectedModel, isProcessing }) {
  const [formData, setFormData] = useState({
    agent_age: 35,
    months_with_company: 12,
    unique_proposal: 15,
    unique_quotations: 10,
    unique_customers: 8,
    unique_proposals_last_7_days: 3,
    unique_proposals_last_15_days: 6,
    unique_proposals_last_21_days: 10,
    unique_quotations_last_7_days: 2,
    unique_quotations_last_15_days: 4,
    unique_quotations_last_21_days: 8,
    unique_customers_last_7_days: 2,
    unique_customers_last_15_days: 5,
    unique_customers_last_21_days: 7,
    ANBP_value: 120000
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate a mock agent entry from form data
    const agentEntry = {
      agent_code: 'DEMO-' + Math.floor(Math.random() * 10000),
      agent_age: formData.agent_age,
      agent_join_month: new Date(Date.now() - formData.months_with_company * 30 * 24 * 60 * 60 * 1000).toISOString(),
      first_policy_sold_month: new Date(Date.now() - (formData.months_with_company - 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
      year_month: new Date().toISOString(),
      ...formData
    };

    // Process prediction
    onPredict(agentEntry).then(result => {
      setPrediction(result);
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Demo: Single Agent Prediction</h2>
      <p className="text-sm text-gray-600 mb-4">
        Enter agent metrics to predict NILL risk using the {selectedModel} model.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent Age</label>
            <input
              type="number"
              name="agent_age"
              value={formData.agent_age}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Months at Company</label>
            <input
              type="number"
              name="months_with_company"
              value={formData.months_with_company}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Proposals</label>
            <input
              type="number"
              name="unique_proposal"
              value={formData.unique_proposal}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Quotations</label>
            <input
              type="number"
              name="unique_quotations"
              value={formData.unique_quotations}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposals (Last 7 Days)</label>
            <input
              type="number"
              name="unique_proposals_last_7_days"
              value={formData.unique_proposals_last_7_days}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quotations (Last 7 Days)</label>
            <input
              type="number"
              name="unique_quotations_last_7_days"
              value={formData.unique_quotations_last_7_days}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isProcessing}
            className={`px-4 py-2 rounded-md text-white ${
              isProcessing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Predict NILL Risk'}
          </button>
        </div>
      </form>

      {prediction && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Prediction Results</h3>
          
          <div className="flex items-center mb-4">
            <div className={`text-lg font-bold mr-3 px-3 py-1 rounded-md ${
              prediction.predicted_nill === 1 
                ? 'text-red-700 bg-red-100' 
                : 'text-green-700 bg-green-100'
            }`}>
              {prediction.predicted_nill === 1 ? 'NILL Risk: High' : 'NILL Risk: Low'}
            </div>
            <div className="text-gray-700">
              Risk Score: <span className="font-semibold">{(prediction.risk_score * 100).toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Key Risk Factors:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {prediction.top_factors.map((factor, idx) => (
                <li key={idx}>{factor}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Recommendation:</h4>
            <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
              {prediction.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}