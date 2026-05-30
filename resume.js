const skillKeywords = {
  'javascript': 'JavaScript', 'js': 'JavaScript', 'typescript': 'TypeScript', 'ts': 'TypeScript',
  'python': 'Python', 'java': 'Java', 'c++': 'C++', 'cpp': 'C++', 'c#': 'C#', 'go': 'Go', 'golang': 'Go',
  'rust': 'Rust', 'ruby': 'Ruby', 'php': 'PHP', 'swift': 'Swift', 'kotlin': 'Kotlin',
  'react': 'React', 'reactjs': 'React', 'angular': 'Angular', 'vue': 'Vue.js', 'vuejs': 'Vue.js',
  'next.js': 'Next.js', 'nextjs': 'Next.js', 'node': 'Node.js', 'nodejs': 'Node.js', 'express': 'Express.js',
  'django': 'Django', 'flask': 'Flask', 'spring': 'Spring Boot', 'springboot': 'Spring Boot',
  'sql': 'SQL', 'mysql': 'MySQL', 'postgresql': 'PostgreSQL', 'postgres': 'PostgreSQL',
  'mongodb': 'MongoDB', 'redis': 'Redis', 'firebase': 'Firebase', 'dynamodb': 'DynamoDB',
  'aws': 'AWS', 'azure': 'Azure', 'gcp': 'GCP', 'docker': 'Docker', 'kubernetes': 'Kubernetes', 'k8s': 'Kubernetes',
  'git': 'Git', 'github': 'GitHub', 'linux': 'Linux', 'ci/cd': 'CI/CD', 'jenkins': 'Jenkins',
  'html': 'HTML', 'css': 'CSS', 'sass': 'SASS', 'tailwind': 'Tailwind CSS',
  'graphql': 'GraphQL', 'rest': 'REST APIs', 'api': 'REST APIs',
  'machine learning': 'Machine Learning', 'ml': 'Machine Learning', 'deep learning': 'Deep Learning',
  'tensorflow': 'TensorFlow', 'pytorch': 'PyTorch', 'data science': 'Data Science',
  'dsa': 'DSA', 'data structures': 'Data Structures', 'algorithms': 'Algorithms',
  'system design': 'System Design', 'microservices': 'Microservices',
  'agile': 'Agile', 'scrum': 'Scrum', 'jira': 'JIRA',
  'figma': 'Figma', 'ui/ux': 'UI/UX',
};

const importantSkills = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'AWS',
  'Docker', 'Kubernetes', 'System Design', 'Data Structures', 'Algorithms',
  'Git', 'REST APIs', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Machine Learning',
  'CI/CD', 'Microservices', 'GraphQL'
];

function loadSample() {
  document.getElementById('resumeText').value = `Aditya Sharma — Software Engineer
  
Experience: 1.5 years at TechStartup Inc.
- Built REST APIs using Node.js and Express
- Developed frontend dashboards with React and TypeScript
- Managed PostgreSQL databases, wrote complex SQL queries
- Implemented CI/CD pipelines using GitHub Actions

Education: B.Tech in Computer Science, IIT Delhi (2023)
- GPA: 8.5/10
- Relevant coursework: Data Structures, Algorithms, DBMS, Operating Systems

Skills: JavaScript, TypeScript, React, Node.js, Express, Python, SQL, PostgreSQL, MongoDB, Git, Docker, HTML, CSS, REST APIs, Agile

Projects:
- E-commerce Platform: Full-stack app with React + Node.js, handling 10K+ users
- Chat Application: Real-time messaging with WebSocket, Redis caching
- Portfolio Website: Responsive design with 95+ Lighthouse score

Achievements:
- Led a team of 4 engineers to deliver MVP in 6 weeks
- Reduced API response time by 40% through query optimization
- Open source contributor with 200+ GitHub stars`;
}

function analyzeResume() {
  const text = document.getElementById('resumeText').value.trim();
  if (!text || text.length < 50) {
    alert('Please paste your resume text (at least 50 characters).');
    return;
  }
  document.getElementById('uploadSection').style.display = 'none';
  document.getElementById('loadingSection').style.display = 'block';

  setTimeout(() => {
    const analysis = performAnalysis(text);
    displayResults(analysis);
    saveProfile(analysis);
  }, 2000);
}

