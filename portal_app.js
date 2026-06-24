let interns = JSON.parse(localStorage.getItem('bytehex_interns_cache')) || [
    { id: 4001, name: "Ayesha Malik", track: "Full-Stack Web Dev", attended: true, task: "Optimize API Queries", taskDone: false, performance: 92, certificate: "In Progress" },
    { id: 4002, name: "Zain Ahmed", track: "UI/UX Engineering", attended: false, task: "Figma Typography Update", taskDone: true, performance: 88, certificate: "Issued" }
];
let latestNotice = localStorage.getItem('bytehex_notice_cache') || "Welcome to the ByteHex workspace panel! Weekly reviews conclude on Friday sessions.";

const internModalObj = new bootstrap.Modal(document.getElementById('internModal'));
const taskModalObj = new bootstrap.Modal(document.getElementById('taskModal'));
const announcementModalObj = new bootstrap.Modal(document.getElementById('announcementModal'));

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value.trim();

    if (user === "admin" && pass === "password") {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        renderPortalDashboard();
    } else {
        alert("Invalid administrative credentials provided.");
    }
});

function logoutSession() {
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
}

function syncPortalData() {
    localStorage.setItem('bytehex_interns_cache', JSON.stringify(interns));
    localStorage.setItem('bytehex_notice_cache', latestNotice);

    document.getElementById('announcement-display').innerText = latestNotice;

    const total = interns.length;
    const activeTasks = interns.filter(i => i.task && !i.taskDone).length;
    
    const presentCount = interns.filter(i => i.attended).length;
    const attendancePercentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

    const totalPerformance = interns.reduce((acc, current) => acc + current.performance, 0);
    const avgPerformance = total > 0 ? Math.round(totalPerformance / total) : 0;

    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-tasks').innerText = activeTasks;
    document.getElementById('stat-attendance').innerText = `${attendancePercentage}%`;
    document.getElementById('stat-performance').innerText = `${avgPerformance}/100`;
}

