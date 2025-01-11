import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const loaction = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(loaction.search);

    const tabFromUrl = urlParams.get("tab");
    console.log(tabFromUrl);
  }, 1000);
  return <div></div>;
}
