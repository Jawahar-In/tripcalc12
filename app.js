
// --- DATASET (Expanded & INR Prices) ---
// Exchange Rate approx 1 KES = 0.65 INR. Used round figures.
const cities = ["Nairobi", "Mombasa", "Kisumu", "Naivasha", "Nakuru"];

const hotelsDB = [
  { id: 1, name: "Nairobi Serena Hotel", city: "Nairobi", price: 10500, rating: 4.5, stars: 5, amenities: ["Elevator", "Pool", "Spa", "Wifi"] },
  { id: 2, name: "Ibis Styles Nairobi", city: "Nairobi", price: 4200, rating: 4.0, stars: 3, amenities: ["Elevator", "Wifi", "Bar"] },
  { id: 3, name: "Villa Rosa Kempinski", city: "Nairobi", price: 18000, rating: 4.9, stars: 5, amenities: ["Elevator", "Spa", "Gym", "Luxury"] },
  { id: 4, name: "Mombasa Beach Resort", city: "Mombasa", price: 7500, rating: 4.2, stars: 4, amenities: ["Pool", "Beach", "Breakfast"] }, 
  { id: 5, name: "Kisumu Lakeview", city: "Kisumu", price: 3000, rating: 3.8, stars: 3, amenities: ["Wifi", "Parking"] },
  { id: 6, name: "The Boma Nairobi", city: "Nairobi", price: 8500, rating: 4.3, stars: 5, amenities: ["Elevator", "Pool", "Gym"] },
  { id: 7, name: "Sarova Stanley", city: "Nairobi", price: 12500, rating: 4.6, stars: 5, amenities: ["Elevator", "Heritage", "Breakfast"] },
  { id: 8, name: "Budget Inn Westlands", city: "Nairobi", price: 2100, rating: 3.2, stars: 2, amenities: ["Wifi"] },
  { id: 9, name: "Naivasha Country Club", city: "Naivasha", price: 6000, rating: 4.4, stars: 4, amenities: ["Garden", "Pool"] },
  { id: 10, name: "Radisson Blu Arboretum", city: "Nairobi", price: 14000, rating: 4.7, stars: 5, amenities: ["Elevator", "Pool", "Luxury"] },
  { id: 11, name: "PrideInn Azure", city: "Nairobi", price: 5500, rating: 4.1, stars: 4, amenities: ["Elevator", "Pool"] },
  { id: 12, name: "Sankara Nairobi", city: "Nairobi", price: 16000, rating: 4.8, stars: 5, amenities: ["Elevator", "Art", "Gym"] },
  { id: 13, name: "Park Inn by Radisson", city: "Nairobi", price: 9000, rating: 4.5, stars: 4, amenities: ["Elevator", "Wifi"] },
  { id: 14, name: "Golden Tulip", city: "Nairobi", price: 7800, rating: 4.2, stars: 4, amenities: ["Elevator", "Pool"] },
  { id: 15, name: "Ngong Hills Hotel", city: "Nairobi", price: 3800, rating: 3.9, stars: 3, amenities: ["Wifi", "Parking"] }
];

const cruiseDB = {
  "Royal Caribbean": {
    "Symphony of the Seas": { lang: ["English", "Spanish"], pax: 6680, crew: 2200, yr: 2018 },
    "Harmony of the Seas": { lang: ["English", "French"], pax: 6780, crew: 2300, yr: 2016 }
  },
  "Carnival": {
    "Mardi Gras": { lang: ["English"], pax: 5282, crew: 1735, yr: 2020 }
  },
  "Norwegian": {
    "Norwegian Bliss": { lang: ["English", "German"], pax: 4004, crew: 1716, yr: 2018 }
  }
};

// --- TAB LOGIC ---
function switchTab(mode) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + mode).classList.add('active');
  
  const hotelForm = document.getElementById('hotel-form');
  const cruiseForm = document.getElementById('cruise-form');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.getElementById('main-content');
  const resultsArea = document.getElementById('listing-container');

  // Reset UI
  resultsArea.innerHTML = '';
  mainContent.style.opacity = '0';
  
  if(mode === 'hotels') {
    hotelForm.classList.remove('hidden');
    cruiseForm.classList.add('hidden');
    sidebar.style.display = 'block';
    mainContent.style.gridTemplateColumns = '280px 1fr';
  } else {
    hotelForm.classList.add('hidden');
    cruiseForm.classList.remove('hidden');
    sidebar.style.display = 'none'; // No filters for cruise demo
    mainContent.style.gridTemplateColumns = '1fr'; // Full width
  }
}

// --- HOTEL AUTOCOMPLETE ---
const cityInput = document.getElementById('hotel-city');
const suggestBox = document.getElementById('city-suggestions');

cityInput.addEventListener('input', (e) => {
  const val = e.target.value.toLowerCase();
  suggestBox.innerHTML = '';
  if(!val) { suggestBox.style.display = 'none'; return; }
  
  const matches = cities.filter(c => c.toLowerCase().includes(val));
  if(matches.length > 0) {
    matches.forEach(c => {
      const d = document.createElement('div');
      d.className = 'suggestion';
      d.innerText = c;
      d.onclick = () => { cityInput.value = c; suggestBox.style.display = 'none'; };
      suggestBox.appendChild(d);
    });
    suggestBox.style.display = 'block';
  } else { suggestBox.style.display = 'none'; }
});
document.addEventListener('click', e => { if(e.target !== cityInput) suggestBox.style.display = 'none'; });

