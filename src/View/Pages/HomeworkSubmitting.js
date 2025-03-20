import React, { useState } from 'react';
import './HomeworkSubmitting.css';

const HomeworkSubmitting = () => {
  const [partnerIds, setPartnerIds] = useState(['']);
  const [homeworkName, setHomeworkName] = useState('');
  const [studentMessage, setStudentMessage] = useState('');
  const [declaration, setDeclaration] = useState('');
  const [files, setFiles] = useState(null);

  // Handle file/folder selection
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // Handle partner id change
  const handlePartnerChange = (index, value) => {
    const newPartnerIds = [...partnerIds];
    newPartnerIds[index] = value;
    setPartnerIds(newPartnerIds);
  };

  // Add another partner input field
  const addPartnerField = () => {
    setPartnerIds([...partnerIds, '']);
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Files:', files);
    console.log('Partner IDs:', partnerIds);
    console.log('Homework Name:', homeworkName);
    console.log('Student Message:', studentMessage);
    console.log('Declaration:', declaration);
    alert('Homework submitted successfully!');
    // You can add further submission logic here (like an API call)
  };

  return (
    <div className="container">
      <header>
        <h1>Submission Homework in Course Python</h1>
      </header>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* File Upload Input */}
        <label htmlFor="homeworkFile">Upload Homework File/Folder:</label>
        <input
          type="file"
          id="homeworkFile"
          name="homeworkFile"
          onChange={handleFileChange}
          // Allows folder selection in supported browsers
          webkitdirectory="true"
          directory=""
          multiple
        />

        {/* Partner IDs */}
        <label>Partner ID(s):</label>
        {partnerIds.map((partnerId, index) => (
          <input
            key={index}
            type="text"
            name="partnerId[]"
            placeholder="Enter partner ID"
            value={partnerId}
            onChange={(e) => handlePartnerChange(index, e.target.value)}
          />
        ))}
        <button type="button" onClick={addPartnerField}>
          Add Partner ID
        </button>

        {/* Homework Name */}
        <label htmlFor="homeworkName">Homework Name:</label>
        <input
          type="text"
          id="homeworkName"
          name="homeworkName"
          placeholder="Enter homework name"
          value={homeworkName}
          onChange={(e) => setHomeworkName(e.target.value)}
        />

        {/* Message to Homework Checker */}
        <label htmlFor="studentMessage">Message to Homework Checker:</label>
        <textarea
          id="studentMessage"
          name="studentMessage"
          placeholder="Enter any message for the homework checker"
          value={studentMessage}
          onChange={(e) => setStudentMessage(e.target.value)}
        />

        {/* Declaration Summary and Yes/No options */}
        <p>
          If I put it "yes" then I declare that I did not use any help tools like
          AI.
        </p>
        <label>Declaration:</label>
        <label>
          <input
            type="radio"
            name="declaration"
            value="yes"
            checked={declaration === 'yes'}
            onChange={() => setDeclaration('yes')}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="declaration"
            value="no"
            checked={declaration === 'no'}
            onChange={() => setDeclaration('no')}
          />
          No
        </label>

        {/* Submit Button */}
        <button type="submit">Submit Homework</button>
      </form>
    </div>
  );
};

export default HomeworkSubmitting;  