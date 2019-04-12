
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

document.getElementById('test-api-btn').addEventListener('click', function(event){
  console.log(validateAndStructureInputs());
});




function addField(event, fieldType){
  let dataType = event.target.attributes['data-type'].value;
  let row = event.target.parentElement.parentElement;
  
  // change + button to - button
  let buttonId = Math.random();
  event.target.parentElement.innerHTML = `<button class="add-field-btn" id="rem-btn-${buttonId}" type="button">-</button>`;
  document.getElementById(`rem-btn-${buttonId}`).addEventListener('mouseup', function(event){
    if(event.target.parentElement.parentElement.children[0].innerText === dataType + ':'){
      event.target.parentElement.parentElement.nextElementSibling.children[0].innerText = dataType + ':';
    }
    else if(event.target.parentElement.parentElement.children[0].innerText === dataType + ' alerts:'){
      event.target.parentElement.parentElement.nextElementSibling.children[0].innerText = dataType + ' alerts:';
    }
    event.target.parentElement.parentElement.remove();
  })
  
  //create and add new row
  let newRow = document.createElement('tr');
  newRow.className = `expandable-row`;
  newRow.setAttribute('data-type', dataType);
  let uniqueId = Math.random();
  if(dataType === 'email'){
    newRow.innerHTML = `<td class="input-label"><label for="email-${uniqueId}"></label></td>
    <td><input type="text" name="email-${uniqueId}" id="email-${uniqueId}" placeholder="send alerts to"></td>
    <td><button id="btn-${uniqueId}" class="add-email-btn" type="button" data-type="email">+</button></td>`;
  }
  else{
    newRow.innerHTML = `<td class="input-label"></td><td><input class="key-value-input" type="text" name="${dataType}-key-${uniqueId}" id="${dataType}-key-${uniqueId}">&nbsp;:&nbsp;<input class="key-value-input" type="text" name="${dataType}-value-${uniqueId}" id="${dataType}-value-${uniqueId}"></td><td><button id="btn-${uniqueId}" class="add-field-btn" type="button" data-type="${dataType}">+</button></td>`;
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

function validateAndStructureInputs(){
  const inputs = document.querySelectorAll('input');
  let requestBody = {
    method: '',
    url: '',
    params: {},
    headers: {},
    body: {}
  };
  let name;
  let emails = [];

  requestBody.method = document.querySelector('select').value;

  function matchKeyValuePair(input, inputs, dataType){
    const inputId = input.id.split('-')[2];
    for(let possibleMatch of inputs){
      const possibleMatchInfo = possibleMatch.id.split('-');
      if(possibleMatchInfo[0] === dataType && possibleMatchInfo[1] === 'value' && possibleMatchInfo[2] === inputId){
        requestBody[dataType][input.value] = possibleMatch.value;
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
        requestBody.url = input.value;
      }
    }
    else if(!input.value){
      continue;
    }
    else if(input.id === name){
      name = input.value;
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
  return{name, url: requestBody.url, requestBody, emails: emails.join(', ')};
}