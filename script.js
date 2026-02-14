// ── Data ──────────────────────────────────────────────────────────────────────

const CATEGORIES = {
  safety:         { label: "Safety",        icon: "⚠️",  color: "#ff4757" },
  lighting:       { label: "Poor Lighting", icon: "💡",  color: "#eccc68" },
  sanitation:     { label: "Sanitation",    icon: "🗑️",  color: "#2ed573" },
  infrastructure: { label: "Infrastructure",icon: "🔧",  color: "#ffa502" },
  other:          { label: "Other",         icon: "📌",  color: "#00d4ff" },
}

const AUTHORITY_CATEGORY_MAP = {
  "Municipal Corporation":          "infrastructure",
  "Kerala State Electricity Board": "lighting",
  "Sanitation Wing":                "sanitation",
  "Police":                         "safety",
  "Traffic Police":                 "safety",
}

const CATEGORY_AUTHORITY_MAP = {
  safety:         "Police",
  lighting:       "Kerala State Electricity Board",
  sanitation:     "Sanitation Wing",
  infrastructure: "Municipal Corporation",
  other:          "Municipal Corporation",
}

const PIN_POSITIONS = [
  { id: "1", x: 38, y: 52 },
  { id: "2", x: 62, y: 34 },
  { id: "3", x: 27, y: 68 },
]

let reports = [
  {
    id: "1",
    category: "infrastructure",
    title: "Large pothole on MG Road",
    description: "Deep pothole near bus stop causing accidents daily. Two bikes fell yesterday.",
    upvotes: 34,
    date: "2026-02-11",
    severity: "High",
    authority: "Municipal Corporation",
    location: "MG Road, Near Bus Stop, Ernakulam",
    photo: null,
    resolved: false,
    x: 38, y: 52,
  },
  {
    id: "2",
    category: "lighting",
    title: "Street lights not working on Park Avenue",
    description: "Entire stretch of Park Avenue has been dark for 2 weeks. Very unsafe at night for pedestrians.",
    upvotes: 21,
    date: "2026-02-10",
    severity: "Medium",
    authority: "Kerala State Electricity Board",
    location: "Park Avenue, Kochi",
    photo: null,
    resolved: false,
    x: 62, y: 34,
  },
  {
    id: "3",
    category: "sanitation",
    title: "Illegal garbage dump near school",
    description: "Garbage dump formed outside St. Mary's School gate. Foul smell affecting students and nearby residents.",
    upvotes: 47,
    date: "2026-02-12",
    severity: "High",
    authority: "Sanitation Wing",
    location: "Convent Road, Near St. Mary's School",
    photo: null,
    resolved: false,
    x: 27, y: 68,
  },
]

// ── State ─────────────────────────────────────────────────────────────────────

let activeFilter   = "all"
let selectedId     = null
let selectedAuthId = null
let currentPhoto   = null
let currentLocation = ""

// ── Navigation ────────────────────────────────────────────────────────────────

function goTo(page) {
  document.getElementById("landingPage").classList.add("hidden")
  document.getElementById("userPage").classList.add("hidden")
  document.getElementById("authorityPage").classList.add("hidden")

  if (page === "landing") {
    document.getElementById("landingPage").classList.remove("hidden")
  } else if (page === "user") {
    document.getElementById("userPage").classList.remove("hidden")
    renderUserInterface()
  } else if (page === "authority") {
    document.getElementById("authorityPage").classList.remove("hidden")
    renderAuthorityReports()
    updateAuthorityStats()
  }
}

// ── User Interface ────────────────────────────────────────────────────────────

function setFilter(btn, filter) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"))
  btn.classList.add("active")
  activeFilter = filter
  renderUserInterface()
}

function getFiltered() {
  return activeFilter === "all"
    ? reports
    : reports.filter(r => r.category === activeFilter)
}

function updateUserStats() {
  document.getElementById("u-total").textContent = reports.length
  document.getElementById("u-high").textContent = reports.filter(r => r.severity === "High").length
  document.getElementById("u-upvotes").textContent = reports.reduce((a, r) => a + r.upvotes, 0)
}

function sevColor(sev) {
  return sev === "High" ? "#ff4757" : sev === "Medium" ? "#ffa502" : "#2ed573"
}

