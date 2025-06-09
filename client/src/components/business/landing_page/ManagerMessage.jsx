import React from 'react';

const ManagerMessage = ({ isSmallScreen, services, courses, introTitle, introSubtitle, introText }) => {
  return (
    <div style={{ maxWidth: '450px',  padding: '0 20px' }}>
      <h2
        style={{
          textAlign: 'left',
          fontSize: isSmallScreen ? '1.2rem' : '1.6rem',
          color: 'rgb(141 138 138)',
          marginBottom: '10px',
        }}
      >
        {introTitle}
      </h2>

      <h1
        style={{
          textAlign: 'left',
          fontSize: isSmallScreen ? '1.6rem' : '2.4rem',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '20px',
        }}
      >
        {introSubtitle}
      </h1>

      <p
        style={{
          fontSize: isSmallScreen ? '1rem' : '1.2rem',
          lineHeight: '1.7',
          color: '#444',
          marginBottom: '30px',
        }}
      >
        {introText}
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        <div>
          <h3 style={{ color: '#000', marginBottom: '10px' }}>Our Services</h3>
          <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.6' }}>
            {services.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

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
    </div>
  );
};

export default ManagerMessage;
