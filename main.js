document.addEventListener('DOMContentLoaded', () => {
    // 獲取所有相關的 DOM 元素
    const productsGrid = document.querySelector('.product-grid');
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartUI = document.getElementById('cart');
    const cartItemsList = document.getElementById('cart-items');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout');

    // 初始化購物車陣列
    let cart = [];

    // --- 購物車核心邏輯 ---

    // 1. 更新購物車 UI (列表、數量、總計)
    function updateCart() {
        cartItemsList.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const listItem = document.createElement('li');
            // 將價格從字串轉換為數字 (因為 data-price 存的是字串)
            const itemPrice = parseInt(item.price);
            const subtotal = itemPrice * item.quantity;
            total += subtotal;

            listItem.innerHTML = `
                ${item.name} (NT$${itemPrice}) x ${item.quantity} 
                <button class="remove-item" data-id="${item.id}">移除</button>
            `;
            cartItemsList.appendChild(listItem);
        });

        // 處理購物車是空的狀態
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li style="color:var(--muted); font-style:italic;">購物車目前是空的。</li>';
        }

        // 更新總計和右上角購物車數量
        cartTotalSpan.textContent = `NT$${total.toLocaleString()}`;
        cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // 2. 加入商品到購物車
    function addToCart(productId, name, price) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // 新增商品
            cart.push({ id: productId, name: name, price: price, quantity: 1 });
        }
        
        updateCart();
        // 確保購物車在加入商品時自動打開
        if (cartUI.getAttribute('aria-hidden') === 'true') {
             toggleCartVisibility();
        }
    }

    // 3. 從購物車移除商品
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    // --- UI 互動事件監聽 ---

    // 監聽產品網格中的「加入購物車」按鈕點擊
    productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productElement = e.target.closest('.product');
            
            // 從 HTML 的 data- 屬性中獲取產品資訊
            const id = productElement.dataset.id;
            const name = productElement.dataset.name;
            const price = productElement.dataset.price;
            
            addToCart(id, name, price);
        }
    });

    // 監聽購物車列表中的「移除」按鈕點擊
    cartItemsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            removeFromCart(id);
        }
    });

    // 4. 切換購物車側邊欄顯示/隱藏
    function toggleCartVisibility() {
        const isHidden = cartUI.getAttribute('aria-hidden') === 'true';
        // 根據 isHidden 狀態切換 aria-hidden 和 transform (CSS 控制)
        cartUI.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
        cartToggle.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    }

    cartToggle.addEventListener('click', toggleCartVisibility);
    cartClose.addEventListener('click', toggleCartVisibility);
    
    // 結帳功能 (模擬)
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('感謝您購買 GENAE 娃娃！我們將盡快為您處理訂單。');
            cart = []; // 清空購物車
            updateCart();
            toggleCartVisibility();
        } else {
            alert('購物車目前是空的，請先加入商品。');
        }
    });

    // --- 網站基礎功能 ---

    // 初始化：載入時更新一次購物車顯示
    updateCart();

    // 更新 Footer 年份
    document.getElementById('y').textContent = new Date().getFullYear();
    
    // 導覽列開合 (針對手機版)
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.getElementById('nav-list');
    
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('is-open', !isExpanded);
        });

        // 點擊導覽連結後自動關閉選單 (手機版)
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('is-open')) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navList.classList.remove('is-open');
                }
            });
        });
    }

});