import React from "react";
import WebRoutes from "./routes/WebRoutes";
import { useApi } from "./context/ApiProvider";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { TfiArrowTopRight } from "react-icons/tfi";
import Loader from "./components/Loader";

export default function App() {
  const { loading } = useApi();

  return (
    <div>
      <div className="fixed bottom-0 w-full z-50 opacity-50 hover:opacity-100 transition-all">
        <div className="bg-amber-200 h-8 flex items-center justify-center">
          <p className="flex gap-2">
            Checkout the source code for the project{" "}
            <Link
              className="text-primary flex items-center gap-1"
              to={"https://github.com/raj-2093/taskpad"}
              target="_blank"
            >
              here{" "}
              <span className="">
                <TfiArrowTopRight />
              </span>
            </Link>
          </p>
        </div>
      </div>
      {/* { loading && <>Loading ...</> } */}
      {loading && (
        <div className="fixed h-full w-full flex items-center justify-center">
          <Loader />
        </div>
      )}
      {!loading && <WebRoutes />}
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
}
