function toPdf() {
  el = document.getElementById("invoicer");
  html2pdf().from(el).save();
}
