// app.js
(function () {
  const svg = document.getElementById('canvas');
  const colorInput = document.getElementById('color');
  const widthInput = document.getElementById('width');
  const undoBtn = document.getElementById('undo');
  const clearBtn = document.getElementById('clear');
  const exportBtn = document.getElementById('export');

  let drawing = false;
  let currentPath = null;
  let pathData = '';
  const paths = []; // store appended path elements for undo

  // helper: SVG point from client coords
  function clientToSvgPoint(clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const ctm = svg.getScreenCTM().inverse();
    return pt.matrixTransform(ctm);
  }

  // start a new path
  function startPath(x, y) {
    pathData = `M ${x.toFixed(2)} ${y.toFixed(2)}`;
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', pathData);
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke-linecap', 'round');
    p.setAttribute('stroke-linejoin', 'round');
    p.setAttribute('stroke', colorInput.value);
    p.setAttribute('stroke-width', widthInput.value);
    p.style.pointerEvents = 'none';
    svg.appendChild(p);
    currentPath = p;
    paths.push(p);
  }

  // extend
  function extendPath(x, y) {
    pathData += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    if (currentPath) currentPath.setAttribute('d', pathData);
  }

  // finish
  function finishPath() {
    currentPath = null;
    pathData = '';
  }

  // pointer event handlers
  function onPointerDown(e) {
    // only primary button or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    svg.setPointerCapture(e.pointerId);
    drawing = true;
    const pt = clientToSvgPoint(e.clientX, e.clientY);
    startPath(pt.x, pt.y);
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!drawing) return;
    const pt = clientToSvgPoint(e.clientX, e.clientY);
    extendPath(pt.x, pt.y);
    e.preventDefault();
  }

  function onPointerUp(e) {
    if (!drawing) return;
    svg.releasePointerCapture(e.pointerId);
    drawing = false;
    finishPath();
    e.preventDefault();
  }

  // attach pointer events to svg
  svg.addEventListener('pointerdown', onPointerDown);
  svg.addEventListener('pointermove', onPointerMove);
  svg.addEventListener('pointerup', onPointerUp);
  svg.addEventListener('pointercancel', onPointerUp);
  svg.addEventListener('pointerleave', onPointerUp);

  // when color/width changes, upcoming paths use new values
  colorInput.addEventListener('change', () => { /* value read at creation */ });
  widthInput.addEventListener('change', () => { /* value read at creation */ });

  // Undo last path
  undoBtn.addEventListener('click', () => {
    const last = paths.pop();
    if (last && last.parentNode) {
      last.parentNode.removeChild(last);
    }
  });

  // Clear all
  clearBtn.addEventListener('click', () => {
    while (paths.length) {
      const p = paths.pop();
      if (p.parentNode) p.parentNode.removeChild(p);
    }
  });

  // Export SVG: open new window with svg markup
  exportBtn.addEventListener('click', () => {
    // clone svg to avoid rect background? We'll export full xml including viewBox
    const clone = svg.cloneNode(true);
    // ensure strokes have absolute pixels: set width/height attributes
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', svg.clientWidth);
    clone.setAttribute('height', svg.clientHeight);

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(clone);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drawing.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // keyboard: Ctrl+Z for undo, Delete/Clear
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      const last = paths.pop();
      if (last && last.parentNode) last.parentNode.removeChild(last);
    } else if (e.key === 'Delete') {
      clearBtn.click();
    }
  });

})();
