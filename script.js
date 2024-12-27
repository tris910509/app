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





let isAdmin = false;

// Menambahkan fungsi login admin
function loginAdmin(username, password) {
    // Misalnya admin memiliki username 'admin' dan password 'admin123'
    if (username === "admin" && password === "admin123") {
        isAdmin = true;
        alert("Anda berhasil login sebagai admin!");
        renderAdminDashboard();
    } else {
        alert("Username atau password salah!");
    }
}

// Render Dashboard Admin
function renderAdminDashboard() {
    document.getElementById("adminDashboard").style.display = "block";
    renderAllPurchases();
}

// Menambahkan bagian untuk mengelola produk (admin) di **index.html**

<div id="adminDashboard" style="display: none;">
    <h4>Dashboard Admin</h4>
    <button class="btn btn-danger" onclick="logoutAdmin()">Logout Admin</button>
    <h5>Riwayat Pembelian Semua Pengguna</h5>
    <div id="allPurchases"></div>
</div>




function renderAllPurchases() {
    const allPurchasesContainer = document.getElementById("allPurchases");
    allPurchasesContainer.innerHTML = "";

    users.forEach(user => {
        if (user.purchaseHistory) {
            user.purchaseHistory.forEach(history => {
                const historyDiv = document.createElement("div");
                historyDiv.innerHTML = `
                    <h6>${user.username} - ${history.date}</h6>
                    <ul>
                        ${history.items.map(item => `<li>${item.name} - Rp ${item.price}</li>`).join('')}
                    </ul>
                    <p>Total: Rp ${history.total}</p>
                    <hr>
                `;
                allPurchasesContainer.appendChild(historyDiv);
            });
        }
    });
}

// Logout admin
function logoutAdmin() {
    isAdmin = false;
    document.getElementById("adminDashboard").style.display = "none";
}




let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function addToWishlist(index) {
    const product = products[index];
    if (!wishlist.some(item => item.name === product.name)) {
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        renderWishlist();
    } else {
        alert("Produk sudah ada di wishlist.");
    }
}

function renderWishlist() {
    const wishlistContainer = document.getElementById("wishlistItems");
    wishlistContainer.innerHTML = "";
    
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "<p>Wishlist kosong</p>";
    } else {
        wishlist.forEach((item, index) => {
            const row = document.createElement("div");
            row.classList.add("d-flex", "justify-content-between", "mb-2");
            row.innerHTML = `
                <span>${item.name} - Rp ${item.price}</span>
                <button class="btn btn-danger btn-sm" onclick="removeFromWishlist(${index})">Hapus</button>
            `;
            wishlistContainer.appendChild(row);
        });
    }
}

function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist();
}




document.getElementById("searchInput").addEventListener("input", function () {
    renderProducts();
});

document.getElementById("categoryFilter").addEventListener("change", function () {
    renderProducts();
});

document.getElementById("priceFilter").addEventListener("input", function () {
    document.getElementById("priceValue").innerText = `Rp ${this.value}`;
    renderProducts();
});




function registerUser(username, password) {
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        alert("Username sudah terdaftar!");
    } else {
        const newUser = { username, password, balance: 1000000, purchaseHistory: [] };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        alert("Pendaftaran berhasil! Silakan login.");
    }
}



function applyPromoCode() {
    const promoCode = document.getElementById("promoCode").value;
    const validPromo = promoCode === "DISKON50"; // Contoh kode promo yang memberikan diskon 50%
    if (validPromo) {
        const discount = 0.5;
        const totalPrice = cart.reduce((total, item) => total + parseInt(item.price), 0);
        const discountedPrice = totalPrice * (1 - discount);
        alert(`Diskon diterapkan! Total harga: Rp ${discountedPrice}`);
    } else {
        alert("Kode promo tidak valid.");
    }
}


function calculateShippingCost() {
    const location = document.getElementById("deliveryLocation").value;
    let shippingCost = 0;
    switch (location) {
        case "Jakarta":
            shippingCost = 10000;
            break;
        case "Surabaya":
            shippingCost = 20000;
            break;
        case "Bandung":
            shippingCost = 15000;
            break;
    }
    alert(`Biaya pengiriman ke ${location}: Rp ${shippingCost}`);
}




