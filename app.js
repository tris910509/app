// Data login dan peran
const users = [
    { id: 1, username: "admin", pin: "1234", role: "admin" },
    { id: 2, username: "kasir", pin: "5678", role: "kasir" }
];

// Data Produk, Pelanggan, dan Transaksi
let currentUser = null;
let products = loadData('products') || [];
let customers = loadData('customers') || [];
let transactions = loadData('transactions') || [];
let cart = loadData('cart') || [];

// Fungsi Login
function login() {
    const username = document.getElementById('username').value;
    const pin = document.getElementById('pin').value;
    currentUser = users.find(user => user.username === username && user.pin === pin);

    if (currentUser) {
        displayApp();
        loadProductsForUser();
        displayCustomers();
        displayTransactionHistory();
    } else {
        alert('Username atau PIN salah!');
    }
}

// Menampilkan Aplikasi POS
function displayApp() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}

// Menampilkan Daftar Produk
function loadProductsForUser() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach((product, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `${product.name} - Rp${product.price} (Stok: ${product.stock}) - Kategori: ${product.category}
                        <button class="btn btn-warning btn-sm" onclick="editProduct(${index})"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})"><i class="fas fa-trash"></i> Hapus</button>
                        <button class="btn btn-success btn-sm" onclick="addToCart(${index})"><i class="fas fa-cart-plus"></i> Tambah ke Keranjang</button>`;
        productList.appendChild(li);
    });
}

// Menambah Produk
document.getElementById('add-product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('product-name').value.trim();
    const price = parseInt(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const category = document.getElementById('product-category').value;

    if (name && !isNaN(price) && price > 0 && !isNaN(stock) && stock >= 0) {
        const newProduct = { name, price, stock, category };
        products.push(newProduct);
        saveData('products', products);
        loadProductsForUser();
        alert('Produk berhasil ditambahkan!');
    } else {
        alert('Mohon masukkan nama produk, harga, dan stok yang valid!');
    }

    // Reset Form
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-stock').value = '';
});

// Mengedit Produk
function editProduct(index) {
    const product = products[index];
    const newPrice = prompt(`Edit Harga Produk "${product.name}" (Harga Lama: Rp${product.price})`, product.price);
    const newStock = prompt(`Edit Stok Produk "${product.name}" (Stok Lama: ${product.stock})`, product.stock);

    if (newPrice !== null && newStock !== null) {
        products[index].price = parseInt(newPrice);
        products[index].stock = parseInt(newStock);
        saveData('products', products);
        loadProductsForUser();
    }
}

// Menghapus Produk
function deleteProduct(index) {
    if (confirm(`Yakin ingin menghapus produk "${products[index].name}"?`)) {
        products.splice(index, 1);
        saveData('products', products);
        loadProductsForUser();
    }
}

// Menambah Produk ke Keranjang
function addToCart(index) {
    const product = products[index];
    const existingProductIndex = cart.findIndex(item => item.name === product.name);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveData('cart', cart);
    displayCart();
}

// Menampilkan Keranjang Belanja
function displayCart() {
    const cartList = document.getElementById('cart-list');
    let total = 0;
    cartList.innerHTML = '';

    cart.forEach(item => {
        total += item.price * item.quantity;
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `${item.name} x ${item.quantity} - Rp${item.price * item.quantity}
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.name}')"><i class="fas fa-trash"></i> Hapus</button>`;
        cartList.appendChild(li);
    });

    document.getElementById('total-price').textContent = total;
    document.getElementById('discounted-price').textContent = total * (1 - (document.getElementById('discount').value / 100));
}

// Menghapus Produk dari Keranjang
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    saveData('cart', cart);
    displayCart();
}

// Checkout dan Hitung Kembalian
document.getElementById('checkout').addEventListener('click', function () {
    const total = parseInt(document.getElementById('total-price').textContent);
    const paymentAmount = parseInt(document.getElementById('payment-amount').value);

    if (paymentAmount >= total) {
        const change = paymentAmount - total;
        document.getElementById('change-amount').style.display = 'block';
        document.getElementById('change-value').textContent = change;
        alert(`Pembayaran berhasil! Kembalian Anda: Rp${change}`);
        saveTransaction(change);
    } else {
        alert('Jumlah pembayaran tidak cukup.');
    }
});

// Menyimpan Transaksi
function saveTransaction(change) {
    const transaction = {
        date: new Date().toLocaleString(),
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        paymentAmount: document.getElementById('payment-amount').value,
        change
    };
    transactions.push(transaction);
    saveData('transactions', transactions);
    saveData('cart', []);
    loadProductsForUser();
    displayTransactionHistory();
}

// Menampilkan Riwayat Transaksi
function displayTransactionHistory() {
    const transactionList = document.getElementById('transaction-history');
    transactionList.innerHTML = '';
    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `${transaction.date} - Rp${transaction.total} - Pembayaran: Rp${transaction.paymentAmount} - Kembalian: Rp${transaction.change}`;
        transactionList.appendChild(li);
    });
}

// Menampilkan Daftar Pelanggan
function displayCustomers() {
    const customerList = document.getElementById('customer-list');
    customerList.innerHTML = '';
    customers.forEach((customer, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `${customer.name} - ID: ${customer.id} - Status: ${customer.status}
                        <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${index})"><i class="fas fa-trash"></i> Hapus</button>`;
        customerList.appendChild(li);
    });
}

// Menambah Pelanggan
function addCustomer(name, status) {
    const newCustomer = {
        id: customers.length + 1,
        name,
        status
    };
    customers.push(newCustomer);
    saveData('customers', customers);
    displayCustomers();
}

// Menghapus Pelanggan
function deleteCustomer(index) {
    if (confirm(`Yakin ingin menghapus pelanggan ${customers[index].name}?`)) {
        customers.splice(index, 1);
        saveData('customers', customers);
        displayCustomers();
    }
}

// Menyimpan Data ke LocalStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Mengambil Data dari LocalStorage
function loadData(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById('login').style.display = 'block';
    document.getElementById('app').style.display = 'none';
}
