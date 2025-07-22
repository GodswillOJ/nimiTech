const { getImageUrl } = require('../utils/envUtils');
const { formatDate } = require('../utils/dateUtils');

/**
 * Generate responsive HTML email template for blog posts
 * Uses table-based layout for maximum email client compatibility
 */
async function generateEmailTemplate(blogPost) {
  const featuredImageUrl = blogPost.featuredImage ? getImageUrl(blogPost.featuredImage) : null;
  const authorAvatarUrl = blogPost.author?.avatar ? getImageUrl(blogPost.author.avatar) : null;
  const blogUrl = `${process.env.CLIENT_URL}/blog/${blogPost.slug}`;
  const companyLogoUrl = `${process.env.CLIENT_URL}/assets/logo.png`;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${blogPost.title}</title>
    <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        
        /* Base styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #f8f9fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        
        .header {
            background: linear-gradient(135deg, #88199a 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
        }
        
        .header img {
            max-width: 150px;
            height: auto;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .featured-image {
            width: 100%;
            max-width: 540px;
            height: auto;
            border-radius: 8px;
            margin-bottom: 25px;
        }
        
        .blog-title {
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
            line-height: 1.3;
            margin: 0 0 20px 0;
        }
        
        .blog-excerpt {
            font-size: 16px;
            color: #666;
            line-height: 1.6;
            margin: 0 0 30px 0;
        }
        
        .author-section {
            display: table;
            width: 100%;
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        
        .author-avatar {
            display: table-cell;
            width: 60px;
            vertical-align: middle;
            padding-right: 15px;
        }
        
        .author-avatar img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
        
        .author-info {
            display: table-cell;
            vertical-align: middle;
        }
        
        .author-name {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 0 0 5px 0;
        }
        
        .publish-date {
            font-size: 14px;
            color: #999;
            margin: 0;
        }
        
        .cta-button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #88199a 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
        }
        
        .footer {
            background-color: #f8f9fa;
            padding: 30px 20px;
            text-align: center;
            border-top: 1px solid #e1e5e9;
        }
        
        .footer p {
            font-size: 14px;
            color: #666;
            margin: 0 0 10px 0;
        }
        
        .unsubscribe-link {
            color: #88199a;
            text-decoration: none;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #88199a;
            text-decoration: none;
        }
        
        /* Mobile responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }
            
            .content {
                padding: 20px !important;
            }
            
            .blog-title {
                font-size: 24px !important;
            }
            
            .author-section {
                padding: 15px !important;
            }
            
            .cta-button {
                display: block !important;
                width: 100% !important;
                box-sizing: border-box;
            }
        }
    </style>
</head>
<body>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="padding: 20px 0;">
                <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <img src="${companyLogoUrl}" alt="Nimitech IT LLC" style="max-width: 150px; height: auto;">
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td class="content">
                            ${featuredImageUrl ? `<img src="${featuredImageUrl}" alt="${blogPost.title}" class="featured-image">` : ''}
                            
                            <h1 class="blog-title">${blogPost.title}</h1>
                            
                            <p class="blog-excerpt">${blogPost.excerpt || ''}</p>
                            
                            <!-- Author Section -->
                            <table class="author-section" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    ${authorAvatarUrl ? `
                                    <td class="author-avatar">
                                        <img src="${authorAvatarUrl}" alt="${blogPost.author.name}">
                                    </td>
                                    ` : ''}
                                    <td class="author-info">
                                        <p class="author-name">By ${blogPost.author.name}</p>
                                        <p class="publish-date">${formatDate(blogPost.createdAt)}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="${blogUrl}" class="cta-button">Read Full Article</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            <p><strong>Nimitech IT LLC</strong></p>
                            <p>Stay updated with our latest insights and technology trends.</p>
                            
                            <div class="social-links">
                                <a href="${process.env.CLIENT_URL}">Website</a>
                                <a href="${process.env.CLIENT_URL}/blog">Blog</a>
                                <a href="${process.env.CLIENT_URL}/contact">Contact</a>
                            </div>
                            
                            <p>
                                <a href="{{UNSUBSCRIBE_LINK}}" class="unsubscribe-link">Unsubscribe</a> from these emails
                            </p>
                            
                            <p style="font-size: 12px; color: #999; margin-top: 20px;">
                                This email was sent to you because you subscribed to our newsletter.
                                <br>
                                © ${new Date().getFullYear()} Nimitech IT LLC. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

/**
 * Generate plain text version of the email for better deliverability
 */
function generatePlainTextTemplate(blogPost) {
  const blogUrl = `${process.env.CLIENT_URL}/blog/${blogPost.slug}`;
  
  return `
${blogPost.title}

${blogPost.excerpt || ''}

By ${blogPost.author.name}
Published: ${formatDate(blogPost.createdAt)}

Read the full article: ${blogUrl}

---

Nimitech IT LLC
Stay updated with our latest insights and technology trends.

Website: ${process.env.CLIENT_URL}
Blog: ${process.env.CLIENT_URL}/blog
Contact: ${process.env.CLIENT_URL}/contact

Unsubscribe: {{UNSUBSCRIBE_LINK}}

© ${new Date().getFullYear()} Nimitech IT LLC. All rights reserved.
`;
}

module.exports = {
  generateEmailTemplate,
  generatePlainTextTemplate
};
