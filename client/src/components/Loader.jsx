import React from "react";
import loader from "../assets/loaders/loading.gif";

export default function Loader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img src={loader} alt="Loading ..." className="w-28" />
    </div>
  );
}
