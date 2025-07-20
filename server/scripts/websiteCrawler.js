const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

/**
 * Website Crawler for Nimitech IT LLC
 * Crawls key sections of the website to build AI knowledge base
 * Uses fetch and cheerio for lightweight, fast crawling
 */

class WebsiteCrawler {
  constructor(baseUrl = 'https://nimitechit.com') {
    this.baseUrl = baseUrl;
    this.knowledgeBase = {
      websiteId: 'nimitechit',
      lastUpdated: new Date().toISOString(),
      sections: {}
    };
  }

  async init() {
    console.log('🚀 Starting website crawler...');
    // No browser initialization needed with fetch/cheerio
  }

  async crawl() {
    console.log('🚀 Starting website crawl for Nimitech IT LLC...');
    
    try {
      // Crawl different sections
      await this.crawlPage('/', 'home');
      await this.crawlPage('/about', 'about');
      await this.crawlPage('/services', 'services');
      await this.crawlPage('/contact', 'contact');
      await this.crawlPage('/blog', 'blog');
      await this.crawlPage('/faq', 'faq');
      
      // Save knowledge base
      await this.saveKnowledgeBase();
      
      console.log('✅ Website crawl completed successfully!');
      console.log(`📊 Knowledge base stats:`);
      Object.keys(this.knowledgeBase.sections).forEach(section => {
        const data = this.knowledgeBase.sections[section];
        console.log(`  - ${section}: ${data.paragraphs ? data.paragraphs.length : 0} paragraphs, ${data.links ? data.links.length : 0} links`);
      });
      
    } catch (error) {
      console.error('❌ Error during crawl:', error);
    }
  }

  async crawlPage(urlPath, sectionName) {
    try {
      console.log(`📄 Crawling ${sectionName}: ${urlPath}`);
      const url = `${this.baseUrl}${urlPath}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Remove unwanted elements
      $('script, style, nav, footer, .cookie-banner, .popup').remove();
      
      // Extract content
      const content = {
        title: $('title').text().trim(),
        headings: [],
        paragraphs: [],
        links: [],
        images: [],
        lists: [],
        fullText: ''
      };
      
      // Extract headings
      $('h1, h2, h3, h4, h5, h6').each((i, el) => {
        const $el = $(el);
        const text = $el.text().trim();
        if (text) {
          content.headings.push({
            level: el.tagName.toLowerCase(),
            text: text
          });
        }
      });
      
      // Extract paragraphs
      $('p').each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 20) {
          content.paragraphs.push(text);
        }
      });
      
      // Extract links
      $('a[href]').each((i, el) => {
        const $el = $(el);
        const text = $el.text().trim();
        const href = $el.attr('href');
        if (text && href) {
          content.links.push({ text, href });
        }
      });
      
      // Extract images
      $('img[alt]').each((i, el) => {
        const $el = $(el);
        const alt = $el.attr('alt');
        const src = $el.attr('src');
        if (alt && src) {
          content.images.push({ alt, src });
        }
      });
      
      // Extract lists
      $('ul, ol').each((i, el) => {
        const listItems = [];
        $(el).find('li').each((j, li) => {
          const text = $(li).text().trim();
          if (text) {
            listItems.push(text);
          }
        });
        if (listItems.length > 0) {
          content.lists.push(listItems);
        }
      });
      
      // Extract contact info for contact page
      if (sectionName === 'contact') {
        content.emails = [];
        content.phones = [];
        content.socialLinks = [];
        
        // Extract emails
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const pageText = $.text();
        const emails = pageText.match(emailRegex) || [];
        content.emails = [...new Set(emails)];
        
        // Extract phone numbers
        const phoneRegex = /(?:\+?1[-.]?)?(?:\(?[0-9]{3}\)?[-.]?)?[0-9]{3}[-.]?[0-9]{4}/g;
        const phones = pageText.match(phoneRegex) || [];
        content.phones = [...new Set(phones)];
        
        // Extract social media links
        $('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"], a[href*="instagram"], a[href*="youtube"]').each((i, el) => {
          const $el = $(el);
          const href = $el.attr('href');
          const text = $el.text().trim();
          
          content.socialLinks.push({
            platform: href.includes('facebook') ? 'Facebook' :
                      href.includes('twitter') ? 'Twitter' :
                      href.includes('linkedin') ? 'LinkedIn' :
                      href.includes('instagram') ? 'Instagram' :
                      href.includes('youtube') ? 'YouTube' : 'Social',
            url: href,
            text: text
          });
        });
      }
      
      // Extract FAQ items for FAQ page
      if (sectionName === 'faq') {
        content.faqItems = [];
        
        $('dt, .faq-question, .question, h3, h4').each((i, el) => {
          const $el = $(el);
          const question = $el.text().trim();
          
          if (question.length > 10 && question.includes('?')) {
            let answer = '';
            const nextElement = $el.next();
            if (nextElement.length) {
              answer = nextElement.text().trim();
            }
            
            content.faqItems.push({
              question: question,
              answer: answer
            });
          }
        });
      }
      
      // Extract full text from main content area
      const mainContent = $('main').length ? $('main') : $('body');
      content.fullText = mainContent.text().replace(/\s+/g, ' ').trim();
      
      this.knowledgeBase.sections[sectionName] = {
        url,
        crawledAt: new Date().toISOString(),
        ...content
      };
      
      console.log(`✅ Successfully crawled ${sectionName}`);
      return content;
      
    } catch (error) {
      console.error(`❌ Error crawling ${sectionName}:`, error.message);
      this.knowledgeBase.sections[sectionName] = {
        url: `${this.baseUrl}${urlPath}`,
        crawledAt: new Date().toISOString(),
        error: error.message
      };
      return null;
    }
  }

  async saveKnowledgeBase() {
    try {
      const outputPath = path.join(__dirname, '..', 'data', 'knowledgeBase.json');
      
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      await fs.mkdir(dir, { recursive: true });
      
      // Save knowledge base
      await fs.writeFile(outputPath, JSON.stringify(this.knowledgeBase, null, 2));
      
      console.log(`💾 Knowledge base saved to: ${outputPath}`);
      
    } catch (error) {
      console.error('Error saving knowledge base:', error);
    }
  }
}

// Run the crawler
if (require.main === module) {
  const crawler = new WebsiteCrawler();
  crawler.crawl().then(() => {
    console.log('🎉 Crawling process completed!');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Crawling failed:', error);
    process.exit(1);
  });
}

module.exports = WebsiteCrawler;
