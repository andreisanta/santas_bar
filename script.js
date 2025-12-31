// Navigation

const menuItems = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('section');

function showSection(id) {
    sections.forEach(sec => {
        sec.style.display = sec.id === id ? 'block' : 'none';
    });

    menuItems.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === id);
    });
}

menuItems.forEach(btn => {
    btn.addEventListener('click', () => {
        showSection(btn.dataset.target);
    });
});

// Cocktails

const menuContainer = document.getElementById('menu');
const filterButtons = document.querySelectorAll('.filters .cocktail-btn');

let cocktails = [];

// Load cocktails
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
      <buton onclick="showRecipe('${c.id}')" class="btn">Vezi rețeta</button>
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

// Load single cocktail
function showRecipe(recipeId) {
    showSection('recipe');
    loadRecipe(recipeId);
}

function loadRecipe(recipeId) {
    const container = document.getElementById('recipe-container');

    fetch('drinks.json')
        .then(res => res.json())
        .then(data => {
            const recipe = data.find(r => r.id === recipeId);
            if (!recipe) {
                container.innerHTML = "<p>Rețeta nu a fost găsită.</p>";
                return;
            }

            const ingredientsList = recipe.ingredients.map(i => `<li>${i.quantity} ${i.item}</li>`).join('');
            const videos = recipe.video ? recipe.video.split(",").map((video, index) => `<p class="content"><a href="${video}" target="_blank">Video preparare ${index > 0 ? index + 1 : ''}</a></p>`).join("") : ""

            container.innerHTML = `
                <div class="card empty"></div>
                <div class="card">
                    <header class="header">
                        <h1>${recipe.name}</h1>
                    </header>
                    <div class="image-container-details">
                        <img src="${recipe.image}" alt="${recipe.name}" onerror="this.onerror=null; this.src='images/not-found.png';">
                    </div>
                    <h2>Ingrediente</h2>
                    <ul>${ingredientsList}</ul>
                    <h2>Preparare</h2>
                    <p class="content">${recipe.preparation}</p>
                    <h2>Servire</h2>
                    <p class="content">${recipe.serving}</p>
                    ${videos}
                    <button onclick="showSection('cocktails')" class="btn">Înapoi la lista de cocktailuri</button>
                </div>
                <div class="card empty"></div>
        `;
        });
}

// Disclaimer

document.getElementById('current-year').textContent = new Date().getFullYear();

const disclaimerLink = document.getElementById('disclaimer-link');

disclaimerLink.addEventListener('click', (e) => {
    e.preventDefault();

    showSection('disclaimer');
});