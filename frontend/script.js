/* ==========================================================================
   BANANA GENERAL — HOSPITAL MANAGEMENT SYSTEM (frontend only)
   --------------------------------------------------------------------------
   Data now comes from the backend API (Render). The `db` object below just
   holds the current in-memory copy of what's loaded from the server.
   ========================================================================== */

const BASE_URL = "https://hospital-management-exu3.onrender.com";

const db = {
    patients: [],
    doctors: [],
    appointments: [],
    bills: [],
    counters: { patient: 1005, appt: 4, bill: 503, doctor: 4 },

    // --- Real API calls ---
    api: {
        async addPatient(data) {
            const res = await fetch(`${BASE_URL}/api/patients`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            return res.json();
        },

        async addDoctor(data) {
            const res = await fetch(`${BASE_URL}/api/doctors`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            return res.json();
        },

        async addAppointment(data) {
            const res = await fetch(`${BASE_URL}/api/appointments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            return res.json();
        },

        async addBill(data) {
            const res = await fetch(`${BASE_URL}/api/bills`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            return res.json();
        },

        async removePatient(id) {
            const res = await fetch(`${BASE_URL}/api/patients/${id}`, {
                method: "DELETE"
            });
            return res.json();
        },

        async removeDoctor(id) {
            const res = await fetch(`${BASE_URL}/api/doctors/${id}`, {
                method: "DELETE"
            });
            return res.json();
        },

        async cancelAppointment(id) {
            const res = await fetch(`${BASE_URL}/api/appointments/${id}/cancel`, {
                method: "PATCH"
            });
            return res.json();
        },

        async markBillPaid(id) {
            const res = await fetch(`${BASE_URL}/api/bills/${id}/pay`, {
                method: "PATCH"
            });
            return res.json();
        },
    }
};

async function loadAll() {
    try {
        const [patients, doctors, appointments, bills] = await Promise.all([
            fetch(`${BASE_URL}/api/patients`).then(r => r.json()),
            fetch(`${BASE_URL}/api/doctors`).then(r => r.json()),
            fetch(`${BASE_URL}/api/appointments`).then(r => r.json()),
            fetch(`${BASE_URL}/api/bills`).then(r => r.json()),
        ]);
        db.patients = patients;
        db.doctors = doctors;
        db.appointments = appointments;
        db.bills = bills;
    } catch (err) {
        console.error("Failed to load data from backend:", err);
        showToast("Could not connect to server.");
    }
}

function todayISO() { return new Date().toISOString().slice(0, 10); }

function addDays(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
}

function doctorName(id) { const d = db.doctors.find(d => d.id === id); return d ? d.name : "Unassigned"; }

function patientName(id) { const p = db.patients.find(p => p.id === id); return p ? p.name : "Unknown"; }

function money(n) { return "Rs " + Number(n).toLocaleString("en-PK"); }

/* ============================== LOGIN ============================== */
const DEMO_USER = "admin";
const DEMO_PASS = "banana123";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value;
    const errorEl = document.getElementById("loginError");

    if (user === DEMO_USER && pass === DEMO_PASS) {
        errorEl.hidden = true;
        document.getElementById("loginScreen").hidden = true;
        document.getElementById("app").hidden = false;
        document.getElementById("userName").textContent = "Admin";
        document.getElementById("userAvatar").textContent = "A";
        await loadAll();
        renderAll();
    } else {
        errorEl.hidden = false;
    }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    document.getElementById("app").hidden = true;
    document.getElementById("loginScreen").hidden = false;
    document.getElementById("loginForm").reset();
});

/* ============================== NAV ============================== */
document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(`view-${btn.dataset.view}`).classList.add("active");
    });
});

/* ============================== MODALS ============================== */
const overlay = document.getElementById("modalOverlay");

document.querySelectorAll("[data-open-modal]").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.openModal));
});
document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", closeModal);
});
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

function openModal(id) {
    populateSelects();
    overlay.hidden = false;
    document.getElementById(id).classList.add("open");
    const firstField = document.getElementById(id).querySelector("input, select");
    if (firstField) firstField.focus();
}

function closeModal() {
    overlay.hidden = true;
    document.querySelectorAll(".modal").forEach(m => {
        m.classList.remove("open");
        m.reset();
    });
}

function populateSelects() {
    const doctorOptions = db.doctors.map(d => `<option value="${d.id}">${d.name} — ${d.specialty}</option>`).join("");
    const patientOptions = db.patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("");

    document.getElementById("patientDoctorSelect").innerHTML = doctorOptions || `<option disabled>No doctors yet</option>`;
    document.getElementById("apptDoctorSelect").innerHTML = doctorOptions || `<option disabled>No doctors yet</option>`;
    document.getElementById("apptPatientSelect").innerHTML = patientOptions || `<option disabled>No patients yet</option>`;
    document.getElementById("billPatientSelect").innerHTML = patientOptions || `<option disabled>No patients yet</option>`;
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { toast.hidden = true; }, 2400);
}

/* ============================== FORM HANDLERS ============================== */
document.getElementById("patientModal").addEventListener("submit", async(e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    await db.api.addPatient({
        name: f.get("name"),
        age: Number(f.get("age")),
        gender: f.get("gender"),
        condition: f.get("condition"),
        doctorId: f.get("doctor"),
        status: f.get("status"),
    });
    closeModal();
    await loadAll();
    renderAll();
    showToast("Patient admitted successfully.");
});

document.getElementById("doctorModal").addEventListener("submit", async(e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    await db.api.addDoctor({
        name: f.get("name"),
        specialty: f.get("specialty"),
        email: f.get("email"),
        phone: f.get("phone"),
    });
    closeModal();
    await loadAll();
    renderAll();
    showToast("Doctor added to staff.");
});

document.getElementById("apptModal").addEventListener("submit", async(e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    await db.api.addAppointment({
        patientId: f.get("patient"),
        doctorId: f.get("doctor"),
        date: f.get("date"),
        time: f.get("time"),
    });
    closeModal();
    await loadAll();
    renderAll();
    showToast("Appointment booked.");
});

document.getElementById("billModal").addEventListener("submit", async(e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    await db.api.addBill({
        patientId: f.get("patient"),
        amount: Number(f.get("amount")),
        status: f.get("status"),
    });
    closeModal();
    await loadAll();
    renderAll();
    showToast("Invoice created.");
});

/* ============================== SEARCH / FILTER ============================== */
document.getElementById("patientSearch").addEventListener("input", renderPatients);
document.getElementById("patientFilter").addEventListener("change", renderPatients);

/* ============================== RENDERERS ============================== */
function renderAll() {
    renderDashboard();
    renderPatients();
    renderDoctors();
    renderAppointments();
    renderBilling();
}

function renderDashboard() {
    document.getElementById("statPatients").textContent = db.patients.length;
    document.getElementById("statDoctors").textContent = db.doctors.length;
    document.getElementById("statAppts").textContent = db.appointments.filter(a => a.date === todayISO() && a.status !== "Cancelled").length;
    const outstanding = db.bills.filter(b => b.status === "Unpaid").reduce((sum, b) => sum + b.amount, 0);
    document.getElementById("statBilling").textContent = money(outstanding);

    const upcoming = db.appointments
        .filter(a => a.status === "Scheduled")
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .slice(0, 5);
    const upcomingEl = document.getElementById("dashUpcoming");
    upcomingEl.innerHTML = upcoming.length ? upcoming.map(a => `
    <li><span>${patientName(a.patientId)} &rarr; ${doctorName(a.doctorId)}</span>
    <span class="li-meta">${a.date} · ${a.time}</span></li>`).join("") :
        `<li class="empty">Nothing scheduled — book an appointment to see it here.</li>`;

    const recent = [...db.patients].slice(-5).reverse();
    const recentEl = document.getElementById("dashRecentPatients");
    recentEl.innerHTML = recent.length ? recent.map(p => `
    <li><span>${p.name}</span><span class="li-meta">${p.condition}</span></li>`).join("") :
        `<li class="empty">No patients admitted yet.</li>`;
}

function renderPatients() {
    const search = document.getElementById("patientSearch").value.trim().toLowerCase();
    const filter = document.getElementById("patientFilter").value;

    const rows = db.patients.filter(p => {
        const matchesSearch = !search || [p.name, p.id, p.condition].join(" ").toLowerCase().includes(search);
        const matchesFilter = filter === "all" || p.status === filter;
        return matchesSearch && matchesFilter;
    });

    const body = document.getElementById("patientsTableBody");
    body.innerHTML = rows.map(p => `
    <tr>
      <td class="mono">${p.id}</td>
      <td>${p.name}</td>
      <td>${p.age}</td>
      <td>${p.gender}</td>
      <td>${p.condition}</td>
      <td>${doctorName(p.doctorId)}</td>
      <td><span class="status-pill status-${p.status}">${p.status}</span></td>
      <td><button class="row-btn" data-remove-patient="${p.id}">Discharge &amp; remove</button></td>
    </tr>`).join("");

    document.getElementById("patientsEmpty").hidden = rows.length !== 0;

    body.querySelectorAll("[data-remove-patient]").forEach(btn => {
        btn.addEventListener("click", async() => {
            await db.api.removePatient(btn.dataset.removePatient);
            await loadAll();
            renderAll();
            showToast("Patient record removed.");
        });
    });
}

function renderDoctors() {
    const grid = document.getElementById("doctorsGrid");
    grid.innerHTML = db.doctors.map(d => `
    <div class="doctor-card">
      <span class="avatar">${d.name.replace("Dr. ","").split(" ").map(w=>w[0]).join("").slice(0,2)}</span>
      <h3>${d.name}</h3>
      <p class="specialty">${d.specialty}</p>
      <p class="contact">${d.email}</p>
      <p class="contact">${d.phone}</p>
      <button class="row-btn" style="margin-top:12px" data-remove-doctor="${d.id}">Remove from staff</button>
    </div>`).join("") || `<p class="empty-state">No doctors on staff yet — add the first one above.</p>`;

    grid.querySelectorAll("[data-remove-doctor]").forEach(btn => {
        btn.addEventListener("click", async() => {
            await db.api.removeDoctor(btn.dataset.removeDoctor);
            await loadAll();
            renderAll();
            showToast("Doctor removed from staff.");
        });
    });
}

function renderAppointments() {
    const rows = [...db.appointments].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    const body = document.getElementById("apptTableBody");
    body.innerHTML = rows.map(a => `
    <tr>
      <td>${patientName(a.patientId)}</td>
      <td>${doctorName(a.doctorId)}</td>
      <td>${a.date}</td>
      <td>${a.time}</td>
      <td><span class="status-pill status-${a.status}">${a.status}</span></td>
      <td>${a.status === "Scheduled" ? `<button class="row-btn" data-cancel-appt="${a.id}">Cancel</button>` : ""}</td>
    </tr>`).join("");

  document.getElementById("apptEmpty").hidden = rows.length !== 0;

  body.querySelectorAll("[data-cancel-appt]").forEach(btn => {
    btn.addEventListener("click", async () => {
      await db.api.cancelAppointment(btn.dataset.cancelAppt);
      await loadAll();
      renderAll();
      showToast("Appointment cancelled.");
    });
  });
}

function renderBilling(){
  const body = document.getElementById("billTableBody");
  body.innerHTML = db.bills.map(b => `
    <tr>
      <td class="mono">${b.id}</td>
      <td>${patientName(b.patientId)}</td>
      <td>${money(b.amount)}</td>
      <td><span class="status-pill status-${b.status}">${b.status}</span></td>
      <td>${b.status === "Unpaid" ? `<button class="row-btn" data-mark-paid="${b.id}">Mark paid</button>` : ""}</td>
    </tr>`).join("");

  document.getElementById("billEmpty").hidden = db.bills.length !== 0;

  body.querySelectorAll("[data-mark-paid]").forEach(btn => {
    btn.addEventListener("click", async () => {
      await db.api.markBillPaid(btn.dataset.markPaid);
      await loadAll();
      renderAll();
      showToast("Invoice marked as paid.");
    });
  });
}