function renderUserInterface() {
  updateUserStats()
  renderCards()
  renderPins()
}

function renderCards() {
  const filtered = getFiltered()
  document.getElementById("u-count").textContent = filtered.length + " REPORTS"
  const list = document.getElementById("userReportList")
  list.innerHTML = ""

  if (filtered.length === 0) {
    list.innerHTML = `<div style="text-align:center;color:var(--muted);padding:40px 0;font-size:14px">No reports in this category yet.<br/>Be the first to report!</div>`
    return
  }

  filtered.sort((a, b) => b.upvotes - a.upvotes).forEach(r => {
    const cat = CATEGORIES[r.category]
    const col = sevColor(r.severity)
    const div = document.createElement("div")
    div.className = "report-card" + (r.id === selectedId ? " selected" : "")
    div.innerHTML = `
      <span class="card-icon">${cat.icon}</span>
      <div class="card-body">
        <div class="card-title">${r.title}</div>
        <div class="card-desc">${r.description.slice(0, 72)}...</div>
        ${r.photo ? `<img src="${r.photo}" class="card-photo-thumb" alt="photo"/>` : ""}
        <div class="card-meta">
          <span class="sev-badge" style="background:${col}22;color:${col}">${r.severity}</span>
          <span class="card-date">${r.date}</span>
          ${r.location ? `<span class="card-location">📍 ${r.location.split(",")[0]}</span>` : ""}
        </div>
      </div>
      <button class="upvote-btn" data-id="${r.id}">↑<span>${r.upvotes}</span></button>
    `
    div.querySelector(".upvote-btn").addEventListener("click", e => {
      e.stopPropagation()
      upvote(r.id)
    })
    div.addEventListener("click", () => openDetail(r.id))
    list.appendChild(div)
  })
}

function renderPins() {
  const filtered = getFiltered()
  const container = document.getElementById("mapPins")
  container.innerHTML = ""

  filtered.forEach(r => {
    const cat = CATEGORIES[r.category]
    const isSelected = r.id === selectedId
    const wrapper = document.createElement("div")
    wrapper.className = "pin-wrapper" + (isSelected ? " selected" : "")
    wrapper.style.left = r.x + "%"
    wrapper.style.top  = r.y + "%"
    wrapper.innerHTML = `
      <div class="pin" style="
        background:${cat.color};
        box-shadow:0 0 ${isSelected ? 24 : 10}px ${cat.color}88;
        border-color:${isSelected ? "#fff" : cat.color};
      ">
        <span>${cat.icon}</span>
      </div>
      <div class="pin-badge">↑${r.upvotes}</div>
    `
    wrapper.addEventListener("click", () => openDetail(r.id))
    container.appendChild(wrapper)
  })
}

// ── Upvote ────────────────────────────────────────────────────────────────────

function upvote(id) {
  reports = reports.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r)
  renderUserInterface()
  if (selectedId === id) {
    const r = reports.find(r => r.id === id)
    document.getElementById("d-upvotes").textContent = r.upvotes
  }
}

function upvoteFromDetail() {
  if (!selectedId) return
  upvote(selectedId)
}

// ── Detail Modal ──────────────────────────────────────────────────────────────

function openDetail(id) {
  selectedId = id
  const r = reports.find(r => r.id === id)
  const cat = CATEGORIES[r.category]
  const col = sevColor(r.severity)

  document.getElementById("d-icon").textContent = cat.icon
  document.getElementById("d-title").textContent = r.title
  document.getElementById("d-date").textContent = r.date
  document.getElementById("d-desc").textContent = r.description
  document.getElementById("d-upvotes").textContent = r.upvotes

  const sevEl = document.getElementById("d-severity")
  sevEl.textContent = "● " + r.severity + " Severity"
  sevEl.style.background = col + "22"
  sevEl.style.color = col

  document.getElementById("d-authority").textContent = "🏛 " + r.authority

  const locEl = document.getElementById("d-location")
  if (r.location) {
    locEl.textContent = "📍 " + r.location
    locEl.classList.remove("hidden")
  } else {
    locEl.classList.add("hidden")
  }

  const photoWrap = document.getElementById("d-photo-wrap")
  const photoImg  = document.getElementById("d-photo")
  if (r.photo) {
    photoImg.src = r.photo
    photoWrap.classList.remove("hidden")
  } else {
    photoWrap.classList.add("hidden")
  }

  document.getElementById("detailModal").classList.remove("hidden")
  renderUserInterface()
}

