import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Loader = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: 'rgba(255,255,255,.8)' }}>
      <FontAwesomeIcon icon={['fa', 'spinner']} spin size="3x"/>
    </div>
  );
}

export default Loader;