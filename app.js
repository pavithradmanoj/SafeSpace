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

// ── AUTHORITY CREDENTIALS (Change these!) ────────────────────────────────────

const AUTHORITY_CREDENTIALS = {
  // Format: "username": "password"
  // IMPORTANT: Change these default credentials!
  "admin": "admin123",
  "municipal": "civic@2026",
  "kseb": "lights@2026",
  "sanitation": "clean@2026",
  "police": "safe@2026",
}

// Session tracking
let isAuthorityLoggedIn = false
let currentAuthorityUser = null

// Default reports (fallback if no saved data exists)
const DEFAULT_REPORTS = [
  
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
  {
    id: "4",
    category: "safety",
    title: "Broken traffic signal at Marine Drive intersection",
    description: "Traffic signal has been malfunctioning for 3 days causing near-miss accidents. All lights are stuck on red, forcing drivers to ignore the signal.",
    upvotes: 29,
    date: "2026-02-13",
    severity: "High",
    authority: "Traffic Police",
    location: "Marine Drive, Junction with Broadway",
    photo: null,
    resolved: false,
    x: 45, y: 42,
  },
  {
    id: "5",
    category: "infrastructure",
    title: "Broken footpath on SA Road",
    description: "Footpath tiles are broken and displaced for 200 meters. Elderly people and children are at risk of falling.",
    upvotes: 18,
    date: "2026-02-09",
    severity: "Medium",
    authority: "Municipal Corporation",
    location: "SA Road, Near Kaloor Stadium",
    photo: null,
    resolved: false,
    x: 55, y: 48,
  },
  {
    id: "6",
    category: "sanitation",
    title: "Overflowing drainage near market",
    description: "Open drainage near Broadway market is overflowing with sewage water. Health hazard for shoppers and vendors.",
    upvotes: 52,
    date: "2026-02-08",
    severity: "High",
    authority: "Sanitation Wing",
    location: "Broadway Market, Near Fish Section",
    photo: null,
    resolved: false,
    x: 33, y: 55,
  },
  {
    id: "7",
    category: "lighting",
    title: "No street lights in residential colony",
    description: "Entire Panampilly Nagar colony has had no street lighting for a month. Multiple theft attempts reported.",
    upvotes: 43,
    date: "2026-02-11",
    severity: "High",
    authority: "Kerala State Electricity Board",
    location: "Panampilly Nagar, Kochi",
    photo: null,
    resolved: false,
    x: 50, y: 60,
  },
  {
    id: "8",
    category: "safety",
    title: "Stray dogs creating menace near bus stand",
    description: "Pack of 6-7 stray dogs chasing and biting pedestrians near KSRTC bus stand. Children are especially vulnerable.",
    upvotes: 38,
    date: "2026-02-13",
    severity: "Medium",
    authority: "Municipal Corporation",
    location: "KSRTC Bus Stand, Ernakulam South",
    photo: null,
    resolved: false,
    x: 41, y: 70,
  },
  {
    id: "9",
    category: "infrastructure",
    title: "Water logging on Palarivattom flyover",
    description: "Rainwater accumulates on the flyover creating dangerous conditions. Poor drainage design causing accidents during monsoon.",
    upvotes: 27,
    date: "2026-02-10",
    severity: "Medium",
    authority: "Municipal Corporation",
    location: "Palarivattom Flyover, NH Bypass",
    photo: null,
    resolved: false,
    x: 70, y: 45,
  },
  {
    id: "10",
    category: "other",
    title: "Illegal parking blocking narrow lane",
    description: "Cars and two-wheelers permanently parked on both sides of lane, making it impossible for emergency vehicles to pass.",
    upvotes: 15,
    date: "2026-02-12",
    severity: "Low",
    authority: "Traffic Police",
    location: "Rajaji Road, Behind Metro Station",
    photo: null,
    resolved: false,
    x: 48, y: 38,
  },
  {
    id: "11",
    category: "sanitation",
    title: "Public toilet in deplorable condition",
    description: "Public toilet at boat jetty is extremely dirty and unusable. No water supply for weeks. Tourists are complaining.",
    upvotes: 31,
    date: "2026-02-11",
    severity: "Medium",
    authority: "Sanitation Wing",
    location: "Boat Jetty, Marine Drive",
    photo: null,
    resolved: false,
    x: 35, y: 45,
  },
  {
    id: "13",
    category: "infrastructure",
    title: "Damaged speed breaker near hospital",
    description: "Speed breaker outside General Hospital is broken and has sharp edges. Causing damage to vehicles and discomfort to patients.",
    upvotes: 22,
    date: "2026-02-09",
    severity: "Medium",
    authority: "Municipal Corporation",
    location: "General Hospital Road, Ernakulam",
    photo: null,
    resolved: false,
    x: 42, y: 58,
  },
  {
    id: "14",
    category: "safety",
    title: "Missing manhole cover on busy road",
    description: "Open manhole without cover on main road. Extremely dangerous for two-wheelers and pedestrians, especially at night.",
    upvotes: 56,
    date: "2026-02-13",
    severity: "High",
    authority: "Municipal Corporation",
    location: "Shanmugham Road, Near Petrol Pump",
    photo: null,
    resolved: false,
    x: 30, y: 50,
  },
  {
    id: "15",
    category: "sanitation",
    title: "Plastic waste accumulation in canal",
    description: "Large amount of plastic waste blocking canal flow. Causing mosquito breeding and foul smell in nearby residential area.",
    upvotes: 40,
    date: "2026-02-12",
    severity: "High",
    authority: "Sanitation Wing",
    location: "Perandoor Canal, Fort Kochi",
    photo: null,
    resolved: false,
    x: 25, y: 62,
  },
]