function closeDetail() {
  document.getElementById("detailModal").classList.add("hidden")
  selectedId = null
  renderUserInterface()
}

// ── Report Form ───────────────────────────────────────────────────────────────

function openReportForm() {
  currentPhoto = null
  currentLocation = ""
  document.getElementById("locationInput").value = ""
  document.getElementById("locationResult").classList.add("hidden")
  document.getElementById("formDesc").value = ""
  document.getElementById("photoInput").value = ""
  document.getElementById("photoPreview").classList.add("hidden")
  document.getElementById("photoPreviewWrap").classList.remove("hidden")
  document.getElementById("reportFormModal").classList.remove("hidden")
}

function closeReportForm() {
  document.getElementById("reportFormModal").classList.add("hidden")
}

function searchLocation() {
  const val = document.getElementById("locationInput").value.trim()
  if (!val) return
  currentLocation = val + ", Kochi"
  document.getElementById("locationText").textContent = currentLocation
  document.getElementById("locationResult").classList.remove("hidden")
}

function syncCategoryFromAuthority() {
  const authority = document.getElementById("formAuthority").value
  const cat = AUTHORITY_CATEGORY_MAP[authority] || "other"
  document.getElementById("formCategory").value = cat
}

function syncAuthorityFromCategory() {
  const cat = document.getElementById("formCategory").value
  const authority = CATEGORY_AUTHORITY_MAP[cat] || "Municipal Corporation"
  document.getElementById("formAuthority").value = authority
}

function previewPhoto(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = e => {
    currentPhoto = e.target.result
    const preview = document.getElementById("photoPreview")
    preview.src = currentPhoto
    preview.classList.remove("hidden")
    document.getElementById("photoPreviewWrap").classList.add("hidden")
  }
  reader.readAsDataURL(file)
}

function submitReport() {
  const desc      = document.getElementById("formDesc").value.trim()
  const category  = document.getElementById("formCategory").value
  const authority = document.getElementById("formAuthority").value
  const severity  = document.getElementById("formSeverity").value

  if (!desc) {
    alert("Please write a description of the issue.")
    return
  }

  const cat = CATEGORIES[category]
  const newReport = {
    id:        Date.now().toString(),
    category,
    title:     desc.slice(0, 60) + (desc.length > 60 ? "..." : ""),
    description: desc,
    upvotes:   0,
    date:      new Date().toISOString().slice(0, 10),
    severity,
    authority,
    location:  currentLocation || "Kochi",
    photo:     currentPhoto,
    resolved:  false,
    x:         18 + Math.random() * 64,
    y:         18 + Math.random() * 64,
  }

  reports.unshift(newReport)
  closeReportForm()
  renderUserInterface()
  updateAuthorityStats()
  openDetail(newReport.id)
}

// ── Authority Interface ───────────────────────────────────────────────────────

function updateAuthorityStats() {
  document.getElementById("a-total").textContent   = reports.length
  document.getElementById("a-pending").textContent  = reports.filter(r => !r.resolved).length
  document.getElementById("a-resolved").textContent = reports.filter(r => r.resolved).length
}