let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(index) {
    const product = products[index];
    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById("cartItems");
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Keranjang belanja kosong</p>";
    } else {
        cart.forEach((item, index) => {
            const row = document.createElement("div");
            row.classList.add("d-flex", "justify-content-between", "mb-2");
            row.innerHTML = `
                <span>${item.name} - Rp ${item.price} x ${item.quantity}</span>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Hapus</button>
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
            `;
            cartContainer.appendChild(row);
        });

        const total = cart.reduce((total, item) => total + (parseInt(item.price) * item.quantity), 0);
        const totalDiv = document.createElement("div");
        totalDiv.innerHTML = `<p><strong>Total: Rp ${total}</strong></p>`;
        cartContainer.appendChild(totalDiv);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function updateQuantity(index, quantity) {
    cart[index].quantity = parseInt(quantity);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}




function proceedToCheckout() {
    if (cart.length === 0) {
        alert("Keranjang belanja kosong!");
        return;
    }

    const total = cart.reduce((total, item) => total + (parseInt(item.price) * item.quantity), 0);
    const shippingCost = 20000; // Asumsi biaya pengiriman tetap
    const grandTotal = total + shippingCost;

    const checkoutDetails = {
        items: cart,
        total: total,
        shipping: shippingCost,
        grandTotal: grandTotal
    };

    alert(`Total Belanja: Rp ${total}\nBiaya Pengiriman: Rp ${shippingCost}\nTotal Pembayaran: Rp ${grandTotal}`);
    // Simpan data checkout ke riwayat pengguna
    const user = users[0]; // Misalnya user pertama
    user.purchaseHistory.push({
        date: new Date().toLocaleString(),
        items: cart,
        total: grandTotal
    });
    localStorage.setItem("users", JSON.stringify(users));

    // Kosongkan keranjang setelah checkout
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}



function proceedToCheckout() {
    if (cart.length === 0) {
        alert("Keranjang belanja kosong!");
        return;
    }

    const total = cart.reduce((total, item) => total + (parseInt(item.price) * item.quantity), 0);
    const shippingCost = 20000; // Asumsi biaya pengiriman tetap
    const grandTotal = total + shippingCost;

    const checkoutDetails = {
        items: cart,
        total: total,
        shipping: shippingCost,
        grandTotal: grandTotal
    };

    alert(`Total Belanja: Rp ${total}\nBiaya Pengiriman: Rp ${shippingCost}\nTotal Pembayaran: Rp ${grandTotal}`);
    // Simpan data checkout ke riwayat pengguna
    const user = users[0]; // Misalnya user pertama
    user.purchaseHistory.push({
        date: new Date().toLocaleString(),
        items: cart,
        total: grandTotal
    });
    localStorage.setItem("users", JSON.stringify(users));

    // Kosongkan keranjang setelah checkout
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}



function submitReview(productIndex, reviewText, rating) {
    const product = products[productIndex];
    if (!product.reviews) {
        product.reviews = [];
    }

    product.reviews.push({ text: reviewText, rating: rating });
    localStorage.setItem("products", JSON.stringify(products));
    alert("Review berhasil ditambahkan!");
    renderProductReviews(productIndex);
}

function renderProductReviews(productIndex) {
    const product = products[productIndex];
    const reviewContainer = document.getElementById("reviewsContainer");

    if (product.reviews && product.reviews.length > 0) {
        reviewContainer.innerHTML = product.reviews.map(review => `
            <div>
                <p><strong>Rating: ${review.rating}</strong></p>
                <p>${review.text}</p>
            </div>
        `).join('');
    } else {
        reviewContainer.innerHTML = "<p>Belum ada review untuk produk ini.</p>";
    }
}



function proceedToPayment() {
    if (cart.length === 0) {
        alert("Keranjang belanja kosong!");
        return;
    }

    const total = cart.reduce((total, item) => total + (parseInt(item.price) * item.quantity), 0);
    const shippingCost = 20000; // Asumsi biaya pengiriman tetap
    const grandTotal = total + shippingCost;

    // Simulasi proses pembayaran
    const paymentMethod = prompt("Pilih metode pembayaran: 1. Transfer Bank 2. Kartu Kredit");
    
    if (paymentMethod === "1" || paymentMethod === "2") {
        alert(`Pembayaran berhasil! Total Pembayaran: Rp ${grandTotal}`);
        completePurchase(grandTotal);
    } else {
        alert("Metode pembayaran tidak valid.");
    }
}

function completePurchase(grandTotal) {
    // Simulasi penyelesaian pembelian
    alert(`Pembelian selesai. Total yang dibayar: Rp ${grandTotal}`);
    // Menyimpan pembelian dalam riwayat pengguna
    const user = users[0]; // Misalnya user pertama
    user.purchaseHistory.push({
        date: new Date().toLocaleString(),
        items: cart,
        total: grandTotal
    });
    localStorage.setItem("users", JSON.stringify(users));

    // Kosongkan keranjang setelah checkout
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}



let users = JSON.parse(localStorage.getItem("users")) || [];

function login(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser = user;
        alert(`Selamat datang, ${username}`);
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
        alert("Username atau password salah");
    }
}

function renderProfile() {
    if (currentUser) {
        const profileContainer = document.getElementById("profile");
        profileContainer.innerHTML = `
            <h4>Profil Pengguna</h4>
            <p>Username: ${currentUser.username}</p>
            <p>Email: ${currentUser.email || "Tidak ada email"}</p>
            <button class="btn btn-primary" onclick="editProfile()">Edit Profil</button>
        `;
    }
}

function editProfile() {
    const newEmail = prompt("Masukkan email baru:");
    currentUser.email = newEmail;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    renderProfile();
}





function renderSalesReport() {
    if (isAdmin()) {
        const reportContainer = document.getElementById("salesReport");
        reportContainer.innerHTML = "<h4>Laporan Penjualan</h4>";

        users.forEach(user => {
            if (user.purchaseHistory) {
                user.purchaseHistory.forEach(history => {
                    const transactionRow = document.createElement("div");
                    transactionRow.innerHTML = `
                        <p><strong>${user.username}</strong> - Tanggal: ${history.date}</p>
                        <ul>
                            ${history.items.map(item => `<li>${item.name} - Rp ${item.price} x ${item.quantity}</li>`).join('')}
                        </ul>
                        <p><strong>Total Pembelian: Rp ${history.total}</strong></p>
                    `;
                    reportContainer.appendChild(transactionRow);
                });
            }
        });
    }
}




























