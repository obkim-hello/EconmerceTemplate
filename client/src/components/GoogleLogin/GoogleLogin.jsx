/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../service/google";
import { sessionService } from "redux-react-session";
import { useNavigate } from "react-router-dom";

export default (props) => {
  const navigate = useNavigate();
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        console.log(authResult.code);
        const result = await googleAuth(authResult.code);
        console.log(result);
        await sessionService.saveUser(result.data.toString());
        await sessionService.saveSession(result.data.toString());
        if (window.location.href.includes("?next=")) {
          const next = window.location.href.split("?next=")[1];
          navigate(next);
        } else {
          navigate("/");
        }
      } else {
        console.log(authResult);
        throw new Error(authResult);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <button
      className="w-full bg-[WHITE] bg-none border rounded box-border text-[#1f1f1f] cursor-pointer text-sm h-10 tracking-[0.25px] overflow-hidden relative text-center align-middle whitespace-nowrap  min-w-min px-3 py-0 border-solid border-[#747775] disabled:cursor-default disabled:bg-[#ffffff61] disabled:border-[#1f1f1f1f];"
      onClick={googleLogin}
    >
      <div className="@apply transition-opacity duration-[0.218s] opacity-0 absolute inset-0;"></div>
      <div className="@apply items-center flex flex-row flex-nowrap h-full justify-between relative w-full;">
        <div className="@apply h-5 min-w-[20px] w-5 mr-3;">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="block"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </div>
        <span className="@apply grow font-medium overflow-hidden text-ellipsis align-top;">
          Sign in with Google
        </span>
        <span className="hidden">Sign in with Google</span>
      </div>
    </button>
  );
};
