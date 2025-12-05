import xpath from "xpath";

export const mergeAssemblyBindings = (xmlA, xmlB) => {
  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  const docA = parser.parseFromString(xmlA, "text/xml");
  const docB = parser.parseFromString(xmlB, "text/xml");

  const assemblyBindingA = xpath.select1(
    "//*[local-name()='assemblyBinding']",
    docA
  );
  const assemblyBindingB = xpath.select1(
    "//*[local-name()='assemblyBinding']",
    docB
  );

  if (!assemblyBindingA || !assemblyBindingB) {
    throw new Error("assemblyBinding konnte nicht gefunden werden.");
  }

  const assembliesA = xpath.select(
    "*[local-name()='dependentAssembly']",
    assemblyBindingA
  );
  const assembliesB = xpath.select(
    "*[local-name()='dependentAssembly']",
    assemblyBindingB
  );

  const mapA = new Map();
  assembliesA.forEach((depA) => {
    const name = xpath.select1(
      "string(*[local-name()='assemblyIdentity']/@name)",
      depA
    );
    if (name) mapA.set(name, depA);
  });

  const changes = [];

  assembliesB.forEach((depB) => {
    const name = xpath.select1(
      "string(*[local-name()='assemblyIdentity']/@name)",
      depB
    );
    const depA = mapA.get(name);

    if (depA) {
      const redirectA = xpath.select1(
        "*[local-name()='bindingRedirect']",
        depA
      );
      const redirectB = xpath.select1(
        "*[local-name()='bindingRedirect']",
        depB
      );

      if (redirectA && redirectB) {
        const newVersionA = redirectA.getAttribute("newVersion");
        const newVersionB = redirectB.getAttribute("newVersion");

        if (newVersionA && newVersionA !== newVersionB) {
          redirectB.setAttribute(
            "oldVersion",
            redirectA.getAttribute("oldVersion")
          );
          redirectB.setAttribute("newVersion", newVersionA);

          changes.push({
            package: name,
            oldVersion: newVersionB,
            newVersion: newVersionA,
            lineNumber: findLineByPackageName(xmlB, name),
          });
        }
      }
    }
  });

  return {
    mergedXml: serializer.serializeToString(docB),
    changes,
  };
};

export const isDowngrade = (oldV, newV) => {
  const a = oldV.split(".").map(Number);
  const b = newV.split(".").map(Number);

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    if (y < x) return true;
    if (y > x) return false;
  }
  return false;
};

const findLineByPackageName = (xmlText, packageName) => {
  const xml = xmlText.replace(/\r/g, "");
  const lines = xml.split("\n");

  const search = `name="${packageName}"`;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(search)) {
      return i + 1; // Zeilennummer 1-basiert
    }
  }

  return null;
};
