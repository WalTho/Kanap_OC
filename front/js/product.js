// Product ID retrieval
const getProductId = () => {
    return new URL(location.href).searchParams.get("id");
};
const productId = getProductId();

fetch(`http://localhost:3000/api/products/${productId}`)
    .then((response) => {
        return response.json();
    })

    .then((product) => {
        selectedProduct(product);
        registredProduct(product);
    })
    .catch((error) => {
        alert(error);
    });

// Select colors ID
const selectedColor = document.querySelector("#colors");

// Select quantity ID
const selectedQuantity = document.querySelector("#quantity");

// Select the Add to Cart button
const button = document.querySelector("#addToCart");

// Function that retrieves the data from the .then(product) promise to inject the values into the Html file
let selectedProduct = (product) => {
    // Integration of the selected product data in the HTML page
    document.querySelector("head > title").textContent = product.name;
    document.querySelector(".item__img")
        .innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    document.querySelector("#title").textContent += product.name;
    document.querySelector("#price").textContent += product.price;
    document.querySelector("#description").textContent += product.description;

    // Loop integrating the different colors of the product in the HTML
    for (color of product.colors) {
        let option = document.createElement("option");
        option.innerHTML = `${color}`;
        option.value = `${color}`;
        selectedColor.appendChild(option);
    }
};

// Function that saves in an object the user's options when clicking on the add to cart button
let registredProduct = (product) => {
    // Listening to the event click on the add button
    button.addEventListener("click", (event) => {
        event.preventDefault();

        if (selectedColor.value == false) {
            confirm("Veuillez sélectionner une couleur");
        } else if (selectedQuantity.value == 0) {
            confirm("Veuillez sélectionner le nombre d'articles souhaités");
        } else {
            alert("Votre article a bien été ajouté au panier");

            // Retrieving information from the selected product
            let selectedProduct = {
                id: product._id,
                name: product.name,
                img: product.imageUrl,
                altTxt: product.altTxt,
                description: product.description,
                color: selectedColor.value,
                quantity: parseInt(selectedQuantity.value, 10),
            };
            console.log(selectedProduct);

            // LocalStorage management

            // Recovery of data from localStorage
            let existingCart = JSON.parse(localStorage.getItem("cart"));

            // If the localStorage exists
            if (existingCart) {
                console.log("Il y a déjà un produit dans le panier, on compare les données");
                // We search with the find() method if the id and the color of an item are already present
                let item = existingCart.find(
                    (item) =>
                    item.id == selectedProduct.id && item.color == selectedProduct.color
                );
                // If already present, the new quantity is incremented and the total price of the article is updated
                if (item) {
                    item.quantity = item.quantity + selectedProduct.quantity;
                    item.totalPrice += item.price * selectedProduct.quantity;
                    localStorage.setItem("cart", JSON.stringify(existingCart));
                    console.log("Quantité supplémentaire dans le panier.");
                    return;
                }
                // If not, then push the new selected item
                existingCart.push(selectedProduct);
                localStorage.setItem("cart", JSON.stringify(existingCart));
                console.log("Le produit a été ajouté au panier");

            } else {
                // Otherwise creation of an array in which we push the object "selectedProduct".
                let createLocalStorage = [];
                createLocalStorage.push(selectedProduct);
                localStorage.setItem("cart", JSON.stringify(createLocalStorage));
                console.log("Le panier est vide, on ajoute le premier produit");
            }
        }
    });
};