"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function PDFUpload() {
  const { data: session } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !session?.user?.id) return;
  
    console.log("Selected file:", file);
    console.log("File name:", file.name);
    console.log("File size:", file.size);
    console.log("File type:", file.type);
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/pdf/upload`, {
        method: "POST",
        headers: {
          "x-user-id": session.user.id,
          // ❗ do not manually set Content-Type here — browser will do it for FormData
        },
        body: formData,
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Upload error:", errorData);
        alert(`Failed to upload PDF: ${errorData.error || 'Unknown error'}`);
        return;
      }
  
      const responseData = await res.json();
      console.log("Upload success:", responseData);
  
      router.push("/pdfChat"); // Redirect only on success
    } catch (error) {
      console.error("Failed to upload:", error);
      alert("Failed to upload PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-100">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">📄 Upload a PDF Document</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-6"
      />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 shadow-md transition duration-200"
      >
        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Upload and Start Chatting"}
      </button>
    </div>
  );
}
