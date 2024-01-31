import { LayoutPageProps } from "../layout";
import React from "react";
import _get from "lodash/get";
import { isEmpty } from "lodash";
// import logo from "../../assets/icon.png";

export const AuthPage = ({ state }: LayoutPageProps) => {
  const authMessage = _get(state, "auth.res.message", "");

  const openAuthLink = async () => {
    await (window as any).api.invoke("open:link", null);
  };

  return (
    <div
      className="flex justify-center items-center flex-col"
      style={{ height: "100vh", width: "100vw" }}
    >
      <img
        src={"static://assets/icon.png"}
        style={{ width: "100px", padding: "5px", marginBottom: "20px" }}
      />
      
      {!isEmpty(authMessage) && (
        <div className="flex justify-center">
          <div className="text-2xl font-bold">{authMessage}</div>
        </div>
      )}
      <div className="flex justify-center mt-2">
        <button
          onClick={openAuthLink}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login / Signup
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
