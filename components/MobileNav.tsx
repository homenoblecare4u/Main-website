'use client';

import { useState, useEffect } from 'react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
    document.body.classList.remove('menu-open');
  };

  const toggleMenu = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('menu-open');
    };
  }, []);

  return (
    <>
      <button
        className="menu"
        type="button"
        aria-expanded={isOpen}
        aria-controls="navlinks"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={toggleMenu}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div className={`navlinks ${isOpen ? 'open' : ''}`} id="navlinks">
        <a href="#services" onClick={closeMenu}>
          Services
        </a>
        <a href="#how" onClick={closeMenu}>
          How it works
        </a>
        <a href="#about" onClick={closeMenu}>
          Why us
        </a>
        <a href="#faq" onClick={closeMenu}>
          FAQs
        </a>
        <a className="btn btn-primary" href="#contact" onClick={closeMenu}>
          Request a callback
        </a>
      </div>
    </>
  );
}
