const API_DATABASE_ID = document.getElementById('main').attributes['data-id'].value;

const pauseButton = document.getElementById('pause-btn');
if(pauseButton){
  pauseButton.addEventListener('mouseup', (event) => {
    updateApi(API_DATABASE_ID, {isPaused: true}, 'pause');
  });
}

const unPauseButton = document.getElementById('un-pause-btn');
if(unPauseButton){
  unPauseButton.addEventListener('mouseup', (event) => {
    updateApi(API_DATABASE_ID, {isPaused: false}, 'unpause');
  });
}

const editFieldButtons = document.getElementsByClassName('edit-field-btn');
for(let button of editFieldButtons){
  button.addEventListener('click', (event) => {
    let row = event.target.parentElement.parentElement;
    row.childNodes[3].classList.add('hidden');
    row.childNodes[5].classList.remove('hidden');
    row.childNodes[5].childNodes[1].childNodes[3].focus();
    event.target.nextElementSibling.classList.remove('hidden');
    event.target.classList.add('hidden');
  });
}

const cancelEditNameButton = document.getElementsByClassName('x-btn');
for(let button of cancelEditNameButton){
  button.addEventListener('click', (event) => {
    let row = event.target.parentElement.parentElement.parentElement;
    row.childNodes[3].classList.remove('hidden');
    row.childNodes[5].classList.add('hidden');
    row.childNodes[7].children[0].classList.remove('hidden');
    row.childNodes[7].children[1].classList.add('hidden');
    //console.log(event.target.nextElementSibling);
  });
}

document.getElementById('delete-btn').addEventListener('mouseup', (event) => {
  function confirmDialog(msg) {
    return new Promise(function (resolve, reject) {
      let confirmed = window.confirm(msg);
  
      return confirmed ? resolve(true) : reject(false);
    });
   }

  confirmDialog('you sure, dude?')
  .then(() => {
    $.ajax({
      type: 'DELETE',
      url: '/delete-api',
      data: {
        "appId": API_DATABASE_ID
      },
    })
    .then((response) => {
      if(response === 'success'){
        window.location = '/';
      }
    })
    .catch((err) => {
      console.log(err);
    })
  })
  .catch(
    console.log('good choice, man')
  );
});

// change view of 'stats' to different time frames
document.getElementById('stats-select').addEventListener('change', (event) => {
  const timeframes = document.getElementsByClassName('stats-timeframe');
  for(let timeframe of timeframes){
    timeframe.classList.add('hidden');
  }
  document.getElementById('stats-' + event.target.value).classList.remove('hidden');
});

// Click handler to enter 'edit field' changes
const enterButtons = document.getElementsByClassName('enter-field-btn');
for(let button of enterButtons){
  button.addEventListener('click', (event) => {
    const input = button.parentElement.parentElement.children[2].children[0].children[1];
    const key = input.attributes['data-field'].value;
    let value = input.value.trim();;
    if(key === 'emails'){
      value = value.split(',').map((email) => email.trim());
    }
    const updateObject = {}
    updateObject[key] = value;
    updateApi(API_DATABASE_ID, updateObject, 'update');
  })
};


// Enable enter key to submit 'edit field' changes
const inputEditFields = document.getElementsByClassName('edit-field-input');

for(let field of inputEditFields){
  field.addEventListener('keypress', (event) => {
    if(event.code !== 'Enter'){
      return;
    }
    else {
      const input = event.target;
      const key = input.attributes['data-field'].value;
      let value = input.value.trim();;
      if(key === 'emails'){
        value = value.split(',').map((email) => email.trim()).filter((email) => email.length > 0);
      }
      const updateObject = {}
      updateObject[key] = value;
      updateApi(API_DATABASE_ID, updateObject, 'update');
    }
  })
};

document.getElementById('add-note-btn').addEventListener('click', (event) =>{
  if(event.target.hasAttribute('active')){
    document.getElementById('upper-note-row').classList.add('hidden');
    document.querySelector('#upper-note-row textarea').value = '';
    event.target.removeAttribute('active');
  }
  else {
    document.getElementById('upper-note-row').classList.remove('hidden');
    document.querySelector('#upper-note-row textarea').focus();
    event.target.setAttribute('active', '');
  }
})

document.getElementById('add-note-row').addEventListener('click', (event) =>{
  document.getElementById('lower-note-row').classList.remove('hidden');
  document.querySelector('#lower-note-row textarea').focus();
  event.target.classList.add('hidden');
});

const textareas = document.getElementsByTagName('textarea');
for(let textarea of textareas){
  textarea.addEventListener('blur', (event) => {
    event.target.parentElement.parentElement.classList.add('hidden');
    document.getElementById('add-note-btn').removeAttribute('active');
    document.getElementById('add-note-row').classList.remove('hidden');
  })
  textarea.addEventListener('keydown', (event) => {
    if(event.key === 'Escape'){
      event.target.parentElement.parentElement.classList.add('hidden');
      document.getElementById('add-note-btn').removeAttribute('active');
      document.getElementById('add-note-row').classList.remove('hidden');
    }
    else if(event.key === 'Enter'){
      event.preventDefault();
      const updateObject = { 
        notes: 
          { 
            text: event.target.value,
            timestamp: Date.now()
          }
      };
      updateApi(API_DATABASE_ID, updateObject, 'push');
    }
  })
}

const deleteNoteButtons = document.getElementsByClassName('delete-note-btn');
for(let button of deleteNoteButtons){
  button.addEventListener('mouseup', (event) => {
    const updateObject = {"notes": {"_id" : event.target.attributes['data-note-id'].value}};
    updateApi(API_DATABASE_ID, updateObject, 'pull');
  });
}

function updateApi (apiId, updateObject, operation){
  $.ajax({
    type: 'POST',
    url: '/update-api',
    data: {
      apiId,
      updateObject: JSON.stringify(updateObject),
      operation
    },
  })
  .then((response) => {
    if(response === 'success'){
      location.reload();
    }
  })
  .catch((err) => {
    console.log(err);
    alert('Error updating API record:\n', err);
  })
}
