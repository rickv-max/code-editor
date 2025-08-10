// Element references
const btnHtml = document.getElementById(‘btn-html’);
const btnCss = document.getElementById(‘btn-css’);
const btnJs = document.getElementById(‘btn-js’);
const previewContainer = document.getElementById(‘preview-container’);
const formatBtn = document.getElementById(‘formatBtn’);
const modeDesktop = document.getElementById(‘modeDesktop’);
const modeIphone = document.getElementById(‘modeIphone’);

// Code storage
const codeData = {
html: `<!DOCTYPE html>

<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    <div class="container">
        <h1>Hello dari HTML!</h1>
        <p>Ini adalah live editor ala VS Code.</p>
        <button onclick="changeColor()">Klik Saya!</button>
    </div>
</body>
</html>`,
  css: `* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
font-family: ‘Segoe UI’, Tahoma, Geneva, Verdana, sans-serif;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: #333;
min-height: 100vh;
display: flex;
align-items: center;
justify-content: center;
}

.container {
background: white;
padding: 2rem;
border-radius: 15px;
box-shadow: 0 10px 30px rgba(0,0,0,0.2);
text-align: center;
max-width: 400px;
width: 90%;
}

h1 {
color: #667eea;
margin-bottom: 1rem;
font-size: 2rem;
}

p {
margin-bottom: 1.5rem;
line-height: 1.6;
color: #666;
}

button {
background: linear-gradient(135deg, #667eea, #764ba2);
color: white;
border: none;
padding: 12px 24px;
border-radius: 25px;
cursor: pointer;
font-size: 16px;
transition: transform 0.2s ease;
}

button:hover {
transform: translateY(-2px);
}`, js: `// Fungsi untuk mengubah warna background
function changeColor() {
const colors = [
‘linear-gradient(135deg, #667eea 0%, #764ba2 100%)’,
‘linear-gradient(135deg, #f093fb 0%, #f5576c 100%)’,
‘linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)’,
‘linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)’,
‘linear-gradient(135deg, #fa709a 0%, #fee140 100%)’
];

```
const randomColor = colors[Math.floor(Math.random() * colors.length)];
document.body.style.background = randomColor;

console.log('Warna background berubah!');
```

}

// Animasi saat halaman dimuat
document.addEventListener(‘DOMContentLoaded’, function() {
const container = document.querySelector(’.container’);
if (container) {
container.style.opacity = ‘0’;
container.style.transform = ‘translateY(20px)’;
container.style.transition = ‘all 0.5s ease’;

```
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
}

console.log('Live Editor siap digunakan!');
```

});`
};

// Mode mapping for CodeMirror
const modeMap = {
html: ‘xml’,
css: ‘css’,
js: ‘javascript’
};

// Current state
let currentLanguage = ‘html’;
let editor;
let previewIframe = null;
let currentPreviewMode = ‘desktop’;
let debounceTimer = null;

// Initialize CodeMirror editor
function initializeEditor() {
const textarea = document.getElementById(‘code-editor’);
editor = CodeMirror.fromTextArea(textarea, {
mode: modeMap[currentLanguage],
theme: ‘dracula’,
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
gutters: [“CodeMirror-linenumbers”, “CodeMirror-foldgutter”]
});

// Set initial content
editor.setValue(codeData[currentLanguage]);

// Auto-update preview with debouncing
editor.on(‘change’, () => {
codeData[currentLanguage] = editor.getValue();

```
// Clear existing timer
if (debounceTimer) {
  clearTimeout(debounceTimer);
}

// Set new timer for debounced update
debounceTimer = setTimeout(() => {
  updatePreview();
}, 300);
```

});

// Focus editor
editor.focus();
}

// Create preview based on current mode
function createPreview() {
previewContainer.innerHTML = ‘’;

if (currentPreviewMode === ‘desktop’) {
previewIframe = document.createElement(‘iframe’);
previewIframe.id = ‘desktop-preview’;
previewIframe.setAttribute(‘sandbox’, ‘allow-scripts allow-same-origin’);
previewContainer.appendChild(previewIframe);
} else if (currentPreviewMode === ‘iphone’) {
const iphoneFrame = document.createElement(‘div’);
iphoneFrame.id = ‘iphone14pro-frame’;

```
previewIframe = document.createElement('iframe');
previewIframe.id = 'iphone14pro-preview';
previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');

iphoneFrame.appendChild(previewIframe);
previewContainer.appendChild(iphoneFrame);
```

}

updatePreview();
}

