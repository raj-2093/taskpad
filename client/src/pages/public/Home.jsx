import React, { useEffect } from "react";
import { useApi } from "../../context/ApiProvider";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { TfiArrowTopRight } from "react-icons/tfi";
import taskpadLogo from "../../assets/taskpad-logo-enlarged.png"

export default function Home() {
  // Temporary
  const { user } = useApi();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/user/dashboard");
    }
  }, []);

  return (
    <div className="">
      {/* <div>
        <div className="bg-amber-200 h-8 flex items-center justify-center">
          <p className='flex gap-2'>Checkout the source code for the project <Link className="text-primary flex items-center gap-1" to={"https://github.com/raj-2093/taskpad"} target='_blank'>here <span className=''><TfiArrowTopRight /></span></Link></p>
        </div>
      </div> */}
      <div className="">
        <header className="h-16">
          <nav className="bg-blue-400 h-full flex items-center px-6 shadow shadow-black">
            <div>
              <Link className="text-2xl" to={"/"}>
                Taskpad
              </Link>
            </div>
            <div className="ml-auto">
              <Link
                to={"/login"}
                className="group p-2 px-4 w-24 min-w-fit rounded-md bg-blue-500 shadow shadow-blue-600 flex items-center justify-start text-start gap-1 relative"
              >
                Login{" "}
                <span className="absolute right-4 transition-all group-hover:right-3.5">
                  <BsArrowRight className="" />
                </span>
              </Link>
            </div>
          </nav>
        </header>
      </div>

      <section className="flex items-start justify-center h-[calc(100vh-64px)] bg-amber-100" style={{
        // backgroundImage: `url(${bg})`,
        // backgroundSize: "contain",
        // backgroundRepeat: "no-repeat"
      }}>
        <div className="h-full p-4 py-7 pt-20 h-64 flex flex-col gap-7 items-center justify-start">
          <h2 className="text-7xl">
            Taskpad
          </h2>
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-center">
              An application to help small to medium sized teams help track
              their progress
            </p>
            <p className="text-center">and</p>
            <p className="text-center text-xl uppercase">Get things done</p>
          </div>
          {/* <p className='text-center'>An application to help small to medium sized teams help track their progress <br /> and <br /> <span className='text-xl uppercase'>Get things done</span></p> */}
          <div className="mt-auto mb-28">
            <span className="text-2xl">
              <Link className="text-primary" to={"/signup"}>
                Register
              </Link>{" "}
              to get started
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
