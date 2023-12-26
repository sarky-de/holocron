const dataTypeSelect = document.getElementById('data-type');
const dataList = document.querySelector('.pilot-list');
const dataDetails = document.getElementById('data-details');
const cardImageContainer = document.getElementById('card-image');
const addCardButton = document.getElementById('add-card-button');
const removeCardButton = document.getElementById('remove-card-button');
const inventoryList = document.getElementById('inventory-list');

let currentCardId;
let currentCardAmount = 0;

function capitalizeWords(str) {
  str = str.replaceAll("-", " ");
  var words = str.split(" ");

  for (var i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  return words.join(" ");
}

async function displayDataDetailsAndImage(cardId) {
  const data = await fetchCard(cardId);
  if (data) {
    let detailsHTML = '<h2 class="text-xl font-semibold">Data Details</h2>';
    for (const key in data) {
      detailsHTML += `<p><span class="font-semibold">${key}:</span> ${data[key]}</p>`;
    }
    dataDetails.innerHTML = detailsHTML;

    cardImageContainer.innerHTML = '';
    const cardImage = document.createElement('img');
    if (data.firing_arcs) {
      cardImage.src = `xwing-ship-images/images/ships/${data.xws}.png`;
    } else {
      cardImage.src = `images/${data.image}`;
    }
    cardImage.alt = `${data.name} Card Image`;
    cardImageContainer.appendChild(cardImage);
    currentCardId = data.xws;
  } else {
    dataDetails.innerHTML = '';
    cardImageContainer.innerHTML = '';
  }
  await renderInventoryList();
}

async function fetchCard(cardId) {
  try {
    const response = await fetch(`http://localhost:3000/card/${cardId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching card:`, error);
  }
}

async function fetchCategories() {
    try {
        const response = await fetch(`http://localhost:3000/data/`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching categories:`, error);
    }
}

async function fetchDataForCategory(category) {
    try {
        const response = await fetch(`http://localhost:3000/data/${category}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching data for category ${category}:`, error);
    }
}

async function init() {
    const categories = await fetchCategories();
    categories.forEach(item => {
        const optionItem = document.createElement('option');
        optionItem.value = item;
        const itemName = capitalizeWords(item);
        optionItem.text = itemName;
        dataTypeSelect.appendChild(optionItem);
    });

    populateDataList(categories[0]);
    updateRemoveButtonVisibility();
    await renderInventoryList();    
}

async function populateDataList(category) {
    const data = await fetchDataForCategory(category);

    dataList.innerHTML = ''; 
    data.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = item.name;
      listItem.classList.add('cursor-pointer', 'hover:underline', 'text-blue-600');
      listItem.addEventListener('click', async () => await displayDataDetailsAndImage(item.cardId));
      
      dataList.appendChild(listItem);
  });
}

function updateRemoveButtonVisibility() {
  if (currentCardAmount > 0) {
    removeCardButton.style.display = 'block';
  } else {
    removeCardButton.style.display = 'none';
  }
}

async function renderInventoryList() {
  inventoryList.innerHTML = '';
  currentCardAmount = 0;
  const response = await fetch('http://localhost:3000/inventory');
  const result = await response.json();
  result.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = `Card ID: ${item.cardId}, Quantity: ${item.quantity}`;
    listItem.classList.add('cursor-pointer', 'hover:underline', 'text-blue-600');
    listItem.addEventListener('click', async () => await displayDataDetailsAndImage(item.cardId));
    inventoryList.appendChild(listItem);
    if (item.cardId === currentCardId) {
      currentCardAmount = item.quantity;
    }
  });
  updateRemoveButtonVisibility();
}

addCardButton.addEventListener('click', async () => {
  const cardId = currentCardId;
  await fetch(`/inventory/${cardId}`, { method: 'PUT' });
  await renderInventoryList();
});

removeCardButton.addEventListener('click', async () => {
  if (currentCardAmount <= 0) {
    return;
  }
    
  await fetch(`/inventory/${currentCardId}`, { method: 'DELETE' });
  await renderInventoryList();
});

dataTypeSelect.addEventListener('change', async () => {
  const selectedDataType = dataTypeSelect.value;
  dataDetails.innerHTML = ''; 
  cardImageContainer.innerHTML = ''; 
  await populateDataList(selectedDataType);
});

init();
