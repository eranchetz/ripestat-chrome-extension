// Load CSS
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('tooltip.css');
document.head.appendChild(link);

// Regex for IPv4/IPv6 + optional CIDR
const ipRegex = new RegExp(
  "\\b(" +
    // IPv4 pattern + optional /CIDR
    "(?:(?:[0-9]{1,3}\\.){3}[0-9]{1,3}(?:\\/\\d{1,2})?)" +
  "|" +
    // IPv6 pattern + optional /CIDR (full, compressed, partial)
    "(?:" +
      "(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}" +
      "|" +
      "(?:[A-Fa-f0-9]{1,4}:){1,7}:" +
      "|" +
      ":(?::[A-Fa-f0-9]{1,4}){1,7}" +
      "|" +
      "(?:[A-Fa-f0-9]{1,4}:){1,6}:[A-Fa-f0-9]{1,4}" +
    ")(?:\\/\\d{1,3})?" +
  ")\\b",
  "g"
);

// Cache for WHOIS data
let ipDataCache = {};
let tooltipElement = null;

// 1) Walk the DOM and replace IP text with highlight spans
walkAndHighlight(document.body);

// 2) Listen for mouseover to show tooltip
document.addEventListener('mouseover', (e) => {
  const target = e.target.closest('.ip-highlight');
  if (target) {
    const ip = target.getAttribute('data-ip');
    const info = ipDataCache[ip] || 'Loading...';
    showTooltip(target, info);
  }
});

// 3) Listen for mouseout to remove tooltip
document.addEventListener('mouseout', (e) => {
  if (tooltipElement && e.target.closest('.ip-highlight')) {
    tooltipElement.remove();
    tooltipElement = null;
  }
});

/**
 * Recursively walk the DOM, looking for text nodes that match the IP regex.
 * Replace only those matches with a <span class="ip-highlight"> ... </span>.
 */
function walkAndHighlight(root) {
  // Skip certain node types we shouldn’t modify
  if (
    root.nodeName === 'SCRIPT' ||
    root.nodeName === 'STYLE' ||
    root.nodeName === 'IFRAME' ||
    root.nodeType === Node.COMMENT_NODE
  ) {
    return; // Don’t process these
  }

  // If this is a text node, attempt to highlight IP addresses in its text
  if (root.nodeType === Node.TEXT_NODE) {
    const text = root.nodeValue;
    if (ipRegex.test(text)) {
      // We found IP addresses in this text node → replace them
      const newNode = wrapIPsInHTML(text);
      root.parentNode.replaceChild(newNode, root);
    }
    return;
  }

  // Otherwise, recurse into child nodes
  for (let i = 0; i < root.childNodes.length; i++) {
    walkAndHighlight(root.childNodes[i]);
  }
}

/**
 * Given a string with IP addresses, create a document fragment
 * with <span class="ip-highlight"> wrappers for each IP + (i) icon.
 */
function wrapIPsInHTML(text) {
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  ipRegex.lastIndex = 0; // reset regex

  // Use exec in a loop to find each match
  let match;
  while ((match = ipRegex.exec(text)) !== null) {
    // Plain text before the IP
    const before = text.slice(lastIndex, match.index);
    if (before) {
      fragment.appendChild(document.createTextNode(before));
    }

    // Create the highlight wrapper
    const span = document.createElement('span');
    span.className = 'ip-highlight';
    span.setAttribute('data-ip', match[0]); // store matched IP in dataset

    // IP text node
    const ipText = document.createElement('span');
    ipText.className = 'ip-text';
    ipText.textContent = match[0];

    // (i) icon
    const icon = document.createElement('span');
    icon.className = 'ip-icon';
    icon.textContent = 'i';

    // Preload WHOIS data if not cached
    preloadIpData(match[0]);

    // Append children to highlight span
    span.appendChild(ipText);
    span.appendChild(icon);

    fragment.appendChild(span);
    lastIndex = ipRegex.lastIndex;
  }

  // Remaining text after last match
  const remaining = text.slice(lastIndex);
  if (remaining) {
    fragment.appendChild(document.createTextNode(remaining));
  }

  return fragment;
}

/**
 * Preload WHOIS data for a given IP (only if not cached).
 */
async function preloadIpData(ip) {
  if (ipDataCache[ip]) return; // Already in cache
  try {
    const response = await fetch(`https://stat.ripe.net/data/whois/data.json?resource=${ip}`);
    const data = await response.json();
    const records = (data.data.records && data.data.records[0]) || [];
    ipDataCache[ip] =
      records.length > 0
        ? records.map(record => `${record.key}: ${record.value}`).join('<br>')
        : 'No information available';
  } catch (error) {
    console.error('API fetch error:', error);
    ipDataCache[ip] = 'Error fetching data';
  }
}

/**
 * Create and position the tooltip near the target element.
 */
function showTooltip(element, info) {
  // Remove any existing tooltip
  if (tooltipElement) {
    tooltipElement.remove();
  }

  // Create a new tooltip
  tooltipElement = document.createElement('div');
  tooltipElement.className = 'ip-tooltip';
  tooltipElement.innerHTML = info;
  document.body.appendChild(tooltipElement);

  // Position it
  const rect = element.getBoundingClientRect();
  tooltipElement.style.left = `${rect.left}px`;
  tooltipElement.style.top = `${rect.bottom + window.scrollY + 5}px`; // small offset
}

