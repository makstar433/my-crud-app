// script.js

const form = document.getElementById('itemForm');
const itemList = document.getElementById('itemList');
const getAllItemsButton = document.getElementById('getAllItems');

// Event listener for form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nameInput = document.getElementById('name');
  const descriptionInput = document.getElementById('description');

  const newItem = {
    name: nameInput.value,
    description: descriptionInput.value
  };

  // Send a POST request to add a new item
  const response = await fetch('/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newItem),
  });

  if (response.ok) {
    // Clear input fields after successful addition
    nameInput.value = '';
    descriptionInput.value = '';
    // Fetch all items and update the table
    getAllItems();
  } else {
    console.error('Failed to add item');
  }
});

// Event listener for "Get All Items" button click
getAllItemsButton.addEventListener('click', getAllItems);

// Function to fetch all items and render them on the page
async function getAllItems() {
  // Send a GET request to fetch all items
  const response = await fetch('/items');
  if (response.ok) {
    const items = await response.json();
    // Render items in the table
    renderItems(items);
  } else {
    console.error('Failed to fetch items');
  }
}

// Function to render items on the page
function renderItems(items) {
  itemList.innerHTML = '';

  items.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td>${item.name}</td>
      <td>${item.description}</td>
    `;
    itemList.appendChild(row);
  });
}
