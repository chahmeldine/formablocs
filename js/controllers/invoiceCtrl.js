const tbodyContainer = document.querySelector("tbody");
const clientInfo = document.querySelector(".invoic2");
const dateInvoice = document.querySelector(".invoic3");
const { email, invoiceId } = JSON.parse(localStorage.getItem("currentUser"));

const showInvoice = () => {
  fbHelper.getInvoice(
    email,
    invoiceId,
    tbodyContainer,
    clientInfo,
    dateInvoice
  );
};

showInvoice();
