export const CONTENT = `
      <p>Your product manager wants &ldquo;real-time updates.&rdquo; Before you reach for WebSocket, stop. The right choice depends on your data flow direction, scale requirements, and infrastructure. Picking the wrong protocol means either over-engineering a simple notification feed or under-engineering a chat system that collapses at scale.</p>

      <p>This guide breaks down the three main approaches with real code, honest tradeoffs, and a decision framework you can actually use.</p>

      <h2>Why HTTP Request-Response Falls Short</h2>

      <p>Standard HTTP is a pull model &mdash; the client asks, the server responds. For real-time features, this means the client must keep asking &ldquo;anything new?&rdquo; repeatedly.</p>

      <pre><code>// Naive polling: wasteful and laggy
setInterval(async () => {
  const res = await fetch('/api/notifications');
  const data = await res.json();
  updateUI(data);
}, 5000); // 5-second delay + wasted requests when nothing changed</code></pre>

      <p>This approach wastes bandwidth (most responses return &ldquo;nothing new&rdquo;), introduces latency (up to 5 seconds before you see an update), and hammers your server with unnecessary requests.</p>

      <h2>Long Polling: The Simplest Upgrade</h2>

      <p>Long polling flips the script: the client sends a request, but the server <strong>holds it open</strong> until there is new data to send. Once the client receives a response, it immediately sends another request.</p>

      <h3>How It Works</h3>

      <pre><code>// Client-side long polling
async function longPoll() {
  try {
    const res = await fetch('/api/events?since=lastEventId', {
      signal: AbortSignal.timeout(30000) // 30s timeout
    });
    const data = await res.json();
    handleNewData(data);
  } catch (err) {
    // Timeout or error: wait briefly, then retry
    await new Promise(r => setTimeout(r, 1000));
  }
  longPoll(); // Immediately reconnect
}</code></pre>

      <pre><code>// Server-side (Node.js/Express)
app.get('/api/events', async (req, res) => {
  const since = req.query.since;

  // Check for new data, wait up to 25 seconds
  const data = await waitForNewEvents(since, 25000);

  if (data) {
    res.json(data);
  } else {
    res.status(204).end(); // No new data, client will retry
  }
});</code></pre>

      <h3>When Long Polling Makes Sense</h3>
      <ul>
        <li>You need maximum browser and proxy compatibility</li>
        <li>Updates are infrequent (less than once per second)</li>
        <li>You cannot use WebSocket due to corporate proxy restrictions</li>
        <li>The implementation must be dead simple</li>
      </ul>

      <h3>Drawbacks</h3>
      <ul>
        <li>Each response requires a new HTTP connection (overhead)</li>
        <li>Slight latency gap between response and next request</li>
        <li>Server must hold many open connections simultaneously</li>
        <li>Not suitable for high-frequency updates</li>
      </ul>

      <h2>Server-Sent Events (SSE): The Underrated Middle Ground</h2>

      <p>SSE provides a <strong>persistent, one-way</strong> channel from server to client over standard HTTP. The browser natively supports it via the <code>EventSource</code> API, with automatic reconnection built in.</p>

      <h3>Server Implementation</h3>

      <pre><code>// Node.js/Express SSE endpoint
app.get('/api/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  // Send a comment every 15s to keep the connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\\n\\n');
  }, 15000);

  // Send events as they happen
  const onNewOrder = (order) => {
    res.write(\`event: new-order\\n\`);
    res.write(\`data: \${JSON.stringify(order)}\\n\\n\`);
  };

  eventEmitter.on('order:created', onNewOrder);

  req.on('close', () => {
    clearInterval(heartbeat);
    eventEmitter.off('order:created', onNewOrder);
  });
});</code></pre>

      <h3>Angular Client with Signals</h3>

      <pre><code>// notification.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications = signal&lt;Notification[]&gt;([]);
  connected = signal(false);
  private eventSource: EventSource | null = null;

  connect() {
    this.eventSource = new EventSource('/api/stream');
    this.connected.set(true);

    this.eventSource.addEventListener('new-order', (event) => {
      const order = JSON.parse(event.data);
      this.notifications.update(list => [order, ...list]);
    });

    this.eventSource.onerror = () => {
      this.connected.set(false);
      // EventSource automatically reconnects!
    };

    this.eventSource.onopen = () => {
      this.connected.set(true);
    };
  }

  disconnect() {
    this.eventSource?.close();
    this.connected.set(false);
  }
}</code></pre>

      <h3>SSE Advantages</h3>
      <ul>
        <li><strong>Automatic reconnection</strong> with configurable retry interval (built into EventSource)</li>
        <li><strong>Event ID tracking</strong> &mdash; resume from where you left off via <code>Last-Event-ID</code> header</li>
        <li><strong>Works over HTTP/2</strong> &mdash; multiplexed connections, no head-of-line blocking</li>
        <li><strong>Firewall and proxy friendly</strong> &mdash; standard HTTP, no upgrade needed</li>
        <li><strong>Native browser API</strong> &mdash; no library required</li>
      </ul>

      <h3>SSE Limitations</h3>
      <ul>
        <li>Unidirectional &mdash; server to client only (client uses regular HTTP for sending)</li>
        <li>Text only &mdash; no binary data (must base64 encode)</li>
        <li>Maximum 6 connections per domain in HTTP/1.1 (solved by HTTP/2)</li>
      </ul>

      <h2>WebSocket: Full-Duplex Power</h2>

      <p>WebSocket provides a <strong>persistent, bidirectional</strong> channel. After an HTTP handshake upgrade, both client and server can send messages at any time without request-response overhead.</p>

      <h3>Server Implementation</h3>

      <pre><code>// Node.js WebSocket server (using ws library)
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);

  // Heartbeat to detect dead connections
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (data) => {
    const message = JSON.parse(data);

    // Broadcast to all other clients
    clients.forEach(client => {
      if (client !== ws && client.readyState === 1) {
        client.send(JSON.stringify(message));
      }
    });
  });

  ws.on('close', () => { clients.delete(ws); });
});

// Ping every 30 seconds to detect stale connections
setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);</code></pre>

      <h3>Angular Chat Component</h3>

      <pre><code>// chat.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatService {
  messages = signal&lt;ChatMessage[]&gt;([]);
  connectionState = signal&lt;'connecting' | 'open' | 'closed'&gt;('closed');
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;

  connect(roomId: string) {
    this.connectionState.set('connecting');
    this.ws = new WebSocket(\`wss://api.example.com/chat/\${roomId}\`);

    this.ws.onopen = () => {
      this.connectionState.set('open');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      this.messages.update(list => [...list, msg]);
    };

    this.ws.onclose = () => {
      this.connectionState.set('closed');
      this.reconnect(roomId);
    };
  }

  send(content: string) {
    this.ws?.send(JSON.stringify({ content, timestamp: Date.now() }));
  }

  private reconnect(roomId: string) {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;
    setTimeout(() => this.connect(roomId), delay);
  }
}</code></pre>

      <h2>Head-to-Head Comparison</h2>

      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Long Polling</th>
            <th>SSE</th>
            <th>WebSocket</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Direction</td>
            <td>Server &rarr; Client</td>
            <td>Server &rarr; Client</td>
            <td>Bidirectional</td>
          </tr>
          <tr>
            <td>Protocol</td>
            <td>HTTP</td>
            <td>HTTP</td>
            <td>WS (upgrade from HTTP)</td>
          </tr>
          <tr>
            <td>Auto Reconnect</td>
            <td>Manual</td>
            <td>Built-in</td>
            <td>Manual</td>
          </tr>
          <tr>
            <td>Binary Support</td>
            <td>Yes</td>
            <td>No (text only)</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>HTTP/2 Compatible</td>
            <td>Yes</td>
            <td>Yes (multiplexed)</td>
            <td>No (separate connection)</td>
          </tr>
          <tr>
            <td>Proxy Friendly</td>
            <td>Very</td>
            <td>Yes</td>
            <td>Sometimes problematic</td>
          </tr>
          <tr>
            <td>Latency</td>
            <td>Medium</td>
            <td>Low</td>
            <td>Lowest</td>
          </tr>
          <tr>
            <td>Connections per Server</td>
            <td>~10K</td>
            <td>~50K</td>
            <td>~50K</td>
          </tr>
          <tr>
            <td>Memory per Connection</td>
            <td>~10KB</td>
            <td>~5KB</td>
            <td>~8KB</td>
          </tr>
          <tr>
            <td>Complexity</td>
            <td>Low</td>
            <td>Low</td>
            <td>Medium-High</td>
          </tr>
        </tbody>
      </table>

      <h2>Decision Framework</h2>

      <p>Use this flowchart to pick the right approach:</p>

      <ul>
        <li><strong>Does the client need to send frequent messages?</strong> &rarr; WebSocket (chat, gaming, collaborative editing)</li>
        <li><strong>Is it server-to-client only?</strong> &rarr; SSE (notifications, live feeds, dashboards, stock tickers)</li>
        <li><strong>Do you need maximum compatibility with zero dependencies?</strong> &rarr; Long Polling (legacy systems, restrictive proxies)</li>
        <li><strong>Is it a live sports score or news feed?</strong> &rarr; SSE (one-way, auto-reconnect, event types)</li>
        <li><strong>Is it a multiplayer game or real-time collaboration?</strong> &rarr; WebSocket (bidirectional, low latency, binary frames)</li>
      </ul>

      <h2>Scaling Considerations</h2>

      <p>All three approaches face the same fundamental challenge at scale: <strong>sticky sessions</strong>. When a client connects to Server A, that server holds the connection state. If an event originates on Server B, it must reach Server A to deliver to the client.</p>

      <h3>Solution: Redis Pub/Sub</h3>

      <pre><code>// Every server subscribes to a Redis channel
import Redis from 'ioredis';

const redisSub = new Redis();
const redisPub = new Redis();

// When a new event happens on any server:
redisPub.publish('notifications', JSON.stringify(event));

// Every server listens and forwards to its connected clients:
redisSub.subscribe('notifications');
redisSub.on('message', (channel, data) => {
  const event = JSON.parse(data);
  connectedClients.forEach(client => client.send(data));
});</code></pre>

      <h2>Common Mistakes</h2>

      <ul>
        <li><strong>No heartbeat mechanism:</strong> Connections silently die behind NATs and proxies. Always implement ping/pong (WebSocket) or comment-based heartbeats (SSE).</li>
        <li><strong>Memory leaks from unclosed connections:</strong> Always clean up event listeners and remove clients from tracking sets on disconnect.</li>
        <li><strong>Missing reconnection with backoff:</strong> Network blips happen. Implement exponential backoff (1s, 2s, 4s, 8s) with a maximum delay cap.</li>
        <li><strong>Using WebSocket when SSE is enough:</strong> If your data only flows server-to-client, SSE is simpler, more reliable, and works better with HTTP/2.</li>
        <li><strong>Not handling message ordering:</strong> Messages can arrive out of order after reconnection. Include sequence numbers or timestamps.</li>
      </ul>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>SSE is the right default</strong> for most real-time features &mdash; notifications, feeds, dashboards</li>
        <li><strong>WebSocket is for bidirectional needs</strong> &mdash; chat, gaming, collaboration</li>
        <li><strong>Long Polling still has its place</strong> &mdash; maximum compatibility, simple infrastructure</li>
        <li><strong>Always implement heartbeats and reconnection</strong> regardless of which approach you choose</li>
        <li><strong>Use Redis Pub/Sub for horizontal scaling</strong> to distribute events across server instances</li>
        <li><strong>Start with SSE, upgrade to WebSocket only when you hit its limitations</strong> &mdash; premature WebSocket is a common source of unnecessary complexity</li>
      </ul>

      <p>The best real-time architecture is the simplest one that meets your requirements. Do not let the appeal of WebSocket trick you into over-engineering a notification bell.</p>
    `;
