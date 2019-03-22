// for making a stylable custom button for various ui actions (mainly swapping between map display types)
function UiControlButton(parentDiv, outerStyleMap, innerStyleMap, text, id, callback) {

  // Set CSS for the control border.
  const button = document.createElement('div');
  styleDiv(button, outerStyleMap);

  // Set CSS for the control interior.
  const innerButtonDiv = document.createElement('div');
  styleDiv(innerButtonDiv, innerStyleMap);
  innerButtonDiv.innerHTML = text;
  button.appendChild(innerButtonDiv);

  // Setup the click event listener
  button.addEventListener('click', function(event) {
    event.id = id; // to uniquely identify the clicked button
    callback(event);
  });
  parentDiv.appendChild(button); // this is needed because apparently using return statements loses the styles somehow
} // UiControlButton

function styleDiv(div, styleMap) {
    
  styleMap.forEach( (value, styleAttr) => { // why tf it's this way around is beyond me... surely not a source of a gazillion bugs world round :D

    div.style[styleAttr] = value;
  });
}