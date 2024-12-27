// Data
let products = [];
let customers = [];
let transactions = [];
let currentUser = null;

// Login
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (username === "admin" && password === "1234") {
        currentUser = "admin";
        document.getElementById("login-section").classList.add("d-none");
        document.getElementById("app-section").classList.remove("d-none");
    } else {
        alert("Username atau password salah!");
    }
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById("login-section").classList.remove("d-none");
    document.getElementById("app-section").classList.add("d-none");
}

// Tab Navigation
function showTab(tab) {
    const tabs = document.querySelectorAll(".tab-content");
    tabs.forEach((tabElement) => tabElement.classList.add("d-none"));
    document.getElementById(tab).classList.remove("d-none");
}

// Produk
function addProduct() {
    const name = document.getElementById("product-name").value.trim();
    const price = parseInt(document.getElementById("product-price").value.trim());
    const stock = parseInt(document.getElementById("product-stock").value.trim());
    const category = document.getElementById("product-category").value.trim();
    if (name && !isNaN(price) && !isNaN(stock) && category) {
        products.push({ name, price, stock, category });
        renderProducts();
    } else {
        alert("Isi semua field produk dengan benar!");
    }
}

function renderProducts() {
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    products.forEach((product, index) => {
        list.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>Rp${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.category}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function deleteProduct(index) {
    products.splice(index, 1);
    renderProducts();
}

// Pelanggan
function addCustomer() {
    const name = document.getElementById("customer-name").value.trim();
    if (name) {
        const id = `CUST-${customers.length + 1}`;
        customers.push({ name, id });
        renderCustomers();
    } else {
        alert("Nama pelanggan harus diisi!");
    }
}

function renderCustomers() {
    const list = document.getElementById("customer-list");
    list.innerHTML = "";
    customers.forEach((customer) => {
        list.innerHTML += `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.id}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomer('${customer.id}')">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function deleteCustomer(id) {
    customers = customers.filter((customer) => customer.id !== id);
    renderCustomers();
}

// Transaksi
function checkout() {
    const total = products.reduce((sum, product) => sum + product.price, 0);
    transactions.push({ total, date: new Date().toLocaleString() });
    renderTransactions();
    alert(`Transaksi berhasil dengan total Rp${total}`);
}

function renderTransactions() {
    const list = document.getElementById("transaction-history");
    list.innerHTML = "";
    transactions.forEach((transaction) => {
        list.innerHTML += `<li class="list-group-item">${transaction.date} - Rp${transaction.total}</li>`;
    });
}
