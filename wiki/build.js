#!/usr/bin/env node

/**
 * Research Wiki - Build Script
 * Generates JSON manifest from research/ folder
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Research is in the parent directory's research-agent folder
const RESEARCH_DIR = path.join(__dirname, '..', 'research');
const OUTPUT_FILE = path.join(__dirname, 'data', 'topics.json');

function findTopics() {
  const topicsPath = path.join(RESEARCH_DIR, 'topics');
  const topics = [];
  
  if (!fs.existsSync(topicsPath)) {
    return topics;
  }
  
  const topicDirs = fs.readdirSync(topicsPath);
  
  for (const topicDir of topicDirs) {
    const topicPath = path.join(topicsPath, topicDir);
    const stat = fs.statSync(topicPath);
    
    if (!stat.isDirectory()) continue;
    
    const indexJsonPath = path.join(topicPath, 'index.json');
    if (!fs.existsSync(indexJsonPath)) continue;
    
    const topicData = JSON.parse(fs.readFileSync(indexJsonPath, 'utf-8'));
    
    // Find papers
    const papersPath = path.join(topicPath, 'papers');
    const papers = [];
    if (fs.existsSync(papersPath)) {
      const paperFiles = fs.readdirSync(papersPath).filter(f => f.endsWith('.md'));
      for (const paperFile of paperFiles) {
        const paperContent = fs.readFileSync(path.join(papersPath, paperFile), 'utf-8');
        const paperMeta = extractPaperMetadata(paperContent);
        papers.push({
          file: `papers/${paperFile}`,
          ...paperMeta
        });
      }
    }
    
    // Check for implementation plan
    const implPath = path.join(topicPath, 'implementation-plan.md');
    const hasImplementation = fs.existsSync(implPath);
    
    // Determine agent attribution from topic data
    const agent = topicData.agent || 'research-agent';
    
    topics.push({
      slug: topicDir,
      name: topicData.topic || topicDir,
      description: topicData.description || '',
      created: topicData.created || new Date().toISOString().split('T')[0],
      status: topicData.status || 'research-complete',
      keyFindings: topicData.key_findings || [],
      papers,
      hasImplementation,
      agent
    });
  }
  
  return topics;
}

function extractPaperMetadata(content) {
  const metadata = {};
  
  // Extract title
  const titleMatch = content.match(/#{1,2}\s*[*]?Title[:]?\s*(.+)/i) || 
                     content.match(/#{1,2}\s*(.+?)(?:\n|$)/);
  if (titleMatch) {
    metadata.title = titleMatch[1].replace(/^\*\*|\*\*$/g, '').trim();
  }
  
  // Extract authors
  const authorMatch = content.match(/Authors?[:]\s*(.+)/i);
  if (authorMatch) {
    metadata.authors = authorMatch[1].trim();
  }
  
  // Extract date
  const dateMatch = content.match(/Date[:]\s*(.+)/i);
  if (dateMatch) {
    metadata.date = dateMatch[1].trim();
  }
  
  // Extract source
  const sourceMatch = content.match(/Source[:]\s*(.+)/i);
  if (sourceMatch) {
    metadata.source = sourceMatch[1].trim();
  }
  
  // Extract URL
  const urlMatch = content.match(/URL[:]\s*(https?:\S+)/i);
  if (urlMatch) {
    metadata.url = urlMatch[1].trim();
  }
  
  // Extract key findings
  const keyInsight = content.match(/Key (?:Findings|Insight)[:]?\s*([^\n#]+)/i);
  if (keyInsight) {
    metadata.keyInsight = keyInsight[1].trim();
  }
  
  return metadata;
}

function getRecentUpdates(topics) {
  return topics
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .slice(0, 5);
}

function build() {
  console.log('🔨 Building research wiki data...');
  
  const topics = findTopics();
  const recentUpdates = getRecentUpdates(topics);
  
  const data = {
    generated: new Date().toISOString(),
    topics,
    recentUpdates,
    totalTopics: topics.length
  };
  
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  
  console.log(`✅ Built ${topics.length} topics`);
  console.log(`📁 Output: ${OUTPUT_FILE}`);
  
  return data;
}

// Run if executed directly
build();

export { build, findTopics };
