import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LayoutSplashScreen } from "../../../layout/_core/EzsSplashScreen";
import { setToken } from "./AuthSlice";

const tokenFake =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJUb2tlbklEIjoiNjA5IiwibmJmIjoxNjQ3NjYyOTE0LCJleHAiOjE2NzkxOTg5MTQsImlhdCI6MTY0NzY2MjkxNH0.E14PBAL98NfIxW-S16QFIb3titEXE38naUjfk4JnbF8";

function AuthInit(props) {
  const dispatch = useDispatch();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // We should request user by authToken before rendering the application

  useEffect(() => {
    const requestUser = () => {
      dispatch(setToken(window.Token || tokenFake));
      setShowSplashScreen(false);
    };

    if (window.Token || tokenFake) {
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
