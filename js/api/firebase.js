const firebaseConfig = {
  apiKey: "AIzaSyCwgryfraBl3_mmC2T1zBhRCiD4RRjDnpw",
  authDomain: "formablocs.firebaseapp.com",
  projectId: "formablocs",
  storageBucket: "formablocs.appspot.com",
  messagingSenderId: "519555606083",
  appId: "1:519555606083:web:f6700b0cb2b8e00af6d6f6",
  measurementId: "G-1CVYTHN6N8",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const basket = JSON.parse(localStorage.getItem("basket"));

if (!basket) {
  localStorage.setItem("basket", JSON.stringify([]));
}

//Create an object to initialize functions
const fbHelper = {};

fbHelper.getFormations = (section) => {
  const formations = [];
  db.collection("formations")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        formations.push(doc);
      });
      formations.forEach((item, idx) => {
        section.innerHTML += `
        <div class="cardformation marine">
        <h2>${item.data().title}</h2>
        <p>Financement possible :<br>
           CPF, Pôle Emploi, OPCO, Entreprises, Transition pro</p>
        <p>À partir de ${item.data().price}</p>
        <p>Disponible en formation complète, blocs <br>de compétences et VAE</p>
        <a href="/formateur.html"><button onclick="fbHelper.setItemId(event)" id=${
          item.id
        }>En savoir</button></a>
    </div>`;
      });
    });
};

fbHelper.setItemId = (event) => {
  localStorage.setItem("itemId", event.target.id);
};

fbHelper.getBlocs = async (sections, id) => {
  const querySnapshot = await db.collection("blocs").get();
  querySnapshot.forEach(async (b) => {
    let { title, price, reference } = b.data();
    const refFormation = await reference.get();
    const ref = refFormation.data();

    if (refFormation.id === id) {
      const item = {
        id: b.id,
        title,
        price,
        reference: {
          id: refFormation.id,
          data: {
            price: ref.price,
            title: ref.title,
          },
        },
      };
      sections.innerHTML += `
              <div class="bloccard marine">
              <h2>${title}</h2>
              <p>${price}euros</p>
              <p>Préparer et animer des actions de formation <br>
              collectives en intégrant des environnements numériques</p>
              <button onclick="fbHelper.addBasket(event)" id='${JSON.stringify(
                item
              )}'>Ajouter au panier</button>
          </div>`;
    }
  });
  const orangeBlock = document.querySelector(".complete-formation");
  const queryFormations = await db.collection("formations").get();

  queryFormations.forEach((form) => {
    if (form.id === id) {
      const { title, price } = form.data();
      const formItem = { id: form.id, title, price };
      orangeBlock.innerHTML = `<div class="bloccard2 orange">
            <h2>Et pour suivre la formation complète ?</h2>
            <small>${form.data().title} </small>
            <small>Prix unitaire en ${form.data().price}€</small>
            <button class="marine buttonf" onclick="fbHelper.addBasket(event)" id='${JSON.stringify(
              formItem
            )}'>Ajouter au panier</button>
        </div>`;
    }
  });
};

fbHelper.addBasket = (event) => {
  const basket = JSON.parse(localStorage.getItem("basket"));
  const item = JSON.parse(event.target.id);
  console.log(item);
  const index = basket.findIndex((el) => el.id === item.id);
  if (index >= 0) {
    basket.filter((el) => el.id !== item.id);
  } else {
    basket.push(item);
  }
  localStorage.setItem("basket", JSON.stringify(basket));
  fbHelper.getBasketCount();
};

fbHelper.removeBasketItem = (event) => {
  const basket = JSON.parse(localStorage.getItem("basket"));
  const itemId = event.target.id;
  let newBasket = [];
  if (itemId) {
    newBasket = basket.filter((el) => el.id !== itemId);
  }
  localStorage.setItem("basket", JSON.stringify(newBasket));
  fbHelper.getBasket(document.querySelector(".paniercard"));
  fbHelper.getBasketCount();
};