function renderPortalDirectory() {
    const tbody = document.getElementById('interns-tbody');
    tbody.innerHTML = '';
    const query = document.getElementById('portal-search').value.toLowerCase();

    const filtered = interns.filter(i => {
        return i.name.toLowerCase().includes(query) || 
               i.track.toLowerCase().includes(query) || 
               i.id.toString().includes(query);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-muted p-4">No matching intern database matrix entities located.</td></tr>`;
        return;
    }

    filtered.forEach(intern => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><code class="fw-bold text-secondary">#${intern.id}</code></td>
            <td class="text-start">
                <span class="fw-bold d-block text-dark">${intern.name}</span>
                <small class="badge bg-secondary-subtle text-secondary font-monospace" style="font-size:0.7rem;">${intern.track}</small>
            </td>
            <td>
                <div class="form-check form-switch d-inline-block">
                    <input class="form-check-input" type="checkbox" ${intern.attended ? 'checked' : ''} onchange="toggleAttendance(${intern.id})">
                    <span class="small ms-1 ${intern.attended ? 'text-success fw-bold' : 'text-danger'}">${intern.attended ? 'Present' : 'Absent'}</span>
                </div>
            </td>
            <td class="text-start" style="max-width: 220px;">
                ${intern.task ? `
                    <div class="p-2 border rounded bg-light mb-1 small text-truncate">
                        <input type="checkbox" class="form-check-input me-1" ${intern.taskDone ? 'checked' : ''} onchange="toggleTaskDone(${intern.id})">
                        <span class="${intern.taskDone ? 'text-decoration-line-through text-muted' : 'fw-semibold text-dark'}">${intern.task}</span>
                    </div>
                ` : '<span class="text-muted small">No Active Task Outlined</span>'}
                <button class="btn btn-xs btn-link p-0 text-primary style="font-size: 0.75rem;" onclick="openTaskModal(${intern.id})">Modify Task Assignment</button>
            </td>
            <td>
                <span class="badge ${intern.performance >= 90 ? 'bg-success' : intern.performance >= 75 ? 'bg-info text-dark' : 'bg-warning text-dark'} fw-bold fs-6">
                    ${intern.performance}
                </span>
            </td>
            <td>
                <select class="form-select form-select-sm d-inline-block w-auto font-monospace small fw-bold text-center border-2 ${intern.certificate === 'Issued' ? 'border-success text-success' : intern.certificate === 'Reviewing' ? 'border-warning text-warning' : 'border-secondary text-secondary'}" onchange="updateCertificateStatus(${intern.id}, this.value)">
                    <option value="In Progress" ${intern.certificate === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Reviewing" ${intern.certificate === 'Reviewing' ? 'selected' : ''}>Reviewing</option>
                    <option value="Issued" ${intern.certificate === 'Issued' ? 'selected' : ''}>Issued 📜</option>
                </select>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="openEditModal(${intern.id})">✏️</button>
                    <button class="btn btn-outline-danger" onclick="deleteInternProfile(${intern.id})">🗑️</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderPortalDashboard() {
    syncPortalData();
    renderPortalDirectory();
}

window.toggleAttendance = (id) => {
    interns = interns.map(i => i.id === id ? { ...i, attended: !i.attended } : i);
    renderPortalDashboard();
};

window.toggleTaskDone = (id) => {
    interns = interns.map(i => i.id === id ? { ...i, taskDone: !i.taskDone } : i);
    renderPortalDashboard();
};

window.updateCertificateStatus = (id, value) => {
    interns = interns.map(i => i.id === id ? { ...i, certificate: value } : i);
    renderPortalDashboard();
};

window.deleteInternProfile = (id) => {
    if (confirm("Confirm database excision of specified intern profile reference block?")) {
        interns = interns.filter(i => i.id !== id);
        renderPortalDashboard();
    }
};

window.triggerAddModal = () => {
    document.getElementById('intern-form').reset();
    document.getElementById('intern-edit-id').value = '';
    document.getElementById('modal-title').innerText = "Register New Intern Profile";
    document.getElementById('modal-submit-btn').innerText = "Save Intern Entry";
    internModalObj.show();
};

window.openEditModal = (id) => {
    const i = interns.find(item => item.id === id);
    if (!i) return;
    document.getElementById('intern-edit-id').value = i.id;
    document.getElementById('intern-name').value = i.name;
    document.getElementById('intern-track').value = i.track;
    document.getElementById('intern-perf').value = i.performance;
    document.getElementById('modal-title').innerText = "Modify Active Intern Profile Indexes";
    document.getElementById('modal-submit-btn').innerText = "Update Intern Profile";
    internModalObj.show();
};

document.getElementById('intern-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const editId = document.getElementById('intern-edit-id').value;
    const name = document.getElementById('intern-name').value.trim();
    const track = document.getElementById('intern-track').value;
    const perf = parseInt(document.getElementById('intern-perf').value);

    if (editId) {
        interns = interns.map(item => item.id === parseInt(editId) ? { ...item, name, track, performance: perf } : item);
    } else {
        const entry = {
            id: Math.floor(1000 + Math.random() * 9000),
            name,
            track,
            attended: true,
            task: "",
            taskDone: false,
            performance: perf,
            certificate: "In Progress"
        };
        interns.push(entry);
    }
    internModalObj.hide();
    renderPortalDashboard();
});

window.openTaskModal = (id) => {
    document.getElementById('task-assignment-form').reset();
    document.getElementById('task-intern-id').value = id;
    taskModalObj.show();
};

document.getElementById('task-assignment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('task-intern-id').value);
    const desc = document.getElementById('task-desc').value.trim();

    interns = interns.map(item => item.id === id ? { ...item, task: desc, taskDone: false } : item);
    taskModalObj.hide();
    renderPortalDashboard();
});

window.triggerAnnouncementModal = () => {
    document.getElementById('announcement-input').value = '';
    announcementModalObj.show();
};

window.submitNoticeAnnouncement = () => {
    const text = document.getElementById('announcement-input').value.trim();
    if (!text) {
        alert("Announcement input payload cannot evaluate empty.");
        return;
    }
    latestNotice = text;
    announcementModalObj.hide();
    renderPortalDashboard();
};

document.getElementById('portal-search').addEventListener('input', renderPortalDirectory);

document.getElementById('theme-toggle').addEventListener('click', () => {
    const el = document.getElementById('portal-html');
    const toggleBtn = document.getElementById('theme-toggle');
    const isLight = el.getAttribute('data-bs-theme') === 'light';
    
    el.setAttribute('data-bs-theme', isLight ? 'dark' : 'light');
    toggleBtn.innerText = isLight ? "☀️ Light" : "🌙 Dark";
    toggleBtn.className = isLight ? "btn btn-outline-info btn-sm me-2" : "btn btn-outline-light btn-sm me-2";
});

syncPortalData();