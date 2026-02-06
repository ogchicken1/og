/* ---------------------------
   OG Chicken — Vanilla JS UI
---------------------------- */

// Smooth scroll for buttons
document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.getAttribute("data-scroll"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Mobile menu toggle
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
if (burger && mobileMenu) {
  burger.addEventListener("click", () => mobileMenu.classList.toggle("show"));
  mobileMenu.querySelectorAll("a,[data-scroll]").forEach((el) => {
    el.addEventListener("click", () => mobileMenu.classList.remove("show"));
  });
}

// Scroll reveal (IntersectionObserver)
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.12 },
);
revealEls.forEach((el) => io.observe(el));

/* Parallax glow movement */
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  document.documentElement.style.setProperty("--mx", `${x}px`);
  document.documentElement.style.setProperty("--my", `${y}px`);
});

/* Tilt effect for hero card */
const tiltCard = document.getElementById("tiltCard");
if (tiltCard) {
  tiltCard.addEventListener("mousemove", (e) => {
    const r = tiltCard.getBoundingClientRect();
    const cx = e.clientX - r.left;
    const cy = e.clientY - r.top;
    const rx = (cy / r.height - 0.5) * -8;
    const ry = (cx / r.width - 0.5) * 8;
    tiltCard.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });
  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "";
  });
}

/* -------- Menu Data (EDIT THIS) -------- */
const MENU = [
  {
    id: "c1",
    type: "chicken",
    name: "OG Fire Chicken",
    price: 9.99,
    badge: "Signature",
    desc: "Crispy, juicy, neon-spice coating. Real crunch.",
    img: "assets/food/chicken.jpg",
  },
  {
    id: "c2",
    type: "chicken",
    name: "Wings Bucket",
    price: 12.49,
    badge: "Hot",
    desc: "Wings with OG sauce + spicy dust finish.",
    img: "assets/food/wings.jpg",
  },
  {
    id: "b1",
    type: "burger",
    name: "Neon Smash Burger",
    price: 8.99,
    badge: "Top Pick",
    desc: "Double smash, melted cheese, OG sauce, pickles.",
    img: "assets/food/burger.jpg",
  },
  {
    id: "b2",
    type: "burger",
    name: "Chicken Burger",
    price: 8.49,
    badge: "Crispy",
    desc: "Crispy chicken fillet, slaw, mayo, chili glaze.",
    img: "assets/food/burger.jpg",
  },
  {
    id: "s1",
    type: "sides",
    name: "Street Fries",
    price: 3.99,
    badge: "Side",
    desc: "Seasoned fries + dip. Add peri-peri dust.",
    img: "assets/food/fries.jpg",
  },
  {
    id: "d1",
    type: "drinks",
    name: "Chill Cola",
    price: 1.99,
    badge: "Cold",
    desc: "Ice-cold fizzy refresh for spicy bites.",
    img: "assets/food/drink.jpg",
  },
];

const menuGrid = document.getElementById("menuGrid");

function money(n) {
  return `$${n.toFixed(2)}`;
}

function cardHTML(item) {
  return `
    <article class="card glass" data-type="${item.type}">
      <div class="badge">${item.badge}</div>
      <div class="img">
        <img src="${item.img}" alt="${item.name}" loading="lazy"
          onerror="this.src='assets/food/chicken.jpg'">
      </div>
      <div class="body">
        <div class="top">
          <div class="name">${item.name}</div>
          <div class="price">${money(item.price)}</div>
        </div>
        <div class="desc">${item.desc}</div>
        <div class="actions">
          <button class="btn btn-fire" data-add="${item.id}">Add</button>
          <button class="btn btn-ghost" data-view="${item.id}">Details</button>
        </div>
      </div>
    </article>
  `;
}

function renderMenu(filter = "all") {
  if (!menuGrid) return;
  const items = filter === "all" ? MENU : MENU.filter((m) => m.type === filter);
  menuGrid.innerHTML = items.map(cardHTML).join("");

  // reveal newly injected cards
  menuGrid.querySelectorAll(".card").forEach((c, i) => {
    c.style.opacity = "0";
    c.style.transform = "translateY(12px)";
    setTimeout(
      () => {
        c.style.transition = "opacity .55s ease, transform .55s ease";
        c.style.opacity = "1";
        c.style.transform = "translateY(0)";
      },
      60 + i * 40,
    );
  });
}

