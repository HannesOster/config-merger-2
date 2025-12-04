import FileDragDrop from "./FileDragDrop";

export function FileUpload({
  setFileA,
  fileA,
  setFileB,
  fileB,
  handleCompare,
  loading,
}) {
  return (
    <>
      <div className="flex gap-6">
        <FileDragDrop
          label="Web.config lokal"
          setFile={setFileA}
          file={fileA}
        />

        <FileDragDrop
          label="Web.config Zielsystem"
          setFile={setFileB}
          file={fileB}
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          disabled={loading || !fileA || !fileB}
          className="flex w-28 h-9 px-2 flex-col bg-indigo-600 rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none"
        >
          {loading ? "Vergleiche..." : "Merge"}
        </button>
      </div>
    </>
  );
}
