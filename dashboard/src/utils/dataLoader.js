import Papa from 'papaparse';

export const loadDefaultDatasets = async () => {
  try {
    // Load training data
    const trainResponse = await fetch('/dataset/train_storming_round.csv');
    const trainCsvText = await trainResponse.text();
    const trainData = Papa.parse(trainCsvText, { header: true, dynamicTyping: true });
    
    // Load test data
    const testResponse = await fetch('/dataset/test_storming_round.csv');
    const testCsvText = await testResponse.text();
    const testData = Papa.parse(testCsvText, { header: true, dynamicTyping: true });
    
    return {
      trainData: trainData.data,
      testData: testData.data,
      error: null
    };
  } catch (error) {
    console.error("Error loading datasets:", error);
    return {
      trainData: null,
      testData: null,
      error: "Failed to load datasets. Please check if the files exist in the public/dataset folder."
    };
  }
};

export const processUploadedCsv = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};