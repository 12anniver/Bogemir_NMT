document.addEventListener("DOMContentLoaded", () => {
  const brandHeader = document.getElementById('brand-header');
  const text = brandHeader.textContent;
  brandHeader.innerHTML = ''; // Clear original text

  for (const char of text) {
    const span = document.createElement('span');
    span.textContent = char;
    brandHeader.appendChild(span);
  }
});
