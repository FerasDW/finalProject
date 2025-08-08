// api/genericDashboardAPI.js (CORRECTED)
// Base API URL - replace with your actual API endpoint
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jsonplaceholder.typicode.com';

// API endpoints configuration
const endpoints = {
  students: `${API_BASE_URL}/users`,
  lecturers: `${API_BASE_URL}/posts`
};

// Helper function to get auth token (implement based on your auth system)
const getAuthToken = () => {
  // Replace with your actual token retrieval logic
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Helper function to build headers
const buildHeaders = (contentType = 'application/json') => {
  const headers = {
    'Content-Type': contentType,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response, entityType, operation) => {
  if (!response.ok) {
    let errorMessage;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    
    throw new Error(`${operation} ${entityType} failed: ${errorMessage}`);
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Invalid JSON response for ${operation} ${entityType}`);
  }
};

/**
 * Get data for specific entity type
 */
export const getData = async (entityType) => {
  if (!entityType || !endpoints[entityType]) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  try {
    const response = await fetch(endpoints[entityType], {
      method: 'GET',
      headers: buildHeaders(),
    });
    
    const data = await handleResponse(response, entityType, 'Fetch');
    
    // Ensure we return an array
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
      // Handle cases where API returns { data: [...], meta: {...} }
      return data.data;
    } else if (data && typeof data === 'object' && Array.isArray(data.results)) {
      // Handle cases where API returns { results: [...], pagination: {...} }
      return data.results;
    } else {
      console.warn(`Unexpected data format from ${entityType} API:`, data);
      return [];
    }
    
  } catch (error) {
    console.error(`Error fetching ${entityType}:`, error);
    throw new Error(`Failed to load ${entityType} data: ${error.message}`);
  }
};

/**
 * Create a new record
 */
export const createRecord = async (entityType, recordData) => {
  if (!entityType || !endpoints[entityType]) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  if (!recordData || typeof recordData !== 'object') {
    throw new Error('Invalid record data provided');
  }

  try {
    const response = await fetch(endpoints[entityType], {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(recordData),
    });

    const data = await handleResponse(response, entityType, 'Create');
    
    // Return the created record
    if (data && typeof data === 'object') {
      return data;
    } else {
      throw new Error('Invalid response format from create operation');
    }
    
  } catch (error) {
    console.error(`Error creating ${entityType.slice(0, -1)}:`, error);
    throw new Error(`Failed to create ${entityType.slice(0, -1)}: ${error.message}`);
  }
};

/**
 * Update an existing record
 */
export const updateRecord = async (entityType, id, recordData) => {
  if (!entityType || !endpoints[entityType]) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  if (!id || (!Number.isInteger(id) && typeof id !== 'string')) {
    throw new Error('Invalid record ID provided');
  }

  if (!recordData || typeof recordData !== 'object') {
    throw new Error('Invalid record data provided');
  }

  try {
    const response = await fetch(`${endpoints[entityType]}/${id}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(recordData),
    });

    const data = await handleResponse(response, entityType, 'Update');
    return data;
    
  } catch (error) {
    console.error(`Error updating ${entityType.slice(0, -1)}:`, error);
    throw new Error(`Failed to update ${entityType.slice(0, -1)}: ${error.message}`);
  }
};

/**
 * Delete a record
 */
export const deleteRecord = async (entityType, id) => {
  if (!entityType || !endpoints[entityType]) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  if (!id || (!Number.isInteger(id) && typeof id !== 'string')) {
    throw new Error('Invalid record ID provided');
  }

  try {
    const response = await fetch(`${endpoints[entityType]}/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });

    // For DELETE, we might get 204 No Content, which is valid
    if (response.status === 204) {
      return { success: true, id };
    }

    const data = await handleResponse(response, entityType, 'Delete');
    return data;
    
  } catch (error) {
    console.error(`Error deleting ${entityType.slice(0, -1)}:`, error);
    throw new Error(`Failed to delete ${entityType.slice(0, -1)}: ${error.message}`);
  }
};

/**
 * Get a single record by ID
 */
export const getRecord = async (entityType, id) => {
  if (!entityType || !endpoints[entityType]) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  if (!id || (!Number.isInteger(id) && typeof id !== 'string')) {
    throw new Error('Invalid record ID provided');
  }

  try {
    const response = await fetch(`${endpoints[entityType]}/${id}`, {
      method: 'GET',
      headers: buildHeaders(),
    });
    
    const data = await handleResponse(response, entityType, 'Fetch');
    return data;
    
  } catch (error) {
    console.error(`Error fetching ${entityType.slice(0, -1)}:`, error);
    throw new Error(`Failed to load ${entityType.slice(0, -1)}: ${error.message}`);
  }
};

/**
 * Search records with filters
 */
export const searchRecords = async (entityType, filters = {}) => {
  if (!entityType || !endpoints[entityType]) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  try {
    const queryParams = new URLSearchParams();
    
    // Add filters as query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== 'all' && value !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `${endpoints[entityType]}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(),
    });
    
    const data = await handleResponse(response, entityType, 'Search');
    
    // Ensure we return an array (same logic as getData)
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
      return data.data;
    } else if (data && typeof data === 'object' && Array.isArray(data.results)) {
      return data.results;
    } else {
      return [];
    }
    
  } catch (error) {
    console.error(`Error searching ${entityType}:`, error);
    throw new Error(`Failed to search ${entityType}: ${error.message}`);
  }
};

/**
 * Batch delete operations
 */
export const batchDelete = async (entityType, ids) => {
  if (!entityType || !endpoints[entityType]) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error('Invalid IDs array provided');
  }

  try {
    const response = await fetch(`${endpoints[entityType]}/batch`, {
      method: 'DELETE',
      headers: buildHeaders(),
      body: JSON.stringify({ ids }),
    });

    const data = await handleResponse(response, entityType, 'Batch delete');
    return data;
    
  } catch (error) {
    console.error(`Error batch deleting ${entityType}:`, error);
    throw new Error(`Failed to batch delete ${entityType}: ${error.message}`);
  }
};

/**
 * Get entity statistics
 */
export const getStats = async (entityType) => {
  if (!entityType || !endpoints[entityType]) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  try {
    const response = await fetch(`${endpoints[entityType]}/stats`, {
      method: 'GET',
      headers: buildHeaders(),
    });
    
    const data = await handleResponse(response, entityType, 'Fetch stats');
    return data;
    
  } catch (error) {
    console.error(`Error fetching ${entityType} stats:`, error);
    throw new Error(`Failed to load ${entityType} statistics: ${error.message}`);
  }
};