// ── LocalStorage Functions ───────────────────────────────────────────────────

function loadReportsFromStorage() {
  try {
    const savedReports = localStorage.getItem('civicReports')
    if (savedReports) {
      const parsed = JSON.parse(savedReports)
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`Loaded ${parsed.length} reports from localStorage`)
        return parsed
      }
    }
  } catch (error) {
    console.error('Error loading reports from localStorage:', error)
  }
  console.log('Using default reports')
  return [...DEFAULT_REPORTS]
}

function saveReportsToStorage() {
  try {
    localStorage.setItem('civicReports', JSON.stringify(reports))
    console.log(`Saved ${reports.length} reports to localStorage`)
  } catch (error) {
    console.error('Error saving reports to localStorage:', error)
    if (error.name === 'QuotaExceededError') {
      alert('Storage limit exceeded. Some data may not be saved.')
    }
  }
}

// Session management
function saveAuthSession() {
  if (isAuthorityLoggedIn) {
    sessionStorage.setItem('authorityLoggedIn', 'true')
    sessionStorage.setItem('authorityUser', currentAuthorityUser)
  } else {
    sessionStorage.removeItem('authorityLoggedIn')
    sessionStorage.removeItem('authorityUser')
  }
}

function loadAuthSession() {
  const loggedIn = sessionStorage.getItem('authorityLoggedIn')
  const user = sessionStorage.getItem('authorityUser')
  if (loggedIn === 'true' && user) {
    isAuthorityLoggedIn = true
    currentAuthorityUser = user
    return true
  }
  return false
}

// Initialize reports from localStorage or use defaults
let reports = loadReportsFromStorage()

// ── State ─────────────────────────────────────────────────────────────────────

let activeFilter   = "all"
let selectedId     = null
let selectedAuthId = null
let currentPhoto   = null
let currentLocation = ""

// ── Authority Login ───────────────────────────────────────────────────────────

function showAuthorityLogin() {
  document.getElementById("authorityLoginModal").classList.remove("hidden")
  document.getElementById("loginUsername").value = ""
  document.getElementById("loginPassword").value = ""
  document.getElementById("loginError").textContent = ""
  document.getElementById("loginUsername").focus()
}

function closeAuthorityLogin() {
  document.getElementById("authorityLoginModal").classList.add("hidden")
}

function attemptAuthorityLogin() {
  const username = document.getElementById("loginUsername").value.trim()
  const password = document.getElementById("loginPassword").value
  
  if (!username || !password) {
    document.getElementById("loginError").textContent = "Please enter both username and password"
    return
  }
  
  // Check credentials
  if (AUTHORITY_CREDENTIALS[username] === password) {
    // Login successful
    isAuthorityLoggedIn = true
    currentAuthorityUser = username
    saveAuthSession()
    closeAuthorityLogin()
    goTo('authority')
  } else {
    // Login failed
    document.getElementById("loginError").textContent = "Invalid username or password"
    document.getElementById("loginPassword").value = ""
  }
}

