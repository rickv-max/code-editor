const btnHtml = document.getElementById('btn-html');
const btnCss = document.getElementById('btn-css');
const btnJs = document.getElementById('btn-js');
const previewContainer = document.getElementById('preview-container');
const formatBtn = document.getElementById('formatBtn');
const modeDesktop = document.getElementById('modeDesktop');
const modeIphone = document.getElementById('modeIphone');

// Data kode tiap bahasa
const codeData = {
  html: `<h1>Hello dari HTML!</h1>\n<p>Ini editor ala VS Code.</p>`,
  css: `body { font-family: Arial, sans-serif; background: #1e1e1e; color: #ddd; padding: 20px; }`,
  js: `console.log('JS aktif!');`
};

// Mode CodeMirror per bahasa
const modeMap = {
  html: 'xml',
  css: 'css',
  js: 'javascript'
};

// Inisialisasi editor CodeMirror
let currentLanguage = 'html';
const textarea = document.getElementById('code-editor');
let editor = CodeMirror.fromTextArea(textarea, {
  mode: modeMap[currentLanguage],
  theme: 'dracula',
  lineNumbers: true,
  electricChars: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  indentUnit: 2,
  tabSize: 2,
  indentWithTabs: false
});

// Preview iframe element (dinamis)
let previewIframe = null;
let currentPreviewMode = 'desktop'; // desktop or iphone

function createPreview() {
  previewContainer.innerHTML = '';
  if (currentPreviewMode === 'desktop') {
    previewIframe = document.createElement('iframe');
    previewIframe.id = 'desktop-preview';
    previewContainer.appendChild(previewIframe);
  } else if (currentPreviewMode === 'iphone') {
    const iphoneFrame = document.createElement('div');
    iphoneFrame.id = 'iphone14pro-frame';
    previewIframe = document.createElement('iframe');
    previewIframe.id = 'iphone14pro-preview';
    iphoneFrame.appendChild(previewIframe);
    previewContainer.appendChild(iphoneFrame);
  }
  updatePreview();
}

// Fungsi switch tab bahasa
function switchLanguage(lang) {
  codeData[currentLanguage] = editor.getValue();

  currentLanguage = lang;

  [btnHtml, btnCss, btnJs].forEach(btn => btn.classList.remove('active'));
  if(lang === 'html') btnHtml.classList.add('active');
  else if(lang === 'css') btnCss.classList.add('active');
  else btnJs.classList.add('active');

  editor.setOption('mode', modeMap[lang]);
  editor.setValue(codeData[lang]);
  editor.focus();
}

// Update preview iframe content
function updatePreview() {
  const source = `
    <!DOCTYPE html>
    <html lang="id">
    <head><style>${codeData.css}</style></head>
    <body>
      ${codeData.html}
      <script>${codeData.js}<\/script>
    </body>
    </html>
  `;
  if(previewIframe) previewIframe.srcdoc = source;
}

// Event tombol sidebar bahasa
btnHtml.addEventListener('click', () => switchLanguage('html'));
btnCss.addEventListener('click', () => switchLanguage('css'));
btnJs.addEventListener('click', () => switchLanguage('js'));

// Event tombol format kode
formatBtn.addEventListener('click', () => {
  const code = editor.getValue();
  let formatted = code;

  if(currentLanguage === 'js') {
    formatted = js_beautify.js(code, { indent_size: 2 });
  } else if(currentLanguage === 'html') {
    formatted = js_beautify.html(code, { indent_size: 2 });
  } else if(currentLanguage === 'css') {
    formatted = js_beautify.css(code, { indent_size: 2 });
  }

  editor.setValue(formatted);
});

// Mode desktop dan iPhone toggle
function setPreviewMode(mode) {
  currentPreviewMode = mode;
  [modeDesktop, modeIphone].forEach(btn => btn.classList.remove('active'));
  if(mode === 'desktop') modeDesktop.classList.add('active');
  else modeIphone.classList.add('active');
  createPreview();
}

modeDesktop.addEventListener('click', () => setPreviewMode('desktop'));
modeIphone.addEventListener('click', () => setPreviewMode('iphone'));

// Update preview tiap kali editor berubah
editor.on('change', () => {
  codeData[currentLanguage] = editor.getValue();
  updatePreview();
});

// Inisialisasi awal
setPreviewMode('desktop');
switchLanguage('html');
