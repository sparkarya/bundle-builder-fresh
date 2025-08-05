const requiredItems = 3;
const discountPercentage = 0.30;
const selectedItems = new Set();
const products = {
    1: { name: 'Product 1', price: 100, image: 'assets/p1.jpg' },
    2: { name: 'Product 2', price: 150, image: 'assets/p2.jpg' },
    3: { name: 'Product 3', price: 200, image: 'assets/p3.jpg' },
    4: { name: 'Product 4', price: 180, image: 'assets/p4.jpg' },
    5: { name: 'Product 5', price: 400, image: 'assets/p5.jpg' },
    6: { name: 'Product 6', price: 350, image: 'assets/p6.jpg' },
    7: { name: 'Product 7', price: 220, image: 'assets/p7.jpg' }
};

function toggleProduct(id) {
    const card = document.querySelector(`.card[data-id='${id}']`);
    const button = card.querySelector('button');

    if (selectedItems.has(id)) {
        selectedItems.delete(id);
        button.innerHTML = `Add to Bundle <span class="plus-icon">+</span>`;
        button.classList.remove('active');
    } else {
        if (selectedItems.size >= requiredItems) return;
        selectedItems.add(id);
        button.innerHTML = `Remove <span class="plus-icon">-</span>`;
        button.classList.add('active');
    }
    updateUI();
}

function updateUI() {
    const selectedCount = selectedItems.size;
    let subtotal = Array.from(selectedItems).reduce((sum, id) => sum + products[id].price, 0);

    // Update bundle items in the side panel
    const bundleItemsContainer = document.getElementById('bundleItemsContainer');
    bundleItemsContainer.innerHTML = ''; // Clear previous items
    
    if (selectedCount === 0) {
        // Render placeholders
        for (let i = 0; i < requiredItems; i++) {
            bundleItemsContainer.innerHTML += '<div class="bundle-placeholder"></div>';
        }
    } else {
        selectedItems.forEach(id => {
            const product = products[id];
            const itemHtml = `
                <div class="bundle-item">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="bundle-item-info">
                        <h4>${product.name}</h4>
                        <p>₹${product.price}</p>
                    </div>
                </div>
            `;
            bundleItemsContainer.innerHTML += itemHtml;
        });

        // Add remaining placeholders
        for (let i = selectedCount; i < requiredItems; i++) {
            bundleItemsContainer.innerHTML += '<div class="bundle-placeholder"></div>';
        }
    }

    // Calculate discount and final price
    let discount = 0;
    
    if (selectedCount >= requiredItems) {
        discount = subtotal * discountPercentage;
    }
    
    // Update summary section
    document.getElementById('subtotalPrice').textContent = `₹${subtotal}`;
    document.getElementById('discountPrice').textContent = `-₹${discount.toFixed(0)}`;

    // Update Add to Cart button
    const addToCartButton = document.getElementById('addToCart');
    if (selectedCount >= requiredItems) {
        addToCartButton.disabled = false;
        addToCartButton.innerHTML = `Add to Cart <span class="plus-icon">></span>`;
    } else {
        addToCartButton.disabled = true;
        addToCartButton.innerHTML = `Add ${requiredItems - selectedCount} Items to Proceed`;
    }
}

// Add to Cart functionality
document.getElementById('addToCart').addEventListener('click', () => {
    if (selectedItems.size < requiredItems) return;
    const items = Array.from(selectedItems).map(id => products[id].name);
    const subtotal = Array.from(selectedItems).reduce((sum, id) => sum + products[id].price, 0);
    const discount = subtotal * discountPercentage;
    const finalTotal = subtotal - discount;

    alert(`🛒 Bundle added to cart:\n- ${items.join('\n- ')}\n\nSubtotal: ₹${subtotal}\nDiscount (30%): -₹${discount.toFixed(0)}\nTotal: ₹${finalTotal.toFixed(0)}`);
});