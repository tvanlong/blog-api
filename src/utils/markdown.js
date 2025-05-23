const marked = require('marked');
const sanitizeHtml = require('sanitize-html');

const parseMarkdown = (content) => {
  const html = marked(content);
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class'],
    },
  });
};

module.exports = { parseMarkdown };