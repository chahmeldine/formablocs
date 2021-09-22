const basketCard = document.querySelector(".paniercard");
document.querySelector(".commandform").addEventListener("submit", (e) => {
  e.preventDefault();
  const nom = document.querySelector(`input[type='text']`);
  const email = document.querySelector(`input[type='email']`);
  const tel = document.querySelector(`input[type='tel']`);
  if (nom.value !== "" && email.value !== "" && tel.value !== "") {
    fbHelper.submitOrder(nom.value, email.value, tel.value);
  } else {
    alert("Veuillez remplir tous les champs.");
  }
});

document.querySelector("#estimate-button").addEventListener("click", (e) => {
  e.preventDefault();
  const nom = document.querySelector(`input[type='text']`);
  const email = document.querySelector(`input[type='email']`);
  const tel = document.querySelector(`input[type='tel']`);
  if (nom.value !== "" && email.value !== "" && tel.value !== "") {
    fbHelper.submitEstimate(nom.value, email.value, tel.value);
  } else {
    alert("Veuillez remplir tous les champs.");
  }
});

const displayBasket = () => {
  fbHelper.getBasket(basketCard);
};

displayBasket();
