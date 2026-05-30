/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Loader2, Image as ImageIcon, Download } from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [loading]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "animated-result.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.image) {
        setImageUrl(data.image);
      } else {
        alert(data.error || "Failed to generate image.");
      }
    } catch (e) {
      alert("Error generating image.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 flex flex-col items-center">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">LIMZart Social Live</h1>
        <p className="text-gray-600">Generate high-res images or upload one to bring it to life.</p>
      </header>

      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Option 1: Generate New</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your clown image..."
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {loading ? "Generating..." : "Generate & Animate"}
          </button>
          
          {loading && (
            <div className="w-full space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>LIMZTECH</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-blue-600 h-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 border-t pt-4">
          <label className="block text-sm font-medium text-gray-700">Option 2: Upload Existing</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full p-2 border border-gray-200 rounded-xl"
          />
        </div>
      </div>

      {imageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        >
          <motion.img
            src={imageUrl}
            alt="Animated"
            className="w-full h-auto origin-center"
            animate={{
              scale: [1, 1.05, 1.02, 1.05, 1],
              rotate: [0, -2, 2, -2, 0]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <button
            onClick={handleDownload}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white text-gray-900 transition"
          >
            <Download size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

