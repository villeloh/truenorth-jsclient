
/**
 * 'Base class' for UI buttons. 'Sub-classes' 'extend' this 'class' by calling its
 * make function within their own make function. Enough quote marks yet?
 */

const UIButton = {

  // do you have enough parameters yet ??!
  make: function(parentDiv, outerStyleMap, innerStyleMap, eventId, callback, text, borderDivId, innerDivId) {

    // Set CSS for the control border.
    const outerButtonDiv = document.createElement('div');
    outerButtonDiv.id = borderDivId;
    this._styleDiv(outerButtonDiv, outerStyleMap);

    // Set CSS for the control interior.
    const innerButtonDiv = document.createElement('div');
    innerButtonDiv.id = innerDivId; // for changing button texts dynamically, this div must be 'findable'
    this._styleDiv(innerButtonDiv, innerStyleMap);

    // to make textless buttons possible with the same 'class'
    if (text !== null && text !== undefined) {

      innerButtonDiv.innerHTML = text;
    }
    outerButtonDiv.appendChild(innerButtonDiv);

    outerButtonDiv.addEventListener('click', function(event) {
      event.id = eventId; // to uniquely identify the clicked button
      callback(event);
    });
    parentDiv.appendChild(outerButtonDiv); // this is needed because apparently using return statements loses the styles somehow
  }, // make

  _styleDiv: function(div, styleMap) {
    
    styleMap.forEach( (value, styleAttr) => { // why tf it's this way around is beyond me... surely not a source of a gazillion bugs world round :D
  
      div.style[styleAttr] = value;
    });
  }

}; // UIButton