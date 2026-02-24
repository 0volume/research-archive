/**
 * Research Wiki - Client-side JavaScript
 * Handles rendering, routing, search, and filtering
 */

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Simple markdown to HTML converter
function parseMarkdown(text) {
  if (!text) return '';
  
  let html = text
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks (```lang)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Lists
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
    // Wrap consecutive li in ul
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Checkboxes
    .replace(/- \[ \] (.*$)/gm, '<div class="checkbox"><span class="unchecked">☐</span> $1</div>')
    .replace(/- \[x\] (.*$)/gm, '<div class="checkbox"><span class="checked">☑</span> $1</div>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p>')
    // Line breaks
    .replace(/\n/g, '<br>');
  
  // Wrap in paragraph if not starting with HTML tag
  if (!html.startsWith('<')) {
    html = '<p>' + html + '</p>';
  }
  
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  
  return html;
}

class WikiApp {
  constructor() {
    this.data = null;
    this.currentTopic = null;
    this.searchQuery = '';
    this.activeFilter = 'all';
    // Local data path for GitHub Pages
    this.baseUrl = './';
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
    
    // Setup search with debounce
    this.setupSearch();
    
    // Setup keyboard shortcuts
    this.setupKeyboard();
  }

  async loadHomepage() {
    try {
      const response = await fetch('data/topics.json');
      if (!response.ok) throw new Error('Failed to fetch');
      this.data = await response.json();
      this.renderHomepage();
    } catch (error) {
      console.error('Failed to load wiki data:', error);
      this.showError('Failed to load research data. Please try again later.');
    }
  }

  async loadTopic(slug) {
    try {
      const response = await fetch('data/topics.json');
      if (!response.ok) throw new Error('Failed to fetch');
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
    const totalTopics = this.data.topics.length;
    
    const topicsHTML = this.data.topics.map(topic => this.renderTopicCard(topic)).join('');
    
    const recentUpdatesHTML = this.data.recentUpdates.map(update => `
      <div class="update-item">
        <div class="update-date">${this.formatDate(update.created)}</div>
        <a href="?topic=${update.slug}" class="update-title">${update.name}</a>
      </div>
    `).join('');

    main.innerHTML = `
      <div class="search-container">
        <input type="text" class="search-input" id="search" placeholder="Search topics, papers, or findings..." aria-label="Search topics">
        <span class="search-hint">Press / to search</span>
      </div>
      
      <div class="filter-container">
        <div class="filter-buttons" role="group" aria-label="Filter by status">
          <button class="filter-btn active" data-filter="all" aria-pressed="true">All</button>
          <button class="filter-btn" data-filter="research" aria-pressed="false">Research</button>
          <button class="filter-btn" data-filter="complete" aria-pressed="false">Complete</button>
          <button class="filter-btn" data-filter="implemented" aria-pressed="false">Implemented</button>
        </div>
        <div class="result-count" id="result-count">
          Showing <span class="count">${totalTopics}</span> of <span class="total">${totalTopics}</span> topics
        </div>
      </div>
      
      <h2 class="section-title">Research Topics</h2>
      <p class="section-subtitle">${totalTopics} topics available</p>
      
      <div class="topics-grid" id="topics-grid">
        ${topicsHTML}
      </div>
      
      <div class="empty-state" id="empty-state" style="display: none;">
        <div class="empty-state-icon">🔍</div>
        <h3>No topics found</h3>
        <p id="empty-state-message">Try adjusting your search or filter</p>
      </div>
      
      <h2 class="section-title" style="margin-top: 48px;">Recent Updates</h2>
      <div class="recent-updates">
        ${recentUpdatesHTML}
      </div>
    `;
    
    // Update sidebar stats
    if (this.data.topics) {
      const stats = {
        'stat-topics': this.data.topics.length,
        'stat-papers': this.data.topics.reduce((sum, t) => sum + (t.papers?.length || 0), 0),
        'stat-complete': this.data.topics.filter(t => t.status === 'research-complete').length,
        'stat-impl': this.data.topics.filter(t => t.hasImplementation).length
      };
      
      // Animate stat numbers
      Object.entries(stats).forEach(([id, target]) => {
        const el = document.getElementById(id);
        if (el) this.animateCount(el, target);
      });
    }
    
    // Update sidebar recent updates
    const sidebarUpdates = document.getElementById('sidebar-updates');
    if (sidebarUpdates && this.data.recentUpdates) {
      sidebarUpdates.innerHTML = this.data.recentUpdates.slice(0, 3).map(update => `
        <div class="update-item">
          <div class="update-date">${this.formatDate(update.created)}</div>
          <a href="?topic=${update.slug}" class="update-title">${update.name}</a>
        </div>
      `).join('');
    }
    
    // Setup filter buttons
    this.setupFilters();
    
    // Re-setup search after render
    this.setupSearch();
  }

  renderTopicCard(topic) {
    const findingsTags = (topic.keyFindings || []).slice(0, 3).map(f => 
      `<span class="key-finding-tag">${this.truncate(f, 40)}</span>`
    ).join('');
    
    // Determine status class
    let statusClass = 'status-research';
    let statusText = 'Research';
    if (topic.status === 'research-complete') {
      statusClass = 'status-complete';
      statusText = '✓ Complete';
    }
    
    // Build data attributes for filtering
    const filterStatus = topic.status === 'research-complete' ? 'complete' : 'research';
    const filterImplemented = topic.hasImplementation ? 'implemented' : '';
    
    return `
      <a href="?topic=${topic.slug}" class="topic-card" data-filter-status="${filterStatus}" data-filter-implemented="${filterImplemented}">
        <div class="topic-card-header">
          <h3 class="topic-name">${topic.name}</h3>
          <span class="topic-status ${statusClass}">
            ${statusText}
          </span>
        </div>
        <p class="topic-description">${topic.description || ''}</p>
        <div class="key-findings">${findingsTags}</div>
        <div class="topic-meta">
          <span>📄 ${(topic.papers || []).length} papers</span>
          <span>📅 ${this.formatDate(topic.created)}</span>
          ${topic.hasImplementation ? '<span>🚀 Implementation</span>' : ''}
        </div>
        <div class="agent-badge">
          🤖 Added by ${topic.agent || 'Research Agent'}
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
    const papersList = topic.papers || [];
    const papersHTML = papersList.map((paper, i) => `
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
          <p class="topic-date">Created ${this.formatDate(topic.created)} • ${papersList.length} papers</p>
          <p class="topic-description" style="margin-top: 12px;">${topic.description}</p>
          <div class="agent-badge" style="margin-top: 12px;">
            🤖 Research by ${topic.agent}
          </div>
        </div>
        
        ${topic.hasImplementation && topic.implementationPlan ? `
        <div class="content-section implementation-section">
          <div class="section-header">
            <h2>🚀 Implementation Plan</h2>
            <button class="expand-all-btn" onclick="wikiApp.toggleAllSections()">Expand All</button>
          </div>
          <div class="implementation-content">
            ${this.renderImplementationPlan(topic.implementationPlan)}
          </div>
        </div>
        ` : ''}
        
        ${findingsHTML}
        
        <div class="content-section">
          <div class="section-header">
            <h2>📄 Research Papers</h2>
            <span class="section-count">${papersList.length} papers</span>
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
    
    // Debounced search
    const debouncedFilter = debounce(() => {
      this.filterTopics();
    }, 200);
    
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      debouncedFilter();
    });
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        
        // Set active filter
        this.activeFilter = btn.dataset.filter;
        
        // Apply filter
        this.filterTopics();
      });
    });
  }

  filterTopics() {
    const grid = document.getElementById('topics-grid');
    const emptyState = document.getElementById('empty-state');
    const emptyMessage = document.getElementById('empty-state-message');
    const resultCount = document.getElementById('result-count');
    
    if (!grid || !this.data) return;
    
    const cards = grid.querySelectorAll('.topic-card');
    let visibleCount = 0;
    const totalTopics = this.data.topics.length;
    
    cards.forEach(card => {
      const name = card.querySelector('.topic-name').textContent.toLowerCase();
      const description = card.querySelector('.topic-description').textContent.toLowerCase();
      
      // Get papers for this topic
      const topicSlug = card.getAttribute('href').split('=')[1];
      const topic = this.data.topics.find(t => t.slug === topicSlug);
      
      // Build searchable text from papers and key findings
      let papersText = '';
      if (topic && topic.papers) {
        papersText = topic.papers.map(p => 
          (p.title || '') + ' ' + (p.authors || '') + ' ' + (p.keyInsight || '')
        ).join(' ').toLowerCase();
      }
      
      let findingsText = '';
      if (topic && topic.keyFindings) {
        findingsText = topic.keyFindings.join(' ').toLowerCase();
      }
      
      const fullText = name + ' ' + description + ' ' + papersText + ' ' + findingsText;
      
      // Check filter
      const filterStatus = card.dataset.filterStatus;
      const filterImplemented = card.dataset.filterImplemented;
      
      let matchesFilter = true;
      if (this.activeFilter === 'research') {
        matchesFilter = filterStatus === 'research';
      } else if (this.activeFilter === 'complete') {
        matchesFilter = filterStatus === 'complete';
      } else if (this.activeFilter === 'implemented') {
        matchesFilter = filterImplemented === 'implemented';
      }
      
      // Check search query
      const matchesSearch = this.searchQuery === '' || fullText.includes(this.searchQuery);
      
      if (matchesFilter && matchesSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });
    
    // Update result count
    if (resultCount) {
      resultCount.innerHTML = `Showing <span class="count">${visibleCount}</span> of <span class="total">${totalTopics}</span> topics`;
    }
    
    // Show/hide empty state
    if (emptyState && emptyMessage) {
      if (visibleCount === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        if (this.searchQuery) {
          emptyMessage.textContent = `No topics found matching "${this.searchQuery}"`;
        } else {
          emptyMessage.textContent = 'No topics match the selected filter';
        }
      } else {
        grid.style.display = 'grid';
        emptyState.style.display = 'none';
      }
    }
  }

  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      // Focus search with /
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('search')?.focus();
      }
      
      // Go back/home with Escape
      if (e.key === 'Escape') {
        const searchInput = document.getElementById('search');
        if (searchInput === document.activeElement) {
          searchInput.blur();
          return;
        }
        
        // If on topic page, go back to wiki home
        if (window.location.search.includes('topic=')) {
          window.location.href = './index.html';
        }
        // If on wiki home, go to main archive
        else {
          window.location.href = '../';
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

  animateCount(element, target) {
    const duration = 800;
    const start = 0;
    const startTime = performance.now();
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
        // Add pulse animation on complete
        element.classList.add('counting');
        setTimeout(() => element.classList.remove('counting'), 300);
      }
    };
    
    requestAnimationFrame(update);
  }

  renderImplementationPlan(markdown) {
    if (!markdown) return '<p>No implementation plan available.</p>';
    
    // Parse markdown to HTML
    let html = parseMarkdown(markdown);
    
    // Make headers collapsible
    html = html.replace(/<h2>(.*?)<\/h2>/g, (match, title) => {
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `<div class="impl-section">
        <button class="impl-toggle" onclick="wikiApp.toggleSection('${id}')" aria-expanded="false">
          <span class="toggle-icon">▶</span>
          <span class="toggle-title">${title}</span>
        </button>
        <div class="impl-section-content" id="${id}">`;
    });
    
    // Split by sections and rebuild
    const sections = html.split(/(<div class="impl-section">)/);
    let result = '';
    let inSection = false;
    let sectionDepth = 0;
    
    for (const part of sections) {
      if (part.includes('impl-section">')) {
        result += part;
        inSection = true;
        sectionDepth++;
      } else if (inSection && part.includes('</h2>')) {
        result += part;
      } else if (inSection && (part.includes('<h2>') || part.includes('<h3>') || part.includes('<hr>'))) {
        // Close previous section and start new
        result += '</div></div>' + part;
      } else if (inSection && sectionDepth > 0) {
        result += part;
      } else {
        result += part;
      }
    }
    
    // Close any open sections
    if (inSection) {
      result += '</div></div>'.repeat(sectionDepth);
    }
    
    return result;
  }

  toggleSection(id) {
    const content = document.getElementById(id);
    const button = content.previousElementSibling;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      content.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
      button.querySelector('.toggle-icon').textContent = '▶';
    } else {
      content.style.display = 'block';
      button.setAttribute('aria-expanded', 'true');
      button.querySelector('.toggle-icon').textContent = '▼';
    }
  }

  toggleAllSections() {
    const allContents = document.querySelectorAll('.impl-section-content');
    const allButtons = document.querySelectorAll('.impl-toggle');
    const anyExpanded = Array.from(allContents).some(c => c.style.display !== 'none');
    
    allContents.forEach((content, i) => {
      content.style.display = anyExpanded ? 'none' : 'block';
      allButtons[i].setAttribute('aria-expanded', anyExpanded ? 'false' : 'true');
      allButtons[i].querySelector('.toggle-icon').textContent = anyExpanded ? '▶' : '▼';
    });
  }

  showError(message) {
    const main = document.getElementById('main');
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>${message}</h3>
        <p><a href="./index.html" style="color: var(--accent-blue);">Return to homepage</a></p>
      </div>
    `;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.wikiApp = new WikiApp();
});