fbHelper.getBasket = (basketCard) => {
  const basket = JSON.parse(localStorage.getItem("basket"));
  const amount = basket.reduce((total, item) => total + item.price, 0);
  localStorage.setItem("amount", amount);
  basketCard.innerHTML = "";
  basket.forEach(({ id, title, price, reference }) => {
    basketCard.innerHTML += `                
    <div class="row articles" id="${id}">
        <div>
            <h3>
                ${title}
            </h3>
        </div>  
        <p>${price}€</p>
        <button onclick="fbHelper.removeBasketItem(event)" id="${id}">
            annuler
        </button>
    </div>`;
  });
  basketCard.insertAdjacentHTML(
    "beforeend",
    `<p class="price">Montant total: ${amount}€</p>`
  );
};

fbHelper.getBasketCount = () => {
  const basketHtml = document.querySelector(".panier");
  const basket = JSON.parse(localStorage.getItem("basket"));
  if (basket && basket.length > 0) {
    basketHtml.innerHTML = `<img src="./img/shopping-cart.svg" alt="panier"/><span >${basket.length}</span>`;
  }
};

if (location.pathname !== "/devispdf.html") {
  fbHelper.getBasketCount();
}

fbHelper.submitOrder = (nom, email, tel) => {
  axios
    .post(
      "http://localhost:5000/create-checkout-session",

      {
        articles: JSON.parse(localStorage.getItem("basket")),
        date: firebase.firestore.FieldValue.serverTimestamp(),
        email,
        nom,
        telephone: tel,
        total: localStorage.getItem("amount"),
      }
    )
    .then((response) => {
      if (response) {
        db.collection("orders")
          .add({
            articles: JSON.parse(localStorage.getItem("basket")),
            date: firebase.firestore.FieldValue.serverTimestamp(),
            email,
            nom,
            telephone: tel,
            total: localStorage.getItem("amount"),
          })
          .then((docRef) => {
            db.collection("orders").doc(docRef.id).update({
              referenceNumber: docRef.id,
            });
          })
          .catch((error) => {
            console.error("Error writing document:", error);
          });
      }
    });
};

fbHelper.submitEstimate = (nom, email, tel) => {
  db.collection("users")
    .doc(email)
    .collection("invoices")
    .add({
      articles: JSON.parse(localStorage.getItem("basket")),
      date: firebase.firestore.FieldValue.serverTimestamp(),
      email,
      nom,
      telephone: tel,
      total: localStorage.getItem("amount"),
    })
    .then((docRef) => {
      console.log(docRef.id);
      db.collection("users")
        .doc(email)
        .collection("invoices")
        .doc(docRef.id)
        .update({
          referenceNumber: docRef.id,
        });
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ invoiceId: docRef.id, email })
      );
      location.pathname = "/devispdf.html";
    })
    .catch((error) => {
      console.error("Error writing document:", error);
    });
};

fbHelper.getInvoice = (email, invoiceId, tbodyContainer, clientInfo) => {
  db.collection("users")
    .doc(email)
    .collection("invoices")
    .doc(invoiceId)
    .get()
    .then((querySnapshot) => {
      const {
        articles,
        date,
        email,
        nom,
        prenom,
        referenceNumber,
        total,
        telephone,
      } = querySnapshot.data();

      dateInvoice.innerHTML = `<p>Date du devis: ${dayjs(date.toDate())
        .locale("fr")
        .format("DD MMM YYYY")}</p>`;
      dateInvoice.insertAdjacentHTML(
        "beforeend",
        `<p>Numéro de réference: ${referenceNumber}</p>`
      );

      clientInfo.innerHTML = `            <ul>
                    <li>${nom}</li>
                    <li>${email}</li>
                    <li>${telephone}</li>
                </ul>`;

      articles.map(({ id, price, title }) => {
        tbodyContainer.innerHTML += `      
                        <tr id="${id}">
                            <td>${title}</td>
                            <td>${price}</td>
                            <td>${price}</td>
                        </tr>`;
      });
      tbodyContainer.insertAdjacentHTML(
        "beforeend",
        `              <tr>
                        <td colspan="2">
                         Total
                        </td>
           
                        <td id="prix total">
                            ${total}
                        </td>
                    </tr>`
      );
    });
};
