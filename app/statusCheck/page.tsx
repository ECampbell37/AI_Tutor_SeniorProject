/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/statusCheck/page.tsx
 ************************************************************/

"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, RefreshCcw } from "lucide-react";

//Status Check URL
const API_URL = `${process.env.NEXT_PUBLIC_PYTHON_API}/health`;

export default function ApiStatusPage() {
  //Hook
  const [status, setStatus] = useState<"loading" | "up" | "down">("loading");

  //Check feedback from API
  const checkApi = async () => {
    setStatus("loading");
    try {
      //Ping Server
      const res = await fetch(API_URL, { cache: "no-store" });
      if (res.ok) {
        //If successful, server is up
        setStatus("up");
      } else {
        //Otherwise, server is down
        setStatus("down");
      }
    } catch {
      setStatus("down");
    }
  };

  //Check status
  useEffect(() => {
    checkApi();
  }, []);


  //Function to Display Proper status screen
  const renderStatus = () => {
    //Loading screen
    if (status === "loading") {
      return (
        <div className="flex flex-col items-center text-blue-500 animate-pulse">
          <Loader2 size={48} className="animate-spin" />
          <p className="mt-2 text-lg">Waking up the API server...</p>
        </div>
      );
    }

    //Up screen
    if (status === "up") {
      return (
        <div className="flex flex-col items-center text-green-600">
          <CheckCircle size={48} />
          <p className="text-2xl mt-2">The Python API is running ✅</p>
        </div>
      );
    }

    //Down screen
    return (
      <div className="flex flex-col items-center text-red-600">
        <XCircle size={48} />
        <p className="text-2xl mt-2">The Python API is not responding ❌</p>
        <p className="text-sm mt-1 text-gray-500">
          It might still be cold starting on Render.
        </p>
      </div>
    );
  };

  //Main Screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-6 text-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">API Server Status</h1>
      {renderStatus()}
      <button
        onClick={checkApi}
        className="mt-8 bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <RefreshCcw size={18} /> Check Again
      </button>
    </div>
  );
}
