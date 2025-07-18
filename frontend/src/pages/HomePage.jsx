import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className="text-red-500 outline-dashed text-center p-4"
        onClick={() => {
          navigate("/login");
        }}
      >
        Log In
      </button>
    </div>
  );
};

export default HomePage;
