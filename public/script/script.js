const deleteBtns = document.querySelectorAll('.delete-btn');

for (let btn of deleteBtns) {
  btn.addEventListener('click', () => { btn.submit(); });
};