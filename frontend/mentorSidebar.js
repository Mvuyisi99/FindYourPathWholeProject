/* =====================================================================
   mentor-sidebar.js
   Reusable sidebar for every mentor page (FindYourPath).
   Self-contained: it injects its own styles, so no extra CSS file is needed.

   USAGE
     <script src="mentor-sidebar.js"></script>        (in <head>)

     <div class="app-layout">
         <mentor-sidebar active="dashboard"></mentor-sidebar>
         <div class="main-area"> ... </div>
     </div>

   active = dashboard | users | booking | calendar | messages | settings

   It fills in the mentor's name, role and photo, and (once the page has
   loaded) calls initMentorNav() from bookings.js if that function exists.
   ===================================================================== */

(function () {
    'use strict';

    var HOME_PAGE = 'MentorDashboard.html';

    var NAV_ITEMS = [
        { key: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
        { key: 'users',     icon: 'fas fa-users',          label: 'Users' },
        { key: 'booking',   icon: 'far fa-calendar-alt',   label: 'Bookings' },
        { key: 'calendar',  icon: 'fas fa-calendar-days',  label: 'Calendar' },
        { key: 'messages',  icon: 'far fa-comment-dots',   label: 'Messages' },
        { key: 'settings',  icon: 'fas fa-cog',            label: 'Settings' }
    ];

    var CSS = `
    mentor-sidebar { display: contents; }

    .app-layout {
        display: flex;
        min-height: 100vh;
    }

    .main-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
        background: #f5f6fa;
    }

    .sidebar {
        width: 260px;
        flex-shrink: 0;
        background-color: #0D2B45;
        border-right: 1px solid #e9eef3;
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 16px;
        min-height: 100vh;
    }

    .sidebar .logo-area {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        cursor: pointer;
        background: #ffffff;
        border-radius: 12px;
        padding: 8px 12px 8px 3px;
        width: fit-content;
    }

    .sidebar .logo-img {
        width: 38px;
        height: 38px;
        object-fit: contain;
    }

    .sidebar .logo-text {
        font-weight: 800;
        font-size: 1.5rem;
        color: #1e3a5f;
    }

    .sidebar .logo-text .green {
        color: #2e7d32;
    }

    .sidebar .admin-card {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 12px;
        margin-bottom: 8px;
    }

    .sidebar .admin-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        object-fit: cover;
    }

    .sidebar .admin-name {
        font-size: 0.9rem;
        font-weight: 700;
        color: white;
    }

    .sidebar .admin-role {
        font-size: 0.75rem;
        opacity: 0.8;
        color: white;
    }

    .sidebar .admin-status {
        font-size: 0.7rem;
        color: #4caf50;
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
    }

    .sidebar .admin-status .dot {
        width: 7px;
        height: 7px;
        background: #4caf50;
        border-radius: 50%;
    }

    .sidebar ul {
        list-style: none;
        flex: 1;
        margin: 0;
        padding: 0;
    }

    .sidebar li {
        padding: 12px 16px;
        margin: 2px 0;
        font-size: 0.95rem;
        font-weight: 500;
        color: white;
        border-radius: 14px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .sidebar li i {
        width: 20px;
        font-size: 1rem;
        color: #5b6e8c;
    }

    .sidebar li.active {
        background-color: #e8f5e9;
        color: #2e7d32;
        font-weight: 700;
    }

    .sidebar li.active i {
        color: #2e7d32;
    }

    .sidebar li:hover:not(.active) {
        background-color: #f1f5f9;
        color: #2e7d32;
    }

    .sidebar .sidebar-footer {
        margin-top: auto;
        padding-top: 12px;
    }

    .sidebar .promo-card {
        background: white;
        padding: 16px;
        border-radius: 16px;
        text-align: center;
    }

    .sidebar .promo-img {
        width: 100px;
        height: 100px;
        margin: 0 auto 10px;
        border-radius: 50%;
        object-fit: cover;
    }

    .sidebar .promo-text {
        font-size: 0.9rem;
        color: #333;
        font-weight: 600;
        line-height: 1.4;
    }
    `;

    /* ---------------------------------------------------------------
       Helpers
       --------------------------------------------------------------- */
    function injectStyles() {
        if (document.getElementById('mentor-sidebar-styles')) return;
        var style = document.createElement('style');
        style.id = 'mentor-sidebar-styles';
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

    function getStoredUser() {
        try { return JSON.parse(localStorage.getItem('careerUser')); }
        catch (e) { return null; }
    }

    // Shared with mentor-header.js so the photo is only fetched once per page
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

    injectStyles();

    /* ---------------------------------------------------------------
       <mentor-sidebar>
       --------------------------------------------------------------- */
    class MentorSidebar extends HTMLElement {
        connectedCallback() {
            var active = this.getAttribute('active') || '';

            var navHtml = NAV_ITEMS.map(function (item) {
                return '<li' + (item.key === active ? ' class="active"' : '') +
                       ' data-nav="' + item.key + '"><i class="' + item.icon + '"></i> ' +
                       item.label + '</li>';
            }).join('');

            this.innerHTML =
                '<aside class="sidebar">' +
                    '<div class="logo-area" id="sidebarLogo">' +
                        '<img src="PROJECT 3 LOGO 2  3.png" alt="logo" class="logo-img" ' +
                            'onerror="this.onerror=null;this.src=\'https://via.placeholder.com/38x38?text=FP\'">' +
                        '<div class="logo-text">Find<span class="green">Your</span>Path</div>' +
                    '</div>' +

                    '<div class="admin-card">' +
                        '<img class="admin-avatar" id="sidebarAvatar" alt="">' +
                        '<div>' +
                            '<div class="admin-name" id="sidebarName">Mentor</div>' +
                            '<div class="admin-role" id="sidebarRole">Mentor</div>' +
                            '<div class="admin-status"><span class="dot"></span> Online</div>' +
                        '</div>' +
                    '</div>' +

                    '<ul>' + navHtml + '</ul>' +

                    '<div class="sidebar-footer">' +
                        '<div class="promo-card">' +
                            '<img src="PROJECT 3 LOGO.png" alt="Promo" class="promo-img">' +
                            '<div class="promo-text">Real guidance.<br>Local mentors.<br>Brighter futures.</div>' +
                        '</div>' +
                    '</div>' +
                '</aside>';

            this.querySelector('#sidebarLogo').addEventListener('click', function () {
                var here = location.pathname.split('/').pop();
                if (here === HOME_PAGE) location.reload();
                else location.href = HOME_PAGE;
            });

            this.fillUser();

            var self = this;
            onReady(function () {
                self.loadPhoto();
                // Sidebar link navigation lives in bookings.js
                if (typeof initMentorNav === 'function') {
                    try { initMentorNav(); }
                    catch (e) { console.error('initMentorNav failed:', e); }
                }
            });
        }

        fillUser() {
            var user = getStoredUser();
            if (!user) return;
            var name = user.fullname || 'Mentor';
            var role = user.role || 'Mentor';
            this.querySelector('#sidebarName').textContent = name;
            this.querySelector('#sidebarRole').textContent = role;
        }

        loadPhoto() {
            var img = this.querySelector('#sidebarAvatar');
            resolvePhoto().then(function (r) {
                if (!r || !img) return;
                img.onerror = function () { img.onerror = null; img.src = r.fallback; };
                img.src = r.photo || r.fallback;
                img.alt = r.name;
            });
        }
    }

    customElements.define('mentor-sidebar', MentorSidebar);
})();