const getProductId = () => {
    return new URL(location.href).searchParams.get("id");
};
const orderId = getProductId();

const cart = JSON.parse(localStorage.getItem("cart"));

const confirmationId = document.querySelector("#orderId");

const backBtn = `<button id="backBtn"><a href="./index.html">Retour à l'accueil</a></button>`;

// Display of the orderId in the DOM
(function() {
        confirmationId.innerHTML = `
            <br>
            <strong>${orderId}</strong>. <br>
            <br>
        `;
        confirmationId.insertAdjacentHTML("beforeend", backBtn);
        localStorage.clear();
    }
)();