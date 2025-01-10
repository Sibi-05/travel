import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsInstagram, BsLinkedin, BsGithub } from "react-icons/bs";

export default function FooterCom() {
  return (
    <Footer
      container
      className="border border-t-8 border-b-5 border-purple-500"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <div className="mt-5">
              <Link
                to="/"
                className="self-center text-lg whitespace-nowrap  sm:text-xl font-semibold dark:text-white  border-purple-500 gap-2"
              >
                <span className="px-2 py-1 border-2 text-black  border-purple-500 rounded-md dark:text-white">
                  5181
                </span>
                <span className="text-purple-500"> blog</span>
              </Link>
            </div>
            <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
              <Footer.Icon
                href="https://www.instagram.com/mr__5_1_b_1/"
                icon={BsInstagram}
              />
              <Footer.Icon
                href="https://www.linkedin.com/in/sibi-p-807140314/"
                icon={BsLinkedin}
              />
              <Footer.Icon href="https://github.com/Sibi-05" icon={BsGithub} />
            </div>
          </div>
        </div>
      </div>
    </Footer>
  );
}
