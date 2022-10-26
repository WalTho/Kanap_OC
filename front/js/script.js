// Retrieving data from the API
fetch("http://localhost:3000/api/products/")
    .then((response) => response.json())
    // Creation of a list of products from the API data
    .then(function(products) {
        // Integration of the different products in the homepage
        for (let product of products) {
            let i = 0;
            i < product.length;
            i++;
            document.getElementById("items").innerHTML += `<a href="./product.html?id=${product._id}">
                                                                <article>
                                                                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                                                                    <h3 class="productName">${product.name}</h3>
                                                                    <p class="productDescription">${product.description}</p>
                                                                </article>
                                                            </a>`
        }
    })
    // In case of failure to retrieve data from the API
    .catch(function(error) {
        console.log(error);
    });