function renderAuthorityReports() {
  const catFilter  = document.getElementById("authCategoryFilter").value
  const orgFilter  = document.getElementById("authOrgFilter").value
  const keyword    = (document.getElementById("authSearch").value || "").toLowerCase().trim()

  let filtered = [...reports]

  if (catFilter !== "all")
    filtered = filtered.filter(r => r.category === catFilter)

  if (orgFilter !== "all")
    filtered = filtered.filter(r => r.authority === orgFilter)

  if (keyword)
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(keyword) ||
      r.description.toLowerCase().includes(keyword) ||
      r.location?.toLowerCase().includes(keyword) ||
      r.category.toLowerCase().includes(keyword)
    )

  const grid = document.getElementById("authorityReportGrid")
  grid.innerHTML = ""

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results">No reports found matching your filters.</div>`
    return
  }

  filtered.sort((a, b) => b.upvotes - a.upvotes).forEach(r => {
    const cat = CATEGORIES[r.category]
    const col = sevColor(r.severity)
    const card = document.createElement("div")
    card.className = "auth-card" + (r.resolved ? " resolved" : "")

    card.innerHTML = `
      ${r.resolved ? '<div class="resolved-stamp">✓ Resolved</div>' : ""}
      ${r.photo ? `<img src="${r.photo}" class="auth-card-thumb" alt="photo"/>` : ""}
      <div class="auth-card-header">
        <div class="auth-card-title">${cat.icon} ${r.title}</div>
      </div>
      <div class="auth-card-body">${r.description.slice(0, 100)}...</div>
      <div class="auth-card-footer">
        <div class="auth-card-meta">
          <span class="sev-badge" style="background:${col}22;color:${col}">${r.severity}</span>
          <span class="sev-badge" style="background:#00d4ff15;color:#00d4ff;border:1px solid #00d4ff33">${r.authority}</span>
        </div>
        <span style="font-size:11px;color:var(--muted);font-family:'Space Mono',monospace">↑${r.upvotes}</span>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-top:8px;font-family:'Space Mono',monospace">
        📍 ${r.location || "Kochi"} · ${r.date}
      </div>
    `

    card.addEventListener("click", () => openAuthDetail(r.id))
    grid.appendChild(card)
  })

  updateAuthorityStats()
}

// ── Authority Detail Modal ────────────────────────────────────────────────────

function openAuthDetail(id) {
  selectedAuthId = id
  const r = reports.find(r => r.id === id)
  const cat = CATEGORIES[r.category]
  const col = sevColor(r.severity)

  document.getElementById("ad-icon").textContent  = cat.icon
  document.getElementById("ad-title").textContent = r.title
  document.getElementById("ad-date").textContent  = r.date
  document.getElementById("ad-desc").textContent  = r.description
  document.getElementById("ad-location").textContent = r.location || "Kochi"
  document.getElementById("ad-authority").textContent = r.authority
  document.getElementById("ad-upvotes").textContent = r.upvotes

  const sevEl = document.getElementById("ad-severity")
  sevEl.textContent = "● " + r.severity + " Severity"
  sevEl.style.background = col + "22"
  sevEl.style.color = col

  document.getElementById("ad-category").textContent = cat.icon + " " + cat.label

  const statusEl = document.getElementById("ad-status")
  statusEl.textContent = r.resolved ? "✓ Resolved" : "⏳ Pending"
  statusEl.style.background = r.resolved ? "#2ed57322" : "#ffa50222"
  statusEl.style.color = r.resolved ? "#2ed573" : "#ffa502"

  const resolveBtn = document.getElementById("resolveBtn")
  resolveBtn.textContent = r.resolved ? "↩ Mark as Pending" : "✓ Mark as Resolved"
  resolveBtn.className = "btn-resolve" + (r.resolved ? " resolved" : "")

  const photoWrap = document.getElementById("ad-photo-wrap")
  const photoImg  = document.getElementById("ad-photo")
  if (r.photo) {
    photoImg.src = r.photo
    photoWrap.classList.remove("hidden")
  } else {
    photoWrap.classList.add("hidden")
  }

  document.getElementById("authDetailModal").classList.remove("hidden")
}

function toggleResolve() {
  if (!selectedAuthId) return
  reports = reports.map(r =>
    r.id === selectedAuthId ? { ...r, resolved: !r.resolved } : r
  )
  openAuthDetail(selectedAuthId)
  renderAuthorityReports()
}

// ── Init ──────────────────────────────────────────────────────────────────────

// Close modals when clicking backdrop
document.getElementById("detailModal").addEventListener("click", function(e) {
  if (e.target === this) closeDetail()
})
document.getElementById("reportFormModal").addEventListener("click", function(e) {
  if (e.target === this) closeReportForm()
})
document.getElementById("authDetailModal").addEventListener("click", function(e) {
  if (e.target === this) this.classList.add("hidden")
})

// Enter key on location input
document.getElementById("locationInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") searchLocation()
})

// Enter key on authority search
document.getElementById("authSearch").addEventListener("keydown", function(e) {
  if (e.key === "Enter") renderAuthorityReports()
})
