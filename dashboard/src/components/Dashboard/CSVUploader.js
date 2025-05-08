'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';

export default function CSVUploader({ onUpload, isLoading }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };
  
  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };
  
  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setUploadStatus('Please select a valid CSV file');
      return;
    }
    
    setFile(selectedFile);
    setUploadStatus(`Selected: ${selectedFile.name}`);
    
    // Parse the CSV file
    Papa.parse(selectedFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn("CSV parsing had errors:", results.errors);
          setUploadStatus(`Warning: CSV had ${results.errors.length} parsing issues.`);
        }
        
        if (results.data && results.data.length > 0) {
          onUpload(results.data);
          setUploadStatus(`Processed ${results.data.length} rows from ${selectedFile.name}`);
        } else {
          setUploadStatus('Error: No valid data found in the CSV file');
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setUploadStatus(`Error parsing CSV: ${error.message}`);
      }
    });
  };
  
  const activateFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Upload CSV</h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={!isLoading ? handleDragOver : undefined}
        onDragLeave={!isLoading ? handleDragLeave : undefined}
        onDrop={!isLoading ? handleDrop : undefined}
        onClick={!isLoading ? activateFileInput : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileInput}
          disabled={isLoading}
        />
        
        {file ? (
          <div className="py-2">
            <p className="font-medium text-gray-800">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="py-4">
            <svg 
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
            <p className="mt-1 text-sm text-gray-500">
              {isLoading ? 'Processing...' : 'Drag and drop or click to upload CSV'}
            </p>
          </div>
        )}
      </div>
      
      {uploadStatus && (
        <div className="text-sm text-gray-600 mt-2">
          {uploadStatus}
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        <p>Upload test data to analyze which agents are at risk of going NILL in the next month.</p>
      </div>
    </div>
  );
}