const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// We need an array to hold our state.

let items = [];

function handleSubmit(e) {
  e.preventDefault();
  const name = e.currentTarget.item.value;
  // If its empty then don't submit.
  if (!name) return;

  const item = {
    name,
    id: Date.now(),
    complete: false
  };
  // Push items into state.
  items.push(item);
  console.log(`There are now ${items.length} items in your state`);
  // Clear the form
  e.target.reset();
  // Fire off custom event that will tell anyone else who cares that items have been updated.
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
  console.log(items);
  const html = items
    .map(
      item => `<li class="shopping-item">
      <input value="${item.id}"
      type="checkbox"
      ${item.complete && 'checked'}
      >
      <span class="itemName">${item.name}</span>
      <button 
      aria-label="Remove ${item.name}" 
      value="${item.id}"
      >&times;</buttonaria-label="Remove>
  </li>`
    )
    .join('');
  list.innerHTML = html;
}

function mirrorToLocalStorage() {
  console.info('Saving items to local storage');
  localStorage.setItem('items', JSON.stringify(items));
}

function restoreFromLocalStorage() {
  console.info('Restoring from LS');
  // pull items from LS
  const lsItems = JSON.parse(localStorage.getItem('items'));
  if (lsItems.length) {
    items.push(...lsItems);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function deleteItem(id) {
  console.log('Deleting item', id);
  items = items.filter(item => item.id !== id);
  console.log(items);
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
  console.log('marking as complete', id);
  const itemRef = items.find(item => item.id === id);
  itemRef.complete = !itemRef.complete;
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
// Event Delegation: We listen for click on list UL but then,
//  delegate the click over to the button if its what was clicked
list.addEventListener('click', function(e) {
  const id = parseInt(e.target.value);
  if (e.target.matches('button')) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    markAsComplete(id);
  }
});

restoreFromLocalStorage();
