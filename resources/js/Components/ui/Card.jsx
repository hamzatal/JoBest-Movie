// resources/js/components/ui/Card.jsx

import React from 'react';

export const Card = ({ children }) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg">
      {children}
    </div>
  );
};

export const CardHeader = ({ children }) => {
  return <div className="card-header">{children}</div>;
};

export const CardTitle = ({ title }) => {
  return <h2 className="text-xl font-bold">{title}</h2>;
};

export const CardContent = ({ children }) => {
  return <div className="card-content">{children}</div>;
};
