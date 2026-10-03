
const LOGIN_PAGE = 'Home.html';   // where signed-out users are sent; change to your login page

const BookingStore = {

    async requireUser() {
        const { data } = await sb.auth.getUser();
        if (!data || !data.user) {
            window.location.href = LOGIN_PAGE;
            return null;
        }
        return data.user;
    },


    async findMentorByName(name) {
        const { data, error } = await sb.from('profiles')
            .select('id, full_name')
            .eq('role', 'Mentor')
            .ilike('full_name', name)
            .maybeSingle();
        if (error) throw error;
        return data;
    },

    async request({ mentor, mentorDetail, message }) {
        const user = await this.requireUser();
        if (!user) return null;

        const { data: me, error: meErr } = await sb.from('profiles')
            .select('full_name').eq('id', user.id).single();
        if (meErr) throw meErr;

        const m = await this.findMentorByName(mentor);
        if (!m) throw new Error('MENTOR_NOT_FOUND');

        const { data, error } = await sb.from('bookings').insert({
            student_id: user.id,
            mentor_id: m.id,
            student_name: me.full_name,
            mentor_name: m.full_name,
            mentor_detail: mentorDetail,
            message: message || null
        }).select().single();
        if (error) throw error;
        return data;
    },

    async myBookingStates() {
        const user = await this.requireUser();
        if (!user) return {};
        const { data, error } = await sb.from('bookings')
            .select('mentor_name, status, session_date, start_time, end_time')
            .eq('student_id', user.id)
            .in('status', ['pending', 'confirmed'])
            .order('created_at', { ascending: true });
        if (error) throw error;

        const n = new Date();
        const today = n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');

        const states = {};
        data.forEach(b => {
            // A confirmed session that already happened no longer blocks a new booking
            if (b.status === 'confirmed' && b.session_date < today) return;
            states[b.mentor_name] = b;   // newest row wins
        });
        return states;
    },

    async watchMyBookings(callback) {
        const user = await this.requireUser();
        if (!user) return;
        sb.channel('my-bookings')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'bookings', filter: 'student_id=eq.' + user.id },
                callback)
            .subscribe();
    },

    async forMentor() {
        const user = await this.requireUser();
        if (!user) return [];
        const { data, error } = await sb.from('bookings')
            .select('*')
            .eq('mentor_id', user.id)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async get(id) {
        const user = await this.requireUser();
        if (!user) return null;
        const { data, error } = await sb.from('bookings')
            .select('*')
            .eq('id', id)
            .eq('mentor_id', user.id)
            .maybeSingle();
        if (error) throw error;
        return data;
    },

    async update(id, changes) {
        const { data, error } = await sb.from('bookings')
            .update(changes).eq('id', id).select().single();
        if (error) throw error;
        return data;
    }
};

function initMentorNav() {
    const routes = {
        dashboard: 'MentorDashboard.html',
        booking: 'MentorBookings.html'
    };
    document.querySelectorAll('.sidebar li[data-nav]').forEach(li => {
        li.addEventListener('click', () => {
            const page = routes[li.dataset.nav];
            if (page) window.location.href = page;
        });
    });
}

async function initStudentBookingButtons() {
    const cards = [];
    document.querySelectorAll('.booking-grid a').forEach(btn => {
        if (btn.textContent.trim() !== 'Book') return;
        const card = btn.closest('.booking-grid > div');
        cards.push({
            btn: btn,
            mentor: card.querySelector('h2').textContent.trim(),
            detail: card.querySelector('p').textContent.trim()
        });
    });

    function setState(btn, mode, title) {
        const look = {
            book:      { text: 'Book',       off: false, bg: '',        color: '',      opacity: '' },
            busy:      { text: 'Sending...', off: true,  bg: '',        color: '',      opacity: '0.6' },
            requested: { text: 'Requested',  off: true,  bg: '',        color: '',      opacity: '0.6' },
            confirmed: { text: 'Confirmed',  off: true,  bg: '#4caf50', color: 'white', opacity: '' }
        }[mode];
        btn.textContent = look.text;
        btn.style.pointerEvents = look.off ? 'none' : '';
        btn.style.background = look.bg;
        btn.style.color = look.color;
        btn.style.opacity = look.opacity;
        btn.title = title || '';
    }

    function slotText(b) {
        const d = new Date(b.session_date + 'T00:00');
        const day = d.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
        return day + ', ' + b.start_time.slice(0, 5) + ' - ' + b.end_time.slice(0, 5);
    }

    async function refresh() {
        try {
            const states = await BookingStore.myBookingStates();
            cards.forEach(c => {
                const b = states[c.mentor];
                if (!b) setState(c.btn, 'book');
                else if (b.status === 'confirmed') setState(c.btn, 'confirmed', slotText(b));
                else setState(c.btn, 'requested', 'Waiting for the mentor to confirm');
            });
        } catch (e) {
            console.error('Could not load booking states:', e);
        }
    }

    cards.forEach(c => {
        c.btn.addEventListener('click', async e => {
            e.preventDefault();
            setState(c.btn, 'busy');
            try {
                await BookingStore.request({ mentor: c.mentor, mentorDetail: c.detail });
                await refresh();
            } catch (err) {
                console.error(err);
                if (err.code === '23505') {
                    await refresh();
                } else if (err.message === 'MENTOR_NOT_FOUND') {
                    c.btn.textContent = 'Unavailable';
                    alert('This mentor has not registered yet.');
                } else {
                    setState(c.btn, 'book');
                    alert('Could not send your request. Please try again.');
                }
            }
        });
    });

    await refresh();
    BookingStore.watchMyBookings(refresh);
    window.addEventListener('focus', refresh);
}