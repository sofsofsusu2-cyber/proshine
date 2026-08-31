/**
 * ProShine Website Interactive Controller
 */

// Estimator service configuration data
const serviceData = {
  kitchen: [{ label: 'Standard Kitchen (Full Degrease)', price: '₹1499' }],
  room: [
    { label: '1 Room', price: '₹799' },
    { label: '2 Rooms', price: '₹899' },
    { label: '3 Rooms', price: '₹999' }
  ],
  washroom: [
    { label: '1 Washroom', price: '₹999' },
    { label: '2 Washrooms', price: '₹1199' },
    { label: '3 Washrooms', price: '₹1499' }
  ],
  fullhome: [
    { label: '1 BHK Complete', price: '₹4999' },
    { label: '2 BHK Complete', price: '₹7999' },
    { label: '3 BHK Complete', price: '₹9999' },
    { label: 'Villa / Duplex', price: '₹12999' }
  ]
};

// Memory for active selected tiers across cards
const selectedTiers = {
  kitchen: null,
  room: null,
  washroom: null,
  fullhome: null
};

/**
 * Handle tier clicks for multi-tier cards (Room, Washroom, Full Home)
 */
function selectTier(element, serviceKey, optionName, price) {
  const parentCard = element.closest('.service-card');
  const isAlreadyActive = element.classList.contains('active');

  // Clear siblings
  const allTiers = parentCard.querySelectorAll('.selectable-tier');
  allTiers.forEach(tier => {
    tier.classList.remove('active');
    const icon = tier.querySelector('.tier-radio');
    if (icon) icon.className = 'fa-regular fa-circle tier-radio';
  });

  if (!isAlreadyActive) {
    // Select this tier
    element.classList.add('active');
    const activeIcon = element.querySelector('.tier-radio');
    if (activeIcon) activeIcon.className = 'fa-solid fa-circle-check tier-radio';

    const cardTitle = parentCard.querySelector('h3') ? parentCard.querySelector('h3').innerText : serviceKey;
    selectedTiers[serviceKey] = {
      title: cardTitle,
      option: optionName,
      price: price
    };
  } else {
    // Deselect if clicked again
    selectedTiers[serviceKey] = null;
  }

  updateMasterBar();
}

/**
 * Kitchen Toggle (Since it has a single flat price)
 */
function toggleKitchenTier(element, optionName, price) {
  const isAlreadyActive = element.classList.contains('active');
  const icon = element.querySelector('.tier-radio');

  if (!isAlreadyActive) {
    element.classList.add('active');
    if (icon) icon.className = 'fa-solid fa-circle-check tier-radio';
    selectedTiers.kitchen = {
      title: 'Kitchen Deep Cleaning',
      option: optionName,
      price: price
    };
  } else {
    element.classList.remove('active');
    if (icon) icon.className = 'fa-regular fa-circle tier-radio';
    selectedTiers.kitchen = null;
  }

  updateMasterBar();
}

/**
 * Update the Master Checkout Bar in Real-Time
 */
function updateMasterBar() {
  const summaryTextElem = document.getElementById('selectedItemsText');
  const totalPriceElem = document.getElementById('masterTotalPrice');

  const selectedItems = [];
  let grandTotal = 0;

  for (const key in selectedTiers) {
    if (selectedTiers[key]) {
      selectedItems.push(`${selectedTiers[key].option} (₹${selectedTiers[key].price})`);
      grandTotal += selectedTiers[key].price;
    }
  }

  if (selectedItems.length > 0) {
    summaryTextElem.innerHTML = selectedItems.join(' <span style="color:#16a34a; font-weight:800;">+</span> ');
    totalPriceElem.innerText = `₹${grandTotal}`;
  } else {
    summaryTextElem.innerText = 'No service selected yet (Tap options above)';
    totalPriceElem.innerText = '₹0';
  }
}

/**
 * Book only the single card's selected option
 */
function bookSingleCard(serviceKey) {
  const chosen = selectedTiers[serviceKey];
  
  if (!chosen) {
    alert('Please select a specific tier/option on this card first!');
    return;
  }

  const msg = `*Booking Request - ProShine*%0A%0A` +
              `*Service:* ${encodeURIComponent(chosen.title)}%0A` +
              `*Selected:* ${encodeURIComponent(chosen.option)}%0A` +
              `*Price:* ₹${chosen.price}%0A%0A` +
              `Please confirm my booking slot!`;

  window.open(`https://wa.me/919620020046?text=${msg}`, '_blank');
}

/**
 * Book ALL selected services combined via WhatsApp
 */
function bookAllSelectedTiers() {
  const items = [];
  let grandTotal = 0;

  for (const key in selectedTiers) {
    if (selectedTiers[key]) {
      items.push(`• ${selectedTiers[key].title} - ${selectedTiers[key].option} (₹${selectedTiers[key].price})`);
      grandTotal += selectedTiers[key].price;
    }
  }

  if (items.length === 0) {
    alert('Please select at least one package option above before booking!');
    return;
  }

  const msg = `*Combo Deep Cleaning Booking - ProShine*%0A%0A` +
              `*Selected Packages:*%0A${encodeURIComponent(items.join('\n'))}%0A%0A` +
              `*Total Amount:* ₹${grandTotal}%0A%0A` +
              `Please confirm my preferred appointment date and time slot!`;

  window.open(`https://wa.me/919620020046?text=${msg}`, '_blank');
}

/**
 * Estimator Dropdown Handlers
 */
function updateEstimator() {
  const serviceSelect = document.getElementById('calcService');
  const optionSelect = document.getElementById('calcOption');
  if (!serviceSelect || !optionSelect) return;

  const serviceKey = serviceSelect.value;
  const items = serviceData[serviceKey] || [];

  optionSelect.innerHTML = '';
  items.forEach((item, index) => {
    const opt = document.createElement('option');
    opt.value = item.price;
    opt.textContent = `${item.label} (${item.price})`;
    if (index === 0) opt.selected = true;
    optionSelect.appendChild(opt);
  });

  updateEstimatorPrice();
}

function updateEstimatorPrice() {
  const optionSelect = document.getElementById('calcOption');
  const displayElem = document.getElementById('calcPriceDisplay');
  if (optionSelect && displayElem) {
    displayElem.innerText = optionSelect.value || '₹1499';
  }
}

function bookCalculatedService() {
  const service = document.getElementById('calcService');
  const option = document.getElementById('calcOption');
  const serviceName = service ? service.options[service.selectedIndex].text : 'Cleaning Service';
  const optionName = option ? option.options[option.selectedIndex].text : '';

  const msg = `*Booking Inquiry - ProShine*%0A%0A*Service:* ${encodeURIComponent(serviceName)}%0A*Plan:* ${encodeURIComponent(optionName)}%0A%0APlease let me know the available time slots!`;
  window.open(`https://wa.me/919620020046?text=${msg}`, '_blank');
}

// Initialise
(function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateEstimator);
  } else {
    updateEstimator();
  }
})();
/**
 * Terms and Conditions Modal Handlers
 */
function openTermsModal() {
  const modal = document.getElementById('termsModal');
  if (modal) modal.classList.add('active');
}

function closeTermsModal() {
  const modal = document.getElementById('termsModal');
  if (modal) modal.classList.remove('active');
}

// Close modal when clicking outside the box
window.addEventListener('click', (e) => {
  const modal = document.getElementById('termsModal');
  if (e.target === modal) {
    closeTermsModal();
  }
});
