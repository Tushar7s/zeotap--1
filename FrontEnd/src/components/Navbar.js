import React, { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">Rule Engine</div>

        <div className="hamburger" onClick={toggleSidebar}>
          &#9776; {/* Hamburger icon */}
        </div>


        
      </nav>
    </>
  );
}

export default Navbar;
