let products = [];
let editingIndex = null;
let currentPage = 1;
const itemsPerPage = 5;

document.getElementById("productForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const description = document.getElementById("productDescription").value;

    // Validasi form
    if (!name || !price || !description) {
        alert("Semua field harus diisi!");
        return;
    }

    if (editingIndex === null) {
        // Tambah produk baru
        products.push({ name, price, description });
    } else {
        // Edit produk
        products[editingIndex] = { name, price, description };
        editingIndex = null;
    }

    document.getElementById("productForm").reset();
    renderProducts();
});

document.getElementById("searchInput").addEventListener("input", function (e) {
    const searchText = e.target.value.toLowerCase();
    renderProducts(searchText);
});

function renderProducts(searchText = "") {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchText) || 
        product.description.toLowerCase().includes(searchText)
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
            <td>${product.description}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProduct(${start + index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${start + index})">Hapus</button>
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
    document.getElementById("productDescription").value = product.description;
    editingIndex = index;
}

function deleteProduct(index) {
    products.splice(index, 1);
    renderProducts();
}

// Render produk awal
renderProducts();
