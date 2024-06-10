const salesApiUrl = 'http://localhost:5000/api/sales';
const productsApiUrl = 'http://localhost:5000/api/products';

// Fetch products for sale
fetch(productsApiUrl)
  .then(response => response.json())
  .then(products => {
    const productSelection = document.getElementById('productSelection');
    productSelection.innerHTML = '';
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.innerHTML = `
        <input type="checkbox" id="product-${product._id}" value="${product._id}"> <!-- Use product ID as value -->
        <label for="product-${product._id}">${product.name} - $${product.price}</label> <!-- Use product name -->
        <input type="number" id="quantity-${product._id}" min="1" value="1"> <!-- Input for product quantity -->
      `;
      productSelection.appendChild(productDiv);
    });

    // Add event listener for product search
    const productSearchInput = document.getElementById('productSearch');
    productSearchInput.addEventListener('input', function(event) {
      const searchTerm = event.target.value.toLowerCase(); // Get search term and convert to lowercase
      const productLabels = productSelection.querySelectorAll('label');
      productLabels.forEach(label => {
        const productName = label.textContent.toLowerCase();
        const productDiv = label.parentNode;
        if (productName.includes(searchTerm)) {
          productDiv.style.display = 'block'; // Show product if its name contains the search term
        } else {
          productDiv.style.display = 'none'; // Hide product otherwise
        }
      });
    });
  })
  .catch(error => console.error('Error fetching products:', error));

// Add sale form submission
document.getElementById('addSaleForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const tableNumber = document.getElementById('tableNumber').value;
  const selectedProducts = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(checkbox => ({
      productId: checkbox.value,
      name: checkbox.nextElementSibling.textContent.split(' - ')[0], // Obtener nombre del producto
      price: parseFloat(checkbox.nextElementSibling.textContent.split(' - ')[1].replace('$', '').replace(/\./g, '').replace(',', '.')), // Convertir precio a número
      quantity: parseInt(document.getElementById(`quantity-${checkbox.value}`).value) // Obtener cantidad de productos
    }));
  const total = selectedProducts.reduce((acc, product) => acc + (product.price * product.quantity), 0); // Calcular total incluyendo la cantidad

  fetch(salesApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tableNumber, products: selectedProducts, total })
  })
  .then(response => response.json())
  .then(sale => {
    // Agregar venta a la tabla
    const salesTableBody = document.getElementById('salesTableBody');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sale.tableNumber}</td>
      <td>${selectedProducts.map(p => `${p.quantity} ${p.name}`).join('<br>')}</td> <!-- Mostrar cantidad y nombre del producto -->
      <td>$${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td> <!-- Agregar signo $ y formatear total con punto de miles -->
    `;
    salesTableBody.appendChild(row);
  })
  .catch(error => console.error('Error adding sale:', error));
});
