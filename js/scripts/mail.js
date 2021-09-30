function send() {
  emailjs
    .send("Formablocs", "template_mnaxjl8", {
      from_name: document.querySelector("name_form").value,
      message: `name:${document.querySelector("name_form").value},
    téléphone:${document.querySelector("phone_form").value},
    message:${document.querySelector("message_form").value}`,
      email_to: document.querySelector("mail_form").value,
    })
    .then((response) => {
      console.log("suy");
    });
}

document.querySelector("#formabutton").addEventListener("click", send);
