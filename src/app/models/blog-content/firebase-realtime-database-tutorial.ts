export const CONTENT = `
      <p><strong>Firebase Realtime Database (RTDB)</strong> was Google's first real-time, cloud-hosted database — and it still powers massive apps today because of its dead-simple API and sub-100ms real-time sync. This guide shows you exactly how to use it with a real chat app project, and gives you the <strong>honest truth about its limitations</strong> so you can choose wisely.</p>

      <h2>What is Firebase Realtime Database?</h2>
      <p>Firebase RTDB is a <strong>NoSQL cloud database</strong> that stores data as a giant JSON tree. Unlike traditional databases, changes are pushed to all connected clients in <strong>milliseconds</strong> — no polling, no refresh needed. Perfect for chat apps, collaborative tools, live dashboards, and multiplayer games.</p>

      <!-- How It Works -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">How Firebase RTDB Works</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Client A<span class="seq-actor-sub">(User A's phone)</span></div>
            <div class="seq-actor idp">Firebase RTDB<span class="seq-actor-sub">(Google Cloud)</span></div>
            <div class="seq-actor sp">Client B<span class="seq-actor-sub">(User B's laptop)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> Write: "Hello!" to /messages</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#7c3aed;color:#a78bfa">Persists data, broadcasts to all listeners</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow right-23" style="--arrow-color:#22c55e"><span class="seq-num green">2</span> Push event to Client B (sub-100ms!)</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div></div>
              <div class="seq-action" style="border-color:#22c55e;color:#4ade80">UI updates instantly — no refresh</div>
            </div>
          </div>
        </div>
      </div>

      <h2>RTDB vs Firestore: Which Firebase DB Should You Use?</h2>
      <p>Firebase has TWO NoSQL databases. Knowing the difference saves you from an expensive migration later:</p>

      <!-- RTDB vs Firestore -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Firebase RTDB vs Firestore</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#f97316">
            <div class="vs-card-header" style="background:#f97316">&#x26A1; Realtime Database</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F333;</span>Data model: One giant JSON tree</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4AB;</span>Latency: Sub-100ms sync</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B0;</span>Pricing: Per-GB stored and downloaded</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Queries: Very limited</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C8;</span>Scale: ~200K concurrent connections/DB</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: Chat, presence, live state</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x1F4DA; Firestore</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C1;</span>Data model: Collections + documents</div>
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>Latency: ~200-500ms</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B0;</span>Pricing: Per operation (read/write/delete)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Queries: Rich (compound, ordering, indexing)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C8;</span>Scale: Virtually unlimited</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: General-purpose apps, e-commerce</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Setup: 5 Minutes to Your First Database</h2>
      <pre><code># 1. Go to https://console.firebase.google.com
# 2. Click "Add project" &#x2192; name it "my-app"
# 3. In the left sidebar, click "Build" &#x2192; "Realtime Database"
# 4. Click "Create Database" &#x2192; choose region (us-central1) &#x2192; "Start in test mode"
# 5. Your database URL appears: https://my-app-xxx.firebaseio.com

# Install Firebase SDK for your language:

# JavaScript / TypeScript (web, Node.js)
npm install firebase

# Python
pip install firebase-admin

# iOS: pod 'FirebaseDatabase'
# Android: implementation 'com.google.firebase:firebase-database:20.3.0'</code></pre>

      <h2>Your First Write: Hello Firebase</h2>
      <pre><code>// firebase-config.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, push, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "my-app.firebaseapp.com",
  databaseURL: "https://my-app-xxx.firebaseio.com",
  projectId: "my-app",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ── WRITE data ────────────────────────────────
await set(ref(db, "users/alice"), {
  name: "Alice",
  email: "alice@example.com",
  online: true,
});
// Data structure in Firebase:
// /users
//   /alice
//     name: "Alice"
//     email: "alice@example.com"
//     online: true

// ── READ data once ────────────────────────────
const snapshot = await get(ref(db, "users/alice"));
if (snapshot.exists()) {
  console.log(snapshot.val());  // { name: "Alice", email: ..., online: true }
}

// ── LIVE listen (the killer feature!) ─────────
onValue(ref(db, "users/alice"), (snapshot) => {
  const data = snapshot.val();
  console.log("User data changed:", data);
  // Triggers IMMEDIATELY whenever alice's data changes
  // From any client, anywhere in the world. No polling needed.
});

// ── PUSH (auto-generate unique key) ───────────
const newMessageRef = push(ref(db, "messages"));
await set(newMessageRef, {
  text: "Hello everyone!",
  sender: "alice",
  timestamp: Date.now(),
});
// Creates: /messages/-NvBcXyZ123/ with { text, sender, timestamp }

// ── DELETE ────────────────────────────────────
await remove(ref(db, "users/alice"));</code></pre>

      <h2>Hands-On Project: Build a Real-Time Chat App</h2>
      <p>Let's build a working chat app using Firebase RTDB. Multiple users, messages appear instantly across all devices, online presence indicators — all in ~80 lines of code.</p>

      <pre><code>&lt;!-- chat.html --&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;Firebase Chat&lt;/title&gt;
  &lt;style&gt;
    body { font-family: sans-serif; max-width: 600px; margin: 20px auto; }
    #messages { height: 400px; overflow-y: auto; border: 1px solid #ccc;
                padding: 10px; margin-bottom: 10px; }
    .message { padding: 8px; margin: 4px 0; background: #f0f0f0; border-radius: 6px; }
    .sender { font-weight: bold; color: #0078d4; }
    #online { color: green; font-size: 12px; }
    input, button { padding: 10px; font-size: 14px; }
    input { width: 400px; }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Live Chat&lt;/h1&gt;
  &lt;div id="online"&gt;Online: 0 users&lt;/div&gt;
  &lt;div id="messages"&gt;&lt;/div&gt;
  &lt;input id="input" placeholder="Type a message..." /&gt;
  &lt;button id="send"&gt;Send&lt;/button&gt;

  &lt;script type="module"&gt;
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
    import { getDatabase, ref, push, onChildAdded, onValue, set, onDisconnect }
      from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

    const firebaseConfig = { /* your config */ };
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // Simple "login"
    const username = prompt("Your name:") || "Anonymous";
    const userId = Math.random().toString(36).substring(7);

    // ── Presence: mark user online, clean up when they disconnect ──
    const userStatusRef = ref(db, \`status/\${userId}\`);
    set(userStatusRef, { username, online: true });
    onDisconnect(userStatusRef).remove();
    // When tab closes, network drops, etc — Firebase auto-removes this entry!

    // Count online users
    onValue(ref(db, "status"), (snapshot) => {
      const count = snapshot.size;
      document.getElementById("online").textContent = \`Online: \${count} users\`;
    });

    // ── Listen for new messages (real-time!) ──
    const messagesRef = ref(db, "messages");
    onChildAdded(messagesRef, (snapshot) => {
      const msg = snapshot.val();
      const div = document.createElement("div");
      div.className = "message";
      div.innerHTML = \`&lt;span class="sender"&gt;\${msg.sender}:&lt;/span&gt; \${msg.text}\`;
      document.getElementById("messages").appendChild(div);
      document.getElementById("messages").scrollTop = 99999;
    });

    // ── Send message ──
    document.getElementById("send").onclick = async () =&gt; {
      const text = document.getElementById("input").value.trim();
      if (!text) return;
      await push(messagesRef, {
        sender: username,
        text: text,
        timestamp: Date.now(),
      });
      document.getElementById("input").value = "";
    };
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

      <p>Open this HTML file in 2 browser tabs. Type a message in one tab — it appears in the other tab <strong>instantly</strong>. Close a tab — the online count updates automatically. This is Firebase's superpower.</p>

      <h2>Python Backend (firebase-admin)</h2>
      <pre><code># pip install firebase-admin
import firebase_admin
from firebase_admin import credentials, db

# Download service account JSON from Firebase Console:
# Project Settings &#x2192; Service Accounts &#x2192; Generate new private key
cred = credentials.Certificate("service-account.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://my-app-xxx.firebaseio.com"
})

# Reference a path
users_ref = db.reference("users")

# Write
users_ref.child("alice").set({
    "name": "Alice",
    "email": "alice@example.com",
})

# Read once
data = users_ref.child("alice").get()
print(data)  # {'name': 'Alice', 'email': 'alice@example.com'}

# Push (auto-generated unique ID)
new_order = db.reference("orders").push({
    "user_id": "alice",
    "total": 99.99,
    "created_at": {".sv": "timestamp"},  # Server-side timestamp
})
print(new_order.key)  # -NvBcXyZ123

# Update specific fields (doesn't overwrite siblings)
users_ref.child("alice").update({"last_seen": 1234567890})

# Delete
users_ref.child("alice").delete()

# Query (limited but useful)
recent = db.reference("messages").order_by_child("timestamp").limit_to_last(50).get()
# Returns the 50 most recent messages</code></pre>

      <h2>Security Rules (CRITICAL — Don't Skip This!)</h2>
      <p>By default, Firebase "test mode" allows ANYONE on the internet to read and write your database. You MUST set security rules before going live.</p>
      <pre><code>// Firebase Console &#x2192; Realtime Database &#x2192; Rules tab

// &#x274C; DANGEROUS: Default "test mode" (public read/write)
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
// Anyone can read/write ANY data. Your database will be pwned in hours.

// &#x2705; SECURE: Authenticated users only
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}

// &#x2705; BETTER: User-scoped access
{
  "rules": {
    "users": {
      "$uid": {
        // Users can only read/write their own data
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "messages": {
      // Anyone authenticated can read messages
      ".read": "auth != null",
      // Users can only create messages as themselves
      "$messageId": {
        ".write": "auth != null && newData.child('sender').val() === auth.uid",
        ".validate": "newData.hasChildren(['sender', 'text', 'timestamp']) && newData.child('text').isString() && newData.child('text').val().length <= 1000"
      }
    }
  }
}

// Common security rule patterns:
// Admin-only write: ".write": "auth.token.admin === true"
// Read public data: ".read": true
// Validate data: ".validate": "newData.isString() && newData.val().length > 0"
// Owner only: ".read": "data.child('ownerId').val() === auth.uid"</code></pre>

      <h2>The Advantages (Why Choose Firebase)</h2>
      <ul>
        <li><strong>Zero server code for simple apps:</strong> Client talks directly to the database with security rules enforcing access. No backend needed for many use cases.</li>
        <li><strong>Real-time by default:</strong> Every query is reactive. Changes propagate to all clients in under 100ms.</li>
        <li><strong>Automatic offline support:</strong> SDK caches data locally. Your app works offline and syncs when reconnected. Perfect for mobile.</li>
        <li><strong>Presence detection:</strong> <code>onDisconnect()</code> handlers fire when a client goes offline — automatic cleanup.</li>
        <li><strong>Scales to millions of users:</strong> Google infrastructure handles the hard parts (replication, backups, availability).</li>
        <li><strong>Generous free tier:</strong> 1 GB storage, 10 GB/month download, 100 simultaneous connections — enough for real prototypes.</li>
        <li><strong>Integrated auth:</strong> Firebase Auth (Google, email, phone, Apple) works seamlessly with RTDB security rules.</li>
      </ul>

      <h2>The Limitations (Before You Commit!)</h2>
      <p>Firebase RTDB has serious limitations. Know them before building your business on it.</p>

      <!-- Limitations -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Firebase RTDB: Critical Limitations</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">1. No complex queries</div><div class="timeline-item-desc">Can order by ONE field only. No JOINs, no aggregations. If you need "orders where status=shipped AND total&gt;100", use Firestore or PostgreSQL.</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">2. ~200K concurrent connections per database</div><div class="timeline-item-desc">Hard limit. You'll need multiple databases + a routing layer to scale beyond this. Most apps never hit it, but chat/presence apps can.</div></div>
          <div class="timeline-item" style="--c:#a855f7"><div class="timeline-item-title" style="color:#a855f7">3. Entire database is one JSON tree</div><div class="timeline-item-desc">Must design data carefully. Deeply nested data means big downloads. Always "flatten" your data structure.</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">4. Per-GB pricing is costly at scale</div><div class="timeline-item-desc">\\$5/GB downloaded adds up fast. A chat app with 100K daily users can cost \\$500+/month. Cache aggressively.</div></div>
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">5. Vendor lock-in</div><div class="timeline-item-desc">No SQL, no standard API. Migrating to PostgreSQL/MongoDB later requires rewriting all your database code. Plan accordingly.</div></div>
          <div class="timeline-item" style="--c:#ec4899"><div class="timeline-item-title" style="color:#ec4899">6. Limited backups and exports</div><div class="timeline-item-desc">Daily backups only on Blaze plan. No point-in-time recovery. Scheduled exports to Cloud Storage needed for disaster recovery.</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">7. No server-side triggers within RTDB</div><div class="timeline-item-desc">Need Cloud Functions (separate service, cold starts, extra cost) for server logic like sending emails on new records.</div></div>
        </div>
      </div>

      <h2>Data Modeling: The #1 Thing People Get Wrong</h2>
      <pre><code># &#x274C; BAD: Deeply nested data
{
  "users": {
    "alice": {
      "name": "Alice",
      "posts": {
        "-NvPost1": { "title": "Hello", "comments": { "-NvCmt1": {...}, "-NvCmt2": {...} } },
        "-NvPost2": { ... }
      },
      "followers": { ... }
    }
  }
}
# Problem: Reading ONE user downloads ALL their posts, comments, followers!
# A user with 1000 posts = huge slow download every time.

# &#x2705; GOOD: Flat structure
{
  "users": {
    "alice": { "name": "Alice" }
  },
  "posts": {
    "-NvPost1": { "title": "Hello", "authorId": "alice" }
  },
  "comments": {
    "-NvCmt1": { "postId": "-NvPost1", "text": "Great!" }
  },
  "userPosts": {
    "alice": {
      "-NvPost1": true,
      "-NvPost2": true
    }
  }
}
# Now each query downloads only what you need.
# "userPosts" is an INDEX — quick lookup of a user's post IDs.</code></pre>

      <h2>When NOT to Use Firebase RTDB</h2>
      <ul>
        <li><strong>Complex queries needed</strong> — use Firestore or PostgreSQL</li>
        <li><strong>Financial/transactional data</strong> — lack of true ACID transactions across the tree is risky</li>
        <li><strong>Large datasets per user</strong> — per-GB pricing punishes data-heavy apps</li>
        <li><strong>Multi-tenant SaaS with strict isolation</strong> — security rules get complex fast</li>
        <li><strong>You need SQL</strong> — Firebase is NoSQL; accept that or choose differently</li>
      </ul>

      <h2>When Firebase RTDB Shines</h2>
      <ul>
        <li><strong>Real-time chat and messaging</strong> — exactly what it was designed for</li>
        <li><strong>Collaborative editing (Google Docs style)</strong> — cursors, selections, presence</li>
        <li><strong>Live dashboards</strong> — metrics that update in real-time</li>
        <li><strong>Multiplayer games</strong> — game state sync across players</li>
        <li><strong>Presence and online status</strong> — <code>onDisconnect()</code> is magic</li>
        <li><strong>MVPs and prototypes</strong> — ship a working app in a weekend</li>
      </ul>

      <h2>The Verdict</h2>
      <p>Firebase Realtime Database is <strong>excellent for what it's designed for</strong>: small pieces of JSON data that need to sync in real-time across many clients. It's the fastest path to a working real-time app. But it's a specialized tool — not a general-purpose database. Use RTDB for chat, presence, and live state; use Firestore for everything else; use PostgreSQL/MongoDB when you outgrow both. Build fast, but architect with migration in mind.</p>
    `;