renderMenu();

/* Filter chips */
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document
      .querySelectorAll(".chip")
      .forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    renderMenu(chip.dataset.filter);
  });
});

/* -------- Order Drawer + Cart -------- */
const drawer = document.getElementById("drawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const cartArea = document.getElementById("cartArea");
const totalPriceEl = document.getElementById("totalPrice");

const openButtons = ["openOrder", "openOrder2", "openOrder3", "openOrder4"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const closeBtn = document.getElementById("closeOrder");

let cart = {}; // {id: qty}

function openDrawer() {
  drawer?.classList.add("open");
  drawerBackdrop?.classList.add("open");
  drawer?.setAttribute("aria-hidden", "false");
  drawerBackdrop?.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  drawer?.classList.remove("open");
  drawerBackdrop?.classList.remove("open");
  drawer?.setAttribute("aria-hidden", "true");
  drawerBackdrop?.setAttribute("aria-hidden", "true");
}

openButtons.forEach((btn) => btn.addEventListener("click", openDrawer));
closeBtn?.addEventListener("click", closeDrawer);
drawerBackdrop?.addEventListener("click", closeDrawer);

function getItem(id) {
  return MENU.find((m) => m.id === id);
}

function cartTotal() {
  let total = 0;
  for (const [id, qty] of Object.entries(cart)) {
    const item = getItem(id);
    if (item) total += item.price * qty;
  }
  return total;
}

function renderCart() {
  if (!cartArea) return;

  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);

  if (entries.length === 0) {
    cartArea.innerHTML = `
      <div class="cart-empty">
        <div class="cart-emoji">🧺</div>
        <div class="cart-text">Your cart is empty.</div>
        <div class="cart-sub">Add items from the menu.</div>
      </div>
    `;
  } else {
    cartArea.innerHTML = entries
      .map(([id, qty]) => {
        const item = getItem(id);
        if (!item) return "";
        return `
        <div class="cart-item glass">
          <img src="${item.img}" alt="${item.name}" onerror="this.src='assets/food/chicken.jpg'">
          <div>
            <div class="ci-name">${item.name}</div>
            <div class="ci-sub">${money(item.price)} • ${item.badge}</div>
          </div>
          <div class="ci-right">
            <div><b>${money(item.price * qty)}</b></div>
            <div class="qty">
              <button data-dec="${id}">−</button>
              <span>${qty}</span>
              <button data-inc="${id}">+</button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  const total = cartTotal();
  if (totalPriceEl) totalPriceEl.textContent = money(total);

  // bind qty buttons
  cartArea.querySelectorAll("[data-inc]").forEach((b) => {
    b.addEventListener("click", () => addToCart(b.dataset.inc, 1));
  });
  cartArea.querySelectorAll("[data-dec]").forEach((b) => {
    b.addEventListener("click", () => addToCart(b.dataset.dec, -1));
  });
}

function addToCart(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

/* Add + Details from menu */
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest("[data-add]");
  if (addBtn) {
    const id = addBtn.dataset.add;
    addToCart(id, 1);
    openDrawer();
  }

  const viewBtn = e.target.closest("[data-view]");
  if (viewBtn) {
    const item = getItem(viewBtn.dataset.view);
    if (!item) return;
    alert(`${item.name}\n\n${item.desc}\n\nPrice: ${money(item.price)}`);
  }
});

/* Checkout demo */
document.getElementById("checkoutBtn")?.addEventListener("click", () => {
  const total = cartTotal();
  if (total <= 0) return alert("Your cart is empty.");
  alert(
    `Demo checkout\n\nTotal: ${money(total)}\n\nNext step: connect to WhatsApp / POS / payment gateway.`,
  );
});

/* Newsletter demo */
document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thanks! You’re on the OG deals list. ✅");
  e.target.reset();
});
