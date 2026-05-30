const systems = [
  { id:'whatsapp', icon:'💬', name:'WhatsApp', desc:'Real-time messaging at scale', difficulty:'medium' },
  { id:'youtube', icon:'📺', name:'YouTube', desc:'Video streaming & recommendations', difficulty:'hard' },
  { id:'url-shortener', icon:'🔗', name:'URL Shortener', desc:'Billions of redirects per day', difficulty:'medium' },
  { id:'twitter', icon:'🐦', name:'Twitter/X', desc:'Real-time feed & trending topics', difficulty:'hard' },
  { id:'uber', icon:'🚗', name:'Uber', desc:'Ride matching & real-time tracking', difficulty:'hard' },
  { id:'netflix', icon:'🎬', name:'Netflix', desc:'Video streaming & personalization', difficulty:'hard' },
];

const expertSolutions = {
  whatsapp: {
    dimensions: {
      'Scalability': 'Use WebSocket servers with consistent hashing. Horizontal scaling with auto-scaling groups. Message queues (Kafka) for async processing.',
      'Database': 'Cassandra for messages (write-heavy, partition by chat_id). PostgreSQL for user profiles. Redis for presence/online status.',
      'Caching': 'Redis for recent conversations and online status. Client-side SQLite for offline access. CDN for media files.',
      'Load Balancing': 'L4 load balancer for WebSocket connections. Consistent hashing to route users to specific servers. Health checks with failover.',
      'Reliability': 'Message acknowledgment system. At-least-once delivery with client-side deduplication. Multi-region replication.',
      'Architecture': 'Microservices: Auth, Messaging, Presence, Media, Notification services. API Gateway for REST. WebSocket servers for real-time.'
    },
    expert: `<h4>Expert Architecture</h4>
    <ul>
      <li><strong>WebSocket Gateway</strong> → Maintains persistent connections for real-time messaging</li>
      <li><strong>Message Service</strong> → Handles message routing, stores in Cassandra partitioned by conversation</li>
      <li><strong>Presence Service</strong> → Redis-based online/last-seen tracking</li>
      <li><strong>Media Service</strong> → S3 for storage, CDN for delivery, thumbnail generation</li>
      <li><strong>Push Notification Service</strong> → FCM/APNs integration for offline users</li>
    </ul>
    <h4>Key Design Decisions</h4>
    <ul>
      <li>Use Cassandra over MySQL for messages — optimized for high write throughput</li>
      <li>Consistent hashing ensures same user always connects to same WebSocket server</li>
      <li>Fan-out on read for group messages (not fan-out on write) to handle large groups</li>
      <li>End-to-end encryption with Signal Protocol</li>
    </ul>`
  },
  youtube: {
    dimensions: {
      'Scalability': 'CDN for video delivery across regions. Transcoding pipeline with workers. Sharded databases for metadata.',
      'Database': 'MySQL/Vitess for video metadata. BigTable for comments. Redis for view counts. Elasticsearch for search.',
      'Caching': 'Multi-tier: CDN edge cache → Regional cache → Origin. Redis for trending videos and user recommendations.',
      'Load Balancing': 'DNS-based geo-routing. L7 load balancers for API. CDN handles video traffic distribution.',
      'Reliability': 'Redundant transcoding. Multi-region storage with replication. Graceful degradation (lower quality on high load).',
      'Architecture': 'Upload pipeline → Transcoding → CDN distribution. Separate read/write paths. ML-based recommendation engine.'
    },
    expert: `<h4>Expert Architecture</h4>
    <ul>
      <li><strong>Upload Service</strong> → Handles chunked uploads to blob storage (S3/GCS)</li>
      <li><strong>Transcoding Pipeline</strong> → FFmpeg workers process into multiple resolutions (240p-4K)</li>
      <li><strong>CDN Network</strong> → Global edge nodes serve cached video chunks using adaptive bitrate</li>
      <li><strong>Recommendation Engine</strong> → Collaborative filtering + content-based ML models</li>
      <li><strong>Search Service</strong> → Elasticsearch with inverted index for title/description/tags</li>
    </ul>
    <h4>Key Design Decisions</h4>
    <ul>
      <li>Adaptive bitrate streaming (DASH/HLS) for varying network conditions</li>
      <li>Separate hot/cold storage — popular videos on SSD, older on HDD/archive</li>
      <li>Eventual consistency for view counts (aggregate periodically, not real-time)</li>
      <li>Pre-compute recommendation feeds during off-peak hours</li>
    </ul>`
  },
  'url-shortener': {
    dimensions: {
      'Scalability': 'Stateless API servers behind load balancer. Database sharding by short URL hash. Read-heavy caching.',
      'Database': 'NoSQL (DynamoDB/Cassandra) for key-value lookups. Counter service for analytics. TTL for expiring links.',
      'Caching': 'Redis/Memcached for hot URLs (80/20 rule). Browser 301 caching. Multi-tier cache with LRU eviction.',
      'Load Balancing': 'Round-robin L7 load balancer. Geographic DNS routing for low latency.',
      'Reliability': 'Database replication. Circuit breakers for cache failures (fallback to DB). Rate limiting per API key.',
      'Architecture': 'Simple: API Gateway → URL Service → Cache → Database. Base62 encoding for short codes. Analytics pipeline.'
    },
    expert: `<h4>Expert Architecture</h4>
    <ul>
      <li><strong>ID Generator</strong> → Snowflake/ULID for unique IDs, Base62 encode for short URLs</li>
      <li><strong>URL Service</strong> → Create/Read/Delete operations with validation</li>
      <li><strong>Cache Layer</strong> → Redis with LRU, cache top 20% of URLs (handles 80% of reads)</li>
      <li><strong>Analytics Pipeline</strong> → Kafka → Stream processor → Analytics DB for click tracking</li>
    </ul>
    <h4>Key Design Decisions</h4>
    <ul>
      <li>Base62 encoding gives 62^7 ≈ 3.5 trillion possible URLs with 7 chars</li>
      <li>301 vs 302 redirects — 301 for permanent (browser caches), 302 for tracking analytics</li>
      <li>Counter-based ID generation avoids collision checking overhead</li>
      <li>Rate limiting: 100 creates/min per user, unlimited reads</li>
    </ul>`
  }
};

