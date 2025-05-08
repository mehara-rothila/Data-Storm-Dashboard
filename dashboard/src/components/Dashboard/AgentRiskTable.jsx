'use client';

import { useState } from 'react';

export default function AgentRiskTable({ agents }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('risk_score');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedAgent, setExpandedAgent] = useState(null);
  
  if (!agents || agents.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No agent data available</p>
      </div>
    );
  }
  
  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to descending
      setSortColumn(column);
      setSortDirection('desc');
    }
  };
  
  // Handle search
  const filteredAgents = agents.filter(agent => {
    const query = searchQuery.toLowerCase();
    return (
      agent.agent_code.toString().toLowerCase().includes(query) ||
      agent.risk_category.toLowerCase().includes(query)
    );
  });
  
  // Handle sorting
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    let comparison = 0;
    if (aValue > bValue) {
      comparison = 1;
    } else if (aValue < bValue) {
      comparison = -1;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Handle agent expansion
  const toggleExpandAgent = (agentCode) => {
    if (expandedAgent === agentCode) {
      setExpandedAgent(null);
    } else {
      setExpandedAgent(agentCode);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Agent Risk Predictions</h2>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search agents..."
            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('agent_code')}
              >
                Agent Code
                {sortColumn === 'agent_code' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('agent_age')}
              >
                Age
                {sortColumn === 'agent_age' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('months_with_company')}
              >
                Experience
                {sortColumn === 'months_with_company' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('risk_score')}
              >
                Risk Score
                {sortColumn === 'risk_score' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('predicted_nill')}
              >
                Prediction
                {sortColumn === 'predicted_nill' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('risk_category')}
              >
                Risk Level
                {sortColumn === 'risk_category' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAgents.map((agent) => (
              <>
                <tr key={agent.agent_code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleExpandAgent(agent.agent_code)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {expandedAgent === agent.agent_code ? 'Hide' : 'Show'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agent.agent_code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.agent_age}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.months_with_company} months</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium" style={{
                      color: agent.risk_score > 0.7 ? '#e53e3e' : 
                             agent.risk_score > 0.4 ? '#dd6b20' : 
                             '#38a169'
                    }}>
                      {agent.risk_score.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      agent.predicted_nill === 1 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {agent.predicted_nill === 1 ? 'NILL' : 'Non-NILL'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      agent.risk_category === 'High' 
                        ? 'bg-red-100 text-red-800' 
                        : agent.risk_category === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {agent.risk_category}
                    </span>
                  </td>
                </tr>
                
                {expandedAgent === agent.agent_code && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 bg-gray-50">
                      <div className="text-sm text-gray-900 space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Risk Factors:</h4>
                          <ul className="list-disc list-inside pl-2 text-gray-600">
                            {agent.top_factors.map((factor, index) => (
                              <li key={index}>{factor}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Activity Metrics:</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-500">Proposals:</p>
                              <p className="font-medium">{agent.unique_proposal}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Quotations:</p>
                              <p className="font-medium">{agent.unique_quotations}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Recommended Action:</h4>
                          <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-800 border border-blue-100">
                            {agent.recommendation}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}