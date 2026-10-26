document.addEventListener('DOMContentLoaded', function () {
  const authNav = document.getElementById('auth-nav');
  const authNavMobile = document.getElementById('auth-nav-m');
  const cartBadge = document.getElementById('cart-badge');
  const ordersLink = document.getElementById('orders-link');
  const ordersLinkMobile = document.getElementById('orders-link-m');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  let authHtml;
  if (Auth.isLoggedIn()) {
    const user = Auth.getUser();
    authHtml = '';
    if (Auth.isAdmin()) {
      authHtml += '<a href="/admin/products" class="text-coral hover:text-coral-dark">後台管理</a>';
    }
    authHtml += '<span class="text-ink-2">' + (user?.name || '') + '</span>';
    authHtml += '<button onclick="Auth.logout()" class="text-muted hover:text-coral transition-colors">登出</button>';
  } else {
    authHtml = '<a href="/login" class="bg-cocoa text-white px-[22px] py-[9px] rounded-full text-[13px] tracking-wide hover:bg-coral transition-colors">登入</a>';
  }
  if (authNav) authNav.innerHTML = authHtml;
  if (authNavMobile) authNavMobile.innerHTML = authHtml;

  const showOrders = Auth.isLoggedIn();
  if (ordersLink) ordersLink.style.display = showOrders ? '' : 'none';
  if (ordersLinkMobile) ordersLinkMobile.style.display = showOrders ? 'flex' : 'none';

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      const open = mobileMenu.classList.toggle('hidden') === false;
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    });
  }

  if (cartBadge) {
    apiFetch('/api/cart').then(function (res) {
      if (res && res.data && res.data.items && res.data.items.length > 0) {
        cartBadge.textContent = res.data.items.length;
        cartBadge.style.display = 'flex';
      }
    }).catch(function () {});
  }
});
