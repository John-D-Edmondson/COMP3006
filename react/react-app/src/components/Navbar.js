// Navbar.js 
import "../styles/navbar.css";
import { Link } from 'react-router-dom';
import { useState } from "react";

export default function Navbar() {
const [isNavExpanded, setIsNavExpanded] = useState(false);

    return (
      <nav className="navigation">
        <Link to="/" className="brand-name">
          Online Library
        </Link>
        <button className="hamburger"
                onClick={() => {
                    setIsNavExpanded(!isNavExpanded);
                }}
        >
          {/* icon from heroicons.com */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="white"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div
          className={ isNavExpanded ? "navigation-menu expanded" : "navigation-menu"}>
          <ul>
            <li>
              <Link to="/" onClick={() => {
                    setIsNavExpanded(!isNavExpanded);
                }}>Home</Link>
            </li>
            <li>
              <Link to="/login" onClick={() => {
                    setIsNavExpanded(!isNavExpanded);
                }}>Login</Link>
            </li>
            <li>
              <Link to="/signup" onClick={() => {
                    setIsNavExpanded(!isNavExpanded);
                }}>Sign Up</Link>
            </li>
            <li>
              <Link to="/books" onClick={() => {
                setIsNavExpanded(!isNavExpanded);
              }}>Books</Link>
            </li>
            <li>
              <Link to="/user" onClick={() => {
                setIsNavExpanded(!isNavExpanded);
              }}>Manage</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }