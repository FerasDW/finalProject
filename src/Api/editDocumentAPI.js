// Api/editDocumentAPI.js - Complete fixed version for React with jsPDF

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://13.61.114.153:8082';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem("jwtToken");
};

// Helper function to get authorization headers
const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create axios config with auth headers
const createAuthConfig = (additionalConfig = {}) => {
  return {
    ...additionalConfig,
    headers: {
      ...getAuthHeaders(),
      ...additionalConfig.headers
    }
  };
};

// Upload file with better error handling and timeout
export const uploadFile = async (categoryId, file) => {
  try {
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File is too large. Maximum size is 10MB.');
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${BASE_URL}/api/files/upload/${categoryId}`, formData, createAuthConfig({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }));

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

// Upload document as PDF using jsPDF - React version
export const uploadDocumentAsPDF = async (categoryId, htmlContent, fileName) => {
  try {
    const pdfBlob = await generatePDFWithJsPDF(htmlContent, fileName);
    const pdfFile = new File([pdfBlob], `${fileName}.pdf`, {
      type: 'application/pdf'
    });
    return await uploadFile(categoryId, pdfFile);
  } catch (error) {
    console.error("Error uploading document as PDF:", error);
    throw new Error(`Failed to upload document as PDF: ${error.message}`);
  }
};

const generatePDFWithJsPDF = async (htmlContent, fileName) => {
  return new Promise((resolve, reject) => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16,
        compress: true
      });

      const cleanedHTML = cleanHTMLForPDF(htmlContent);

      const container = document.createElement('div');
      container.innerHTML = `
        <div style="
          width: 180mm;
          padding: 5mm;
          margin: 0;
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #000;
          background: #fff;
          box-sizing: border-box;
        ">
          <div style="
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #6366f1;
          ">
            <h1 style="
              font-size: 16px;
              font-weight: bold;
              color: #6366f1;
              margin: 0 0 5px 0;
            ">${fileName}</h1>
            <p style="
              font-size: 10px;
              color: #666;
              margin: 0;
            ">${new Date().toLocaleDateString()}</p>
          </div>
          <div style="
            word-wrap: break-word;
            overflow-wrap: break-word;
          ">
            ${cleanedHTML}
          </div>
        </div>
      `;

      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.background = '#fff';
      container.style.width = '190mm';

      document.body.appendChild(container);

      html2canvas(container, {
        scale: 1.5,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 680,
        height: 900,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        imageTimeout: 15000
      }).then(canvas => {
        document.body.removeChild(container);

        const imgData = canvas.toDataURL('image/jpeg', 0.7);
        const imgWidth = 190;
        const pageHeight = 277;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 10, position + 10, imgWidth, imgHeight, undefined, 'MEDIUM');
        heightLeft -= pageHeight;

        let pageCount = 1;
        while (heightLeft >= 0 && pageCount < 5) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 10, position + 10, imgWidth, imgHeight, undefined, 'MEDIUM');
          heightLeft -= pageHeight;
          pageCount++;
        }

        const pdfBlob = pdf.output('blob');

        if (pdfBlob.size > 8 * 1024 * 1024) {
          reject(new Error('Generated PDF is too large. Please reduce content or try HTML format.'));
          return;
        }

        resolve(pdfBlob);
      }).catch(error => {
        document.body.removeChild(container);
        reject(new Error('Failed to generate PDF: ' + error.message));
      });

    } catch (error) {
      reject(new Error('PDF generation failed: ' + error.message));
    }
  });
};

const cleanHTMLForPDF = (htmlContent) => {
  return htmlContent
    .replace(/contenteditable="true"/g, '')
    .replace(/class="editableTable"/g, 'style="border-collapse: collapse; width: 100%; margin: 10px 0; border: 1px solid #ddd;"')
    .replace(/class="editableImage"/g, 'style="max-width: 100%; height: auto; border: none;"')
    .replace(/style="[^"]*outline[^"]*"/g, '')
    .replace(/style="[^"]*border:\s*[^"]*solid[^"]*#6366f1[^"]*"/g, 'style="border: 1px solid #ddd;"')
    .replace(/<table[^>]*>/g, '<table style="border-collapse: collapse; width: 100%; margin: 10px 0; border: 1px solid #ddd;">')
    .replace(/<th[^>]*>/g, '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f8f9fa; font-weight: bold;">')
    .replace(/<td[^>]*>/g, '<td style="border: 1px solid #ddd; padding: 8px;">');
};

export const uploadDocumentAsSimplePDF = async (categoryId, htmlContent, fileName) => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.innerText || tempDiv.textContent || '';

    pdf.setFontSize(16);
    pdf.text(fileName, 20, 20);

    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);

    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(textContent, 170);
    pdf.text(lines, 20, 45);

    const pdfBlob = pdf.output('blob');

    const pdfFile = new File([pdfBlob], `${fileName}.pdf`, {
      type: 'application/pdf'
    });

    return await uploadFile(categoryId, pdfFile);
  } catch (error) {
    console.error("Error uploading simple PDF:", error);
    throw new Error(`Failed to upload simple PDF: ${error.message}`);
  }
};

export const uploadDocumentAsHTML = async (categoryId, htmlContent, fileName) => {
  try {
    const styledHTML = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      background: #fff;
      color: #333;
    }
    .document-header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid #6366f1;
    }
    .document-title {
      font-size: 24px;
      font-weight: bold;
      color: #6366f1;
      margin: 0 0 10px 0;
    }
    .document-info {
      font-size: 12px;
      color: #666;
      margin: 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
      border: 1px solid #ddd;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: right;
    }
    th {
      background-color: #f8f9fa;
      font-weight: bold;
    }
    img {
      max-width: 100%;
      height: auto;
      border: none !important;
    }
    .editableTable {
      border: 1px solid #ddd !important;
    }
    .editableImage {
      border: none !important;
    }
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="document-header">
    <h1 class="document-title">${fileName}</h1>
    <p class="document-info">נוצר ב-${new Date().toLocaleDateString('he-IL')}</p>
  </div>
  <div class="document-content">
    ${htmlContent}
  </div>
</body>
</html>`;

    const blob = new Blob([styledHTML], { type: 'text/html;charset=utf-8' });
    const file = new File([blob], `${fileName}.html`, { type: 'text/html' });

    return await uploadFile(categoryId, file);
  } catch (error) {
    console.error("Error uploading document as HTML:", error);
    throw new Error(`Failed to upload document as HTML: ${error.message}`);
  }
};

export const getFilesByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/files/by-category/${categoryId}`, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching files by category:", error);
    throw error;
  }
};

export const getFilesByCategorySimple = async (categoryId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/files/by-category/${categoryId}/simple`, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching files by category (simple):", error);
    throw error;
  }
};

export const deleteFile = async (fileId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/files/${fileId}`, createAuthConfig());
    if (response.status === 204) {
      return { success: true };
    }
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const downloadFile = async (fileId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/files/${fileId}/download`, createAuthConfig({
      responseType: 'blob',
    }));
    return response.data;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

export const getFilesCountByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/files/category/${categoryId}/count`, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching file count:", error);
    throw error;
  }
};

export const getCourses = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/courses`, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const getCategoriesByCourse = async (courseId, year = new Date().getFullYear()) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/categories/by-course/${courseId}?year=${year}`, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching categories by course:", error);
    throw error;
  }
};