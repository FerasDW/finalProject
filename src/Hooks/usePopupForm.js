// hooks/useGenericDashboardPopup.js (CORRECTED)
import { useState, useCallback } from 'react';
import * as genericDashboardAPI from "../Api/GenericDashboard";

export const useGenericDashboardPopup = (entityType, onSuccess) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleAddRecord = useCallback(() => {
    console.log('📝 Opening add record form for:', entityType);
    setIsPopupOpen(true);
    setFormError(null);
  }, [entityType]);

  const handleFormSubmit = useCallback(async (formData) => {
    if (!formData || typeof formData !== 'object') {
      setFormError('Invalid form data');
      return;
    }

    console.log('💾 Form submitted with data:', formData);
    setIsFormLoading(true);
    setFormError(null);
    
    try {
      // Validate required fields based on entity type
      const requiredFields = ['name', 'email'];
      const missingFields = requiredFields.filter(field => !formData[field]?.trim());
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Create the record via API
      const newRecord = await genericDashboardAPI.createRecord(entityType, formData);
      
      if (!newRecord) {
        throw new Error('Failed to create record - no response from server');
      }

      console.log('✅ New record created:', newRecord);
      
      // Close popup and call success callback
      setIsPopupOpen(false);
      
      // Call success callback if provided
      if (typeof onSuccess === 'function') {
        onSuccess(newRecord);
      }
      
      // Show success message
      const entityName = entityType.slice(0, -1); // Remove 's' from plural
      alert(`${entityName.charAt(0).toUpperCase() + entityName.slice(1)} added successfully!`);
      
    } catch (error) {
      console.error('❌ Form submission error:', error);
      
      // Set user-friendly error message
      const errorMessage = error.message || `Failed to create ${entityType.slice(0, -1)}`;
      setFormError(errorMessage);
      
      // Don't close popup on error so user can retry
    } finally {
      setIsFormLoading(false);
    }
  }, [entityType, onSuccess]);

  const handleFormCancel = useCallback(() => {
    console.log('❌ Form cancelled');
    setIsPopupOpen(false);
    setFormError(null);
    // Clear any form loading state
    setIsFormLoading(false);
  }, []);

  // Clear error when popup opens
  const clearError = useCallback(() => {
    setFormError(null);
  }, []);

  return {
    isPopupOpen,
    isFormLoading,
    formError,
    handleAddRecord,
    handleFormSubmit,
    handleFormCancel,
    clearError
  };
};