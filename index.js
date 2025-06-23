document.addEventListener('DOMContentLoaded', () => {
  // Fetch all toys on page load
  fetchToys();
  
  // Add new toy form submission
  const addToyForm = document.querySelector('.add-toy-form');
  addToyForm.addEventListener('submit', event => {
    event.preventDefault();
    
    const name = event.target.name.value;
    const image = event.target.image.value;
    
    const newToy = {
      name,
      image,
      likes: 0
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      addToyToDOM(toy);
      addToyForm.reset();
    });
  });
});

function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => addToyToDOM(toy));
    });
}

function addToyToDOM(toy) {
  const toyCollection = document.getElementById('toy-collection');
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;
  toyCollection.appendChild(card);
  
  // Add event listener for like button
  card.querySelector('.like-btn').addEventListener('click', () => {
    const newLikes = toy.likes + 1;
    
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(response => response.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes;
      card.querySelector('p').textContent = `${updatedToy.likes} Likes`;
    });
  });
}