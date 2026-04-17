# SchoolI Development Roadmap & Integration Guide

This document summarizes the current state of the SchoolI mobile application and provides a blueprint for backend integration, AI agent development, and database architecture.

## 1. Current Features & UI/UX
- **Splash Screen**: Premium animated logo with brand identity.
- **Public Explore**: No-login access to university data (UniUyo, UniCross, UniCal).
- **University Comparison**: Side-by-side metrics for institutional decision making.
- **Smart Dashboard**: 
  - Dynamic progress tracking (percentage-based).
  - AI-driven "Next Recommendation" card.
  - Interactive quick actions for Campus, Courses, and Documents.
- **Campus Intelligence (LIVE)**: 
  - Real-time GPS tracking via `expo-location`.
  - Dynamic distance calculation (Haversine Formula).
  - Simulated real-time queue updates (fluctuating data).
- **Step-by-Step Process Guidance**: Detailed interactive guides for Registration, Clearance, etc.
- **Document Tracker**: Status-aware (Verified/Rejected) tracking with AI missing-doc alerts.
- **AI Assistant Interface**: Chat UI with suggested prompts and NLP-ready routing.
- **Theme Engine**: System-wide Indigo & Slate dark mode support.
- **Performance**: Skeleton loaders for perceived speed.

---

## 2. Data Schema & Backend Props (JSON)
When syncing data with the backend or AI Agent, use the following JSON structures:

### Student Profile & State
```json
{
  "studentId": "CSC/2026/001",
  "name": "John Doe",
  "universityId": "uniuyo",
  "level": 400,
  "department": "Computer Science",
  "progress": 35,
  "isAuthenticated": true,
  "settings": {
    "darkMode": true,
    "language": "en"
  }
}
```

### Document Verification
```json
{
  "documentId": "birth_cert_01",
  "docName": "Birth Certificate",
  "status": "Verified | Pending | Rejected | Missing",
  "fileUrl": "s3://bucket/path/to/file.pdf",
  "rejectionReason": "Blurry scan - corners not visible",
  "timestamp": "2026-04-15T04:00:00Z"
}
```

### Queue & Process Monitoring
```json
{
  "locationId": "senate_house",
  "currentQueue": 42,
  "avgWaitTime": 5400, // in seconds
  "peakHours": ["09:00", "13:00"],
  "smartRecommendation": "Visit at 14:00 for 15m wait time"
}
```

---

## 3. AI Agent Architecture
### Current Features
- **Context-Aware Chat**: Remembers the student's university and progress level.
- **Prompt Suggestions**: Reduces friction by offering common questions.
- **Typing Indicators**: Improves perceived responsiveness.

### Future Implementation (Agent Side)
- **Document Analysis**: The agent should receive OCR data from uploaded docs to auto-verify (e.g., checking if the name on the JAMB slip matches the profile).
- **Proactive Alerts**: Send "Deadlines" or "Missing Doc" push notifications through the AI context.
- **Natural Language Navigation**: Allow users to say "Show me where to pay school fees" and have the agent route the app to the Payment screen.

---

## 4. Database Structure (MongoDB)
MongoDB is ideal for this application due to the flexible nature of university requirements.

### Collections:
1. **`users`**: Stores profile, auth, and preferences.
2. **`universities`**: Stores the static/dynamic school metadata (docs, locations, processes).
3. **`documents`**: Tracks user submissions and verification history.
4. **`queues`**: Time-series data for live queue counts and historical trends.
5. **`notifications`**: User-specific alert history.
6. **`chat_logs`**: History of AI assistant interactions for context persistence.

---

## 5. Next Steps Roadmap
1. **Phase 1: Real-time Backend Sync (Node.js/Express + MongoDB)**
   - Replace `MockStorage` in `appContext.tsx` with real API calls.
   - Implement Auth (JWT) and Profile persistence.
2. **Phase 2: Live Queue API**
   - Connect the Campus screen to a real-time WebSocket or polling service for queue updates.
3. **Phase 3: AI Assistant Integration**
   - Connect the chat UI to a Gemini-powered backend for real document analysis and guidance.
4. **Phase 4: Push Notifications**
   - Integrate Expo Notifications for deadline and queue alerts.
5. **Phase 5: Offline Mode**
   - Implement Redux Persistence or TanStack Query for caching university data offline.
