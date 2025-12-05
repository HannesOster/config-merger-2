import { useState } from "react";
import { mergeAssemblyBindings } from "./utils";
import { FileUpload } from "./components/FileUpload";
import { Output } from "./components/Output";

function App() {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);

  const [mergedXml, setMergedXml] = useState("");
  const [changes, setChanges] = useState([]);

  const [loading, setLoading] = useState(false);

  const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });

  const downloadResult = () => {
    if (!mergedXml) return;

    const blob = new Blob([mergedXml], { type: "text/xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.web.config";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCompare = async () => {
    if (!fileA || !fileB) return;

    setLoading(true);
    setMergedXml("");
    setChanges([]);

    try {
      const [textA, textB] = await Promise.all([
        readFileAsText(fileA),
        readFileAsText(fileB),
      ]);

      const result = mergeAssemblyBindings(textA, textB);

      setMergedXml(result.mergedXml);
      setChanges(result.changes);
    } catch (err) {
      console.error(err);
      alert("❌ Fehler: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 min-w-[1000px]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-10 flex flex-col gap-8 justify-center">
        <h1 className="text-3xl font-extrabold text-blue-900 text-center">
          Config Merger
        </h1>

        {/* Datei Upload */}
        <FileUpload
          setFileA={setFileA}
          fileA={fileA}
          setFileB={setFileB}
          fileB={fileB}
          handleCompare={handleCompare}
          loading={loading}
        />

        {/* Ausgabe */}
        <Output
          changes={changes}
          mergedXml={mergedXml}
          downloadResult={downloadResult}
        />
      </div>
    </div>
  );
}

export default App;
