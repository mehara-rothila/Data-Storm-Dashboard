'use client';

export default function ModelSelector({ models, selectedModel, onSelectModel, isDisabled }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Model</h2>
      
      <div className="space-y-2">
        {models.map((model) => (
          <div
            key={model.id}
            className={`p-3 rounded-md cursor-pointer transition-all duration-200 border ${
              isDisabled ? 'opacity-70 cursor-not-allowed' : ''
            } ${
              selectedModel === model.id
                ? 'bg-green-50 border-green-500 shadow-sm'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (!isDisabled) {
                onSelectModel(model.id);
              }
            }}
          >
            <h3 className={`font-medium ${selectedModel === model.id ? 'text-green-800' : 'text-gray-800'}`}>
              {model.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{model.filename}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-green-50 rounded-md text-sm text-green-700 border border-green-100">
        {selectedModel === 'championship' && (
          <p>This model uses SMOTE to handle class imbalance and Optuna for hyperparameter optimization.</p>
        )}
        
        {selectedModel === 'ceiling-breaker' && (
          <p>This model features a two-stage prediction approach with special handling for agents with fluctuating patterns.</p>
        )}
        
        {selectedModel === 'ultra-optimized' && (
          <p>This model uses a 70/30 CatBoost/XGB ensemble with segment-specific prediction thresholds.</p>
        )}
      </div>
    </div>
  );
}