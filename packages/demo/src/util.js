export function formatByteSize(size) {
  if (size < 1024) {
    return `${size} B`;
  }
  else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }
  else if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;

}

export function openLink(url, attrs = { target: '_blank' }) {
  const link = document.body.appendChild(document.createElement('a'));
  const span = link.appendChild(document.createElement('span'));
  link.setAttribute('href', url);
  for (const [key, value] of Object.entries(attrs)) {
    link.setAttribute(key, value);
  }
  span.click();
  setTimeout(() => {
    document.body.removeChild(link);
  });
}
