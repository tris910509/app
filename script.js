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
        li.textContent = `${product.name} - Rp${product.price}`;
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
    cart.push(product);
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
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - Rp${item.price}`;
        cartList.appendChild(li);
        total += item.price;
    });
    totalPrice.textContent = total;
}

// Fungsi untuk menambahkan produk baru
document.getElementById('add-product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = parseInt(document.getElementById('product-price').value);
    const products = loadData('products');
    products.push({ name, price });
    saveData('products', products);
    displayProducts();
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
});

// Fungsi untuk memproses pembayaran
document.getElementById('checkout').addEventListener('click', function () {
    alert('Pembayaran berhasil!');
    saveData('cart', []);
    displayCart();
});

// Inisialisasi
displayProducts();
displayCart();
