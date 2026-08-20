
  // ==================== REGISTER FORM ====================
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get values
      const fullname = document.getElementById('fullname').value.trim();
      const role = document.getElementById('role').value;
      const cell = document.getElementById('cell').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirmPassword').value;

      // Validation
      if (!fullname || !role || !cell || !email || !password || !confirm) {
        alert(' Please fill all fields');
        return;
      }
      if (password !== confirm) {
        alert(' Passwords do not match!');
        return;
      }
      if (password.length < 4) {
        alert('Password must be at least 4 characters');
        return;
      }

      // Save to localStorage
      const user = { fullname, role, cell, email, password };
      localStorage.setItem('careerUser', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');

      // ✅ Show custom toast message
      const toast = document.getElementById('custom-toast');
      if (toast) {
        toast.textContent = '✅ Registration successful! Redirecting...';
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 1500);
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1600);
      } else {
        // Fallback in case toast div is missing
        alert('Registration successful!');
        window.location.href = 'dashboard.html';
      }
    });
  }

  // ==================== LOGIN MODAL ====================
  const modal = document.getElementById('login-modal');
  const loginLink = document.getElementById('toggle-login-link');
  const closeBtn = document.querySelector('.close');
  const loginForm = document.getElementById('loginForm');

  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.style.display = 'flex';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const stored = localStorage.getItem('careerUser');
      if (!stored) {
        alert(' No account found. Please register first.');
        return;
      }
      const user = JSON.parse(stored);
      if (user.email === email && user.password === password) {
        localStorage.setItem('isLoggedIn', 'true');
        alert('✅ Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 100);
      } else {
        alert('Invalid email or password');
      }
    });
  }

document.addEventListener('DOMContentLoaded', () => {
    // Selectors
    const careerListItems = document.querySelectorAll('.career-nav ul li');
    const dynamicTitle = document.getElementById('dynamicTitle');
    const careerSearchInput = document.getElementById('careerFilter');
    const sidebarMenuItems = document.querySelectorAll('.side-menu li');

    /**
     * 1. CAREER PATH SWITCHER
     * Updates the main banner title and active styling when a 
     * career category is clicked.
     */
    careerListItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove 'active' class from all career items
            careerListItems.forEach(li => li.classList.remove('active'));
            
            // Add 'active' class to the clicked item
            item.classList.add('active');
            
            // Update the banner heading to match the selection
            const selectedCareer = item.innerText;
            dynamicTitle.innerText = selectedCareer.toUpperCase();

            // Note: In a real app, you would fetch new stats/skills 
            // from an API or object here.
            console.log(`Switched to: ${selectedCareer}`);
        });
    });

    /**
     * 2. SEARCH FILTER
     * Filters the 'Top Career Paths' list in real-time as the user types.
     */
    careerSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        careerListItems.forEach(item => {
            const text = item.innerText.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    /**
     * 3. SIDEBAR NAVIGATION
     * Manages the active state for the main dashboard navigation.
     */
    sidebarMenuItems.forEach(menuItem => {
        menuItem.addEventListener('click', () => {
            // Check if the item isn't a divider or promo
            if (!menuItem.classList.contains('menu-divider')) {
                sidebarMenuItems.forEach(i => i.classList.remove('active'));
                menuItem.classList.add('active');
            }
        });
    });

    /**
     * 4. BUTTON INTERACTION
     * Simple visual feedback for the 'Explore Industries' button.
     */
    const exploreBtn = document.querySelector('.btn-industry');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            alert('Redirecting to the Industry Directory...');
        });
    }
});