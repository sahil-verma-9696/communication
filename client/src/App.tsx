import React from "react";

export default function App() {
  const handleClick = async () => {
    window.location.href = "http://localhost:3000/auth/login?type=google";
  };
  return <div onClick={handleClick}>Continue with google</div>;
}
