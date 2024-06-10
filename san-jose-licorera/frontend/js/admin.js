const apiUrl = 'http://localhost:5000/api/products';

// Función para actualizar un producto
const updateProduct = (productId, updatedProductData) => {
  return fetch(`${apiUrl}/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedProductData)
  })
  .then(response => response.json())
  .catch(error => console.error('Error updating product:', error));
};

// Función para eliminar un producto
const deleteProduct = productId => {
  return fetch(`${apiUrl}/${productId}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .catch(error => console.error('Error deleting product:', error));
};

// Fetch products
const fetchProducts = () => {
  fetch(apiUrl)
    .then(response => response.json())
    .then(products => {
      const productTableBody = document.getElementById('productTableBody');
      productTableBody.innerHTML = '';
      products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${product.name}</td>
          <td>$${product.price}</td>
          <td>${product.stock}</td>
          <td>
            <button class="update-btn" data-id="${product._id}">Actualizar</button>
            <button class="delete-btn" data-id="${product._id}">Eliminar</button>
          </td>
        `;
        productTableBody.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching products:', error));
};

// Add product form submission
document.getElementById('addProductForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('productName').value;
  const price = parseFloat(document.getElementById('productPrice').value);
  const stock = document.getElementById('productStock').value;

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, stock })
  })
  .then(response => response.json())
  .then(product => {
    fetchProducts(); // Actualizar la tabla después de agregar el producto
  })
  .catch(error => console.error('Error adding product:', error));
});

// Event listener para actualizar o eliminar un producto
document.addEventListener('click', event => {
  if (event.target.classList.contains('update-btn')) {
    const productId = event.target.dataset.id;
    const updatedProductData = {
      name: prompt('Ingrese el nuevo nombre del producto:'),
      price: parseFloat(prompt('Ingrese el nuevo precio del producto:')),
      stock: prompt('Ingrese el nuevo stock del producto:')
    };
    updateProduct(productId, updatedProductData)
      .then(() => fetchProducts()); // Actualizar la tabla después de la actualización
  } else if (event.target.classList.contains('delete-btn')) {
    const productId = event.target.dataset.id;
    deleteProduct(productId)
      .then(() => fetchProducts()); // Actualizar la tabla después de la eliminación
  }
});

// Cargar los productos al cargar la página
document.addEventListener('DOMContentLoaded', fetchProducts);



