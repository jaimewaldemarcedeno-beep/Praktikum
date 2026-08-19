const firstBtn = document.getElementById("pdf1");
const secondBtn = document.getElementById("pdf2");
const thirdBtn = document.getElementById("pdf3");
const fourthBtn = document.getElementById("pdf4");
const fifthBtn = document.getElementById("pdf5");
const ausblendenBtn = document.getElementById("ausblenden");
const pdfIframe = document.getElementById("pdf-ifr1");


firstBtn.addEventListener("click", () => {
  pdfIframe.src = "Praktikumsreise-Anfang.pdf"; 
  console.log("PDF 1 geladen");
  pdfIframe.style.display = "block"; // Iframe anzeigen, wenn PDF geladen wird
});

secondBtn.addEventListener("click", () => {
  pdfIframe.src = "Einfuehrung_in_BWL.pdf";
  console.log("PDF 2 geladen");
  pdfIframe.style.display = "block"; // Iframe anzeigen, wenn PDF geladen wird

});

thirdBtn.addEventListener("click", () => {
  pdfIframe.src = "Einfuehrung_in_die_Agile_Arbeitsweise.pdf";
  console.log("PDF 3 geladen");
  pdfIframe.style.display = "block"; // Iframe anzeigen, wenn PDF geladen wird
});

fourthBtn.addEventListener("click", () => {
  pdfIframe.src = "Einfuehrung_in_die_Programmierung.pdf";
  console.log("PDF 4 geladen");
  pdfIframe.style.display = "block"; // Iframe anzeigen, wenn PDF geladen wird
});

fifthBtn.addEventListener("click", () => {
  pdfIframe.src = "Praktikumsreise-Ende.pdf";
  console.log("PDF 5 geladen");
  pdfIframe.style.display = "block"; // Iframe anzeigen, wenn PDF geladen wird
});
ausblendenBtn.addEventListener("click", () => {
  pdfIframe.src = "";
  pdfIframe.style.display = "none";
})