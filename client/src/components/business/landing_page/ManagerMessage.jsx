import React from 'react';

const ManagerMessage = ({ isSmallScreen, courses }) => {
  return (
    <div style={{ maxWidth: '450px', padding: '0 20px' }}>
      <div>
        <h3 style={{ color: '#000', marginBottom: '10px' }}>Certified IT Training Courses</h3>
        <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.6' }}>
          {courses.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p style={{ fontWeight: 'bold', color: '#333', marginTop: '10px' }}>
          All courses come with certification upon completion.
        </p>
      </div>
    </div>
  );
};

export default ManagerMessage;
