// Fungsi untuk menyimpan data ke localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Fungsi untuk mengambil data dari localStorage
function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Fungsi untuk menampilkan daftar produk
function displayProducts() {
    const productList = document.getElementById('product-list');
    const products = loadData('products');
    productList.innerHTML = '';
    products.forEach((product, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${product.name} - Rp${product.price}`;
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Tambah ke Keranjang';
        addToCartButton.onclick = () => addToCart(product);
        li.appendChild(addToCartButton);
        productList.appendChild(li);
    });
}

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(product) {
    const cart = loadData('cart');
    const existingProductIndex = cart.findIndex(item => item.name === product.name);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveData('cart', cart);
    displayCart();
}

// Fungsi untuk menampilkan daftar keranjang
function displayCart() {
    const cartList = document.getElementById('cart-list');
    const totalPrice = document.getElementById('total-price');
    const cart = loadData('cart');
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} x${item.quantity} - Rp${item.price * item.quantity}`;
        cartList.appendChild(li);
        total += item.price * item.quantity;
    });
    totalPrice.textContent = total;
}

// Fungsi untuk menambahkan produk baru
document.getElementById('add-product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('product-name').value.trim();
    const price = parseInt(document.getElementById('product-price').value);
    if (name && !isNaN(price) && price > 0) {
        const products = loadData('products');
        products.push({ name, price });
        saveData('products', products);
        displayProducts();
    } else {
        alert('Mohon masukkan nama produk dan harga yang valid!');
    }
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
});

// Fungsi untuk memproses pembayaran
document.getElementById('checkout').addEventListener('click', function () {
    const cart = loadData('cart');
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        alert(`Pembayaran berhasil! Total: Rp${total}`);
        
        // Simpan riwayat transaksi
        const transactionHistory = loadData('transactionHistory');
        const transaction = {
            date: new Date().toLocaleString(),
            items: cart,
            total
        };
        transactionHistory.push(transaction);
        saveData('transactionHistory', transactionHistory);

        // Kosongkan keranjang
        saveData('cart', []);
        displayCart();
        displayTransactionHistory();
    } else {
        alert('Keranjang kosong, tidak ada yang dibayar.');
    }
});

// Fungsi untuk menampilkan riwayat transaksi
function displayTransactionHistory() {
    const transactionHistory = loadData('transactionHistory');
    const historyList = document.getElementById('transaction-history');
    historyList.innerHTML = '';
    transactionHistory.forEach((transaction) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${transaction.date}</strong> - Rp${transaction.total}`;
        historyList.appendChild(li);
    });
}

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function () {
    displayProducts();
    displayCart();
    displayTransactionHistory();
});




// stap 2


// Fungsi untuk menyimpan data ke localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Fungsi untuk mengambil data dari localStorage
function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Fungsi untuk menampilkan daftar produk
function displayProducts() {
    const productList = document.getElementById('product-list');
    const products = loadData('products');
    productList.innerHTML = '';
    products.forEach((product, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${product.name} - Rp${product.price} <button onclick="editProduct(${index})">Edit</button> <button onclick="deleteProduct(${index})">Hapus</button>`;
        productList.appendChild(li);
    });
}

// Fungsi untuk menambah produk
document.getElementById('add-product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('product-name').value.trim();
    const price = parseInt(document.getElementById('product-price').value);
    if (name && !isNaN(price) && price > 0) {
        const products = loadData('products');
        products.push({ name, price });
        saveData('products', products);
        displayProducts();
    } else {
        alert('Mohon masukkan nama produk dan harga yang valid!');
    }
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
});

// Fungsi untuk mengedit produk
function editProduct(index) {
    const products = loadData('products');
    const product = products[index];
    const newName = prompt("Edit Nama Produk", product.name);
    const newPrice = prompt("Edit Harga Produk", product.price);
    if (newName && !isNaN(newPrice) && newPrice > 0) {
        product.name = newName;
        product.price = parseInt(newPrice);
        saveData('products', products);
        displayProducts();
    }
}

// Fungsi untuk menghapus produk
function deleteProduct(index) {
    const products = loadData('products');
    products.splice(index, 1);
    saveData('products', products);
    displayProducts();
}

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(product) {
    const cart = loadData('cart');
    const existingProductIndex = cart.findIndex(item => item.name === product.name);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveData('cart', cart);
    displayCart();
}

// Fungsi untuk menampilkan keranjang
function displayCart() {
    const cartList = document.getElementById('cart-list');
    const totalPrice = document.getElementById('total-price');
    const discountedPrice = document.getElementById('discounted-price');
    const cart = loadData('cart');
    const discount = parseInt(document.getElementById('discount').value) || 0;
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} x${item.quantity} - Rp${item.price * item.quantity}`;
        cartList.appendChild(li);
        total += item.price * item.quantity;
    });
    totalPrice.textContent = total;
    const totalWithDiscount = total - (total * discount / 100);
    discountedPrice.textContent = totalWithDiscount.toFixed(2);
}

// Fungsi untuk checkout
document.getElementById('checkout').addEventListener('click', function () {
    const cart = loadData('cart');
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discount = parseInt(document.getElementById('discount').value) || 0;
        const finalPrice = total - (total * discount / 100);
        alert(`Pembayaran berhasil! Total: Rp${finalPrice.toFixed(2)}`);

        // Simpan transaksi
        const transactionHistory = loadData('transactionHistory');
        const transaction = {
            date: new Date().toLocaleString(),
            items: cart,
            total: finalPrice
        };
        transactionHistory.push(transaction);
        saveData('transactionHistory', transactionHistory);

        // Kosongkan keranjang
        saveData('cart', []);
        displayCart();
        displayTransactionHistory();
    } else {
        alert('Keranjang kosong, tidak ada yang dibayar.');
    }
});

// Fungsi untuk menampilkan riwayat transaksi
function displayTransactionHistory() {
    const transactionHistory = loadData('transactionHistory');
    const historyList = document.getElementById('transaction-history');
    historyList.innerHTML = '';
    transactionHistory.forEach((transaction) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${transaction.date}</strong> - Rp${transaction.total}`;
        historyList.appendChild(li);
    });
}

// Fungsi login admin
document.getElementById('admin-login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value.trim();
    if (password === 'admin123') {
        document.querySelector('.admin-login').style.display = 'none';
        displayProducts(); // Menampilkan produk jika login berhasil
    } else {
        alert('Password salah!');
    }
});

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function () {
    displayCart();
    displayTransactionHistory();
});



