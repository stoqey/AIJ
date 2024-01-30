import React from "react";

export const AuthPage = () => {
    
  const openAuthLink = async () => {
    await (window as any).api.invoke("open:link", "http://localhost:3001/signin/app");
  };

  return (
    <div>
      <h1>Auth Page</h1>
      <button onClick={openAuthLink}>Login / Signup</button>
    </div>
  );
};

export default AuthPage;
