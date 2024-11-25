import Bar from "@/components/Bar";
import ModelViewer from "@/components/ModelViewer";
import React from "react";

export default async function Seats() {

  return (
    <main className="min-h-screen bg-sky-300">
      <div className="bg-gray-800 text-white p-4 text-center my-5">
        <h1 className="text-3xl font-black">Wine and Dine Seats</h1>
      </div>
      <div className="flex justify-center">
        <div className="bg-yellow-400 w-4/5">
            <ModelViewer/>
        </div>
      </div>
    </main>
)}