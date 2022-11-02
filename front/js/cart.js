// Recovery of the localStorage
let cart = JSON.parse(localStorage.getItem("cart"));

// Variable to store the Id of each item in the cart (used to create the order)
let products = [];

// Variable that retrieves the orderId sent as a response by the server during the POST request
let orderId = "";

// Display the contents of the basket
async function displayCart() {
    const parser = new DOMParser();
    const positionEmptyCart = document.getElementById("cart__items");
    let cartArray = [];

    // If the localStorage is empty
    if (cart === null || cart === 0) {
        positionEmptyCart.textContent = "Le panier est vide";
    } else {
        console.log("Des produits sont dans le panier");
    }

    // If the localStorage contains products
    for (i = 0; i < cart.length; i++) {
        const product = await getProductById(cart[i].id);
        const totalPriceItem = (product.price *= cart[i].quantity);
        cartArray += `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
                        <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${product.name}</h2>
                                <p>${cart[i].color}</p>
                                <p>Prix unitaire: ${product.price}€</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p id="quantité">
                                    Qté : <input data-id= ${cart[i].id} data-color= ${cart[i].color} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${cart[i].quantity}>
                                    </p>
                                    <p id="sousTotal">Prix total pour cet article: ${totalPriceItem}€</p> 
                                </div>
                                <div class="cart__item__content__settings__delete">
                                <p data-id= ${cart[i].id} data-color= ${cart[i].color} class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </article>`;
    }
    // Loop to display the total number of items in the cart and the total price amount
    let totalQuantity = 0;
    let totalPrice = 0;

    for (i = 0; i < cart.length; i++) {
        const article = await getProductById(cart[i].id);
        totalQuantity += parseInt(cart[i].quantity);
        totalPrice += parseInt(article.price * cart[i].quantity);
    }

    document.getElementById("totalQuantity").innerHTML = totalQuantity;
    document.getElementById("totalPrice").innerHTML = totalPrice;

    if (i == cart.length) {
        const displayBasket = parser.parseFromString(cartArray, "text/html");
        positionEmptyCart.appendChild(displayBasket.body);
        changeQuantity();
        deleteItem();
    }
}

// Recovery of API products
async function getProductById(productId) {
    return fetch("http://localhost:3000/api/products/" + productId)
        .then(function(res) {
            return res.json();
        })
        .catch((err) => {
            // Server error
            console.log("server error");
        })
        .then(function(response) {
            return response;
        });
}
displayCart();

// Modification of the quantity
function changeQuantity() {
    const quantityInputs = document.querySelectorAll(".itemQuantity");
    quantityInputs.forEach((quantityInput) => {
        quantityInput.addEventListener("change", (event) => {
            event.preventDefault();
            const inputValue = event.target.value;
            const dataId = event.target.getAttribute("data-id");
            const dataColor = event.target.getAttribute("data-color");
            let cart = localStorage.getItem("cart");
            let items = JSON.parse(cart);

            items = items.map((item, index) => {
                if (item.id === dataId && item.color === dataColor) {
                    item.quantity = inputValue;
                }
                return item;
            });
            // Update of localStorage
            let itemsStr = JSON.stringify(items);
            localStorage.setItem("cart", itemsStr);
            // Refresh
            location.reload();
        });
    });
}

// Deleting an item
function deleteItem() {
    const deleteButtons = document.querySelectorAll(".deleteItem");
    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener("click", (event) => {
            event.preventDefault();
            const deleteId = event.target.getAttribute("data-id");
            const deleteColor = event.target.getAttribute("data-color");
            cart = cart.filter(
                (element) => !(element.id == deleteId && element.color == deleteColor)
            );
            console.log(cart);
            // Update of localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
            // Refresh
            location.reload();
            alert("L'article a été supprimé du panier.");
        });
    });
}

// Select the validate button
const btnValidate = document.querySelector("#order");

