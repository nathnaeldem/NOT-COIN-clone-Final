import React from 'react';
import './Admin.css';
import admin from '../images/admin.jpeg';

const Admin = () => {
  // Get the current day of the week (0 = Sunday, 6 = Saturday)
  const today = new Date().getDay();
  const isSaturday = today === 6;

  // Render the content only if today is Saturday
  if (!isSaturday) {
    return <div className="absolute inset-0 h-1/2 fullHeightContainer z-0">
    <div>
      <div className="post-container" style={{ justifyContent: 'center', marginTop: '35px', lineHeight: '1.2' }}>
        <img src={admin} alt="Profile Picture" className="profile-pic" />
        <div className="username">Mr_x</div>
        <div className="date">@admin</div>
        <div className="content">
          <h2 style={{ color: '#b0c710', marginBottom: '6px', marginTop: '19px', fontWeight: 'bold' }}>Be our weekly winner</h2>
          <p>Invite people and maximize your score to stand for a chance to win 5000NOT_COIN.</p>
          <div className="date">12:00 PM · Jul 22, 2024</div>
        </div>
      </div>
    </div>
  </div>;
  }

  return (
    <div className="absolute inset-0 h-1/2 fullHeightContainer z-0">
      <div>
        <div className="post-container" style={{ justifyContent: 'center', marginTop: '35px', lineHeight: '1.2' }}>
          <img src={admin} alt="Profile Picture" className="profile-pic" />
          <div className="username">Mr_x</div>
          <div className="date">@admin</div>
          <div className="content">
            <h2 style={{ color: '#b0c710', marginBottom: '6px', marginTop: '19px', fontWeight: 'bold' }}>Weekly winner</h2>
            <p>Our Weekly winner is @abig** <strong>SCORE:5,800,000 + invited 50 people REWARD: 5000NOT_COIN</strong></p>
            <div className="date">01:09 PM · Aug 3, 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
