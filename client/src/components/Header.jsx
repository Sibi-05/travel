import {
  Navbar,
  TextInput,
  Button,
  Dropdown,
  Avatar,
  DropdownHeader,
} from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toogleTheme } from "../toolkit/theme/themeSlice.js";

export default function Header() {
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Navbar className=" border-b-2  border-purple-500">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white  border-purple-500 gap-2"
      >
        <span className="px-2 py-1 border-2 text-black  border-purple-500 rounded-md dark:text-white">
          5181
        </span>
        <span className="text-purple-500"> blog</span>
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
          className="w-12 h-10 hidden sm:inline text-purple-500  border-purple-500 border-2"
          pill
          onClick={() => dispatch(toogleTheme())}
        >
          <BsFillMoonStarsFill />
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="" img={currentUser.profilePicture} rounded />}
          >
            <DropdownHeader>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </DropdownHeader>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item className="font-bold">Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/signin">
            <Button color="purple" className="text-white border-purple-500">
              Sign-In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className="text-purple-500">
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
