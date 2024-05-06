import React, { useState } from 'react';
import 'jspdf-autotable';
import './FormPDFGenerator.css';


const FormPDFGenerator = () => {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [submitted, setSubmitted] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
  };

  const generatePDF = async () => {
    const backendUrl = 'http://localhost:3001'; 
  
    const response = await fetch(`${backendUrl}/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        course,
        currentDate,
        feeStructure: [
          ['year', 'One time fee', 'Tuition fee'],
          ['1', course === 'B.Tech' ? '500' : '600', course === 'B.Tech' ? '160' : '260'],
          ['2', '-', course === 'B.Tech' ? '160' : '260'],
        ],
      }),
    });
  
    if (response.ok) {
      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    } else {
      console.error('Failed to generate PDF');
    }
  };
  

  const handleGeneratePDF = () => {
    if (name && course) {
      setSubmitted(true);
      generatePDF();
    } else {
      alert('Please provide Name and Course.');
    }
  };

  return (
    <div className="pdf-generator-container">
      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        className="input-field"
      />
      <label>Course:</label>
      <select
        value={course}
        onChange={handleCourseChange}
        className="input-field"
      >
        <option value="">Select</option>
        <option value="B.Tech">B.Tech</option>
        <option value="M.Tech">M.Tech</option>
      </select>
      <div className="buttons-container">
        <button
          onClick={handleGeneratePDF}
          disabled={!name || !course || submitted}
          className="submit-button"
        >
          {submitted ? 'Submitted' : 'Submit'}
        </button>
        <button
          onClick={generatePDF}
          disabled={!submitted}
          className="generate-pdf-button"
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
};

export default FormPDFGenerator;
