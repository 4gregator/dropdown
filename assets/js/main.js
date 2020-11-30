document.addEventListener('DOMContentLoaded', function () {
  const dropdown1 = new Dropdown({
    drop: document.querySelectorAll('.dropdown__input')[0],
    field:document.querySelectorAll('.dropdown__container')[0]
  });

  const dropdown2 = new Dropdown({
    drop: document.querySelectorAll('.dropdown__input')[1],
    field:document.querySelectorAll('.dropdown__container')[1]
  });
});