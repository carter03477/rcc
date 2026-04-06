# Rocky Command Centre (RCC) - Full Specifications

**Project:** Personal Dashboard System for Carter (Age 12)  
**Built:** March 29, 2026  
**Status:** Working prototype, single HTML file with embedded data  
**Location:** `/Users/darrens/.openclaw/workspace-rocky/rcc/`

---

## 🎯 Project Goal

Build Carter a simple, offline-capable dashboard to manage:
- School calendar events (homework, assignments, tests)
- Personal activities (sport, music lessons, social events)
- Tasks and homework tracking
- Contacts (friends, family, teachers)
- Quick notes and reminders

### Why We Built This
- Original goal: Integrate Daymap (school calendar) with personal calendar
- Problem: Daymap's iCal export requires authentication, blocked by school security
- Solution: Build our own system Carter controls completely
- Bonus: Learning opportunity for web development, file management, data structures

---

## 📋 Core Features

### 1. Calendar (📅)
- Display upcoming events with dates and times
- Color-coded categories:
  - **Sport:** Orange (#FF6B35)
  - **School:** Teal (#4ECDC4)
  - **Music:** Yellow (#FFE66D)
- Shows location when relevant
- Supports recurring events (e.g., "Every Monday")

### 2. Tasks (✅)
- Homework and assignment tracking
- Due dates
- Priority levels (high/medium/low) with color coding
- Completion status (strikethrough when done)

### 3. Contacts (👥)
- Name, phone, category (family/friends/school)
- Optional notes field
- Category badges for quick visual identification

### 4. Notes (📝)
- Quick thoughts, reminders, ideas
- Date stamped
- Category labels

---

## 🏗️ Technical Architecture

### Version History

#### v1 (Initial Build)
- **Files:** `dashboard.html` + `data.json`
- **Challenge:** iPad Files app required both files in same folder
- **Data loading:** External JSON via fetch()

#### v2 (Current - Single File)
- **File:** `RCC-Dashboard.html`
- **Architecture:** Embedded JavaScript with inline data object
- **Benefit:** Single file = easy to download and update
- **Update workflow:** Rocky generates new HTML file, sends to Carter via Telegram

### File Structure
```
/Users/darrens/.openclaw/workspace-rocky/rcc/
├── RCC-Dashboard.html    (Current working version - embedded data)
├── dashboard.html         (v1 - external data version)
├── data.json             (v1 - separate data file)
└── README.md             (User instructions)
```

### Technology Stack
- **Frontend:** Pure HTML5 + CSS3 + JavaScript (ES6)
- **No dependencies:** Works completely offline
- **No backend:** All data embedded in HTML
- **Mobile-first:** Responsive design for iPad/iPhone

### Data Structure
```javascript
{
  "calendar": [
    {
      "id": number,
      "title": string,
      "date": string,           // "YYYY-MM-DD" or "Every Monday"
      "time": string,
      "location": string,       // Optional
      "category": string        // "sport" | "school" | "music" | "personal"
    }
  ],
  "contacts": [
    {
      "id": number,
      "name": string,
      "category": string,       // "family" | "friends" | "school"
      "phone": string,          // Optional
      "notes": string           // Optional
    }
  ],
  "tasks": [
    {
      "id": number,
      "title": string,
      "due": string,            // "YYYY-MM-DD" or "Every Sunday"
      "priority": string,       // "high" | "medium" | "low"
      "completed": boolean,
      "category": string        // "homework" | "personal" | "project"
    }
  ],
  "notes": [
    {
      "id": number,
      "title": string,
      "content": string,
      "date": string,           // "YYYY-MM-DD"
      "category": string        // "general" | "music" | "school" | etc.
    }
  ]
}
```

---

## 🔄 Update Workflow

### Current Process
1. Carter asks Rocky to add/update something
   - Example: "Rocky, add basketball practice Thursday 4pm"
2. Rocky:
   - Updates the embedded data in RCC-Dashboard.html
   - Generates new HTML file
   - Sends file to Carter via Telegram: `message(action: "send", target: "telegram:8335887071", message: "Updated RCC!", media: "/path/to/RCC-Dashboard.html", buttons: [])`
3. Carter:
   - Downloads updated file from Telegram
   - Opens in iPad Files app or browser
   - Sees updated content

### Alternative: Data Sync Ideas (Future)
- Rocky could host a simple HTTP server on Mac mini
- Carter's iPad fetches fresh data.json on page load
- Requires network connectivity (not offline-first)
- Could use iCloud/Dropbox sync if desired

---

## 🎨 Design Principles

### Visual Style
- **Clean and fun:** Purple gradient background, white cards
- **Card-based layout:** Each section is a distinct card
- **Hover effects:** Cards lift slightly on hover (desktop)
- **Color coding:** Categories use distinct colors for quick scanning
- **Responsive grid:** Auto-adjusts from 1 to 3 columns based on screen size

### UX Principles
- **Mobile-first:** Designed for iPad as primary device
- **Offline-capable:** No internet required after download
- **Single-file simplicity:** Easy to manage, update, share
- **Zero learning curve:** Familiar layout, intuitive icons
- **Fast loading:** No external dependencies or API calls

### Accessibility
- Semantic HTML structure
- Color + text labels (not color-only coding)
- Good contrast ratios
- Touch-friendly tap targets (12px padding minimum)

---

## 📱 Deployment & Usage

### On iPad
1. Download `RCC-Dashboard.html` from Telegram
2. Save to Files app (Downloads folder or iCloud)
3. Tap to open in Safari
4. Optional: Add to home screen for quick access

### Updates
- Rocky sends new HTML file via Telegram
- Carter downloads and replaces old version
- All data embedded = no sync issues

---

## 🚀 Current Data (as of March 29, 2026)

### Calendar
- Basketball (Today, March 28)
- Drum Lesson (Every Monday 12:30 PM at School)

### Contacts
- Dad (Darren) - family
- Myles (Brother) - family, uses Buddy agent

### Tasks
- Weekly calendar check (Every Sunday, low priority)

### Notes
- RCC is Live! (general, March 29)
- Weekly Schedule: Drum lessons info (music, March 29)

---

## 🎓 Learning Outcomes

Carter is learning:
- **Web development basics:** HTML structure, CSS styling, JavaScript data
- **File management:** Understanding file paths, downloads, storage
- **Data structures:** JSON format, objects, arrays
- **Problem solving:** When tech doesn't work, build your own solution
- **Iteration:** v1 → v2, improving based on real usage

---

## 🔮 Future Enhancement Ideas

### Short Term (Easy Wins)
- [ ] Add emoji picker for event categories
- [ ] Task completion toggle (click to mark done)
- [ ] Sort events by date
- [ ] Filter/search functionality
- [ ] Export to iCal format (download as .ics file)

### Medium Term
- [ ] Sync via iCloud/Dropbox/Git
- [ ] Real-time updates (WebSocket or polling)
- [ ] Multi-device support
- [ ] Dark mode toggle
- [ ] Weekly summary emails/notifications

### Long Term
- [ ] Collaboration with Myles (Buddy integration)
- [ ] Integration with school systems (if APIs become available)
- [ ] Voice input for adding events
- [ ] Calendar sharing with Dad
- [ ] Gamification (streak tracking, achievements)

---

## 🐛 Known Issues & Challenges

### Solved
✅ Two-file dependency (dashboard.html + data.json)  
**Solution:** Embedded data in single HTML file

✅ iPad file management confusion  
**Solution:** Single file, clear download workflow

### Current Limitations
- **Manual updates required:** Carter asks Rocky → Rocky sends new file
- **No auto-sync:** Each device needs separate file copy
- **No collaboration:** Can't share with Myles/Dad in real-time
- **No backup:** If file is deleted, data is lost

### Workarounds in Place
- Rocky keeps master copy at `/Users/darrens/.openclaw/workspace-rocky/rcc/`
- Version history via git (if needed)
- Carter can ask Rocky to resend anytime

---

## 🎯 Success Metrics

### Project Success
✅ Carter can view all events in one place  
✅ Works offline on iPad  
✅ Easy to update via Rocky  
✅ Clean, fun design Carter enjoys using  
✅ Learning experience about web development

### Adoption Indicators
- Carter asks for updates regularly
- Adds new categories/types of data
- Shares with friends/family
- Suggests features or improvements
- Uses it instead of other calendar apps

---

## 📝 Notes for Monty

### Context
- Carter is 12, tech-curious, persistent problem-solver
- This started as a calendar integration project, evolved into custom CRM
- Collaborative build: Carter drove requirements, Rocky implemented
- Learning opportunity was as valuable as the final product

### Review Requests
1. **Architecture:** Is single-file approach best? Or should we set up proper sync?
2. **Data structure:** Any improvements to JSON schema?
3. **Update workflow:** Better way to push updates to Carter's iPad?
4. **Security:** Any concerns with embedding data in HTML?
5. **Scalability:** What happens when Carter has 100+ events?
6. **Code quality:** HTML/CSS/JS best practices check
7. **Features:** What should we prioritize next?

### Collaboration Opportunities
- Could Monty help with backend sync system?
- API integration for Google Calendar/iCloud?
- Git-based version control workflow?
- Automated deployment pipeline?

---

**Built with:** HTML5, CSS3, JavaScript (ES6)  
**Browser support:** Safari (iPad), Chrome, Firefox, Edge (modern versions)  
**File size:** ~10 KB (single HTML file)  
**License:** Personal use by Carter

---

Last updated: March 29, 2026  
Contact: Rocky (rocky@sasc) or Darren
