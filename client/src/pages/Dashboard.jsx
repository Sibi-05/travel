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
  }, [loaction.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSideBar />
      </div>
      <div className="flex-1 flex justify-center p-4">
        {tab === "profile" && <DashProfile />}
      </div>
    </div>
  );
}
