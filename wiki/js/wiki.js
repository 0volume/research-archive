/**
 * Research Wiki - Client-side JavaScript
 * Handles rendering, routing, and search
 */

class WikiApp {
  constructor() {
    this.data = null;
    this.currentTopic = null;
    this.searchQuery = '';
    this.init();
  }

  async init() {
    // Check if we're on topic page
    const urlParams = new URLSearchParams(window.location.search);
    const topicSlug = urlParams.get('topic');
    
    if (topicSlug) {
      await this.loadTopic(topicSlug);
    } else {
      await this.loadHomepage();
    }
    
    // Setup search
    this.setupSearch();
    
    // Setup keyboard shortcuts
    this.setupKeyboard();
  }

  async loadHomepage() {
    try {
      const response = await fetch('./data/topics.json');
      this.data = await response.json();
      this.renderHomepage();
    } catch (error) {
      console.error('Failed to load wiki data:', error);
      this.showError('Failed to load research data');
    }
  }

  async loadTopic(slug) {
    try {
      const response = await fetch('./data/topics.json');
      this.data = await response.json();
      
      this.currentTopic = this.data.topics.find(t => t.slug === slug);
      
      if (!this.currentTopic) {
        this.showError('Topic not found');
        return;
      }
      
      this.renderTopic();
    } catch (error) {
      console.error('Failed to load topic:', error);
      this.showError('Failed to load topic');
    }
  }

  renderHomepage() {
    const main = document.getElementById('main');
    
    const topicsHTML = this.data.topics.map(topic => this.renderTopicCard(topic)).join('');
    
    const recentUpdatesHTML = this.data.recentUpdates.map(update => `
      <div class="update-item">
        <div class="update-date">${this.formatDate(update.created)}</div>
        <a href="?topic=${update.slug}" class="update-title">${update.name}</a>
      </div>
    `).join('');

    main.innerHTML = `
      <div class="search-container">
        <input type="text" class="search-input" id="search" placeholder="Search topics, papers, or findings...">
      </div>
      
      <h2 class="section-title">Research Topics</h2>
      <p class="section-subtitle">${this.data.totalTopics} topics available</p>
      
      <div class="topics-grid" id="topics-grid">
        ${topicsHTML}
      </div>
      
      <h2 class="section-title">Recent Updates</h2>
      <div class="recent-updates">
        ${recentUpdatesHTML}
      </div>
    `;
    
    // Re-setup search after render
    this.setupSearch();
  }

  renderTopicCard(topic) {
    const findingsTags = topic.keyFindings.slice(0, 3).map(f => 
      `<span class="key-finding-tag">${this.truncate(f, 40)}</span>`
    ).join('');
    
    return `
      <a href="?topic=${topic.slug}" class="topic-card">
        <div class="topic-card-header">
          <h3 class="topic-name">${topic.name}</h3>
          <span class="topic-status ${topic.status === 'research-complete' ? 'status-complete' : 'status-research'}">
            ${topic.status === 'research-complete' ? '✓ Complete' : 'Research'}
          </span>
        </div>
        <p class="topic-description">${topic.description}</p>
        <div class="key-findings">${findingsTags}</div>
        <div class="topic-meta">
          <span>📄 ${topic.papers.length} papers</span>
          <span>📅 ${this.formatDate(topic.created)}</span>
          ${topic.hasImplementation ? '<span>🚀 Implementation</span>' : ''}
        </div>
        <div class="agent-badge">
          🤖 Added by ${topic.agent}
        </div>
      </a>
    `;
  }

