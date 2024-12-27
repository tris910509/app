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



let products = [];
let customers = [];
let transactions = [];
let currentUser = null;
let cart = [];


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

function logout() {
    currentUser = null;
    document.getElementById("login-section").classList.remove("d-none");
    document.getElementById("app-section").classList.add("d-none");
}

function showTab(tab) {
    const tabs = document.querySelectorAll(".tab-content");
    tabs.forEach((tabElement) => tabElement.classList.add("d-none"));
    document.getElementById(tab).classList.remove("d-none");
}


function addProduct() {
    const name = document.getElementById("product-name").value.trim();
    const price = parseFloat(document.getElementById("product-price").value);
    const stock = parseInt(document.getElementById("product-stock").value);
    const category = document.getElementById("product-category").value.trim();
    const image = document.getElementById("product-image").files[0];

    if (!name || isNaN(price) || isNaN(stock) || !category) {
        alert("Harap isi semua field produk dengan benar!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const imageUrl = reader.result;
        products.push({ name, price, stock, category, imageUrl });
        renderProducts();
    };
    if (image) reader.readAsDataURL(image);
    else {
        products.push({ name, price, stock, category, imageUrl: null });
        renderProducts();
    }
}

function renderProducts() {
    const list = document.getElementById("product-list");
    const search = document.getElementById("search-product").value.toLowerCase();
    list.innerHTML = "";
    products
        .filter(product => product.name.toLowerCase().includes(search))
        .forEach((product, index) => {
            list.innerHTML += `
                <tr>
                    <td><img src="${product.imageUrl || ''}" alt="Gambar Produk" width="50"></td>
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
    if (confirm("Yakin ingin menghapus produk ini?")) {
        products.splice(index, 1);
        renderProducts();
    }
}


function addCustomer() {
    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const email = document.getElementById("customer-email").value.trim();

    if (!name || !phone || !email) {
        alert("Harap isi semua field pelanggan dengan benar!");
        return;
    }

    const id = `CUST-${customers.length + 1}`;
    customers.push({ id, name, phone, email, points: 0 });
    renderCustomers();
}

function renderCustomers() {
    const list = document.getElementById("customer-list");
    const search = document.getElementById("search-customer").value.toLowerCase();
    list.innerHTML = "";
    customers
        .filter(customer => customer.name.toLowerCase().includes(search))
        .forEach((customer) => {
            list.innerHTML += `
                <tr>
                    <td>${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.email}</td>
                    <td>${customer.points}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteCustomer('${customer.id}')">Hapus</button>
                    </td>
                </tr>
            `;
        });
}

function deleteCustomer(id) {
    if (confirm("Yakin ingin menghapus pelanggan ini?")) {
        customers = customers.filter(customer => customer.id !== id);
        renderCustomers();
    }
}



function addToCart(productIndex) {
    const product = products[productIndex];
    const existing = cart.find(item => item.name === product.name);

    if (existing) {
        if (existing.quantity < product.stock) existing.quantity++;
        else alert("Stok tidak mencukupi!");
    } else if (product.stock > 0) {
        cart.push({ ...product, quantity: 1 });
    } else {
        alert("Produk habis!");
    }

    renderCart();
}

function renderCart() {
    const cartList = document.getElementById("cart");
    const totalDisplay = document.getElementById("transaction-total");

    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartList.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>Rp${item.price}</td>
                <td>${item.quantity}</td>
                <td>Rp${itemTotal}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="decreaseCartItem(${index})">-</button>
                    <button class="btn btn-sm btn-danger" onclick="removeCartItem(${index})">Hapus</button>
                </td>
            </tr>
        `;
    });

    totalDisplay.textContent = total.toFixed(2);
}

function checkout() {
    const method = document.getElementById("payment-method").value;
    if (!cart.length) {
        alert("Keranjang kosong!");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    transactions.push({ cart, total, method, date: new Date().toLocaleString() });

    cart.forEach(item => {
        const product = products.find(p => p.name === item.name);
        product.stock -= item.quantity;
    });

    cart = [];
    renderCart();
    renderProducts();
    renderTransactions();
    alert(`Transaksi berhasil! Total Rp${total.toFixed(2)} dengan metode ${method}.`);
}

function renderTransactions() {
    const history = document.getElementById("transaction-history");
    history.innerHTML = "";

    transactions.forEach((transaction, index) => {
        history.innerHTML += `
            <li class="list-group-item">
                <strong>Transaksi #${index + 1}</strong><br>
                Total: Rp${transaction.total.toFixed(2)}<br>
                Metode: ${transaction.method}<br>
                Tanggal: ${transaction.date}
            </li>
        `;
    });
}















