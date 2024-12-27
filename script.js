let products = [];
let cart = [];
let currentPage = 1;
const itemsPerPage = 5;
let loggedInUser = null;
let users = [];

// Cek apakah ada data produk, riwayat pembelian, dan data pengguna yang tersimpan di localStorage
if (localStorage.getItem("products")) {
    products = JSON.parse(localStorage.getItem("products"));
}
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
}
if (localStorage.getItem("loggedInUser")) {
    loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    displayLoggedIn();
}
if (localStorage.getItem("users")) {
    users = JSON.parse(localStorage.getItem("users"));
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Autentikasi pengguna sederhana
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        loggedInUser = user;
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        displayLoggedIn();
    } else {
        alert("Username atau password salah!");
    }
});

function displayLoggedIn() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("logoutSection").style.display = "block";
    renderProducts();
    renderCart();
    renderPurchaseHistory();
}

function logout() {
    localStorage.removeItem("loggedInUser");
    loggedInUser = null;
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("logoutSection").style.display = "none";
    renderProducts();
    renderCart();
}

function renderProducts() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const maxPrice = document.getElementById("priceFilter").value;

    const filteredProducts = products.filter(product => {
        return (
            (product.name.toLowerCase().includes(searchText) ||
                product.description.toLowerCase().includes(searchText)) &&
            (category === "" || product.category === category) &&
            product.price <= maxPrice
        );
    });

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
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProduct(${start + index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${start + index})">Hapus</button>
                <button class="btn btn-info btn-sm" onclick="addToCart(${start + index})" ${product.stock === 0 ? 'disabled' : ''}>Tambah ke Keranjang</button>
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
    document.getElementById("productStock").value = product.stock;
    editingIndex = index;
}

function deleteProduct(index) {
    products.splice(index, 1);
    saveProductsToLocalStorage();
    renderProducts();
}

function addToCart(index) {
    const product = products[index];
    if (product.stock > 0) {
        cart.push(product);
        product.stock--;
        saveProductsToLocalStorage();
        saveCartToLocalStorage();
        renderCart();
    } else {
        alert("Stok produk habis!");
    }
}

function saveProductsToLocalStorage() {
    localStorage.setItem("products", JSON.stringify(products));
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
    const item = cart[index];
    item.stock++;
    cart.splice(index, 1);
    saveProductsToLocalStorage();
    saveCartToLocalStorage();
    renderCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Keranjang kosong. Tambahkan produk terlebih dahulu.");
        return;
    }

    let totalPrice = cart.reduce((total, item) => total + parseInt(item.price), 0);
    if (loggedInUser.balance < totalPrice) {
        alert("Saldo tidak cukup untuk checkout.");
        return;
    }

    // Proses checkout dan simpan histori pembelian
    loggedInUser.balance -= totalPrice;
    users = users.map(user => user.username === loggedInUser.username ? loggedInUser : user);
    localStorage.setItem("users", JSON.stringify(users));

    // Menyimpan histori pembelian
    const purchaseHistory = loggedInUser.purchaseHistory || [];
    purchaseHistory.push({
        date: new Date().toLocaleString(),
        items: cart,
        total: totalPrice
    });
    loggedInUser.purchaseHistory = purchaseHistory;
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    cart = [];
    saveCartToLocalStorage();
    renderCart();
    renderPurchaseHistory();
}

function renderPurchaseHistory() {
    const purchaseHistory = loggedInUser?.purchaseHistory || [];
    const purchaseHistorySection = document.getElementById("purchaseHistory");
    purchaseHistorySection.innerHTML = "";
    if (purchaseHistory.length === 0) {
        purchaseHistorySection.innerHTML = "<p>Belum ada riwayat pembelian.</p>";
    } else {
        purchaseHistory.forEach(history => {
            const row = document.createElement("div");
            row.classList.add("mb-3");
            row.innerHTML = `
                <strong>${history.date}</strong>
                <ul>
                    ${history.items.map(item => `<li>${item.name} - Rp ${item.price}</li>`).join('')}
                </ul>
                <p>Total: Rp ${history.total}</p>
            `;
            purchaseHistorySection.appendChild(row);
        });
    }
}

// Simulasi saldo untuk user
if (loggedInUser) {
    loggedInUser.balance = loggedInUser.balance || 1000000; // Misalnya saldo awal 1 juta
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
}

renderProducts();
renderCart();
renderPurchaseHistory();
