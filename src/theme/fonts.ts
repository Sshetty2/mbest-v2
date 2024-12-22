export const fontFaces = `
@font-face {
  font-family: 'Rock Salt';
  font-style: normal;
  font-weight: 400;
  src: url('${chrome.runtime.getURL('src/assets/fonts/RockSalt-Regular.ttf')}') format('truetype');
}
`;

export function injectFonts () {
  const style = document.createElement('style');
  style.textContent = fontFaces;
  document.head.appendChild(style);
}
