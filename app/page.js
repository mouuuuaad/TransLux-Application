"use client";

import React, { useState, useEffect } from "react";
import { FaClipboard, FaClipboardCheck, FaVolumeUp } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

import { Button } from "../components/ui/button";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ar");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    const translateText = async () => {
      if (!inputText.trim()) {
        setTranslatedText("");
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(
            inputText
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch translation.");
        }

        const data = await response.json();
        setTranslatedText(data.translation || "Translation failed.");
      } catch (error) {
        setTranslatedText("An error occurred during translation.");
        console.error("Error during translation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      translateText();
    }, 500); // Wait 500ms after user stops typing to send the request

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout
  }, [inputText, sourceLang, targetLang]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  // Function to speak the translated text
  const handleSpeakText = () => {
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLang; // Set the language for the speech
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-6xl  bg-white p-6 rounded-lg shadow-xl">
        {/* Header */}
        <div className="text-center flex justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
          TransLuxe
          </h1>
          <p className="text-xl italic text-gray-500 mt-2">
            Powered by{" "}
            <span className="font-bold not-italic text-black">
              Mouaad Idoufkir
            </span>
          </p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Text */}
          <div>
            <label className="block text-lg text-gray-600 font-semibold mb-2">
              Enter Text
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your text here..."
              className="w-full p-4 border text-xl border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              rows="10"
            ></textarea>
          </div>

          {/* Translated Text */}
          <div>
            <label className="block text-lg text-gray-600 font-semibold mb-2">
              Translated Text
            </label>
            <div className="relative">
              <textarea
                value={translatedText}
                readOnly
                placeholder="Translation will appear here..."
                className={`w-full p-4 border ${
                  isLoading ? "border-gray-300 bg-gray-100" : "border-gray-300"
                } rounded-lg text-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none transition`}
                rows="10"
              ></textarea>
              <div className="flex space-x-4 mt-4">
                {/* Listen Button with Icon */}
                <Button
                  onClick={handleSpeakText}
                  className="absolute top-12 right-2"
                >
                  <FaVolumeUp /> {/* Audio Icon */}
                </Button>
                {/* Copy Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        onClick={handleCopyText}
                        className="absolute top-2 right-2 "
                      >
                        {isCopied ? <FaClipboardCheck /> : <FaClipboard />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Click to copy the translated text
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
          {/* Source Language */}
          <div>
            <label className="block text-lg text-gray-600 font-semibold mb-2">
              Source Language
            </label>
            <Select value={sourceLang} onValueChange={setSourceLang}>
              <SelectTrigger className="py-6 px-3 rounded-lg w-[250px] border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Target Language */}
          <div>
            <label className="block text-lg text-gray-600 font-semibold mb-2">
              Target Language
            </label>
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger className="py-6 px-3 rounded-lg border border-gray-300 shadow-sm w-[250px] focus:ring-2 focus:ring-blue-400 focus:outline-none transition">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
