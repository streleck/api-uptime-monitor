const addFieldButtons = document.getElementsByClassName('add-field-btn')
for(let button of addFieldButtons){
  button.addEventListener('click', addField, false);
}

const expandRequestButtons = document.getElementsByClassName('expand-request-btn')
for(let button of expandRequestButtons){
  button.addEventListener('click', expandField);
}

document.getElementById('url').addEventListener('input', function(event){
  event.target.style.backgroundColor = 'white';
})

document.getElementById('test-api-btn').addEventListener('click', handleClickInitialApiTestButton);

document.getElementById('start-monitoring-btn').addEventListener('click', handleSubmit);

document.getElementById('initial-test-back-btn').addEventListener('click', function(event){
  document.getElementById('start-monitoring-btn').setAttribute('disabled', true);
  document.querySelector('form').style.display = 'block';
  document.querySelector('#api-test-section').style.display = 'none';
  document.querySelector('#main h2').innerText =  'Monitor a new API';
  document.querySelector('#api-test-section h4').innerHTML = 'awaiting response:&nbsp;<span id="loading-dot-1">.</span><span id="loading-dot-2">.</span><span id="loading-dot-3">.</span>';
  document.getElementById('initial-test-results').innerText = '';
  
});


function addField(event, fieldType){
  let dataType = event.target.attributes['data-type'].value;
  let row = event.target.parentElement.parentElement.parentElement;
  
  // change + button to - button
  let buttonId = Math.random();
  event.target.parentElement.innerHTML = `<button class="add-field-btn" id="rem-btn-${buttonId}" type="button">-</button>`;

  document.getElementById(`rem-btn-${buttonId}`).addEventListener('mouseup', function(event){
    if(row.children[0].innerText === dataType + ':'){
      row.nextElementSibling.children[0].innerText = dataType + ':';
    }
    else if(row.children[0].innerText === dataType + ' alerts:'){
      row.nextElementSibling.children[0].innerText = dataType + ' alerts:';
    }
    row.remove();
  })
  
  //create and add new row
  let newRow = document.createElement('tr');
  newRow.className = `expandable-row`;
  newRow.setAttribute('data-type', dataType);
  let uniqueId = Math.random();
  if(dataType === 'email'){
    newRow.innerHTML =
      `<td class="input-label">
        <label for="email-${uniqueId}"></label>
      </td>
      <td>
        <div class="multi-field-container">
          <input type="text" name="email-${uniqueId}" id="email-${uniqueId}" placeholder="send alerts to">
        </div>
        <span><button id="btn-${uniqueId}" class="add-email-btn" type="button" data-type="email">+</button></span>
      </td>`;
  }
  else{
    newRow.innerHTML = 
      `<td class="input-label"></td>
      <td>
      <div class="multi-field-container">
        <input class="key-value-input" type="text" name="${dataType}-key-${uniqueId}" id="${dataType}-key-${uniqueId}">&nbsp;:&nbsp;<input class="key-value-input" type="text" name="${dataType}-value-${uniqueId}" id="${dataType}-value-${uniqueId}">
      </div>
        <span><button id="btn-${uniqueId}" class="add-field-btn" type="button" data-type="${dataType}">+</button></span>
      </td>`;
  }
  row.parentElement.insertBefore(newRow, row.nextSibling);
  document.getElementById(`btn-${uniqueId}`).addEventListener('click', function(e){
    addField(e, dataType);
  })
}

function expandField(event){
  const section = event.target.attributes['data-type'].value;
  const relevantRows = document.querySelectorAll(`.expandable-row[data-type=${section}]`);
  for(let row of relevantRows){
    if(row.style.display === 'none'){
      row.style.display = 'table-row';
      event.target.style.backgroundImage = 'url("../images/triangle-expanded.png")';
    }
    else{
      row.style.display = 'none';
      event.target.style.backgroundImage = 'url("../images/triangle-collapsed.png")';
    }
  }
}

