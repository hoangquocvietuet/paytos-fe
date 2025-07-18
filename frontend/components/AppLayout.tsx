import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const AppLayout = () => {
  return (
    <>
      {/* <div className="hidden xl:block"> */}
      <Header />
      {/* </div> */}
      <Outlet />
    </>
  );
};
