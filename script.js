const btnHtml = document.getElementById('btn-html');
const btnCss = document.getElementById('btn-css');
const btnJs = document.getElementById('btn-js');
const previewContent = document.getElementById('preview-content');
const formatBtn = document.getElementById('formatBtn');
const modeDesktop = document.getElementById('modeDesktop');
const modeIphone = document.getElementById('modeIphone');
const statusLeft = document.getElementById('status-left');
const tabHtml = document.getElementById('tab-html');
const tabCss = document.getElementById('tab-css');
const tabJs = document.getElementById('tab-js');

const codeData = {
  html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Hello World</title>
</head>
<body>
  <div class="container">
    <h1>Welcome to Live Editor</h1>
    <p>Edit HTML, CSS, dan JavaScript secara real-time!</p>
    <button onclick="changeColor()">Change Color</button>
    <div class="feature-list">
      <div class="feature-item">✨ Live Preview</div>
      <div class="feature-item">🎨 Syntax Highlighting</div>
      <div class="feature-item">📱 Mobile Preview</div>
    </div>
  </div>
</body>
</html>`,

  css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(10px);
}

h1 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
}

p {
  margin-bottom: 2rem;
  line-height: 1.6;
  color: #666;
  font-size: 1.1rem;
}

button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.feature-item {
  background: rgba(102, 126, 234, 0.1);
  padding: 1rem;
  border-radius: 10px;
  font-weight: 500;
  transition: transform 0.2s ease;
}

.feature-item:hover {
  transform: translateX(10px);
}`,

  js: `const colors = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
];

let currentColorIndex = 0;

function changeColor() {
  currentColorIndex = (currentColorIndex + 1) % colors.length;
  document.body.style.background = colors[currentColorIndex];

  const button = event.target;
  button.style.transform = 'scale(0.95)';
  setTimeout(() => {
    button.style.transform = 'scale(1)';
  }, 150);

  console.log('Background changed to color index:', currentColorIndex);
}

document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.container');
  const items = document.querySelectorAll('.feature-item');

  if (container) {
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px) scale(0.9)';
    container.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

    setTimeout(() => {
      container.style.opacity = '1';
      container.style.transform = 'translateY(0) scale(1)';
    }, 100);
  }

  items.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.6s ease';

    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, 300 + (index * 100));
  });

  console.log('VS Code Live Editor ready!');
});

setInterval(() => {
  changeColor();
}, 10000);
};

const modeMap = {
  html: 'xml',
  css: 'css',
  js: 'javascript'
};

let currentLanguage = 'html';
let editor;
let previewIframe = null;
let currentPreviewMode = 'desktop';
let debounceTimer = null;

function initializeEditor() {
  const textarea = document.getElementById('code-editor');
  editor = CodeMirror.fromTextArea(textarea, {
    mode: modeMap[currentLanguage],
    theme: 'dracula',
    lineNumbers: true,
    electricChars: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    styleActiveLine: true,
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false,
    lineWrapping: false,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  });
  editor.setValue(codeData[currentLanguage]);
  editor.focus();

  editor.on('change', () => {
    codeData[currentLanguage] = editor.getValue();
    statusLeft.textContent = `${currentLanguage.toUpperCase()} edited`;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      updatePreview();
      statusLeft.textContent = `Ready`;
    }, 700);
  });
}

function switchLanguage(lang) {
  if (lang === currentLanguage) return;

  currentLanguage = lang;

  // Update buttons active state
  btnHtml.classList.toggle('active', lang === 'html');
  btnCss.classList.toggle('active', lang === 'css');
  btnJs.classList.toggle('active', lang === 'js');

  tabHtml.classList.toggle('active', lang === 'html');
  tabCss.classList.toggle('active', lang === 'css');
  tabJs.classList.toggle('active', lang === 'js');

  editor.setOption('mode', modeMap[lang]);
  editor.setValue(codeData[lang]);
  editor.focus();

  updatePreview();
}

function formatCode() {
  let val = editor.getValue();
  switch (currentLanguage) {
    case 'html':
      val = html_beautify(val, { indent_size: 2, space_in_empty_paren: true });
      break;
    case 'css':
      val = css_beautify(val, { indent_size: 2 });
      break;
    case 'js':
      val = js_beautify(val, { indent_size: 2 });
      break;
  }
  editor.setValue(val);
  statusLeft.textContent = `Formatted ${currentLanguage.toUpperCase()}`;
  updatePreview();
}

function updatePreview() {
  if (previewIframe) {
    previewIframe.remove();
    previewIframe = null;
  }

  if (currentPreviewMode === 'desktop') {
    previewIframe = document.createElement('iframe');
    previewIframe.id = 'desktop-preview';
    previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-modals allow-forms');
    previewIframe.style.background = 'white';

    const combinedHTML = `
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>${codeData.css}</style>
</head>
<body>
${codeData.html}
<script>
window.onerror = function(message, source, lineno, colno, error) {
  parent.postMessage({ type: 'preview-error', message: message, line: lineno, column: colno }, '*');
};
</script>
<script>${codeData.js}<\/script>
</body>
</html>
`;
    previewIframe.srcdoc = combinedHTML;

    previewContent.appendChild(previewIframe);

  } else if (currentPreviewMode === 'iphone') {
    previewIframe = document.createElement('iframe');
    previewIframe.id = 'iphone14pro-preview';
    previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-modals allow-forms');

    const combinedHTML = `
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>
  body, html { margin:0; padding:0; }
  ${codeData.css}
</style>
</head>
<body>
${codeData.html}
<script>
window.onerror = function(message, source, lineno, colno, error) {
  parent.postMessage({ type: 'preview-error', message: message, line: lineno, column: colno }, '*');
};
</script>
<script>${codeData.js}<\/script>
</body>
</html>
`;
    previewIframe.srcdoc = combinedHTML;

    // Bungkus iframe dengan iPhone frame
    const iphoneFrame = document.createElement('div');
    iphoneFrame.id = 'iphone14pro-frame';
    iphoneFrame.appendChild(previewIframe);

    previewContent.appendChild(iphoneFrame);
  }
}

function setupEventListeners() {
  btnHtml.addEventListener('click', () => switchLanguage('html'));
  btnCss.addEventListener('click', () => switchLanguage('css'));
  btnJs.addEventListener('click', () => switchLanguage('js'));

  tabHtml.addEventListener('click', () => switchLanguage('html'));
  tabCss.addEventListener('click', () => switchLanguage('css'));
  tabJs.addEventListener('click', () => switchLanguage('js'));

  formatBtn.addEventListener('click', formatCode);

  modeDesktop.addEventListener('click', () => {
    if (currentPreviewMode !== 'desktop') {
      currentPreviewMode = 'desktop';
      modeDesktop.classList.add('active');
      modeIphone.classList.remove('active');
      updatePreview();
    }
  });

  modeIphone.addEventListener('click', () => {
    if (currentPreviewMode !== 'iphone') {
      currentPreviewMode = 'iphone';
      modeIphone.classList.add('active');
      modeDesktop.classList.remove('active');
      updatePreview();
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          formatCode();
          break;
        case '1':
          e.preventDefault();
          switchLanguage('html');
          break;
        case '2':
          e.preventDefault();
          switchLanguage('css');
          break;
        case '3':
          e.preventDefault();
          switchLanguage('js');
          break;
      }
    }
  });

  // Listen to messages from preview iframe for errors
  window.addEventListener('message', e => {
    if (e.data?.type === 'preview-error') {
      statusLeft.textContent = `Error: ${e.data.message} (line: ${e.data.line})`;
      statusLeft.style.color = 'red';
      setTimeout(() => {
        statusLeft.textContent = 'Ready';
        statusLeft.style.color = '';
      }, 7000);
    }
  });

  window.addEventListener('resize', () => {
    setTimeout(() => {
      if (editor) editor.refresh();
    }, 200);
  });
}

window.onload = () => {
  initializeEditor();
  setupEventListeners();
  updatePreview();
};
