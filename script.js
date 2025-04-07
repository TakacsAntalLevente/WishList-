document.addEventListener('DOMContentLoaded', function() {
    const wishInput = document.getElementById('wish-input');
    const wishUrl = document.getElementById('wish-url');
    const addBtn = document.getElementById('add-btn');
    const wishlist = document.getElementById('wishlist');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let wishes = JSON.parse(localStorage.getItem('wishes')) || [];
    
    // Render wishes
    function renderWishes(filter = 'all') {
        wishlist.innerHTML = '';
        
        const filteredWishes = wishes.filter(wish => {
            if (filter === 'completed') return wish.completed;
            if (filter === 'pending') return !wish.completed;
            return true;
        });
        
        if (filteredWishes.length === 0) {
            wishlist.innerHTML = '<p class="no-wishes">No wishes found. Add some!</p>';
            return;
        }
        
        filteredWishes.forEach((wish, index) => {
            const wishItem = document.createElement('li');
            wishItem.className = 'wish-item';
            
            wishItem.innerHTML = `
                <div class="wish-content">
                    <input type="checkbox" class="wish-checkbox" ${wish.completed ? 'checked' : ''} data-index="${index}">
                    <span class="wish-text ${wish.completed ? 'completed' : ''}">${wish.text}</span>
                    ${wish.url ? `<a href="${wish.url}" target="_blank" class="wish-url"><i class="fas fa-link"></i></a>` : ''}
                </div>
                <div class="wish-actions">
                    <button class="edit-btn" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            wishlist.appendChild(wishItem);
        });
        
        // Add event listeners to checkboxes, edit and delete buttons
        document.querySelectorAll('.wish-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleWishComplete);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editWish);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteWish);
        });
    }
    
    // Add new wish
    function addWish() {
        const text = wishInput.value.trim();
        const url = wishUrl.value.trim();
        
        if (text) {
            wishes.push({
                text,
                url: url.startsWith('http') ? url : url ? 'https://' + url : '',
                completed: false
            });
            
            saveWishes();
            renderWishes();
            
            wishInput.value = '';
            wishUrl.value = '';
            wishInput.focus();
        }
    }
    
    // Toggle wish completion status
    function toggleWishComplete(e) {
        const index = e.target.dataset.index;
        wishes[index].completed = !wishes[index].completed;
        saveWishes();
        renderWishes(document.querySelector('.filter-btn.active').dataset.filter);
    }
    
    // Edit wish
    function editWish(e) {
        const index = e.target.closest('button').dataset.index;
        const wish = wishes[index];
        
        const newText = prompt('Edit your wish:', wish.text);
        if (newText !== null) {
            const newUrl = prompt('Edit the URL (leave empty to remove):', wish.url || '');
            
            wish.text = newText.trim();
            wish.url = newUrl ? (newUrl.startsWith('http') ? newUrl : 'https://' + newUrl) : '';
            saveWishes();
            renderWishes(document.querySelector('.filter-btn.active').dataset.filter);
        }
    }
    
    // Delete wish
    function deleteWish(e) {
        if (confirm('Are you sure you want to delete this wish?')) {
            const index = e.target.closest('button').dataset.index;
            wishes.splice(index, 1);
            saveWishes();
            renderWishes(document.querySelector('.filter-btn.active').dataset.filter);
        }
    }
    
    // Save wishes to localStorage
    function saveWishes() {
        localStorage.setItem('wishes', JSON.stringify(wishes));
    }
    
    // Filter wishes
    function filterWishes(e) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        e.target.classList.add('active');
        renderWishes(e.target.dataset.filter);
    }
    
    // Event listeners
    addBtn.addEventListener('click', addWish);
    
    wishInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addWish();
    });
    
    wishUrl.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addWish();
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', filterWishes);
    });
    
    // Initial render
    renderWishes();
});