// Switch between languages
function switchLanguage(lang) {
// Save current code
if (editor) {
codeData[currentLanguage] = editor.getValue();
}

// Update current language
currentLanguage = lang;

// Update active button
[btnHtml, btnCss, btnJs].forEach(btn => btn.classList.remove(‘active’));
document.getElementById(`btn-${lang}`).classList.add(‘active’);

// Update editor mode and content
if (editor) {
editor.setOption(‘mode’, modeMap[lang]);
editor.setValue(codeData[lang]);
editor.focus();
}
}

// Update preview iframe
function updatePreview() {
if (!previewIframe) return;

try {
const source = `
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Live Preview</title>
<style>${codeData.css}</style>
</head>
<body>
${codeData.html}
<script>
// Error handling
window.onerror = function(msg, url, line, col, error) {
console.error(‘Error:’, msg, ‘at line’, line);
return false;
};

```
      ${codeData.js}
    </script>
  </body>
  </html>
`;

previewIframe.srcdoc = source;
```

} catch (error) {
console.error(‘Error updating preview:’, error);
}
}

// Format code using js-beautify
function formatCode() {
if (!editor) return;

const code = editor.getValue();
let formatted = code;

try {
if (currentLanguage === ‘js’) {
formatted = js_beautify(code, {
indent_size: 2,
space_in_empty_paren: true
});
} else if (currentLanguage === ‘html’) {
formatted = html_beautify(code, {
indent_size: 2,
wrap_line_length: 80
});
} else if (currentLanguage === ‘css’) {
formatted = css_beautify(code, {
indent_size: 2
});
}

```
editor.setValue(formatted);
editor.focus();
```

} catch (error) {
console.error(‘Error formatting code:’, error);
alert(‘Error saat memformat kode. Pastikan syntax benar.’);
}
}

// Set preview mode
function setPreviewMode(mode) {
currentPreviewMode = mode;

// Update active button
[modeDesktop, modeIphone].forEach(btn => btn.classList.remove(‘active’));
document.getElementById(`mode${mode.charAt(0).toUpperCase() + mode.slice(1)}`).classList.add(‘active’);

createPreview();
}

// Event listeners
function attachEventListeners() {
// Language switching
btnHtml.addEventListener(‘click’, () => switchLanguage(‘html’));
btnCss.addEventListener(‘click’, () => switchLanguage(‘css’));
btnJs.addEventListener(‘click’, () => switchLanguage(‘js’));

// Format button
formatBtn.addEventListener(‘click’, formatCode);

// Preview mode switching
modeDesktop.addEventListener(‘click’, () => setPreviewMode(‘desktop’));
modeIphone.addEventListener(‘click’, () => setPreviewMode(‘iphone’));

// Keyboard shortcuts
document.addEventListener(‘keydown’, (e) => {
// Ctrl/Cmd + S untuk format
if ((e.ctrlKey || e.metaKey) && e.key === ‘s’) {
e.preventDefault();
formatCode();
}

```
// Ctrl/Cmd + 1/2/3 untuk switch language
if ((e.ctrlKey || e.metaKey) && ['1', '2', '3'].includes(e.key)) {
  e.preventDefault();
  const languages = ['html', 'css', 'js'];
  switchLanguage(languages[parseInt(e.key) - 1]);
}
```

});
}

// Initialize everything when DOM is loaded
document.addEventListener(‘DOMContentLoaded’, () => {
initializeEditor();
attachEventListeners();
setPreviewMode(‘desktop’);
switchLanguage(‘html’);

console.log(‘Live Editor initialized successfully!’);
});

// Handle window resize
window.addEventListener(‘resize’, () => {
if (editor) {
editor.refresh();
}
});
