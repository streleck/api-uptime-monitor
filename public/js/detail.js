const pauseButton = document.getElementById('pause-btn');
if(pauseButton){
  pauseButton.addEventListener('mouseup', (event) => {
    updateApi(event.target.attributes['data-id'].value, {isPaused: true})
  });
}

const unPauseButton = document.getElementById('un-pause-btn');
if(unPauseButton){
  unPauseButton.addEventListener('mouseup', (event) => {
    updateApi(event.target.attributes['data-id'].value, {isPaused: false})
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
  if(confirm('This will remove all test records for this API. Are you sure?')){
    $.ajax({
      type: 'DELETE',
      url: '/delete-api',
      data: {
        "appId": event.target.attributes['data-id'].value
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
  }
  else {
    return;
  }
});

document.getElementById('stats-select').addEventListener('change', (event) => {
  const timeframes = document.getElementsByClassName('stats-timeframe');
  for(let timeframe of timeframes){
    timeframe.classList.add('hidden');
  }
  document.getElementById('stats-' + event.target.value).classList.remove('hidden');
});

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
    updateApi(event.target.attributes['data-id'].value, updateObject);
  })
};






function updateApi (apiId, updateObject){
  console.log('gug: ', apiId);
  console.log('wallet: ', updateObject);
  $.ajax({
    type: 'POST',
    url: '/update-api',
    data: {
      apiId,
      updateObject: JSON.stringify(updateObject)
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