  renderTopic() {
    const main = document.getElementById('main');
    const topic = this.currentTopic;
    
    // Find prev/next topics
    const sortedTopics = [...this.data.topics].sort((a, b) => 
      new Date(a.created) - new Date(b.created)
    );
    const currentIndex = sortedTopics.findIndex(t => t.slug === topic.slug);
    const prevTopic = currentIndex > 0 ? sortedTopics[currentIndex - 1] : null;
    const nextTopic = currentIndex < sortedTopics.length - 1 ? sortedTopics[currentIndex + 1] : null;
    
    // Render papers
    const papersHTML = topic.papers.map((paper, i) => `
      <div class="paper-item">
        <h3 class="paper-title">
          ${paper.url ? `<a href="${paper.url}" target="_blank" rel="noopener">${paper.title || `Paper #${i+1}`}</a>` : (paper.title || `Paper #${i+1}`)}
        </h3>
        <div class="paper-meta">
          ${paper.authors ? `<span>👤 ${paper.authors}</span>` : ''}
          ${paper.date ? `<span>📅 ${paper.date}</span>` : ''}
          ${paper.source ? `<span>📚 ${paper.source}</span>` : ''}
        </div>
        ${paper.keyInsight ? `<div class="paper-insight">💡 ${paper.keyInsight}</div>` : ''}
      </div>
    `).join('');
    
    // Render phases if available
    let phasesHTML = '';
    if (topic.phases) {
      phasesHTML = `
        <div class="content-section">
          <div class="section-header">
            <h2>📈 Implementation Phases</h2>
          </div>
          <div class="phases-timeline">
            ${topic.phases.map(phase => `
              <div class="phase-item">
                <div class="phase-number">${phase.phase}</div>
                <div class="phase-content">
                  <h3>${phase.name}</h3>
                  <div class="phase-weeks">Weeks ${phase.weeks}</div>
                  <div class="phase-deliverable">${phase.deliverable}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Render key findings
    const findingsHTML = topic.keyFindings ? `
      <div class="content-section">
        <div class="section-header">
          <h2>🔑 Key Findings</h2>
        </div>
        <div class="findings-list">
          ${topic.keyFindings.map(finding => `
            <div class="finding-item">
              <span class="finding-icon">✓</span>
              <span>${finding}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    main.innerHTML = `
      <div class="topic-detail">
        <nav class="breadcrumbs">
          <a href="./index.html">Home</a>
          <span>›</span>
          <span>${topic.name}</span>
        </nav>
        
        <div class="topic-header">
          <h1 class="topic-title">${topic.name}</h1>
          <p class="topic-date">Created ${this.formatDate(topic.created)} • ${topic.papers.length} papers</p>
          <p class="topic-description" style="margin-top: 12px;">${topic.description}</p>
          <div class="agent-badge" style="margin-top: 12px;">
            🤖 Research by ${topic.agent}
          </div>
        </div>
        
        ${topic.hasImplementation ? `
        <div class="content-section implementation-section">
          <div class="section-header">
            <h2>🚀 Implementation Plan Available</h2>
          </div>
          <a href="./topics/${topic.slug}/implementation-plan.md" class="implementation-link" target="_blank">
            📋 View Implementation Plan →
          </a>
        </div>
        ` : ''}
        
        ${findingsHTML}
        
        <div class="content-section">
          <div class="section-header">
            <h2>📄 Research Papers</h2>
            <span class="section-count">${topic.papers.length} papers</span>
          </div>
          <div class="papers-list">
            ${papersHTML}
          </div>
        </div>
        
        ${phasesHTML}
        
        <nav class="topic-nav">
          ${prevTopic ? `
            <a href="?topic=${prevTopic.slug}" class="nav-link">
              ← Previous: ${prevTopic.name}
            </a>
          ` : '<span></span>'}
          ${nextTopic ? `
            <a href="?topic=${nextTopic.slug}" class="nav-link next">
              Next: ${nextTopic.name} →
            </a>
          ` : ''}
        </nav>
      </div>
    `;
  }

  setupSearch() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.filterTopics();
    });
  }

  filterTopics() {
    const grid = document.getElementById('topics-grid');
    if (!grid || !this.data) return;
    
    const cards = grid.querySelectorAll('.topic-card');
    
    cards.forEach(card => {
      const name = card.querySelector('.topic-name').textContent.toLowerCase();
      const description = card.querySelector('.topic-description').textContent.toLowerCase();
      const text = name + ' ' + description;
      
      if (this.searchQuery === '' || text.includes(this.searchQuery)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      // Focus search with /
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('search')?.focus();
      }
      
      // Go home with Escape
      if (e.key === 'Escape') {
        const searchInput = document.getElementById('search');
        if (searchInput === document.activeElement) {
          searchInput.blur();
        } else if (!window.location.search.includes('topic=')) {
          // Already on home
        } else {
          window.location.href = './index.html';
        }
      }
    });
  }

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  truncate(str, length) {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
  }

  showError(message) {
    const main = document.getElementById('main');
    main.innerHTML = `
      <div class="empty-state">
        <h3>⚠️ ${message}</h3>
        <p><a href="./index.html" style="color: var(--accent-blue);">Return to homepage</a></p>
      </div>
    `;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.wikiApp = new WikiApp();
});