// --- SEARCH & RENDER HOTELS ---
document.getElementById('search-hotels').addEventListener('click', () => {
  const city = cityInput.value;
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  const err = document.getElementById('error-banner');
  
  if(!city || !checkin || !checkout) {
    err.innerText = "Please select City, Check-in and Check-out dates.";
    err.style.display = 'block'; return;
  }
  if(new Date(checkin) >= new Date(checkout)) {
    err.innerText = "Check-out must be after Check-in.";
    err.style.display = 'block'; return;
  }
  err.style.display = 'none';

  // Show Loader
  const main = document.getElementById('main-content');
  const loader = document.getElementById('loader');
  const list = document.getElementById('listing-container');
  
  main.style.opacity = '1';
  main.style.gridTemplateColumns = '280px 1fr';
  document.querySelector('.sidebar').style.display = 'block';
  
  list.innerHTML = '';
  loader.style.display = 'block';
  
  setTimeout(() => {
    loader.style.display = 'none';
    renderHotels(city);
  }, 800); // Fast load for snappy feel
});

function renderHotels(city) {
  const container = document.getElementById('listing-container');
  let list = hotelsDB.filter(h => h.city.toLowerCase() === city.toLowerCase());
  
  // 1. ELEVATOR FILTER
  if(document.getElementById('filter-elevator').checked) {
    list = list.filter(h => h.amenities.includes("Elevator"));
  }

  // (Optional future: add breakfast/pool/star filters if desired)
  // const starChecks = [...document.querySelectorAll('.star-chk:checked')].map(c => Number(c.value));
  // if (starChecks.length) list = list.filter(h => starChecks.includes(h.stars));

  // 2. SORTING (High to Low)
  const sortVal = document.getElementById('sort-hotels').value;
  if(sortVal === 'rating_high') list.sort((a,b) => b.rating - a.rating);
  if(sortVal === 'price_low') list.sort((a,b) => a.price - b.price);

  container.innerHTML = '';
  if(list.length === 0) {
    container.innerHTML = `<h3 style="text-align:center; color:#666">No properties found in ${city} matching filters.</h3>`;
    return;
  }

  list.forEach((h, i) => {
    const grad = `g-${(i%3)+1}`;
    const card = document.createElement('div');
    card.className = 'hotel-card';
    card.innerHTML = `
      <div class="hotel-img ${grad}">${h.name.charAt(0)}</div>
      <div class="hotel-info">
        <h3 class="h-name">${h.name}</h3>
        <span class="h-loc">📍 ${h.city} City Center</span>
        <div style="margin: 10px 0;">
          <span class="h-rating-box">${h.rating} / 5</span> 
          <span style="font-size:0.8rem; color:#666">Excellent</span>
        </div>
        <div class="h-tags">
          ${h.amenities.map(a => `<span class="tag ${a==='Elevator'?'elevator':''}">${a}</span>`).join('')}
        </div>
      </div>
      <div class="hotel-price">
        <span class="price-val">₹ ${h.price.toLocaleString('en-IN')}</span>
        <span class="price-tax">+ ₹ ${Math.floor(h.price * 0.18)} taxes & fees</span>
        <span style="font-size:0.8rem; color:#666; margin-top:5px">Per Night</span>
        <button class="view-deal">View Deal</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// --- FILTER EVENTS ---
document.getElementById('apply-filters').addEventListener('click', () => {
  const city = cityInput.value;
  if(city) renderHotels(city);
});

document.getElementById('sort-hotels').addEventListener('change', () => {
  const city = cityInput.value;
  if(city) renderHotels(city);
});

// --- CRUISE LOGIC ---
const lineSelect = document.getElementById('cruise-line');
const shipSelect = document.getElementById('cruise-ship');

lineSelect.addEventListener('change', function() {
  const line = this.value;
  shipSelect.innerHTML = '<option value="" disabled selected>Select Ship</option>';
  if(cruiseDB[line]) {
    shipSelect.disabled = false;
    Object.keys(cruiseDB[line]).forEach(s => {
      const opt = document.createElement('option');
      opt.value = s; opt.innerText = s;
      shipSelect.appendChild(opt);
    });
  }
});

document.getElementById('search-cruises').addEventListener('click', () => {
  const line = lineSelect.value;
  const ship = shipSelect.value;
  const err = document.getElementById('error-banner');
  
  if(!line || !ship) {
    err.innerText = "Please select Cruise Line and Ship.";
    err.style.display = 'block'; return;
  }
  err.style.display = 'none';

  const main = document.getElementById('main-content');
  const container = document.getElementById('listing-container');
  
  main.style.opacity = '1';
  container.innerHTML = '<div style="text-align:center; padding:50px"><div class="spinner"></div></div>';
  
  setTimeout(() => {
    const data = cruiseDB[line][ship];
    container.innerHTML = `
      <div style="background:white; padding:30px; border-radius:8px; box-shadow:var(--shadow);">
        <h2 style="color:var(--primary);">${ship}</h2>
        <p>Operated by <strong>${line}</strong></p>
        <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
        
        <div style="margin-bottom:20px;">
          <strong>🗣 Languages Onboard:</strong> <br>
          ${data.lang.map(l => `<span class="tag" style="font-size:0.9rem; margin-top:5px; display:inline-block">${l}</span>`).join(' ')}
        </div>

        <div class="cruise-grid">
          <div class="stat-box">
            <span class="stat-val">${data.pax}</span>
            <span class="stat-lbl">Passengers</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">${data.crew}</span>
            <span class="stat-lbl">Crew Members</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">${data.yr}</span>
            <span class="stat-lbl">Launch Year</span>
          </div>
        </div>
      </div>
    `;
  }, 1000);
});
