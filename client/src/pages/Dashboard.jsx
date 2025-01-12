import DashSideBar from "../components/DashSideBar.jsx";
import DashProfile from "../components/DashProfile.jsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const loaction = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(loaction.search);

    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    console.log(tab);
    console.log(tab === "profile");
  }, [loaction.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        <DashSideBar />
      </div>
      {tab === "profile" && <DashProfile />}
    </div>
  );
}
