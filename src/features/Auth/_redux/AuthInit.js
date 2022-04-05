import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LayoutSplashScreen } from "../../../layout/_core/EzsSplashScreen";
import { setToken } from "./AuthSlice";

// window.Token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJUb2tlbklEIjoiNjQ1IiwibmJmIjoxNjQ4MDE5MzA4LCJleHAiOjE2Nzk1NTUzMDgsImlhdCI6MTY0ODAxOTMwOH0.SoCplpl2gWFf1D_F_8UyIbDMVbltr79x7r0omNMMypM";

function AuthInit(props) {
  const dispatch = useDispatch();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // We should request user by authToken before rendering the application

  useEffect(() => {
    const requestUser = () => {
      dispatch(setToken(window.Token));
      setShowSplashScreen(false);
    };

    if (window.Token) {
      // Xử lí
      requestUser();
    } else {
      setShowSplashScreen(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>;
}

export default AuthInit;
