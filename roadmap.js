const weeklyPlans = {
  'Graphs': {
    title: 'Graph Algorithms',
    desc: 'Master BFS, DFS, topological sort, shortest paths, and connected components.',
    tasks: [
      'Learn BFS and DFS traversal patterns',
      'Solve 5 graph problems on LeetCode (Number of Islands, Clone Graph)',
      'Understand Dijkstra & Bellman-Ford for shortest paths',
      'Practice topological sort problems',
      'Review graph representation: adjacency list vs matrix'
    ],
    resources: [
      { title: 'Graph Theory — NeetCode', desc: 'Visual explanations of graph algorithms with code', link: 'https://neetcode.io' },
      { title: 'William Fiset — Graph Theory', desc: 'Complete YouTube playlist on graph algorithms', link: 'https://youtube.com' },
    ]
  },
  'Dynamic Programming': {
    title: 'Dynamic Programming',
    desc: 'Build intuition for DP patterns: 1D, 2D, knapsack, LCS, and optimization problems.',
    tasks: [
      'Understand memoization vs tabulation',
      'Solve classic problems: Climbing Stairs, Coin Change, House Robber',
      'Learn 2D DP: Longest Common Subsequence, Edit Distance',
      'Practice knapsack variations (0/1, unbounded)',
      'Solve 5 medium DP problems on LeetCode'
    ],
    resources: [
      { title: 'DP Patterns — LeetCode', desc: 'Categorized DP problems by pattern type', link: 'https://leetcode.com' },
      { title: 'Striver DP Series', desc: 'Comprehensive DP playlist with explanations', link: 'https://youtube.com' },
    ]
  },
  'Trees': {
    title: 'Trees & Binary Search Trees',
    desc: 'Master tree traversals, BST operations, and advanced tree problems.',
    tasks: [
      'Review inorder, preorder, postorder traversals',
      'Understand BST insert, delete, and search operations',
      'Solve: Maximum Depth, Validate BST, Level Order Traversal',
      'Learn about balanced trees (AVL, Red-Black concepts)',
      'Practice serialize/deserialize and LCA problems'
    ],
    resources: [
      { title: 'Trees — Visualgo', desc: 'Interactive visualization of tree operations', link: 'https://visualgo.net' },
      { title: 'Binary Trees — Abdul Bari', desc: 'Clear explanations of tree concepts', link: 'https://youtube.com' },
    ]
  },
  'System Design': {
    title: 'System Design Fundamentals',
    desc: 'Learn scalability, databases, caching, and distributed system concepts.',
    tasks: [
      'Understand CAP theorem and consistency models',
      'Learn about load balancing and horizontal scaling',
      'Study caching strategies: Redis, CDN, browser cache',
      'Design URL shortener end-to-end',
      'Review database sharding and replication'
    ],
    resources: [
      { title: 'System Design Primer', desc: 'GitHub repo with comprehensive system design notes', link: 'https://github.com/donnemartin/system-design-primer' },
      { title: 'Gaurav Sen — System Design', desc: 'Popular YouTube channel for system design', link: 'https://youtube.com' },
    ]
  },
  'DBMS': {
    title: 'Database Management',
    desc: 'SQL queries, normalization, indexing, transactions, and NoSQL concepts.',
    tasks: [
      'Review SQL joins, subqueries, and aggregations',
      'Understand normalization forms (1NF, 2NF, 3NF, BCNF)',
      'Learn about indexing: B-trees, hash indexes',
      'Study ACID properties and transaction isolation levels',
      'Compare SQL vs NoSQL use cases'
    ],
    resources: [
      { title: 'SQL Practice — HackerRank', desc: 'Interactive SQL challenges', link: 'https://hackerrank.com' },
      { title: 'CMU Database Course', desc: 'Andy Pavlo database systems course', link: 'https://youtube.com' },
    ]
  },
  'Linked Lists': {
    title: 'Linked Lists & Pointers',
    desc: 'Master singly/doubly linked lists, fast-slow pointers, and common patterns.',
    tasks: [
      'Implement linked list from scratch',
      'Solve: Reverse Linked List, Merge Two Lists, Detect Cycle',
      'Learn fast-slow pointer technique',
      'Practice: Remove Nth Node, Reorder List',
      'Implement LRU Cache using doubly linked list + hashmap'
    ],
    resources: [
      { title: 'Linked List — NeetCode', desc: 'Video solutions for top linked list problems', link: 'https://neetcode.io' },
    ]
  }
};

function getWeakAreas() {
  const profile = JSON.parse(localStorage.getItem('resumeProfile') || 'null');
  let weakAreas = ['Graphs', 'Dynamic Programming', 'DBMS'];
  if (profile && profile.gaps) {
    weakAreas = [];
    if (profile.gaps.includes('Data Structures') || profile.gaps.includes('Algorithms')) {
      weakAreas.push('Graphs', 'Dynamic Programming', 'Trees');
    }
    if (profile.gaps.includes('System Design')) weakAreas.push('System Design');
    if (profile.gaps.includes('SQL') || profile.gaps.includes('PostgreSQL') || profile.gaps.includes('MySQL')) weakAreas.push('DBMS');
    if (weakAreas.length < 3) weakAreas.push('Graphs', 'Dynamic Programming', 'DBMS');
    weakAreas = [...new Set(weakAreas)].slice(0, 5);
  }
  return weakAreas;
}

function render() {
  const weakAreas = getWeakAreas();

  // Weak tags
  document.getElementById('weakTags').innerHTML = weakAreas.map(w =>
    `<span class="weak-tag"><i class="fas fa-exclamation-triangle"></i> ${w}</span>`
  ).join('');

  // Timeline
  const timeline = document.getElementById('roadmapTimeline');
  let allResources = [];
  timeline.innerHTML = weakAreas.map((area, i) => {
    const plan = weeklyPlans[area] || { title: area, desc: `Focus on ${area} fundamentals.`, tasks: [`Study ${area} basics`, `Solve 5 ${area} problems`, 'Review common patterns'], resources: [] };
    allResources.push(...(plan.resources || []));
    const status = i === 0 ? 'current' : i < 0 ? 'completed' : '';
    const statusLabel = i === 0 ? '<span class="week-status active">This Week</span>' : i === 1 ? '<span class="week-status upcoming">Next Week</span>' : `<span class="week-status upcoming">Week ${i + 1}</span>`;
    return `<div class="week-block ${status}">
      <div class="week-dot"></div>
      <div class="week-card">
        <div class="week-header">
          <span class="week-label">Week ${i + 1}</span>
          ${statusLabel}
        </div>
        <h3>${plan.title}</h3>
        <p>${plan.desc}</p>
        <div class="week-tasks">
          ${plan.tasks.map(t => `<div class="week-task"><i class="fas fa-circle"></i> ${t}</div>`).join('')}
        </div>
      </div>
    </div>`;
  }).join('');

  // Resources
  const resGrid = document.getElementById('resourcesGrid');
  const uniqueRes = allResources.filter((r, i, arr) => arr.findIndex(x => x.title === r.title) === i);
  resGrid.innerHTML = uniqueRes.map(r => `
    <div class="resource-card">
      <h4>${r.title}</h4>
      <p>${r.desc}</p>
      <a href="${r.link}" target="_blank" class="resource-link">Visit Resource <i class="fas fa-external-link-alt"></i></a>
    </div>
  `).join('');
}

window.addEventListener('DOMContentLoaded', render);
