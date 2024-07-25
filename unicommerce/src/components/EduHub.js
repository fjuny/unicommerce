import React, { useEffect } from 'react';
import './EduHub.css'; 

function EducationHub() {
  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.setAttribute('data-use-service-core', 'defer');
    script.async = true;
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="education-hub-container">
      <h2>Education Hub</h2>
      <div className="elfsight-app-1db1286b-194e-4fcd-a49f-b2185f265838" data-elfsight-app-lazy></div>
    </div>
  );
}

export default EducationHub;
