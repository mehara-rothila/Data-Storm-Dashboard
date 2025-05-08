'use client';

import React, { useState } from 'react';

const AgentTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('risk_score');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Sample agent data - in a real implementation, this would come from your model predictions
  const agents = [
    {
      agent_code: 'de9a845f',
      agent_age: 43,
      months_with_company: 24,
      unique_proposal: 17,
      unique_quotations: 14,
      risk_score: 0.87,
      predicted_nill: 1,
      risk_category: 'High',
      top_factors: ['Low activity', 'Poor conversion', 'Recent NILL streak']
    },
    {
      agent_code: '1450745b',
      agent_age: 32,
      months_with_company: 12,
      unique_proposal: 13,
      unique_quotations: 12,
      risk_score: 0.35,
      predicted_nill: 0,
      risk_category: 'Low',
      top_factors: ['Consistent performance', 'Good proposal rate']
    },
    {
      agent_code: '5c4dd08c',
      agent_age: 52,
      months_with_company: 36,
      unique_proposal: 27,
      unique_quotations: 21,
      risk_score: 0.22,
      predicted_nill: 0,
      risk_category: 'Low',
      top_factors: ['High activity', 'Good conversion', 'Experience']
    },
    {
      agent_code: '3c7a8b50',
      agent_age: 21,
      months_with_company: 6,
      unique_proposal: 26,
      unique_quotations: 15,
      risk_score: 0.64,
      predicted_nill: 1,
      risk_category: 'Medium',
      top_factors: ['Young agent', 'Poor conversion ratio']
    },
    {
      agent_code: '3dd0c2a1',
      agent_age: 33,
      months_with_company: 8,
      unique_proposal: 8,
      unique_quotations: 14,
      risk_score: 0.55,
      predicted_nill: 0,
      risk_category: 'Medium',
      top_factors: ['Low proposal count', 'Good conversion']
    },
    {
      agent_code: 'c698da4c',
      agent_age: 39,
      months_with_company: 10,
      unique_proposal: 10,
      unique_quotations: 10,
      risk_score: 0.72,
      predicted_nill: 1,
      risk_category: 'High',
      top_factors: ['Low overall activity', 'Declining trend']
    },
    {
      agent_code: '89a8cb39',
      agent_age: 42,
      months_with_company: 48,
      unique_proposal: 24,
      unique_quotations: 23,
      risk_score: 0.18,
      predicted_nill: 0,
      risk_category: 'Low',
      top_factors: ['Experienced', 'High activity', 'Good conversion']
    },
    {
      agent_code: '1de378ca',
      agent_age: 55,
      months_with_company: 18,
      unique_proposal: 20,
      unique_quotations: 17,
      risk_score: 0.42,
      predicted_nill: 0,
      risk_category: 'Medium',
      top_factors: ['Moderate activity', 'Recent improvement']
    },
  ];
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };
  
  // Filter agents by search term
  const filteredAgents = agents.filter((agent) => {
    return agent.agent_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
           agent.risk_category.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Sort agents by selected column
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    } else {
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    }
  });
  
  const getRecommendation = (agent) => {
    if (agent.risk_category === 'High') {
      return 'Immediate intervention required. Schedule meeting to review activity patterns and conversion rates. Provide daily activity targets.';
    } else if (agent.risk_category === 'Medium') {
      return 'Monitor closely. Recommend targeted training on improving weak areas. Weekly check-ins to track progress.';
    } else {
      return 'Maintain current performance. Consider as potential mentor for high-risk agents. Recognize achievements.';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Agent Predictions and Recommendations</h2>
        
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by agent code or risk level..."
            value={searchTerm}
            onChange={handleSearch}
            style={styles.searchInput}
          />
        </div>
      </div>
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th} onClick={() => handleSort('agent_code')}>
                Agent Code
                {sortColumn === 'agent_code' && (
                  <span style={styles.sortIcon}>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th style={styles.th} onClick={() => handleSort('agent_age')}>
                Age
                {sortColumn === 'agent_age' && (
                  <span style={styles.sortIcon}>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th style={styles.th} onClick={() => handleSort('months_with_company')}>
                Exp. (Months)
                {sortColumn === 'months_with_company' && (
                  <span style={styles.sortIcon}>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th style={styles.th} onClick={() => handleSort('unique_proposal')}>
                Proposals
                {sortColumn === 'unique_proposal' && (
                  <span style={styles.sortIcon}>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th style={styles.th} onClick={() => handleSort('unique_quotations')}>
                Quotations
                {sortColumn === 'unique_quotations' && (
                  <span style={styles.sortIcon}>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th style={styles.th} onClick={() => handleSort('risk_score')}>
                Risk Score
                {sortColumn === 'risk_score' && (
                  <span style={styles.sortIcon}>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th style={styles.th} onClick={() => handleSort('predicted_nill')}>
                Prediction
                {sortColumn === 'predicted_nill' && (
                  <span style={styles.sortIcon}>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th style={styles.th} onClick={() => handleSort('risk_category')}>
                Risk Level
                {sortColumn === 'risk_category' && (
                  <span style={styles.sortIcon}>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAgents.map((agent) => (
              <tr key={agent.agent_code} style={styles.tr}>
                <td style={styles.td}>{agent.agent_code}</td>
                <td style={styles.td}>{agent.agent_age}</td>
                <td style={styles.td}>{agent.months_with_company}</td>
                <td style={styles.td}>{agent.unique_proposal}</td>
                <td style={styles.td}>{agent.unique_quotations}</td>
                <td style={{
                  ...styles.td,
                  fontWeight: 600,
                  color: agent.risk_score > 0.7 ? '#dc3545' : agent.risk_score > 0.4 ? '#fd7e14' : '#28a745'
                }}>
                  {agent.risk_score.toFixed(2)}
                </td>
                <td style={{
                  ...styles.td,
                  fontWeight: 600,
                  color: agent.predicted_nill === 1 ? '#dc3545' : '#28a745'
                }}>
                  {agent.predicted_nill === 1 ? 'NILL' : 'Non-NILL'}
                </td>
                <td style={{
                  ...styles.td,
                  fontWeight: 600,
                  color: agent.risk_category === 'High' ? '#dc3545' : agent.risk_category === 'Medium' ? '#fd7e14' : '#28a745'
                }}>
                  {agent.risk_category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={styles.detailedView}>
        <h3 style={styles.detailTitle}>Personalized Action Plans</h3>
        
        {sortedAgents.map((agent) => (
          <div key={`detail-${agent.agent_code}`} style={styles.agentDetail}>
            <div style={styles.agentDetailHeader}>
              <h4 style={styles.agentCode}>Agent: {agent.agent_code}</h4>
              <span style={{
                ...styles.riskBadge,
                backgroundColor: agent.risk_category === 'High' ? '#dc3545' : agent.risk_category === 'Medium' ? '#fd7e14' : '#28a745'
              }}>
                {agent.risk_category} Risk
              </span>
            </div>
            
            <div style={styles.agentFactors}>
              <h5 style={styles.factorsTitle}>Key Factors:</h5>
              <ul style={styles.factorsList}>
                {agent.top_factors.map((factor, index) => (
                  <li key={index} style={styles.factorItem}>{factor}</li>
                ))}
              </ul>
            </div>
            
            <div style={styles.recommendation}>
              <h5 style={styles.recommendationTitle}>Recommended Action:</h5>
              <p style={styles.recommendationText}>{getRecommendation(agent)}</p>
            </div>
          </div>
        ))}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    color: '#333',
  },
  searchContainer: {
    flexBasis: '300px',
  },
  searchInput: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    border: '1px solid #dee2e6',
    fontSize: '0.875rem',
  },
  tableContainer: {
    overflowX: 'auto',
    marginBottom: '1.5rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
  },
  th: {
    padding: '0.75rem',
    borderBottom: '2px solid #dee2e6',
    textAlign: 'left',
    fontWeight: 600,
    color: '#495057',
    cursor: 'pointer',
  },
  sortIcon: {
    marginLeft: '0.25rem',
  },
  tr: {
    borderBottom: '1px solid #dee2e6',
  },
  td: {
    padding: '0.75rem',
    color: '#495057',
  },
  detailedView: {
    marginTop: '1.5rem',
  },
  detailTitle: {
    fontSize: '1.125rem',
    marginBottom: '1rem',
    color: '#333',
  },
  agentDetail: {
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '0.25rem',
    border: '1px solid #dee2e6',
  },
  agentDetailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  agentCode: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
    color: '#343a40',
  },
  riskBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'white',
  },
  agentFactors: {
    marginBottom: '0.75rem',
  },
  factorsTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#495057',
  },
  factorsList: {
    margin: 0,
    paddingLeft: '1.5rem',
  },
  factorItem: {
    marginBottom: '0.25rem',
    fontSize: '0.875rem',
    color: '#495057',
  },
  recommendation: {
    backgroundColor: 'white',
    padding: '0.75rem',
    borderRadius: '0.25rem',
    border: '1px solid #dee2e6',
  },
  recommendationTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#495057',
  },
  recommendationText: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#495057',
    lineHeight: 1.5,
  },
};

export default AgentTable;