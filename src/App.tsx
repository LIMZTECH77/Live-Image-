/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">Live Social Animator</h1>
        <p className="text-gray-600">Generate high-res images and bring them to life.</p>
      </header>

      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your image..."
          className="w-full p-4 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          {loading ? "Generating..." : "Generate & Animate"}
        </button>
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
            alt="Generated"
            className="w-full h-auto"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 1, 0, -1, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