function authorityLogout() {
  if (confirm('Are you sure you want to logout?')) {
    isAuthorityLoggedIn = false
    currentAuthorityUser = null
    saveAuthSession()
    goTo('landing')
  }
}

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
    // Check if logged in
    if (!isAuthorityLoggedIn) {
      showAuthorityLogin()
      return
    }
    document.getElementById("authorityPage").classList.remove("hidden")
    updateAuthorityUserDisplay()
    renderAuthorityReports()
    updateAuthorityStats()
  }
}

function updateAuthorityUserDisplay() {
  const userDisplay = document.getElementById("authorityUserDisplay")
  if (userDisplay && currentAuthorityUser) {
    userDisplay.textContent = `👤 ${currentAuthorityUser}`
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
  // Filter out resolved reports from user interface
  const unresolvedReports = reports.filter(r => !r.resolved)
  
  return activeFilter === "all"
    ? unresolvedReports
    : unresolvedReports.filter(r => r.category === activeFilter)
}

function updateUserStats() {
  // Only count unresolved reports in user stats
  const unresolvedReports = reports.filter(r => !r.resolved)
  document.getElementById("u-total").textContent = unresolvedReports.length
  document.getElementById("u-high").textContent = unresolvedReports.filter(r => r.severity === "High").length
  document.getElementById("u-upvotes").textContent = unresolvedReports.reduce((a, r) => a + r.upvotes, 0)
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
  saveReportsToStorage()
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

  document.getElementById("d-category").textContent = cat.icon + " " + cat.label
  document.getElementById("d-location").textContent = r.location || "Kochi"
  document.getElementById("d-authority").textContent = r.authority

  const photoWrap = document.getElementById("d-photo-wrap")
  const photoImg  = document.getElementById("d-photo")
  if (r.photo) {
    photoImg.src = r.photo
    photoWrap.classList.remove("hidden")
  } else {
    photoWrap.classList.add("hidden")
  }

  document.getElementById("detailModal").classList.remove("hidden")
}

function closeDetail() {
  selectedId = null
  document.getElementById("detailModal").classList.add("hidden")
  renderPins()
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
  saveReportsToStorage()
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
  saveReportsToStorage()
  openAuthDetail(selectedAuthId)
  renderAuthorityReports()
}

// ── Data Management Functions ─────────────────────────────────────────────────

function resetToDefaults() {
  if (confirm('Are you sure you want to reset all reports to defaults? This will delete all user-created reports.')) {
    reports = [...DEFAULT_REPORTS]
    saveReportsToStorage()
    renderUserInterface()
    renderAuthorityReports()
    alert('Reports reset to defaults!')
  }
}

function exportReports() {
  const dataStr = JSON.stringify(reports, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `civic_reports_backup_${new Date().toISOString().slice(0,10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

function importReports(event) {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result)
      if (Array.isArray(imported)) {
        reports = imported
        saveReportsToStorage()
        renderUserInterface()
        renderAuthorityReports()
        alert(`Successfully imported ${reports.length} reports!`)
      } else {
        alert('Invalid file format. Please select a valid reports JSON file.')
      }
    } catch (error) {
      console.error('Import error:', error)
      alert('Error importing reports. Please check the file format.')
    }
  }
  reader.readAsText(file)
}
// ── Scroll fade-in ────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible')
  })
}, { threshold: 0.15 })

document.querySelectorAll('.fade-section').forEach(el => observer.observe(el))


// ── Init ──────────────────────────────────────────────────────────────────────

// Check for existing session on load
loadAuthSession()

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
document.getElementById("authorityLoginModal").addEventListener("click", function(e) {
  if (e.target === this) closeAuthorityLogin()
})

// Enter key on location input
document.getElementById("locationInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") searchLocation()
})

// Enter key on authority search
document.getElementById("authSearch").addEventListener("keydown", function(e) {
  if (e.key === "Enter") renderAuthorityReports()
})

// Enter key on login form
document.getElementById("loginPassword").addEventListener("keydown", function(e) {
  if (e.key === "Enter") attemptAuthorityLogin()
})

console.log('=== Civic Reports App Loaded ===')
console.log(`Total reports: ${reports.length}`)
console.log('LocalStorage enabled: Data will persist across page reloads')
console.log('Authority login required for access')
