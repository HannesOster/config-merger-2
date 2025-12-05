import { FileDown, Package } from "lucide-react";
import { isDowngrade } from "../utils";

export const Output = ({ changes = [], mergedXml = "", downloadResult }) => {
  if (!changes.length && !mergedXml) {
    return (
      <div className="text-gray-500 text-center">
        Lade die Config Dateien hoch und merge sie, um Ergebnisse zu sehen.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 🔥 Änderungen */}
      <div className="bg-white shadow-md rounded-lg p-5 border">
        <h2 className="text-blue-900 font-bold text-lg mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Aktualisierte Dependencies
        </h2>

        {changes.length === 0 ? (
          <p className="text-gray-500">Keine Versionen wurden verändert.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {changes.map((c, idx) => {
              const downgrade = isDowngrade(c.oldVersion, c.newVersion);
              return (
                <li
                  key={idx}
                  className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <div className="font-semibold text-blue-900">
                      {c.package}
                    </div>
                    <div className="text-xs text-gray-500">
                      Zeile: {c.lineNumber}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    {c.oldVersion} ➜{" "}
                    <span
                      className={`font-semibold ${
                        downgrade ? "text-red-600" : "text-green-700"
                      }`}
                    >
                      {c.newVersion}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 🔥 Download */}
      {mergedXml ? (
        <div className="flex justify-center">
          <div className="flex flex-col gap-2">
            <FileDown className="mx-auto w-16 h-16 text-green-600" />
            <button
              onClick={downloadResult}
              className="flex w-32 h-9 px-2 bg-green-600 rounded-full shadow text-white text-xs font-semibold items-center justify-center cursor-pointer hover:bg-green-700"
            >
              Download config
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
