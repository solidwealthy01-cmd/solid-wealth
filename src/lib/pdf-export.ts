/**
 * Dynamic script loader and multi-page PDF generator using html-to-image and jsPDF.
 * Generates high-resolution A4 portrait PDF reports matching the Solid Wealth Printable template.
 */
export async function exportElementsToPdf({
  pageIds,
  filename,
  pixelRatio = 2,
}: {
  pageIds: string[];
  filename: string;
  pixelRatio?: number;
}): Promise<boolean> {
  const loadScript = (src: string) => {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        const isLoaded =
          (src.includes("html-to-image") && (window as any).htmlToImage) ||
          (src.includes("jspdf") && (window as any).jspdf);
        if (isLoaded) return resolve(true);
        existingScript.addEventListener("load", resolve);
        existingScript.addEventListener("error", reject);
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  await Promise.all([
    !(window as any).htmlToImage
      ? loadScript("https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js")
      : Promise.resolve(),
    !(window as any).jspdf
      ? loadScript("https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js")
      : Promise.resolve(),
  ]);

  const { jsPDF } = (window as any).jspdf;
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [794, 1123],
  });

  let pagesAdded = 0;
  for (let i = 0; i < pageIds.length; i++) {
    const el = document.getElementById(pageIds[i]);
    if (!el) continue;

    const img = await (window as any).htmlToImage.toPng(el, { pixelRatio });
    if (pagesAdded > 0) {
      pdf.addPage([794, 1123], "portrait");
    }
    pdf.addImage(img, "PNG", 0, 0, 794, 1123);
    pagesAdded++;
  }

  if (pagesAdded > 0) {
    pdf.save(filename);
    return true;
  }
  return false;
}
