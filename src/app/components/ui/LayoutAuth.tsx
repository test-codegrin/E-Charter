"use client";

import { usePathname } from "next/navigation";
import Nav from "../home/Nav";
import Footer from "../home/Footer";
import { ROUTES } from "../../constants/RoutesConstant";
import { useEffect, useState } from "react";
import GlobalPageLoader from "../loaders/GlobalLoader";

export default function LayoutAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const pathname = usePathname();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setShowLoader(true);
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1700);

    return () => clearTimeout(timer);
  }, [pathname]);

  const hideNavbarFooterPaths = [
    ROUTES.USER_LOGIN,
    ROUTES.USER_SIGNUP,
    ROUTES.USER_FORGOT_PASSWORD,
  ];

  const shouldHideNavbarFooter = hideNavbarFooterPaths.some((path) =>
    pathname?.startsWith(path)
  );

  return (
    <>
      {showLoader ? (
        <GlobalPageLoader />
      ) : (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
        integrity="sha512-DxV+EoADOkOygM4IR9yXP8Sb2qwgidEmeqAEmDKIOfPRQZOWbXCzLC6vjbZyy0vPisbH2SyW27+ddLVCN+OMzQ=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      {!shouldHideNavbarFooter && <Nav />}
      {children}
      {!shouldHideNavbarFooter && <Footer />}
    </>
    )}
    </>
  );
}
