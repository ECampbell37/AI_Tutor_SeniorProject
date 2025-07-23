/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/statusCheck/page.tsx
 ************************************************************/



/**
 * API Status Check Page – Displays real-time health status of the Python backend.
 *
 * This page pings the `/health` endpoint of the FastAPI server and renders feedback.
 * It's helpful for users to verify if the backend is awake (especially if hosted on free-tier platforms like Render).
 */



"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, RefreshCcw, BotMessageSquare } from "lucide-react";

// Python API health check endpoint
const API_URL = `${process.env.NEXT_PUBLIC_PYTHON_API}/health`;



/**
 * Displays a status screen showing whether the FastAPI backend is online.
 * Provides a retry button to re-ping the server.
 */
export default function ApiStatusPage() {
  // State to track API status
  const [status, setStatus] = useState<"loading" | "up" | "down">("loading");


  /**
   * Ping the API server to check if it's responsive.
   * Sets status accordingly for UI rendering.
   */
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

  // Run check once when the page mounts
  useEffect(() => {
    checkApi();
  }, []);


  /**
   * Renders a UI block based on the current API status.
   */
  const renderStatus = () => {
    //Loading screen
    if (status === "loading") {
      return (
        <div className="flex flex-col items-center text-blue-600 animate-pulse">
          <Loader2 size={48} className="animate-spin" />
          <p className="mt-3 text-lg 2xl:text-xl font-medium">Just a moment... Checking your connection to the AI Tutor</p>
        </div>
      );
    }

    //Up screen
    if (status === "up") {
      return (
        <div className="flex flex-col items-center text-green-600 animate-fadeInUp">
          <CheckCircle size={48} />
          <p className="mt-3 text-2xl 2xl:text-3xl font-semibold">You&apos;re good to go!</p>
          <p className="text-sm 2xl:text-lg text-gray-700 mt-1">The AI Tutor is ready to help 🎉</p>
        </div>
      );
    }

    //Down screen
    return (
      <div className="flex flex-col items-center text-red-600 animate-fadeInUp">
        <XCircle size={48} />
        <p className="mt-3 text-2xl 2xl:text-3xl font-semibold">Hmm... can&apos;t reach the Tutor</p>
        <p className="text-sm 2xl:text-lg text-gray-700 mt-1">We&apos;re having some trouble connecting right now — please check back again shortly.</p>
      </div>
    );
  };


  // Main layout
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-6 2xl:p-10">
      <div className="bg-white rounded-2xl shadow-2xl p-12 2xl:p-16 max-w-md 2xl:max-w-xl w-full text-center animate-fadeInUp">
        {/* Mascot Icon */}
        <BotMessageSquare
          size={64}
          className="text-blue-500 animate-bounce mb-4 mx-auto"
          strokeWidth={1.7}
        />

        <h1 className="text-4xl 2xl:text-5xl font-bold text-gray-800 mb-8">Check Your Connection</h1>
        {renderStatus()}
        <button
          onClick={checkApi}
          className="mt-8 bg-blue-600 text-white font-semibold py-2 2xl:py-3 px-6 2xl:px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto 2xl:text-lg"
        >
          <RefreshCcw size={18} /> Try Again
        </button>
      </div>
    </div>
  );
}
