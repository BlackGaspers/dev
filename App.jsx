// MIT License
// Copyright (c) 2025 [BlackGaspers]

import React, { useState, useRef } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const textareaRef = useRef(null);

  async function handleSubmit() {
    if (!input.trim()) {
      setResponse("Por favor, escribe una pregunta válida.");
      setDisplayedResponse("");
      return;
    }

    // Clave de API ya no se expone desde el frontend
    setLoading(true);
    setResponse("");
    setDisplayedResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error en la solicitud: ${res.status}`);
      }

      const data = await res.json();
      const content = data.reply || "Sin respuesta";
      setResponse(content);
      setInput("");

      // Animación tipo máquina de escribir
      let i = 0;
      function typeWriter() {
        setDisplayedResponse(content.slice(0, i));
        if (i <= content.length) {
          i++;
          setTimeout(typeWriter, 15);
        }
      }
      typeWriter();
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setResponse("Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.");
      setDisplayedResponse("");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.ctrlKey) {
      e.preventDefault();
      if (!loading) handleSubmit();
    } else if (e.key === "Enter" && e.ctrlKey) {
      const { selectionStart, selectionEnd, value } = e.target;
      setInput(value.slice(0, selectionStart) + "\n" + value.slice(selectionEnd));
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + 1;
        }
      }, 0);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto shadow-xl rounded-2xl bg-white p-6">
        <div className="mb-4 p-3 bg-blue-100 rounded text-blue-800 text-sm">
          <strong>Inteligencia Artificial BlackGaspers</strong><br />
          {window.location.hostname === "localhost" ? (
            <>
              Ambiente de desarrollo:<br />
              Ejecuta <code>npm start</code> o <code>yarn start</code><br />
              URL: <code>http://localhost:{window.location.port}</code>
            </>
          ) : (
            <>
              Bienvenido a la plataforma de IA<br />
              URL actual: <code>{window.location.origin}</code>
            </>
          )}
          <br />
          Web oficial:{" "}
          <a
            href="https://blackgaspers.com/openia"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            https://blackgaspers.com/openia
          </a>
        </div>

        <h1 className="text-2xl font-bold mb-4">BlackGaspers AI</h1>

        <textarea
          ref={textareaRef}
          className="w-full p-2 border rounded mb-4 focus:ring focus:ring-blue-200 outline-none"
          rows="4"
          placeholder="Escribe tu pregunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Campo de entrada para la pregunta"
          disabled={loading}
          autoFocus
        />

        <button
          className={`bg-blue-600 text-white px-4 py-2 rounded transition-opacity ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          onClick={handleSubmit}
          aria-label="Enviar pregunta"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Cargando...
            </span>
          ) : (
            "Enviar"
          )}
        </button>

        <div className="mt-4 p-4 bg-gray-50 rounded min-h-[60px]">
          <strong>Respuesta:</strong>
          <p aria-live="polite" className="whitespace-pre-line font-mono text-gray-800">
            {displayedResponse || response}
          </p>
        </div>
      </div>
    </div>
  );
}
