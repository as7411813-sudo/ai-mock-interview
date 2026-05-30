const problemBank = [
  // Arrays
  { id:1, title:'Two Sum', topic:'Arrays', difficulty:'easy', leetcode:'https://leetcode.com/problems/two-sum/' },
  { id:2, title:'Best Time to Buy and Sell Stock', topic:'Arrays', difficulty:'easy', leetcode:'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { id:3, title:'Container With Most Water', topic:'Arrays', difficulty:'medium', leetcode:'https://leetcode.com/problems/container-with-most-water/' },
  { id:4, title:'3Sum', topic:'Arrays', difficulty:'medium', leetcode:'https://leetcode.com/problems/3sum/' },
  { id:5, title:'Trapping Rain Water', topic:'Arrays', difficulty:'hard', leetcode:'https://leetcode.com/problems/trapping-rain-water/' },
  // Strings
  { id:6, title:'Valid Anagram', topic:'Strings', difficulty:'easy', leetcode:'https://leetcode.com/problems/valid-anagram/' },
  { id:7, title:'Longest Substring Without Repeating Characters', topic:'Strings', difficulty:'medium', leetcode:'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { id:8, title:'Longest Palindromic Substring', topic:'Strings', difficulty:'medium', leetcode:'https://leetcode.com/problems/longest-palindromic-substring/' },
  // Trees
  { id:9, title:'Maximum Depth of Binary Tree', topic:'Trees', difficulty:'easy', leetcode:'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { id:10, title:'Validate Binary Search Tree', topic:'Trees', difficulty:'medium', leetcode:'https://leetcode.com/problems/validate-binary-search-tree/' },
  { id:11, title:'Binary Tree Level Order Traversal', topic:'Trees', difficulty:'medium', leetcode:'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { id:12, title:'Serialize and Deserialize Binary Tree', topic:'Trees', difficulty:'hard', leetcode:'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
  // Graphs
  { id:13, title:'Number of Islands', topic:'Graphs', difficulty:'medium', leetcode:'https://leetcode.com/problems/number-of-islands/' },
  { id:14, title:'Clone Graph', topic:'Graphs', difficulty:'medium', leetcode:'https://leetcode.com/problems/clone-graph/' },
  { id:15, title:'Course Schedule', topic:'Graphs', difficulty:'medium', leetcode:'https://leetcode.com/problems/course-schedule/' },
  { id:16, title:'Word Ladder', topic:'Graphs', difficulty:'hard', leetcode:'https://leetcode.com/problems/word-ladder/' },
  // Dynamic Programming
  { id:17, title:'Climbing Stairs', topic:'Dynamic Programming', difficulty:'easy', leetcode:'https://leetcode.com/problems/climbing-stairs/' },
  { id:18, title:'Coin Change', topic:'Dynamic Programming', difficulty:'medium', leetcode:'https://leetcode.com/problems/coin-change/' },
  { id:19, title:'Longest Common Subsequence', topic:'Dynamic Programming', difficulty:'medium', leetcode:'https://leetcode.com/problems/longest-common-subsequence/' },
  { id:20, title:'Edit Distance', topic:'Dynamic Programming', difficulty:'hard', leetcode:'https://leetcode.com/problems/edit-distance/' },
  // Linked Lists
  { id:21, title:'Reverse Linked List', topic:'Linked Lists', difficulty:'easy', leetcode:'https://leetcode.com/problems/reverse-linked-list/' },
  { id:22, title:'Merge Two Sorted Lists', topic:'Linked Lists', difficulty:'easy', leetcode:'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { id:23, title:'Linked List Cycle', topic:'Linked Lists', difficulty:'easy', leetcode:'https://leetcode.com/problems/linked-list-cycle/' },
  { id:24, title:'LRU Cache', topic:'Linked Lists', difficulty:'medium', leetcode:'https://leetcode.com/problems/lru-cache/' },
  // Stacks & Queues
  { id:25, title:'Valid Parentheses', topic:'Stacks', difficulty:'easy', leetcode:'https://leetcode.com/problems/valid-parentheses/' },
  { id:26, title:'Min Stack', topic:'Stacks', difficulty:'medium', leetcode:'https://leetcode.com/problems/min-stack/' },
  { id:27, title:'Largest Rectangle in Histogram', topic:'Stacks', difficulty:'hard', leetcode:'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
  // Binary Search
  { id:28, title:'Binary Search', topic:'Binary Search', difficulty:'easy', leetcode:'https://leetcode.com/problems/binary-search/' },
  { id:29, title:'Search in Rotated Sorted Array', topic:'Binary Search', difficulty:'medium', leetcode:'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
  { id:30, title:'Median of Two Sorted Arrays', topic:'Binary Search', difficulty:'hard', leetcode:'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
];

// Weak topics (simulated from interview data)
function getWeakTopics() {
  const sessions = JSON.parse(localStorage.getItem('interviewSessions') || '[]');
  const profile = JSON.parse(localStorage.getItem('resumeProfile') || 'null');
  // Default weak topics for demo
  let weak = ['Graphs', 'Dynamic Programming', 'Trees'];
  if (profile && profile.gaps) {
    if (profile.gaps.includes('Data Structures')) weak.push('Linked Lists', 'Stacks');
    if (profile.gaps.includes('Algorithms')) weak.push('Binary Search');
  }
  return [...new Set(weak)];
}

function getCompleted() {
  return JSON.parse(localStorage.getItem('completedProblems') || '[]');
}

function toggleProblem(id) {
  let completed = getCompleted();
  if (completed.includes(id)) {
    completed = completed.filter(c => c !== id);
  } else {
    completed.push(id);
  }
  localStorage.setItem('completedProblems', JSON.stringify(completed));
  render();
}

let currentFilter = 'all';

function filterTopic(topic, btn) {
  currentFilter = topic;
  document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProblems();
}

function render() {
  const weakTopics = getWeakTopics();
  const completed = getCompleted();
  const topics = [...new Set(problemBank.map(p => p.topic))];

  // Stats
  document.getElementById('totalProblems').textContent = problemBank.length;
  document.getElementById('completedProblems').textContent = completed.length;
  const rate = problemBank.length > 0 ? Math.round((completed.length / problemBank.length) * 100) : 0;
  document.getElementById('completionRate').textContent = rate + '%';
  document.getElementById('streakCount').textContent = Math.min(completed.length, 14);

  // Banner
  if (weakTopics.length > 0) {
    document.getElementById('bannerMessage').textContent = `Weak areas detected: ${weakTopics.join(', ')}. Focus on highlighted problems first.`;
  }

  // Topic filters
  const filtersEl = document.getElementById('topicFilters');
  filtersEl.innerHTML = `<button class="topic-btn ${currentFilter === 'all' ? 'active' : ''}" data-topic="all" onclick="filterTopic('all', this)">All Topics</button>`;
  topics.forEach(t => {
    const isWeak = weakTopics.includes(t);
    filtersEl.innerHTML += `<button class="topic-btn ${currentFilter === t ? 'active' : ''} ${isWeak ? 'weak' : ''}" onclick="filterTopic('${t}', this)">${t}</button>`;
  });

  // Topic progress
  const progEl = document.getElementById('topicProgress');
  progEl.innerHTML = topics.map(t => {
    const total = problemBank.filter(p => p.topic === t).length;
    const done = problemBank.filter(p => p.topic === t && completed.includes(p.id)).length;
    const pct = Math.round((done / total) * 100);
    const isWeak = weakTopics.includes(t);
    return `<div class="topic-prog-card ${isWeak ? 'weak-topic' : ''}">
      <div class="topic-prog-header">
        <span>${t}${isWeak ? '<span class="weak-badge">⚠ Weak</span>' : ''}</span>
        <span>${done}/${total}</span>
      </div>
      <div class="topic-prog-bar"><div class="topic-prog-fill ${isWeak ? 'weak-fill' : ''}" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');

  renderProblems();
}

function renderProblems() {
  const completed = getCompleted();
  const weakTopics = getWeakTopics();
  let filtered = currentFilter === 'all' ? [...problemBank] : problemBank.filter(p => p.topic === currentFilter);

  // Sort: weak topics first, then uncompleted first
  filtered.sort((a, b) => {
    const aWeak = weakTopics.includes(a.topic) ? 0 : 1;
    const bWeak = weakTopics.includes(b.topic) ? 0 : 1;
    if (aWeak !== bWeak) return aWeak - bWeak;
    const aDone = completed.includes(a.id) ? 1 : 0;
    const bDone = completed.includes(b.id) ? 1 : 0;
    return aDone - bDone;
  });

  const listEl = document.getElementById('problemsList');
  listEl.innerHTML = filtered.map(p => {
    const done = completed.includes(p.id);
    const isWeak = weakTopics.includes(p.topic);
    return `<div class="problem-item ${done ? 'completed' : ''}" onclick="toggleProblem(${p.id})">
      <div class="problem-check">${done ? '<i class="fas fa-check"></i>' : ''}</div>
      <div class="problem-info">
        <div class="problem-title">${p.title}</div>
        <div class="problem-meta">
          <span class="diff-label ${p.difficulty}">${p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1)}</span>
          <span>${p.topic}</span>
        </div>
      </div>
      <span class="problem-topic-tag">${isWeak ? '⚠ Weak Area' : p.topic}</span>
      <a class="problem-link" href="${p.leetcode}" target="_blank" onclick="event.stopPropagation()">LeetCode →</a>
    </div>`;
  }).join('');
}

window.addEventListener('DOMContentLoaded', render);
