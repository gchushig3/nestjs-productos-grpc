const productsElement = document.querySelector('#products');
const countElement = document.querySelector('#count');
const messageElement = document.querySelector('#message');
const serviceStatus = document.querySelector('#service-status');
const searchInput = document.querySelector('#search');
const priceInput = document.querySelector('#price');
let products = [];
let activeLimit = '';

const money = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' });
const icons = ['⌨', '◉', '▣', '✦'];

async function loadProducts() {
  productsElement.innerHTML = '<p class="empty">Cargando productos…</p>';
  messageElement.textContent = '';
  const query = activeLimit ? `?precioMaximo=${encodeURIComponent(activeLimit)}` : '';
  try {
    const response = await fetch(`/api/productos${query}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'No se pudieron cargar los productos.');
    products = result;
    serviceStatus.innerHTML = '<i></i> Microservicio gRPC conectado';
    serviceStatus.classList.remove('offline');
    renderProducts();
  } catch (error) {
    serviceStatus.innerHTML = '<i></i> Microservicio gRPC sin conexión';
    serviceStatus.classList.add('offline');
    productsElement.innerHTML = `<p class="error">${escapeHtml(error.message)} Revisa que el servicio esté disponible.</p>`;
    countElement.textContent = '';
  }
}

function renderProducts() {
  const search = searchInput.value.trim().toLocaleLowerCase('es');
  const visible = products.filter((product) => product.nombre.toLocaleLowerCase('es').includes(search) || String(product.id).includes(search));
  countElement.textContent = `(${visible.length})`;
  if (!visible.length) {
    productsElement.innerHTML = '<p class="empty">No hay productos con esos criterios.</p>';
    return;
  }
  productsElement.innerHTML = visible.map((product, index) => `
    <article class="product-card">
      <div class="card-top"><span class="product-icon" aria-hidden="true">${icons[(product.id - 1) % icons.length]}</span><span class="product-id">N.º ${String(product.id).padStart(3, '0')}</span></div>
      <div><h3>${escapeHtml(product.nombre)}</h3><div class="product-bottom"><span class="product-price">${money.format(product.precio)}</span><span class="price-caption">USD</span></div></div>
    </article>`).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

document.querySelector('#filter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  activeLimit = priceInput.value.trim();
  loadProducts();
});
document.querySelector('#clear-filter').addEventListener('click', () => {
  activeLimit = '';
  priceInput.value = '';
  loadProducts();
});
searchInput.addEventListener('input', renderProducts);
loadProducts();