function handleClickInitialApiTestButton(event){
  const formData = validateAndStructureFormData();
  if(!formData){
    return;
  }
  else{
    document.querySelector('form').style.display = 'none';
    document.querySelector('#api-test-section').style.display = 'block';
    document.querySelector('#main h2').innerText =  'Testing API endpoint';

    // Set up loading Animation
    let awaitingResultsCounter = 0;
    const blinkingDots = [
      document.getElementById('loading-dot-1'),
      document.getElementById('loading-dot-2'),
      document.getElementById('loading-dot-3'),
    ];
    let awaitingResults = setInterval(function(){
      for(let dot of blinkingDots){
      dot.style.setProperty('color', 'rgb(211, 160, 250)');
      }
      blinkingDots[awaitingResultsCounter % 3].style.setProperty('color', 'rgb(134, 100, 160)');
      awaitingResultsCounter++;
    }, 500);

    $.ajax({
      type: 'POST',
      url: '/initial-test',
      data: {
        "requestBody": JSON.stringify(formData)
      },
      //success: success,
      dataType: 'json'
    })
    .then(function(response){
      clearInterval(awaitingResults);
      console.log('rezzzz: ', response);
      if(response.success){
        document.querySelector('#api-test-section h4').innerText = 'response:';
        document.getElementById('initial-test-results').innerHTML = `<p>status: ${response.statusText}</p><p>statusCode: ${response.status}</p>`;
        document.getElementById('start-monitoring-btn').removeAttribute('disabled');
      }
      else{
        document.querySelector('#api-test-section h4').innerText = 'response:';
        document.getElementById('initial-test-results').innerHTML = `<p class="error">error: ${response.code}`;
      }
    })
    .catch(function(err){
      clearInterval(awaitingResults);
      console.log('errrror', err);
    });
  }
}

function handleSubmit(event) {
  const formData = validateAndStructureFormData();
  if(!formData){
    return;
  }
  else{
   
    $.ajax({
      type: 'POST',
      url: '/add-api',
      data: {
        "requestBody": JSON.stringify(formData)
      },
      //success: success,
      dataType: 'json'
    })
    .then(function(response){
      if(response.success){
        window.location = '/';
      }
      else{
        alert('Error saving record to database. You can try again if you want.')
      }
    })
    .catch(function(error){
      console.log(error);
    });
  }

}

function validateAndStructureFormData(){
  const inputs = document.querySelectorAll('input');
  let requestBody = {
    method: '',
    url: '',
    params: {},
    headers: {},
    body: {}
  };
  let displayName;
  let emails = [];

  requestBody.method = document.querySelector('select').value;

  function matchKeyValuePair(input, inputs, dataType){
    const inputId = input.id.split('-')[2];
    for(let possibleMatch of inputs){
      const possibleMatchInfo = possibleMatch.id.split('-');
      if(possibleMatchInfo[0] === dataType && possibleMatchInfo[1] === 'value' && possibleMatchInfo[2] === inputId){
        requestBody[dataType][input.value.trim()] = possibleMatch.value.trim();
      }
    }
  }

  for(let input of inputs){
    if(input.id === 'url'){
      if(!input.value){
        input.style.backgroundColor = '#faa';
        return;
      }
      else{
        requestBody.url = input.value.trim();
      }
    }
    else if(!input.value){
      continue;
    }
    else if(input.id === 'displayName'){
      displayName = input.value.trim();
    }
    else if(input.id.startsWith('params-key')){
      matchKeyValuePair(input, inputs, 'params');
    }
    else if(input.id.startsWith('headers-key')){
      matchKeyValuePair(input, inputs, 'headers');
    }
    else if(input.id.startsWith('body-key')){
      matchKeyValuePair(input, inputs, 'body');
    }
    else if(input.id.startsWith('email-') && input.value){
      emails.push(input.value);
    }
  }
  return{displayName, url: requestBody.url, requestBody, emails: emails.join(', ')};
}










document.addEventListener('keypress', function(event){
 if(event.keyCode === 0 && event.ctrlKey === true){
   if(document.querySelector('form').style.display === 'block'){
    document.querySelector('form').style.display = 'none';
    document.querySelector('#api-test-section').style.display = 'block';
   }
   else{
    document.querySelector('form').style.display = 'block';
    document.querySelector('#api-test-section').style.display = 'none';
   }
 }
})