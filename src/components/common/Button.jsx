import React from "react";

export default function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition ${className}`}
    >
      {children}
    </button>
  );
}
