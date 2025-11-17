const textarea=document.getElementById('text');
textarea.addEventListener('input', ()=>{
  count.textContent=textarea.value.length;
});