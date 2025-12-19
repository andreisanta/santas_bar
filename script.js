const menuContainer = document.getElementById('menu');
const filterButtons = document.querySelectorAll('.filters button');

let cocktails = [];

// Încarcă JSON-ul extern
fetch('drinks.json')
    .then(res => res.json())
    .then(data => {
        cocktails = data;
        renderMenu('all');
    })
    .catch(err => console.error("Eroare la citirea drinks.json:", err));

function renderMenu(filter = 'all') {
    menuContainer.innerHTML = '';
    let filtered = cocktails;
    if (filter !== 'all') {
        filtered = cocktails.filter(c => c.category === filter);
    }

    filtered.forEach(c => {
        const ingredients = c.ingredients.map(i => i.item).join(', ')
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
      <div class="image-container">
         <img src="${c.image}" alt="${c.name}" onerror="this.onerror=null; this.src='images/not-found.png';">
      </div>
      <h2>${c.name}</h2>
      <p class="content">${ingredients}</p>
      <a href="reteta.html?id=${c.id}" class="btn">Vezi rețeta</a>
    `;
        menuContainer.appendChild(card);
    });
}

// ===== Filter buttons =====
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenu(btn.dataset.filter);
    });
});
