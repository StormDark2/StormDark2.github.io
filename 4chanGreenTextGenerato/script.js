const photo = document.getElementById('photo');
const filesize = document.getElementById('filesize');
const imageInput = document.getElementById('imageInput');
const linesInput = document.getElementById('linesInput');
const linesPreview = document.getElementById('linesPreview');
const bgColor = document.getElementById('bgColor');
const fontSize = document.getElementById('fontSize');
const fontFamily = document.getElementById('fontFamily');

// Array para guardar los colores de cada línea
let lineColors = [];

function formatBytes(bytes){
  if(!bytes) return '—';
  const kb = Math.round(bytes/1024);
  return kb >= 1024 ? (Math.round((kb/1024)*10)/10)+' MB' : kb + ' KB';
}

imageInput.addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(ev){
    photo.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  filesize.textContent = formatBytes(file.size) + ' ' + (file.name.split('.').pop()||'') .toUpperCase();
});

function applyPreview(){
  linesPreview.innerHTML = '';
  const lines = linesInput.value.split('\n');

  while(lineColors.length < lines.length) lineColors.push('#25c11a');
  while(lineColors.length > lines.length) lineColors.pop();

  lines.forEach((line,i)=>{
    const wrapper = document.createElement('div');
    wrapper.className = 'lineWrapper';

    const span = document.createElement('span');
    span.textContent = '> ' + line;
    span.style.color = lineColors[i];
    span.style.fontSize = fontSize.value+'px';
    span.style.fontFamily = fontFamily.value;

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = lineColors[i];
    colorInput.addEventListener('input', ()=>{
      span.style.color = colorInput.value;
      lineColors[i] = colorInput.value;
    });

    wrapper.appendChild(span);
    wrapper.appendChild(colorInput);
    linesPreview.appendChild(wrapper);
  });

  document.getElementById('card').style.setProperty('--bg', bgColor.value);
  document.getElementById('card').style.fontFamily = fontFamily.value;
}

linesInput.addEventListener('input', applyPreview);
bgColor.addEventListener('input', applyPreview);
fontSize.addEventListener('input', applyPreview);
fontFamily.addEventListener('change', applyPreview);

document.getElementById('exportBtn').addEventListener('click', ()=>{
  const card = document.getElementById('card');
  const colorInputs = card.querySelectorAll('input[type=color]');
  colorInputs.forEach(inp=>inp.style.display='none');
  html2canvas(card, {useCORS:true, scale:2}).then(canvas=>{
    colorInputs.forEach(inp=>inp.style.display='');
    const link = document.createElement('a');
    link.download = 'meme-style.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
});

document.getElementById('resetBtn').addEventListener('click', ()=>{
  photo.src = "/mnt/data/315d5b4e-30fb-4dd4-a00c-86c66f7bf262.png";
  filesize.textContent = "895 KB PNG";
  linesInput.value = "Agregar texto aca";
  fontSize.value = 36;
  bgColor.value = "#e9eded";
  fontFamily.value = "Arial, Helvetica, sans-serif";
  lineColors = [];
  applyPreview();
});

applyPreview();
