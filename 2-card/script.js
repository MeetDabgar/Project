document.addEventListener('DOMContentLoaded', function() {
    // Sample profile data for women
    const womenProfiles = [
        {
            id: 1,
            name: "Alexis",
            age: 28,
            bio: "Adventure seeker and coffee enthusiast",
            distance: "2 km away",
            images: [
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            ]
        },
        // ... (keep other women profiles the same)
    ];

    // Sample profile data for men
    const menProfiles = [
        {
            id: 6,
            name: "Chris",
            age: 31,
            bio: "Entrepreneur and fitness enthusiast",
            distance: "2 km away",
            images: [
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            ]
        },
        // ... (keep other men profiles the same)
    ];

    // DOM Elements
    const swipeContainer = document.getElementById('swipe-container');
    const dislikeBtn = document.getElementById('dislike-btn');
    const likeBtn = document.getElementById('like-btn');
    const superLikeBtn = document.getElementById('super-like-btn');
    const backBtn = document.getElementById('back-btn');
    const matchModal = document.getElementById('match-modal');
    const matchedProfileImg = document.getElementById('matched-profile-img');
    const matchedProfileName = document.getElementById('matched-profile-name');
    const chatIcon = document.getElementById('chat-icon');
    const profileIcon = document.getElementById('profile-icon');
    const chatInterface = document.getElementById('chat-interface');
    const profileInterface = document.getElementById('profile-interface');
    const backToSwiping = document.querySelector('.back-to-swiping');
    const backToSwipingProfile = document.querySelector('.back-to-swiping-profile');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const noMoreProfiles = document.querySelector('.no-more-profiles');
    const userProfilePref = document.getElementById('user-profile-pref');
    const preferenceOptions = document.querySelectorAll('.preference-option input[type="radio"]');
    const savePreferencesBtn = document.getElementById('save-preferences-btn');

    // State variables
    let currentProfileIndex = 0;
    let matches = [];
    let currentCard = null;
    let startX, startY, moveX, moveY;
    let isDragging = false;
    let profiles = [];
    let selectedGenderPref = 'both'; // Default to 'everyone'

    // Initialize the app
    function init() {
        // Load default profiles
        loadProfiles();
        
        // If no profiles, show empty state
        if (profiles.length === 0) {
            noMoreProfiles.style.display = 'block';
        } else {
            renderProfileCard();
        }
        
        // Setup event listeners
        setupEventListeners();
    }

    // Load profiles based on gender preference
    function loadProfiles() {
        if (selectedGenderPref === 'women') {
            profiles = [...womenProfiles];
        } else if (selectedGenderPref === 'men') {
            profiles = [...menProfiles];
        } else {
            // Mix both if 'everyone' is selected
            profiles = [...womenProfiles, ...menProfiles];
            // Shuffle the array
            profiles = profiles.sort(() => Math.random() - 0.5);
        }
    }

    // Update profile preference text display
    function updatePreferenceText() {
        let prefText = '';
        if (selectedGenderPref === 'women') prefText = 'Looking for: Women';
        else if (selectedGenderPref === 'men') prefText = 'Looking for: Men';
        else prefText = 'Looking for: Everyone';
        userProfilePref.textContent = prefText;
    }

    // Render profile card
    function renderProfileCard() {
        if (currentProfileIndex >= profiles.length) {
            noMoreProfiles.style.display = 'block';
            return;
        }

        const profile = profiles[currentProfileIndex];
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.dataset.id = profile.id;
        
        card.innerHTML = `
            <img src="${profile.images[0]}" alt="${profile.name}" class="profile-image">
            <div class="profile-info">
                <div class="profile-name-age">${profile.name}, ${profile.age}</div>
                <div class="profile-bio">${profile.bio}</div>
                <div class="profile-distance">
                    <i class="fas fa-map-marker-alt"></i> ${profile.distance}
                </div>
            </div>
        `;
        
        swipeContainer.appendChild(card);
        currentCard = card;
        setupCardDrag(card);
    }

    // ... (keep all the card drag functions the same: setupCardDrag, startDrag, drag, endDrag)

    // Like profile
    function likeProfile() {
        if (!currentCard) return;
        
        currentCard.classList.add('swipe-right');
        
        // Random chance to match (30%)
        if (Math.random() < 0.3) {
            const profile = profiles[currentProfileIndex];
            matches.push(profile);
            showMatchModal(profile);
        }
        
        moveToNextProfile();
    }

    // Dislike profile
    function dislikeProfile() {
        if (!currentCard) return;
        
        currentCard.classList.add('swipe-left');
        moveToNextProfile();
    }

    // Super like profile
    function superLikeProfile() {
        if (!currentCard) return;
        
        currentCard.classList.add('super-like-effect');
        
        // Higher chance to match (60%)
        if (Math.random() < 0.6) {
            const profile = profiles[currentProfileIndex];
            matches.push(profile);
            showMatchModal(profile);
        }
        
        setTimeout(() => {
            currentCard.classList.add('swipe-right');
            moveToNextProfile();
        }, 1000);
    }

    // Move to next profile
    function moveToNextProfile() {
        setTimeout(() => {
            currentCard.remove();
            currentCard = null;
            currentProfileIndex++;
            if (currentProfileIndex < profiles.length) {
                renderProfileCard();
            } else {
                noMoreProfiles.style.display = 'block';
            }
        }, 500);
    }

    // Show match modal
    function showMatchModal(profile) {
        matchedProfileImg.src = profile.images[0];
        matchedProfileName.textContent = `${profile.name}, ${profile.age}`;
        matchModal.style.display = 'flex';
    }

    // Show profile interface
    function showProfileInterface() {
        profileInterface.style.display = 'flex';
    }

    // Hide profile interface
    function hideProfileInterface() {
        profileInterface.style.display = 'none';
    }

    // Show chat interface
    function showChatInterface() {
        const matchesList = document.querySelector('.matches-list');
        matchesList.innerHTML = '';
        
        if (matches.length === 0) {
            matchesList.innerHTML = '<p class="no-matches">You have no matches yet</p>';
        } else {
            matches.forEach(match => {
                const matchItem = document.createElement('div');
                matchItem.className = 'match-item';
                matchItem.innerHTML = `
                    <img src="${match.images[0]}" alt="${match.name}">
                    <div class="match-info">
                        <h4>${match.name}, ${match.age}</h4>
                        <p>You matched on ${new Date().toLocaleDateString()}</p>
                    </div>
                `;
                matchesList.appendChild(matchItem);
            });
        }
        
        chatInterface.style.display = 'flex';
    }

    // Hide chat interface
    function hideChatInterface() {
        chatInterface.style.display = 'none';
    }

    // Save preferences and reload profiles
    function savePreferences() {
        const selectedOption = document.querySelector('input[name="preference"]:checked');
        if (selectedOption) {
            selectedGenderPref = selectedOption.value;
            updatePreferenceText();
            
            // Reset swiping
            currentProfileIndex = 0;
            if (currentCard) {
                currentCard.remove();
                currentCard = null;
            }
            noMoreProfiles.style.display = 'none';
            
            // Reload profiles with new preference
            loadProfiles();
            
            if (profiles.length > 0) {
                renderProfileCard();
            } else {
                noMoreProfiles.style.display = 'block';
            }
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Action buttons
        dislikeBtn.addEventListener('click', dislikeProfile);
        likeBtn.addEventListener('click', likeProfile);
        superLikeBtn.addEventListener('click', superLikeProfile);
        
        // Back button (rewind)
        backBtn.addEventListener('click', () => {
            if (currentProfileIndex > 0) {
                currentProfileIndex--;
                if (currentCard) {
                    currentCard.remove();
                }
                noMoreProfiles.style.display = 'none';
                renderProfileCard();
            }
        });
        
        // Match modal
        document.querySelector('.close-modal').addEventListener('click', () => {
            matchModal.style.display = 'none';
        });
        
        document.querySelector('.keep-swiping-btn').addEventListener('click', () => {
            matchModal.style.display = 'none';
        });
        
        document.querySelector('.send-message-btn').addEventListener('click', () => {
            matchModal.style.display = 'none';
            showChatInterface();
        });
        
        // Chat interface
        chatIcon.addEventListener('click', showChatInterface);
        backToSwiping.addEventListener('click', hideChatInterface);
        
        // Profile interface
        profileIcon.addEventListener('click', showProfileInterface);
        backToSwipingProfile.addEventListener('click', hideProfileInterface);
        
        // Mode selector
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // In a real app, we would load different profiles based on mode
            });
        });
        
        // Save preferences button
        savePreferencesBtn.addEventListener('click', savePreferences);
    }

    // Initialize the app
    init();
});