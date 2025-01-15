import { Sidebar } from "flowbite-react";
import { FaUserAstronaut } from "react-icons/fa6";
import { PiSignOutBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function DashSideBar() {
  const { currentUser } = useSelector((state) => state.user);
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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            as={Link}
            to="/dashboard?tab=profile"
            active={tab === "profile"}
            icon={FaUserAstronaut}
            label={currentUser.username}
            labelColor="dark"
          >
            Profile
          </Sidebar.Item>
          <Sidebar.Item icon={PiSignOutBold} className="cursor-pointer">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
