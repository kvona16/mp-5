// app/page.tsx
"use client";

import { useState } from "react";
import { Button, TextField, FormHelperText } from "@mui/material";

export default function Home() {
  //state for form inputs, API responses and UI feedback
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    //submit the URL and custom alias to the backend API
    event.preventDefault();
    setError("");
    setShortUrl("");
    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alias }),
      });

      const data = await res.json();

      if (!res.ok) {
        //display validation or errors returned by server
        setError(data.error || "Something went wrong.");
      } else {
        //make the full shareable URL using the current domain
        const fullShortUrl = `${window.location.origin}/${data.alias}`;
        setShortUrl(fullShortUrl);
      }
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };
//copy the shortened URL to the clipboard with a confirmation
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
      /* background image + layout */
      <main className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-6"
            style={{ backgroundImage: `url('/microsoftbackground.png')` }}
      >
        <h1 className="text-2xl font-bold text-left text-white bg-blue-600 p-3 w-150"
            style={{ fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", Tahoma, sans-serif' }}
        >
          URL Shortener
        </h1>
        {/* main container and form for URL shortening */}
        <form
            className="w-150 p-10 bg-gray-300 shadow-md space-y-5"
            onSubmit={handleSubmit}
        >
          {/* input for LONG URL */}
          <TextField
              variant="filled"
              sx={{ backgroundColor: "white", width: "100%", border: 1, }}
              label="Destination URL"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
          />
          {/* input for CUSTOM URL */}
          <TextField
              variant="filled"
              sx={{ backgroundColor: "white", width: "100%", border: 1,  }}
              label="Custom Alias"
              placeholder="e.g. my-link"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              required
          />

          <FormHelperText>Enter a long URL and your custom alias.</FormHelperText>
          {/* Button to copy shortened link */}
          <Button
              sx={{
                width: "110px",
                borderRadius: 0,
                backgroundColor: "#d1d5db",
                color: "black",
                textTransform: "none",
                fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
                borderTop: "2px solid #ffffff",
                borderLeft: "2px solid #ffffff",
                borderRight: "2px solid #4b5563",
                borderBottom: "2px solid #4b5563",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#e5e7eb",
                  boxShadow: "none",
                },
              }}
              variant="contained"
              type="submit"
              disabled={loading || !url || !alias}
          >
            {loading ? "Shortening..." : "Shorten"}
          </Button>

          {/* error message  */}
          {error && (
              <div className="p-3 bg-red-100 text-red-700 text-sm text-center">
                {error}
              </div>
          )}

          {/* Box that displays the shortened URL + copy button  */}
          {shortUrl && (
              <div className="p-4 bg-white shadow-inner space-y-2">
                <p className="text-xs font-semibold text-black"
                   style={{ fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", Tahoma, sans-serif' }}
                >Your shortened link:</p>
                <div className="flex items-center justify-between bg-gray-50 p-2">
                  <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline truncate mr-2 text-sm"
                      style={{ fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", Tahoma, sans-serif' }}
                  >
                    {shortUrl}
                  </a>
                  <Button
                      sx={{
                        width: "110px",
                        borderRadius: 0,
                        backgroundColor: "#d1d5db",
                        color: "black",
                        textTransform: "none",
                        fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
                        borderTop: "2px solid #ffffff",
                        borderLeft: "2px solid #ffffff",
                        borderRight: "2px solid #4b5563",
                        borderBottom: "2px solid #4b5563",
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "#e5e7eb",
                          boxShadow: "none",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      onClick={handleCopy}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
          )}
        </form>
      </main>
  );
}