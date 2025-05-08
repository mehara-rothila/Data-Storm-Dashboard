'use client';

export default function PerformanceMetrics({ metrics }) {
  if (!metrics) return null;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard 
        title="Accuracy" 
        value={metrics.accuracy} 
        isPercentage={true}
        description="Overall prediction accuracy"
        trend={metrics.accuracyTrend}
        color="indigo"
      />
      
      <MetricCard 
        title="Precision" 
        value={metrics.precision} 
        isPercentage={true}
        description="Precision for non-NILL predictions"
        trend={metrics.precisionTrend}
        color="blue"
      />
      
      <MetricCard 
        title="Recall" 
        value={metrics.recall} 
        isPercentage={true}
        description="Recall for non-NILL predictions"
        trend={metrics.recallTrend}
        color="teal"
      />
      
      <MetricCard 
        title="F1 Score" 
        value={metrics.f1Score} 
        isPercentage={true}
        description="Harmonic mean of precision and recall"
        color="cyan"
      />
    </div>
  );
}

function MetricCard({ title, value, isPercentage = false, description, trend, color = 'indigo' }) {
  const colorClasses = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' }
  };
  
  const selectedColor = colorClasses[color] || colorClasses.indigo;
  
  return (
    <div className={`p-4 rounded-lg shadow-sm ${selectedColor.bg} border ${selectedColor.border}`}>
      <div className="flex justify-between items-start">
        <h3 className={`text-sm font-medium ${selectedColor.text}`}>{title}</h3>
        
        {trend && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            trend.positive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <svg 
              className={`-ml-0.5 mr-1 h-2 w-2 ${
                trend.positive ? 'text-green-500' : 'text-red-500'
              }`}
              fill="currentColor" 
              viewBox="0 0 8 8"
            >
              <path 
                fillRule="evenodd" 
                d={trend.direction === 'up' 
                  ? "M0 4l4-4 4 4H0z" 
                  : "M0 0h8v8L4 4 0 0z"
                } 
              />
            </svg>
            {trend.value}
          </span>
        )}
      </div>
      
      <div className="mt-3 mb-1">
        <p className="text-2xl font-bold text-gray-900">
          {isPercentage ? `${(value * 100).toFixed(1)}%` : value}
        </p>
      </div>
      
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}