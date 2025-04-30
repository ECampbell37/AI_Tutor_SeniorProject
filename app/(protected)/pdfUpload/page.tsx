"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, FileUp, Upload } from "lucide-react";

export default function PDFUpload() {
  const { data: session } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !session?.user?.id) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/pdf/upload`, {
        method: "POST",
        headers: {
          "x-user-id": session.user.id,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`❌ Upload failed: ${errorData.error || "Unknown error"}`);
        return;
      }

      router.push("/pdfChat");
    } catch (error) {
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-100 text-gray-800">
      <div className="bg-white bg-opacity-80 backdrop-blur-md p-12 rounded-2xl shadow-xl max-w-md w-full text-center animate-fadeInUp">
        <Upload className="w-12 h-12 text-blue-500 mx-auto mb-5" />
        <h1 className="text-3xl font-bold mb-2">Upload Your PDF</h1>
        <p className="text-gray-600 mb-6">We'll help you understand and chat about it!</p>

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

        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />

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
