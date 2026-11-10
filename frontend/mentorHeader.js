/* =====================================================================
   mentor-header.js
   Reusable top bar for every mentor page (FindYourPath).
   Self-contained: it injects its own styles, so no extra CSS file is needed.

   USAGE
     <script src="mentor-header.js"></script>         (in <head>)

     <div class="main-area">
         <mentor-header greeting subtitle="Here's what happening across FindYourPath today."></mentor-header>
         <main class="page-content"> ... </main>
     </div>

   Attributes
     greeting        -> title becomes "Welcome back, <first name>!"
     title="..."     -> fixed title (used when "greeting" is not set)
     subtitle="..."  -> line under the title
     no-search       -> hides the search box

   It handles the profile dropdown, logout, name/role/photo and, once the
   page has loaded, calls initMentorNotifications() and initMentorSearch()
   if those functions exist (bookings.js / mentorSearch.js).
   ===================================================================== */

(function () {
    'use strict';

    var LOGIN_PAGE = 'Register.html';
    var LOGOUT_REDIRECT = 'Home.html';

    var CSS = `
    mentor-header { display: contents; }

    .top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding: 20px 32px;
        background: white;
        border-bottom: 1px solid #e2e8f0;
        flex-wrap: wrap;
    }

    .top-bar .welcome-block h1 {
        font-size: 1.5rem;
        color: #0f2744;
        margin-bottom: 4px;
    }

    .top-bar .welcome-block p {
        font-size: 0.9rem;
        color: #64748b;
    }

    .top-bar-right {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .top-bar .search-wrap {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 40px;
        padding: 8px 16px;
        min-width: 260px;
    }

    .top-bar .search-wrap i {
        color: #94a3b8;
    }

    .top-bar .search-input {
        border: none;
        background: transparent;
        outline: none;
        width: 100%;
        font-size: 0.85rem;
        font-family: inherit;
    }

    .top-bar .icon-btn {
        position: relative;
        background: none;
        border: none;
        font-size: 1.2rem;
        color: #5b6e8c;
        cursor: pointer;
        padding: 6px;
    }

    .top-bar .badge {
        position: absolute;
        top: -4px;
        right: -6px;
        background: #2e7d32;
        color: white;
        font-size: 0.65rem;
        font-weight: bold;
        padding: 2px 6px;
        border-radius: 40px;
    }

    .top-bar .profile-preview {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        position: relative;
    }

    .top-bar .profile-preview img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }

    .top-bar .profile-preview .name {
        font-weight: 700;
        font-size: 0.9rem;
        color: #0f172a;
    }

    .top-bar .arrow-down {
        font-size: 0.7rem;
        color: #5b6e8c;
    }

    .top-bar .dropdown-menu {
        position: absolute;
        top: 48px;
        right: 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        width: 200px;
        display: none;
        z-index: 100;
    }

    .top-bar .dropdown-menu.show {
        display: block;
    }

    .top-bar .dropdown-menu a {
        display: block;
        padding: 12px 20px;
        text-decoration: none;
        color: #1e293b;
        font-size: 0.9rem;
    }

    .top-bar .dropdown-menu a:hover {
        background: #f1f5f9;
        color: #2e7d32;
    }

    /* Notification panel (opened by the bell, built by initMentorNotifications) */
    .notif-panel {
        position: fixed;
        width: 360px;
        max-width: calc(100vw - 24px);
        max-height: 440px;
        overflow-y: auto;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14);
        z-index: 200;
        display: none;
    }
    .notif-panel.show { display: block; }
    .notif-head {
        padding: 16px 18px 12px;
        font-size: 0.95rem;
        font-weight: 700;
        color: #0f172a;
        border-bottom: 1px solid #f1f5f9;
    }
    .notif-item {
        display: flex;
        gap: 12px;
        padding: 14px 18px;
        border-bottom: 1px solid #f1f5f9;
    }
    .notif-item img { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; }
    .notif-body p { font-size: 0.85rem; line-height: 1.45; color: #0f172a; }
    .notif-time { display: block; font-size: 0.72rem; color: #94a3b8; margin-top: 4px; }
    .notif-actions { display: flex; gap: 8px; margin-top: 10px; }
    .notif-approve,
    .notif-decline {
        font-family: inherit;
        font-size: 0.8rem;
        font-weight: 600;
        border-radius: 8px;
        padding: 7px 16px;
        cursor: pointer;
    }
    .notif-approve { background: #2e7d32; border: 1px solid #2e7d32; color: white; }
    .notif-approve:hover { background: #256628; }
    .notif-decline { background: white; border: 1px solid #cbd5e1; color: #475569; }
    .notif-decline:hover { background: #f1f5f9; }
    .notif-approve:disabled,
    .notif-decline:disabled { opacity: 0.6; cursor: default; }
    .notif-empty { padding: 28px 18px; text-align: center; font-size: 0.85rem; color: #64748b; }
    `;

    /* ---------------------------------------------------------------
       Helpers
       --------------------------------------------------------------- */
    function injectStyles() {
        if (document.getElementById('mentor-header-styles')) return;
        var style = document.createElement('style');
        style.id = 'mentor-header-styles';
        style.textContent = CSS;
        document.head.appendChild(style);
    }

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function getStoredUser() {
        try { return JSON.parse(localStorage.getItem('careerUser')); }
        catch (e) { return null; }
    }

    // Shared with mentor-sidebar.js so the photo is only fetched once per page
    function resolvePhoto() {
        if (!window.__mentorPhotoPromise) {
            window.__mentorPhotoPromise = (async function () {
                if (typeof sb === 'undefined' ||
                    typeof mentorPhotoUrl !== 'function' ||
                    typeof initialsAvatar !== 'function') return null;

                var res = await sb.auth.getUser();
                if (!res.data || !res.data.user) return null;

                var name = (getStoredUser() || {}).fullname || 'Mentor';
                return {
                    name: name,
                    fallback: initialsAvatar(name),
                    photo: await mentorPhotoUrl(res.data.user.id)
                };
            })().catch(function (e) {
                console.error('Could not load profile picture:', e);
                return null;
            });
        }
        return window.__mentorPhotoPromise;
    }

    async function handleLogout() {
        if (!confirm('Are you sure you want to log out?')) return;

        try {
            if (typeof sb !== 'undefined') await sb.auth.signOut();
        } catch (e) {
            console.error('Sign out failed:', e);
        }
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('careerUser');
        window.location.href = LOGOUT_REDIRECT;
    }
    // Other scripts on the page may call handleLogout()
    window.handleLogout = handleLogout;

    injectStyles();

    /* ---------------------------------------------------------------
       <mentor-header>
       --------------------------------------------------------------- */
    class MentorHeader extends HTMLElement {
        connectedCallback() {
            var title = this.getAttribute('title') || 'Welcome back!';
            var subtitle = this.getAttribute('subtitle') ||
                "Here's what happening across FindYourPath today.";
            var showSearch = !this.hasAttribute('no-search');

            var searchHtml = showSearch
                ? '<div class="search-wrap">' +
                      '<i class="fas fa-search"></i>' +
                      '<input type="text" class="search-input" placeholder="Search users, mentors, bookings">' +
                  '</div>'
                : '';

            this.innerHTML =
                '<header class="top-bar">' +
                    '<div class="welcome-block">' +
                        '<h1 id="welcomeTitle">' + escapeHtml(title) + '</h1>' +
                        '<p>' + escapeHtml(subtitle) + '</p>' +
                    '</div>' +

                    '<div class="top-bar-right">' +
                        searchHtml +

                        '<button class="icon-btn" id="notificationBtn" type="button">' +
                            '<i class="far fa-bell"></i>' +
                            '<span class="badge">3</span>' +
                        '</button>' +

                        '<div class="profile-preview" id="profileBtn">' +
                            '<img id="profileAvatar" alt="">' +
                            '<div class="info">' +
                                '<div class="name" id="profileName">Mentor</div>' +
                                '<div class="role" id="profileRole">Mentor</div>' +
                            '</div>' +
                            '<i class="fas fa-chevron-down arrow-down"></i>' +

                            '<div class="dropdown-menu" id="dropdownMenu">' +
                                '<a href="MentorSettings.html"><i class="fas fa-user"></i> My Profile</a>' +
                                '<a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Log out</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</header>';

            this.bindDropdown();
            this.bindLogout();
            if (!this.fillUser()) return;   // not logged in -> redirected

            var self = this;
            onReady(function () {
                self.loadPhoto();
                // Bell panel (bookings.js) and search box (mentorSearch.js)
                if (typeof initMentorNotifications === 'function') {
                    try { initMentorNotifications(); }
                    catch (e) { console.error('initMentorNotifications failed:', e); }
                }
                if (showSearch && typeof initMentorSearch === 'function') {
                    try { initMentorSearch(); }
                    catch (e) { console.error('initMentorSearch failed:', e); }
                }
            });
        }

        bindDropdown() {
            var profileBtn = this.querySelector('#profileBtn');
            var dropdown = this.querySelector('#dropdownMenu');

            profileBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
            document.addEventListener('click', function () {
                dropdown.classList.remove('show');
            });
        }

        bindLogout() {
            this.querySelector('#logoutBtn').addEventListener('click', function (e) {
                e.preventDefault();   // href="#" would otherwise jump to the top
                handleLogout();
            });
        }

        fillUser() {
            var user = getStoredUser();
            if (!user) {
                window.location.href = LOGIN_PAGE;
                return false;
            }

            var fullName = user.fullname || 'Mentor';
            var firstName = fullName.split(' ')[0];

            this.querySelector('#profileName').textContent = fullName;
            this.querySelector('#profileRole').textContent = user.role || 'Mentor';

            if (this.hasAttribute('greeting')) {
                this.querySelector('#welcomeTitle').textContent = 'Welcome back, ' + firstName + '!';
            }
            return true;
        }

        loadPhoto() {
            var img = this.querySelector('#profileAvatar');
            resolvePhoto().then(function (r) {
                if (!r || !img) return;
                img.onerror = function () { img.onerror = null; img.src = r.fallback; };
                img.src = r.photo || r.fallback;
                img.alt = r.name;
            });
        }
    }

    customElements.define('mentor-header', MentorHeader);
})();