let selectedSystem = null;

function renderPicker() {
  const grid = document.getElementById('systemGrid');
  grid.innerHTML = systems.map(s => `
    <div class="system-card" onclick="selectSystem('${s.id}')">
      <span class="sys-icon">${s.icon}</span>
      <h4>${s.name}</h4>
      <p>${s.desc}</p>
      <span class="sys-diff ${s.difficulty}">${s.difficulty.charAt(0).toUpperCase() + s.difficulty.slice(1)}</span>
    </div>
  `).join('');
}

function selectSystem(id) {
  selectedSystem = systems.find(s => s.id === id);
  document.getElementById('systemPicker').style.display = 'none';
  document.getElementById('designForm').style.display = 'block';
  document.getElementById('designTitle').textContent = `Design: ${selectedSystem.name}`;
}

function backToPicker() {
  document.getElementById('systemPicker').style.display = 'block';
  document.getElementById('designForm').style.display = 'none';
  document.getElementById('evalResults').style.display = 'none';
  document.getElementById('evalLoading').style.display = 'none';
}

function submitDesign() {
  const fields = ['funcReq','nonFuncReq','architecture','database','caching','scaling'];
  const values = {};
  let filledCount = 0;
  fields.forEach(f => {
    values[f] = document.getElementById(f).value.trim();
    if (values[f].length > 10) filledCount++;
  });

  if (filledCount < 3) {
    alert('Please fill in at least 3 sections with meaningful content.');
    return;
  }

  document.getElementById('designForm').style.display = 'none';
  document.getElementById('evalLoading').style.display = 'block';

  setTimeout(() => {
    const evaluation = evaluateDesign(values);
    displayResults(evaluation);
  }, 2500);
}

