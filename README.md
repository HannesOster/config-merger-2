# Dokumentenvergleich & Anpassung mit Ollama

## Projektstruktur

- `/client`: React-Frontend (Vite, TailwindCSS)
- `/server`: Node.js-Backend (Express, node-fetch)

## Features

- Zwei Textfelder für Dokument A & B
- Button "Anpassen" schickt beide Texte an das Backend
- Backend sendet die Texte an Ollama (lokal, llama3)
- Ergebnis wird im Frontend angezeigt

## Start

1. **Ollama muss lokal laufen (z.B. llama3 installiert und gestartet)**
2. `npm install` (im Root-Verzeichnis)
3. `npm run dev` (startet Client & Server parallel)
   - Client: http://localhost:5173
   - Server: http://localhost:5000

## Hinweise

- Die Kommunikation mit Ollama erfolgt offline über `localhost:11434`
- Styling mit TailwindCSS
- REST-API: `/api/compare` (POST)

## Beispiel-Prompt an Ollama

```
POST http://localhost:11434/api/generate
{
  "model": "llama3",
  "prompt": "Vergleiche Dokument A und Dokument B, passe B an A an (Struktur, Stil, Sprache, aber Inhalt von B behalten)..."
}
```

## Anpassungen

- Die wichtigsten Stellen sind im Code kommentiert.
- Für Upload-Felder kann die Logik leicht erweitert werden.
# config-merger
