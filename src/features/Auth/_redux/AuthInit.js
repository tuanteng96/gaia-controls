import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { isDevelopment } from "../../../helpers/DevelopmentHelpers";
import { LayoutSplashScreen } from "../../../layout/_core/EzsSplashScreen";
import { setToken } from "./AuthSlice";

if (isDevelopment()) {
  window.Token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBdXRoMlR5cGUiOiJVc2VyRW50IiwiSUQiOiIxIiwiVG9rZW5JZCI6IjMiLCJuYmYiOjE2Njk3MDY5MzksImV4cCI6MTY3MDMxMTczOSwiaWF0IjoxNjY5NzA2OTM5fQ.U9DjVZk5Wf0euPhvYobj7hgogRMUboGLD77G5DmvIXs";
}
  function getScrollbarWidth() {
    // Creating invisible container
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll"; // forcing scrollbar to appear
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement("div");
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  }

function AuthInit(props) {
  const dispatch = useDispatch();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // We should request user by authToken before rendering the application

  useEffect(() => {
    const widthScroll = getScrollbarWidth();
    document.documentElement.style.setProperty(
      "--width-scrollbar",
      `${widthScroll}px`
    );
  },[])

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
