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
        const newVersionA = xpath.select1("string(@newVersion)", redirectA);
        const newVersionB = xpath.select1("string(@newVersion)", redirectB);

        if (newVersionA && newVersionA !== newVersionB) {
          redirectB.setAttribute(
            "oldVersion",
            redirectA.getAttribute("oldVersion") || "0.0.0.0"
          );
          redirectB.setAttribute("newVersion", newVersionA);
        }
      }
    }
  });

  return serializer.serializeToString(docB);
};
