/**
 * cart.js — localStorage-backed shopping cart for the Mojo AI Studio products page.
 *
 * Cart schema (stored under key 'mojo-cart' in localStorage):
 * [{ id: string, name: string, price: number }]
 *
 * Public API (attached to window.MojoCart):
 *   getItems()           → CartItem[]
 *   addItem(id, name, price) → void
 *   removeItem(id)       → void
 *   clearCart()          → void
 *   getCount()           → number
 */

(function () {
  const STORAGE_KEY = 'mojo-cart';

  /** @returns {Array<{id: string, name: string, price: number}>} */
  function getItems() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  /** @param {Array} items */
  function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  /** @param {string} id @param {string} name @param {number} price */
  function addItem(id, name, price) {
    const items = getItems();
    const alreadyInCart = items.some(function (item) { return item.id === id; });
    if (!alreadyInCart) {
      saveItems(items.concat([{ id: id, name: name, price: Number(price) }]));
    }
    updateCartUI();
    showAddedFeedback(name);
  }

  /** @param {string} id */
  function removeItem(id) {
    saveItems(getItems().filter(function (item) { return item.id !== id; }));
    updateCartUI();
  }

  function clearCart() {
    saveItems([]);
    updateCartUI();
  }

  /** @returns {number} */
  function getCount() {
    return getItems().length;
  }

  /** Update the cart count badge in the nav */
  function updateCartUI() {
    var countEl = document.querySelector('[data-cart-count]');
    if (!countEl) { return; }
    var count = getCount();
    countEl.textContent = count > 0 ? '(' + count + ')' : '';
  }

  /** Show a brief visual confirmation that an item was added */
  function showAddedFeedback(name) {
    var existing = document.getElementById('mojo-cart-toast');
    if (existing) { existing.remove(); }

    var toast = document.createElement('div');
    toast.id = 'mojo-cart-toast';
    toast.textContent = name + ' added to cart';
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      padding: '14px 20px',
      borderRadius: '8px',
      background: '#172033',
      color: '#fff',
      fontWeight: '800',
      fontSize: '0.92rem',
      zIndex: '9999',
      boxShadow: '0 14px 38px rgba(23,32,51,0.22)',
      transition: 'opacity 0.3s ease',
    });

    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      setTimeout(function () { toast.remove(); }, 300);
    }, 2400);
  }

  /** Wire up cart toggle button click */
  function bindCartToggle() {
    var toggleBtn = document.querySelector('[data-cart-toggle]');
    if (!toggleBtn) { return; }
    toggleBtn.addEventListener('click', function () {
      var items = getItems();
      if (items.length === 0) {
        alert('Your cart is empty.');
        return;
      }
      var lines = items.map(function (item) {
        return item.name + ' — $' + item.price + '/mo';
      });
      var total = items.reduce(function (sum, item) { return sum + item.price; }, 0);
      lines.push('');
      lines.push('Total: $' + total + '/mo');
      alert(lines.join('\n'));
    });
  }

  /** Wire up all [data-add-to-cart] buttons */
  function bindAddToCartButtons() {
    document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-add-to-cart');
        var name = btn.getAttribute('data-name') || id;
        var price = Number(btn.getAttribute('data-price') || 0);
        addItem(id, name, price);
      });
    });
  }

  /** Wire up dialog add-to-cart button */
  function bindDialogAddToCart() {
    var dialogAddBtn = document.querySelector('[data-dialog-add-to-cart]');
    if (!dialogAddBtn) { return; }
    dialogAddBtn.addEventListener('click', function () {
      var id = dialogAddBtn.getAttribute('data-product-id');
      var name = dialogAddBtn.getAttribute('data-product-name');
      var price = Number(dialogAddBtn.getAttribute('data-product-price') || 0);
      if (id && name) {
        addItem(id, name, price);
      }
    });
  }

  function init() {
    updateCartUI();
    bindCartToggle();
    bindAddToCartButtons();
    bindDialogAddToCart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.MojoCart = {
    getItems: getItems,
    addItem: addItem,
    removeItem: removeItem,
    clearCart: clearCart,
    getCount: getCount,
  };
}());
