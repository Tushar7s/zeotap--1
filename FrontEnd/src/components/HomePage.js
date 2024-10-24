import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/homepage.css'
const HomePage = () => {
  return (
    <div className="front-page">
      <header className="hero-section">
        <div className="container">
          <h1 className="fade-in">Build & Evaluate Rules Dynamically</h1>
          <p className="fade-in">Design custom rules based on user attributes like age, department, income, and more.</p>
          <div className="cta-buttons fade-in">
            <Link to="/eligibility" className="btn primary-btn">Check Eligibility</Link>
            <Link to="/addrule" className="btn primary-btn">Create Rules</Link>
            <Link to="/combinerules" className='btn primary-btn'>Combine Rules</Link>
            <Link to="/rules" className='btn primary-btn'>Manage rules</Link>
          </div>
        </div>
      </header>

      <section className="info-section">
        <div className="container fade-in">
          <h2>What Can You Do?</h2>
          <div className="info-cards">
            <div className="card">
              <h3>Create Dynamic Rules</h3>
              <p>Set conditions and rules based on real-time data with our intuitive rule creation engine.</p>
            </div>
            <div className="card">
              <h3>Evaluate User Data</h3>
              <p>Run user attributes through the rule engine to determine eligibility or outcomes efficiently.</p>
            </div>
            <div className="card">
              <h3>Monitor & Adjust</h3>
              <p>Modify, track, and adjust rules dynamically to ensure compliance with changing policies or user data.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="container fade-in">
          <h2>How Does It Work?</h2>
          <div className="steps">
            <div className="step">
              <h3>Step 1: Define Rules</h3>
              <p>Set up your conditions and define the rules using our Abstract Syntax Tree-based engine.</p>
            </div>
            <div className="step">
              <h3>Step 2: Test & Validate</h3>
              <p>Run tests to ensure the rules are working correctly against sample or real user data.</p>
            </div>
            <div className="step">
              <h3>Step 3: Deploy</h3>
              <p>Activate your rules and let the engine evaluate and automate decision-making processes.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer fade-in">
        <p>&copy; 2024 Rule Engine. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
