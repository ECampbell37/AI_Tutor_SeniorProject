/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/pdfUpload/page.tsx
 ************************************************************/



/**
 * PDF Upload Page – Upload interface for PDF Tutor Mode.
 *
 * Users can upload a PDF (e.g., textbook, handout) to be processed by the backend.
 * Once uploaded, they are redirected to `/pdfChat` to begin asking questions.
 * This feature is backed by a FastAPI route that parses and stores the file in memory.
 */


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, FileUp, Upload } from "lucide-react";



/**
 * Renders the upload screen for PDF Mode.
 * Handles file selection, POST request to backend, and redirects to chat on success.
 */
export default function PDFUpload() {
  // Session and router
  const { data: session } = useSession();
  const router = useRouter();

  // Local state
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  
  
  /**
   * Sends the selected PDF file to the backend API.
   * Alerts the user on error and redirects to /pdfChat on success.
   */
  const handleUpload = async () => {
    if (!file || !session?.user?.id) return;

    setLoading(true);

    // FormData Object to be sent to backend server
    const formData = new FormData();
    formData.append("file", file);

    try {
      //Send User's file to API
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/pdf/upload`, {
        method: "POST",
        headers: {
          "x-user-id": session.user.id,
        },
        body: formData,
      });

      //Handle File error
      if (!res.ok) {
        const errorData = await res.json();
        alert(`❌ Upload failed: ${errorData.error || "Unknown error"}`);
        return;
      }

      //Go to pdfChat page on successful upload
      router.push("/pdfChat");
    } catch {
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-100 text-gray-800">
      <div className="bg-white bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-xl max-w-md w-full text-center animate-fadeInUp">
        
        {/* Upload Icon & Heading */}
        <Upload className="w-12 h-12 text-blue-500 mx-auto mb-5" />
        <h1 className="text-3xl font-bold mb-2">Upload Your PDF</h1>
        <p className="text-gray-600 mb-6">We&apos;ll help you understand and chat about it!</p>

        {/* Upload Area */}
        <label
          htmlFor="pdf-upload"
          className="cursor-pointer border-2 border-dashed border-blue-400 p-6 rounded-xl hover:border-blue-500 transition duration-200 text-sm text-blue-600 font-medium mb-4 block"
        >
          {file ? (
            <div className="text-gray-800 font-medium truncate">{file.name}</div>
          ) : (
            <div className="flex flex-col items-center">
              <FileUp className="w-6 h-6 mb-2" />
              <span>Click to add your PDF here</span>
            </div>
          )}
        </label>

        {/* Hidden File Input */}
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`mt-4 w-full py-3 px-6 rounded-xl font-semibold transition duration-200 shadow-md ${
            loading || !file
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Start Chatting"}
        </button>
      </div>
    </div>
  );
}