function evaluateDesign(values) {
  const dimensions = ['Scalability','Database','Caching','Load Balancing','Reliability','Architecture'];
  const scores = {};
  let totalScore = 0;

  dimensions.forEach(dim => {
    let score = 40 + Math.random() * 20;
    const allText = Object.values(values).join(' ').toLowerCase();

    // Boost based on keywords
    const keywords = {
      Scalability: ['horizontal','auto-scaling','sharding','partition','replicate','distributed'],
      Database: ['sql','nosql','postgresql','cassandra','mongodb','redis','schema','index','partition'],
      Caching: ['redis','memcached','cdn','cache','lru','ttl','invalidat'],
      'Load Balancing': ['load balanc','round robin','consistent hash','l4','l7','nginx','health check'],
      Reliability: ['replicat','failover','backup','circuit breaker','retry','fault toleran','redundan'],
      Architecture: ['microservice','api gateway','message queue','kafka','event driven','websocket','service']
    };

    (keywords[dim] || []).forEach(kw => {
      if (allText.includes(kw)) score += 5 + Math.random() * 5;
    });

    score = Math.min(95, Math.round(score));
    scores[dim] = score;
    totalScore += score;
  });

  const overall = Math.round(totalScore / dimensions.length);

  // Generate feedback
  const feedback = {};
  dimensions.forEach(dim => {
    const s = scores[dim];
    const expert = expertSolutions[selectedSystem?.id];
    if (s >= 75) {
      feedback[dim] = `Strong understanding demonstrated. ${expert?.dimensions?.[dim] || 'Consider adding more specific technical details.'}`;
    } else if (s >= 55) {
      feedback[dim] = `Good foundation but missing key concepts. ${expert?.dimensions?.[dim] || 'Try to include specific technologies and trade-offs.'}`;
    } else {
      feedback[dim] = `Needs significant improvement. ${expert?.dimensions?.[dim] || 'Review system design fundamentals for this area.'}`;
    }
  });

  return { overall, scores, feedback, dimensions };
}

function displayResults(evaluation) {
  document.getElementById('evalLoading').style.display = 'none';
  document.getElementById('evalResults').style.display = 'block';

  // Animate overall score
  const circ = document.getElementById('evalCircle');
  setTimeout(() => {
    circ.style.transition = 'stroke-dashoffset 1.5s ease';
    circ.style.strokeDashoffset = 427 - (evaluation.overall / 100) * 427;
  }, 300);
  animateNum('evalScoreNum', evaluation.overall, 1500);

  // Breakdown bars
  const breakdown = document.getElementById('scoreBreakdown');
  breakdown.innerHTML = evaluation.dimensions.map(dim => `
    <div class="breakdown-item">
      <span class="breakdown-label">${dim}</span>
      <div class="breakdown-bar"><div class="breakdown-fill" style="width:0%" data-target="${evaluation.scores[dim]}"></div></div>
      <span class="breakdown-val">${evaluation.scores[dim]}</span>
    </div>
  `).join('');

  setTimeout(() => {
    breakdown.querySelectorAll('.breakdown-fill').forEach(el => {
      el.style.width = el.dataset.target + '%';
    });
  }, 500);

  // Dimension cards
  const dimGrid = document.getElementById('dimensionGrid');
  const dimIcons = { Scalability:'fa-expand-arrows-alt', Database:'fa-database', Caching:'fa-bolt', 'Load Balancing':'fa-balance-scale', Reliability:'fa-shield-alt', Architecture:'fa-sitemap' };
  dimGrid.innerHTML = evaluation.dimensions.map(dim => {
    const s = evaluation.scores[dim];
    const cls = s >= 75 ? 'good' : s >= 55 ? 'ok' : 'bad';
    return `<div class="dim-card">
      <h4><i class="fas ${dimIcons[dim] || 'fa-circle'}"></i> ${dim} <span class="dim-score ${cls}">${s}/100</span></h4>
      <p>${evaluation.feedback[dim]}</p>
    </div>`;
  }).join('');

  // Expert solution
  const expert = expertSolutions[selectedSystem?.id];
  if (expert) {
    document.getElementById('expertBody').innerHTML = expert.expert;
  } else {
    document.getElementById('expertBody').innerHTML = '<p>Expert solution coming soon for this system.</p>';
  }
}

function toggleExpert() {
  const body = document.getElementById('expertBody');
  const chevron = document.getElementById('expertChevron');
  if (body.style.display === 'none') {
    body.style.display = 'block';
    chevron.style.transform = 'rotate(180deg)';
  } else {
    body.style.display = 'none';
    chevron.style.transform = 'rotate(0)';
  }
}

function animateNum(id, target, duration) {
  const el = document.getElementById(id);
  const start = performance.now();
  function update(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

window.addEventListener('DOMContentLoaded', renderPicker);
