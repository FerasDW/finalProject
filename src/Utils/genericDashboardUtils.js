export const getPrimaryOptions = (data, primaryFilter) => {
  if (!data) return ["All"];
  try {
    const values = Array.from(new Set(data.map((item) => item[primaryFilter]))).filter(Boolean).sort();
    return ["All", ...values];
  } catch (error) {
    return ["All"];
  }
};

export const getFilterOptions = (fieldName, data) => {
  if (!data) return [];
  try {
    return Array.from(new Set(data.map((item) => item[fieldName]))).filter(Boolean).sort();
  } catch (error) {
    return [];
  }
};