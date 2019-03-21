
// for making a custom button to center on the user's location (seems not to exist in the client-side js api by default)
function LocationButton(parentDiv, callback) {

  // Set CSS for the control border.
  const button = document.createElement('div');
  button.style.backgroundColor = '#fff';
  button.style.border = '2px solid #808080';
  button.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  button.style.cursor = 'pointer';
  // button.style.marginBottom = '22px';
  button.style.width = '2.2rem'; // TODO: adapt it to various screens based on their size
  button.style.height = '2.2rem';
  button.style.textAlign = 'center';
  button.style.borderRadius = '50%';
  button.style.marginRight = '0.75rem';
  button.title = 'Center the map on your location';
  parentDiv.appendChild(button);

  // Set CSS for the control interior.
  const innerButtonDiv = document.createElement('div');
  innerButtonDiv.style.backgroundColor = 'black';
  innerButtonDiv.style.width = '1.2rem';
  innerButtonDiv.style.height = '1.2rem';
  innerButtonDiv.style.display = 'inline-block';
  /* 
  innerButtonDiv.style.marginLeft = '15%';
  innerButtonDiv.style.marginRight = '15%';
  innerButtonDiv.style.marginTop = '15%'; */
  innerButtonDiv.style.margin = '20%';
  innerButtonDiv.style.borderRadius = '50%';
/*
  innerButtonDiv.style.color = 'rgb(25,25,25)';
  innerButtonDiv.style.fontFamily = 'Roboto,Arial,sans-serif';
  innerButtonDiv.style.fontSize = '16px';
  innerButtonDiv.style.lineHeight = '38px';

  innerButtonDiv.innerHTML = '*'; */
  button.appendChild(innerButtonDiv);

  // Setup the click event listener
  button.addEventListener('click', function() {
    callback();
  });
} // LocationButton