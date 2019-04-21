document.getElementById('auto-refresh-btn').classList.add(sessionStorage.getItem('autoRefresh') !== 'false' ? 'auto-refresh-true' : 'auto-refresh-false');

const autoRefreshCycle = setInterval(() => {
  if(sessionStorage.getItem('autoRefresh') !== 'false'){
    location.reload();
  }
  else{
    return;
  }
}, 1000 * 60 * 3);

const tableRows = document.getElementsByTagName('tr');

for(let row of tableRows){
  row.addEventListener('click', function(event){
    console.log('gug?', event.currentTarget.id);
    if(!event.currentTarget.id){
      return;
    }
    else if(event.currentTarget.id === 'add-api-row'){
      window.location ='/add';
      return;
    }
    else{
      window.location = '/details/' + event.currentTarget.id.split('-')[1];
    }
  });
}


document.getElementById('auto-refresh-btn').addEventListener('click', (event) => {
  if(sessionStorage.getItem('autoRefresh') === 'true'){
    sessionStorage.setItem('autoRefresh', 'false');
    document.getElementById('auto-refresh-btn').classList.remove('auto-refresh-true');
    document.getElementById('auto-refresh-btn').classList.add('auto-refresh-false');
  }
  else{
    sessionStorage.setItem('autoRefresh', 'true');
    document.getElementById('auto-refresh-btn').classList.add('auto-refresh-true');
    document.getElementById('auto-refresh-btn').classList.remove('auto-refresh-false');
  }
});


