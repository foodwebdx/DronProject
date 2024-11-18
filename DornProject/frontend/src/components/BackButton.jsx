import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BackButton.css';

function BackButton() {
  return (
    <Link to="/sidebar" className="back-button">
      Regresar
    </Link>
  );
}

export default BackButton;
