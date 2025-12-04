import { useState } from "react";
import { mergeAssemblyBindings } from "./utils";
import FileDragDrop from "./components/FileDragDrop";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Output } from "./components/Output";
import { FileUpload } from "./components/FileUpload";

function App() {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [textBContent, setTextBContent] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });

  const downloadResult = () => {
    if (!result) return; // nichts zu speichern
    const blob = new Blob([result], { type: "text/xml" }); // .config ist XML-basiert
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.config"; // Name der Datei
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Speicher freigeben
  };

  const handleCompare = async () => {
    if (!fileA || !fileB) return;
    setLoading(true);
    setResult("");

    try {
      const [textA, textB] = await Promise.all([
        readFileAsText(fileA),
        readFileAsText(fileB),
      ]);

      setTextBContent(textB);

      const merged = mergeAssemblyBindings(textA, textB);
      setResult(merged);
    } catch (err) {
      console.error(err);
      setResult("❌ Fehler: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 min-w-[1000px]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-10 flex flex-col gap-8 justify-center">
        <h1 className="text-3xl font-extrabold text-blue-900 text-center">
          Config Merger{" "}
        </h1>

        <FileUpload
          setFileA={setFileA}
          fileA={fileA}
          setFileB={setFileB}
          fileB={fileB}
          handleCompare={handleCompare}
          loading={loading}
        />

        <Output
          textA={textBContent}
          downloadResult={downloadResult}
          textB={result}
        />
      </div>
    </div>
  );
}

export default App;
