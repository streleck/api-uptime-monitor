let addEmailButton = document.getElementById('add-email-recipient-button');
let addEmailForm = document.getElementById('add-email-form');
let cancelAddEmailButton = document.getElementById('cancel-add-email-button');
let addEmailInput = document.getElementById('new-email-address');

addEmailButton.addEventListener('click', function(){
  addEmailForm.style.setProperty('display', 'inline');
  addEmailButton.style.setProperty('display', 'none');
});

cancelAddEmailButton.addEventListener('click', function(){
  addEmailForm.style.setProperty('display', 'none');
  addEmailInput.value = '';
  addEmailButton.style.setProperty('display', 'inline');
});