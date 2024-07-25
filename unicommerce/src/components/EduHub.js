// eduHub.js
import React from 'react';
import './EduHub.css'; // Ensure this file exists for styling


function EducationHub() {
    return (
      <div className="education-hub-container">
        <h2>Education Hub</h2>
        <div className="iframe-wrapper">
          <iframe
            src="https://www.openlearning.com/malaysiamoocs/"
            title="Education Hub"
            allowFullScreen
          />
        </div>
      </div>
    );
  }
  

export default EducationHub;
