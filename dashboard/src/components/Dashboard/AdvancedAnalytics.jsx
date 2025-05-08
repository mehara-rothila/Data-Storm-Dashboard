'use client';

import { useState, useEffect } from 'react';

export default function AdvancedAnalytics({ data }) {
  const [metrics, setMetrics] = useState({
    totalAgents: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0,
    avgRiskScore: 0,
    newAgentsAtRisk: 0,
    experiencedAgentsAtRisk: 0
  });

  useEffect(() => {
    if (!data?.agentPredictions || data.agentPredictions.length === 0) return;

    const agents = data.agentPredictions;
    const highRisk = agents.filter(a => a.risk_category === 'High');
    const mediumRisk = agents.filter(a => a.risk_category === 'Medium');
    const lowRisk = agents.filter(a => a.risk_category === 'Low');
    const newAgents = agents.filter(a => a.months_with_company <= 3);
    const newAgentsAtRisk = newAgents.filter(a => a.predicted_nill === 1);
    const expAgents = agents.filter(a => a.months_with_company > 12);
    const expAgentsAtRisk = expAgents.filter(a => a.predicted_nill === 1);

    setMetrics({
      totalAgents: agents.length,
      highRiskCount: highRisk.length,
      mediumRiskCount: mediumRisk.length,
      lowRiskCount: lowRisk.length,
      avgRiskScore: agents.reduce((sum, a) => sum + a.risk_score, 0) / agents.length,
      newAgentsAtRisk: newAgentsAtRisk.length,
      experiencedAgentsAtRisk: expAgentsAtRisk.length
    });
  }, [data]);

  if (!data?.agentPredictions) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Advanced Analytics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-3 rounded border">
          <div className="text-sm text-gray-500">High Risk Agents</div>
          <div className="text-2xl font-bold text-red-600">{metrics.highRiskCount}</div>
          <div className="text-xs text-gray-500">
            {((metrics.highRiskCount / metrics.totalAgents) * 100).toFixed(1)}% of total
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded border">
          <div className="text-sm text-gray-500">Medium Risk Agents</div>
          <div className="text-2xl font-bold text-orange-500">{metrics.mediumRiskCount}</div>
          <div className="text-xs text-gray-500">
            {((metrics.mediumRiskCount / metrics.totalAgents) * 100).toFixed(1)}% of total
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded border">
          <div className="text-sm text-gray-500">Low Risk Agents</div>
          <div className="text-2xl font-bold text-green-600">{metrics.lowRiskCount}</div>
          <div className="text-xs text-gray-500">
            {((metrics.lowRiskCount / metrics.totalAgents) * 100).toFixed(1)}% of total
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded border">
          <div className="text-sm text-gray-500">Avg Risk Score</div>
          <div className="text-2xl font-bold text-blue-600">{(metrics.avgRiskScore * 100).toFixed(1)}%</div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Key Insights</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
          <li>
            <span className="font-medium">{metrics.newAgentsAtRisk}</span> new agents (0-3 months) are at risk of going NILL
            {metrics.newAgentsAtRisk > 0 && (
              <span className="text-red-600 ml-1 font-medium">
                - Requires immediate onboarding support
              </span>
            )}
          </li>
          <li>
            <span className="font-medium">{metrics.experiencedAgentsAtRisk}</span> experienced agents (1+ years) are at risk
            {metrics.experiencedAgentsAtRisk > 0 && (
              <span className="text-orange-600 ml-1 font-medium">
                - May indicate burnout or market challenges
              </span>
            )}
          </li>
          <li>
            The highest risk segment is <span className="font-medium">
              {metrics.newAgentsAtRisk > metrics.experiencedAgentsAtRisk ? 'new agents' : 'experienced agents'}
            </span>
          </li>
        </ul>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Recommended Actions</h3>
        <div className="bg-blue-50 p-3 rounded border border-blue-100 text-sm text-blue-800">
          <p className="mb-2">Based on the prediction analysis, we recommend:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Schedule 1:1 coaching for all high-risk agents within the next 7 days</li>
            <li>Implement weekly activity tracking for medium-risk agents</li>
            <li>Consider pairing high-performing agents with those at risk as mentors</li>
            <li>Review the conversion process for agents with poor proposal-to-quotation rates</li>
          </ol>
        </div>
      </div>
    </div>
  );
}