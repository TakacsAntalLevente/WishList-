document.addEventListener('DOMContentLoaded', function() {
    const wishInput = document.getElementById('wish-input');
    const wishUrl = document.getElementById('wish-url');
    const addBtn = document.getElementById('add-btn');
    const wishlist = document.getElementById('wishlist');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let wishes = JSON.parse(localStorage.getItem('wishes')) || [];
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
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


// Music Player Functionality
// Music Player Functionality
// Web Audio API Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Audio elements
    let audioContext;
    let audioBuffer;
    let sourceNode;
    let gainNode;
    let isMusicPlaying = false;
    
    // DOM elements
    const musicToggle = document.getElementById('music-toggle');
    const volumeSlider = document.getElementById('volume-slider');
    const musicStatus = document.querySelector('.music-status');
    const musicModal = document.getElementById('music-modal');
    const enableMusicBtn = document.getElementById('enable-music');
    const musicPlayer = document.querySelector('.music-player');
    
    // Initialize audio context on user interaction
    function initAudioContext() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.gain.value = volumeSlider.value;
        gainNode.connect(audioContext.destination);
        
        loadAudio();
    }
    
    // Load audio file
    function loadAudio() {
        fetch('bg_music.mp3')
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(buffer => {
                audioBuffer = buffer;
                musicStatus.textContent = 'Music: Ready';
                enableMusicBtn.disabled = false;
                enableMusicBtn.innerHTML = '<i class="fas fa-music"></i> Enable Music';
            })
            .catch(error => {
                console.error('Error loading audio:', error);
                musicStatus.textContent = 'Music: Error';
            });
    }
    
    // Play/pause music
    function toggleMusic() {
        if (!isMusicPlaying) {
            if (!audioBuffer) return;
            
            sourceNode = audioContext.createBufferSource();
            sourceNode.buffer = audioBuffer;
            sourceNode.loop = true;
            sourceNode.connect(gainNode);
            sourceNode.start(0);
            isMusicPlaying = true;
            musicStatus.textContent = 'Music: On';
            musicToggle.innerHTML = '<i class="fas fa-music"></i><span class="music-status">Music: On</span>';
        } else {
            if (sourceNode) {
                sourceNode.stop();
                sourceNode.disconnect();
                sourceNode = null;
            }
            isMusicPlaying = false;
            musicStatus.textContent = 'Music: Off';
            musicToggle.innerHTML = '<i class="fas fa-music"></i><span class="music-status">Music: Off</span>';
        }
    }
    
    // Volume control
    volumeSlider.addEventListener('input', function() {
        if (gainNode) {
            gainNode.gain.value = this.value;
        }
    });
    
    // Music toggle button
    musicToggle.addEventListener('click', toggleMusic);
    
    // Enable music button in modal
    enableMusicBtn.addEventListener('click', function() {
        initAudioContext();
        musicModal.style.display = 'none';
        musicPlayer.classList.add('visible');
    });
    
    // Show modal after short delay
    setTimeout(() => {
        musicModal.style.display = 'flex';
    }, 1000);
    
    // Show music player when audio is ready
    if (audioBuffer) {
        musicPlayer.classList.add('visible');
    }
});