function performAnalysis(text) {
  const lower = text.toLowerCase();
  const foundSkills = new Set();
  Object.entries(skillKeywords).forEach(([key, value]) => {
    if (lower.includes(key)) foundSkills.add(value);
  });

  const gaps = importantSkills.filter(s => !foundSkills.has(s)).slice(0, 8);

  // Extract name (first line heuristic)
  const firstLine = text.split('\n')[0].trim();
  const name = firstLine.split(/[—\-|,]/)[0].trim().substring(0, 40);

  // Experience detection
  const expMatch = lower.match(/(\d+\.?\d*)\s*(year|yr)/);
  const years = expMatch ? parseFloat(expMatch[1]) : 0;

  // Score calculation
  let score = 40;
  score += Math.min(foundSkills.size * 2.5, 30);
  score += years > 0 ? Math.min(years * 3, 15) : 0;
  if (lower.includes('project')) score += 5;
  if (lower.includes('achievement') || lower.includes('led') || lower.includes('improved')) score += 5;
  if (lower.includes('education') || lower.includes('b.tech') || lower.includes('b.s')) score += 5;
  score = Math.min(95, Math.round(score));

  const strengths = [];
  if (foundSkills.size > 8) strengths.push('Diverse technical skill set');
  if (lower.includes('led') || lower.includes('team')) strengths.push('Demonstrated leadership experience');
  if (lower.includes('api') || lower.includes('backend')) strengths.push('Backend/API development experience');
  if (lower.includes('react') || lower.includes('frontend')) strengths.push('Frontend development skills');
  if (lower.includes('improved') || lower.includes('reduced') || lower.includes('increased')) strengths.push('Quantifiable achievements present');
  if (strengths.length < 3) strengths.push('Clear resume structure', 'Relevant technical background');

  const improvements = [];
  if (!lower.includes('system design')) improvements.push('Add system design experience or projects');
  if (!lower.includes('aws') && !lower.includes('azure') && !lower.includes('gcp')) improvements.push('Include cloud platform experience');
  if (!lower.includes('test') && !lower.includes('testing')) improvements.push('Mention testing practices (unit/integration)');
  if (gaps.includes('Docker') || gaps.includes('Kubernetes')) improvements.push('Add containerization/DevOps skills');
  if (improvements.length < 3) improvements.push('Consider adding open source contributions', 'Include more quantitative metrics');

  // Determine role
  let role = 'Software Engineer';
  if (lower.includes('frontend') || lower.includes('react') && !lower.includes('backend')) role = 'Frontend Engineer';
  if (lower.includes('backend') || lower.includes('api') && !lower.includes('react')) role = 'Backend Engineer';
  if (lower.includes('full stack') || lower.includes('fullstack')) role = 'Full Stack Engineer';
  if (lower.includes('data scien')) role = 'Data Scientist';
  if (lower.includes('machine learning') || lower.includes(' ml ')) role = 'ML Engineer';
  if (lower.includes('product manag')) role = 'Product Manager';

  return { name, role, score, skills: [...foundSkills], gaps, strengths, improvements, years };
}

function displayResults(analysis) {
  document.getElementById('loadingSection').style.display = 'none';
  document.getElementById('resultsSection').style.display = 'block';

  document.getElementById('profileName').textContent = analysis.name || 'Candidate';
  document.getElementById('profileRole').textContent = analysis.role;

  // Animate score
  const circ = document.getElementById('profileCircle');
  const circumf = 264;
  setTimeout(() => {
    circ.style.transition = 'stroke-dashoffset 1.5s ease';
    circ.style.strokeDashoffset = circumf - (analysis.score / 100) * circumf;
  }, 200);
  animateNumber('profileScoreNum', analysis.score, 1500);

  // Skills
  const skillsEl = document.getElementById('skillsList');
  skillsEl.innerHTML = analysis.skills.map(s => `<span class="skill-tag found">${s}</span>`).join('');

  // Gaps
  const gapsEl = document.getElementById('gapsList');
  gapsEl.innerHTML = analysis.gaps.map(s => `<span class="skill-tag gap">${s}</span>`).join('');

  // Strengths & Improvements
  document.getElementById('strengthsList').innerHTML = analysis.strengths.map(s => `<li>${s}</li>`).join('');
  document.getElementById('improvementsList').innerHTML = analysis.improvements.map(s => `<li>${s}</li>`).join('');

  // Recommended rounds
  const rounds = [
    { icon: '💻', title: 'DSA Round', desc: 'Core data structures & algorithms', focus: analysis.gaps.includes('Data Structures') ? 'Focus: Basics' : 'Focus: Medium-Hard' },
    { icon: '🏗️', title: 'System Design', desc: 'Architecture & scalability', focus: analysis.gaps.includes('System Design') ? 'Priority: High' : 'Standard prep' },
    { icon: '🧠', title: 'Behavioral', desc: 'Leadership & teamwork stories', focus: analysis.strengths.includes('Demonstrated leadership experience') ? 'Strength area' : 'Needs practice' },
    { icon: '🎯', title: 'HR Round', desc: 'Culture fit & career goals', focus: 'Standard prep' },
  ];
  document.getElementById('recRounds').innerHTML = rounds.map(r => `
    <div class="rec-round">
      <span class="round-icon">${r.icon}</span>
      <h4>${r.title}</h4>
      <p>${r.desc}</p>
      <span class="round-focus">${r.focus}</span>
    </div>
  `).join('');
}

function resetAnalysis() {
  document.getElementById('resultsSection').style.display = 'none';
  document.getElementById('uploadSection').style.display = 'block';
}

function saveProfile(analysis) {
  localStorage.setItem('resumeProfile', JSON.stringify({
    ...analysis,
    analyzedAt: new Date().toISOString()
  }));
}

function animateNumber(id, target, duration) {
  const el = document.getElementById(id);
  const start = performance.now();
  function update(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