// addEventListener onClick to the Validate button to validate the form
btnValidate.addEventListener("click", (event) => {
    event.preventDefault();

    let contact = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value,
    };

    console.log(contact);

    // Regex to control the First Name, Last Name and City fields
    const regExDefault = (value) => {
        return /^[A-Z][A-Za-z\é\è\ê\-]+$/.test(value);
    };

    // Regex for address field control
    const regExAdress = (value) => {
        return /^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$/.test(value);
    };

    // Regex to control the Email field
    const regExEmail = (value) => {
        return /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(
            value
        );
    };

    // Control functions of the First Name field:
    function firstNameControl() {
        const firstname = contact.firstName;
        let inputFirstName = document.querySelector("#firstName");
        if (regExDefault(firstname)) {
            inputFirstName.style.backgroundColor = "green";

            document.querySelector("#firstNameErrorMsg").textContent = "";
            return true;
        } else {
            inputFirstName.style.backgroundColor = "#FF6F61";

            document.querySelector("#firstNameErrorMsg").textContent =
                "Le Champ Prénom du formulaire est invalide, ex: Jacques";
            return false;
        }
    }

    // Control functions of the Name field:
    function lastNameControl() {
        const lastname = contact.lastName;
        let inputLastName = document.querySelector("#lastName");
        if (regExDefault(lastname)) {
            inputLastName.style.backgroundColor = "green";

            document.querySelector("#lastNameErrorMsg").textContent = "";
            return true;
        } else {
            inputLastName.style.backgroundColor = "#FF6F61";

            document.querySelector("#lastNameErrorMsg").textContent =
                "Le Champ Nom du formulaire est invalide, ex: Dupont";
            return false;
        }
    }

    // Control functions of the Address field:
    function addressControl() {
        const addressField = contact.address;
        let inputAddress = document.querySelector("#address");
        if (regExAdress(addressField)) {
            inputAddress.style.backgroundColor = "green";

            document.querySelector("#addressErrorMsg").textContent = "";
            return true;
        } else {
            inputAddress.style.backgroundColor = "#FF6F61";

            document.querySelector("#addressErrorMsg").textContent =
                "Le Champ Adresse du formulaire est invalide, ex: 5 av Charles de Gaulles";
            return false;
        }
    }

    // Control functions of the City field:
    function cityControl() {
        const town = contact.city;
        let inputCity = document.querySelector("#city");
        if (regExDefault(town)) {
            inputCity.style.backgroundColor = "green";

            document.querySelector("#cityErrorMsg").textContent = "";
            return true;
        } else {
            inputCity.style.backgroundColor = "#FF6F61";

            document.querySelector("#cityErrorMsg").textContent =
                "Le Champ Ville du formulaire est invalide, ex: Lille";
            return false;
        }
    }

    // Email field control functions:
    function mailControl() {
        const mail = contact.email;
        let inputMail = document.querySelector("#email");
        if (regExEmail(mail)) {
            inputMail.style.backgroundColor = "green";

            document.querySelector("#emailErrorMsg").textContent = "";
            return true;
        } else {
            inputMail.style.backgroundColor = "#FF6F61";

            document.querySelector("#emailErrorMsg").textContent =
                "Le Champ Email du formulaire est invalide, ex: example@kanap.com";
            return false;
        }
    }

    // Checks the validity of the form before sending it to the local storage
    if (
        firstNameControl() &&
        lastNameControl() &&
        addressControl() &&
        cityControl() &&
        mailControl()
    ) {
        // Save the form in the local storage
        localStorage.setItem("contact", JSON.stringify(contact));

        document.querySelector("#order").value =
            "Cliquez pour confirmer";
        sendToServer();
    } else {
        error("Veuillez bien remplir les champs du formulaire");
    }

    function sendToServer() {
        const sendToServer = fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                body: JSON.stringify({
                    contact,
                    products
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            // Retrieve and store the API response (orderId)
            .then((response) => {
                return response.json();
            })
            .then((server) => {
                orderId = server.orderId;
                console.log(orderId);
            });

        // If the orderId has been successfully retrieved, the user is redirected to the Confirmation page
        if (orderId != "") {
            location.href = "confirmation.html?id=" + orderId;
        }
    }
});

// Keep the content of the localStorage in the form field

let dataForm = JSON.parse(localStorage.getItem("contact"));

console.log(dataForm);
if (dataForm) {
    document.querySelector("#firstName").value = dataForm.firstName;
    document.querySelector("#lastName").value = dataForm.lastName;
    document.querySelector("#address").value = dataForm.address;
    document.querySelector("#city").value = dataForm.city;
    document.querySelector("#email").value = dataForm.email;
} else {
    console.log("Le formulaire est vide");
}