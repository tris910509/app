let products = [];
let editingIndex = null;
let currentPage = 1;
const itemsPerPage = 5;
let cart = [];

// Cek apakah ada data produk yang tersimpan di localStorage
if (localStorage.getItem("products")) {
    products = JSON.parse(localStorage.getItem("products"));
}

// Cek apakah ada data keranjang yang tersimpan di localStorage
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
}

document.getElementById("productForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const category = document.getElementById("productCategory").value;
    const description = document.getElementById("productDescription").value;
    const imageFile = document.getElementById("productImage").files[0];

    // Validasi form
    if (!name || !price || !category || !description) {
        alert("Semua field harus diisi!");
        return;
    }

    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : "";

    if (editingIndex === null) {
        // Tambah produk baru
        products.push({ name, price, category, description, imageUrl });
    } else {
        // Edit produk
        products[editingIndex] = { name, price, category, description, imageUrl };
        editingIndex = null;
    }

    document.getElementById("productForm").reset();
    saveProductsToLocalStorage();
    renderProducts();
});

document.getElementById("searchInput").addEventListener("input", function (e) {
    const searchText = e.target.value.toLowerCase();
    renderProducts(searchText);
});

function renderProducts(searchText = "") {
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchText) ||
        product.description.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText)
    );

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    const productTable = document.getElementById("productTable");
    productTable.innerHTML = "";

    paginatedProducts.forEach((product, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${product.name}</td>
            <td>Rp ${product.price}</td>
            <td>${product.category}</td>
            <td>${product.description}</td>
            <td><img src="${product.imageUrl}" alt="Gambar Produk" width="100"></td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProduct(${start + index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${start + index})">Hapus</button>
                <button class="btn btn-info btn-sm" onclick="addToCart(${start + index})">Tambah ke Keranjang</button>
            </td>
        `;
        productTable.appendChild(row);
    });

    renderPagination(filteredProducts.length);
}

function renderPagination(totalItems) {
    const pageCount = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= pageCount; i++) {
        const pageItem = document.createElement("li");
        pageItem.classList.add("page-item");
        pageItem.innerHTML = `
            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
        `;
        pagination.appendChild(pageItem);
    }
}

function changePage(pageNumber) {
    currentPage = pageNumber;
    renderProducts();
}

function editProduct(index) {
    const product = products[index];
    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productDescription").value = product.description;
    editingIndex = index;
}

function deleteProduct(index) {
    products.splice(index, 1);
    saveProductsToLocalStorage();
    renderProducts();
}

function saveProductsToLocalStorage() {
    localStorage.setItem("products", JSON.stringify(products));
}

function addToCart(index) {
    cart.push(products[index]);
    saveCartToLocalStorage();
    alert("Produk ditambahkan ke keranjang!");
    renderCart();
}

function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";
    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Keranjang kosong</p>";
    } else {
        cart.forEach((item, index) => {
            const row = document.createElement("div");
            row.classList.add("d-flex", "justify-content-between", "mb-2");
            row.innerHTML = `
                <span>${item.name} - Rp ${item.price}</span>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Hapus</button>
            `;
            cartItems.appendChild(row);
        });
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToLocalStorage();
    renderCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Keranjang kosong. Tambahkan produk terlebih dahulu.");
        return;
    }

    let totalPrice = cart.reduce((total, item) => total + parseInt(item.price), 0);
    alert(`Total harga: Rp ${totalPrice}. Proses pembayaran simulasi selesai.`);
    cart = [];
    saveCartToLocalStorage();
    renderCart();
}

// Render produk awal dan keranjang
renderProducts();
renderCart();
