import { File, FileDown } from "lucide-react";
import React from "react";

export const Output = ({
  textA = "",
  textB = "",
  startLine = 10,
  endLine = 200,
  downloadResult,
}) => {
  const normalize = (text) =>
    text
      .replace(/\r/g, "")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l !== "");

  const linesA = normalize(textA);
  const linesB = normalize(textB);

  const setA = new Set(linesA);

  const changed = linesB
    .map((line, i) => ({ line, number: i + 1 }))
    .filter(({ line }) => !setA.has(line))
    .filter(({ number }) => number >= startLine && number <= endLine);

  if (!changed.length) {
    return (
      <div className="text-gray-500 text-center">
        Lade die Config Dateien hoch und merge sie um eine fertige Version zu
        erhalten.
      </div>
    );
  }

  const contextLines = new Map();
  changed.forEach(({ number }) => {
    if (number > 1 && !contextLines.has(number - 1)) {
      const prevLine = linesB[number - 2];
      if (prevLine)
        contextLines.set(number - 1, { line: prevLine, isContext: true });
    }
    const changedLine = linesB[number - 1];
    contextLines.set(number, { line: changedLine, isContext: false });
  });

  const allLines = Array.from(contextLines.entries())
    .sort(([a], [b]) => a - b)
    .map(([number, { line, isContext }]) => ({ number, line, isContext }));

  return (
    <>
      <label className="text-blue-900 font-bold text-center">
        Angepasste Dependencies
      </label>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 14,
          border: "1px solid #ccc",
          borderRadius: 6,
          padding: 10,
          overflowX: "auto",
          backgroundColor: "#f9f9f9",
          whiteSpace: "pre",
        }}
      >
        {allLines.map(({ line, number, isContext }) => (
          <div
            key={number}
            style={{
              display: "flex",
              backgroundColor: isContext
                ? "rgba(0,0,0,0.05)"
                : "rgba(0,255,0,0.2)",
            }}
          >
            <div
              style={{
                width: 40,
                textAlign: "right",
                paddingRight: 10,
                color: "#999",
                userSelect: "none",
              }}
            >
              {number}
            </div>
            <div>{line}</div>
          </div>
        ))}
      </div>

      {textB ? (
        <div className="flex justify-center">
          <div className="flex flex-col gap-2">
            <FileDown className="mx-auto w-16 h-16 text-green-600" />
            <button
              onClick={downloadResult}
              className="flex w-32 h-9 px-2 bg-green-600 rounded-full shadow text-white text-xs font-semibold items-center justify-center cursor-pointer focus:outline-none"
            >
              Download config
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};
