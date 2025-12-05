import { File, FileCheck2, FileUp } from "lucide-react";

function FileInput({ label, setFile, file }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="w-full py-9 bg-gray-50 rounded-2xl border border-gray-300 gap-3 grid border-dashed">
        <div className="grid gap-1">
          {file ? (
            <FileCheck2 className="mx-auto w-16 h-16 text-indigo-600" />
          ) : (
            <FileUp className="mx-auto w-16 h-16 text-indigo-600" />
          )}
          <h2 className="text-center text-gray-400   text-xs leading-4">
            {label}
          </h2>
        </div>
        <div className="flex items-center justify-center">
          <label>
            <input
              type="file"
              accept=".config,.xml,.txt"
              onChange={(e) => setFile(e.target.files[0] || null)}
              hidden
            />
            <div className="flex w-28 h-9 px-2 flex-col bg-indigo-600 rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
              {file ? file.name : "Choose file"}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
export default FileInput;
