import React from "react";
import { Navbar, TextInput, Button } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";
import { BsFillMoonStarsFill } from "react-icons/bs";

export default function Header() {
  const path = useLocation().pathname;
  console.log(path);
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-black text-purple-500 rounded-md">
          5181
        </span>
        blog
      </Link>
      <form>
        <TextInput
          placeholder="Search..."
          rightIcon={BiSearchAlt}
          className="hidden lg:inline"
        />
      </form>
      <Button className="lg:hidden w-12 h-10 " color="gray" pill>
        <BiSearchAlt />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          color="white"
          className="w-12 h-10 hidden sm:inline text-purple-500 "
          pill
        >
          <BsFillMoonStarsFill />
        </Button>
        <Link to="/signin">
          <Button>Sign-In</Button>
        </Link>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
