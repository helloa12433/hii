// app.js — populate selects and wire filtering
document.addEventListener('DOMContentLoaded', () => {
  // utility: build options from list items inside a given UL
  function buildOptionsForList(listEl, selectEl) {
    const items = Array.from(listEl.querySelectorAll('.product-item'));
    const cats = new Set(items.map(it => it.dataset.category || ''));
    const arr = Array.from(cats).filter(Boolean).sort();
    // clear select
    selectEl.innerHTML = '';
    const optAll = document.createElement('option');
    optAll.value = 'All';
    optAll.textContent = 'All';
    selectEl.appendChild(optAll);
    arr.forEach(cat => {
      const o = document.createElement('option');
      o.value = cat;
      o.textContent = cat;
      selectEl.appendChild(o);
    });

    // attach change handler
    selectEl.addEventListener('change', () => {
      const chosen = selectEl.value;
      items.forEach(it => {
        if (chosen === 'All' || it.dataset.category === chosen) {
          it.classList.remove('hidden');
        } else {
          it.classList.add('hidden');
        }
      });
    });
  }

  // Panel 1 controls (first panel uses all 6 items defined in HTML)
  buildOptionsForList(document.getElementById('productList'), document.getElementById('categorySelect'));

  // Panel 2 & 3: each has its own smaller list and select
  buildOptionsForList(document.getElementById('productList2'), document.getElementById('categorySelect2'));
  buildOptionsForList(document.getElementById('productList3'), document.getElementById('categorySelect3'));

  // initialize selects to "All"
  document.querySelectorAll('.category-select').forEach(s => s.value = 'All');
});
