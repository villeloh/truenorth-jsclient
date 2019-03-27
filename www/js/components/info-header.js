
/**
 * A header that shows info about the current route (atm, distance and travel time to destination).
 */

const InfoHeader = {

  DEFAULT_TEXT: '0.0 km | n/a',
  
  _DIV_ID: 'info-header',

  make: function(parentDiv) {

    const outerDiv = document.createElement('div');
    outerDiv.style.backgroundColor = 'rgba(0,0,0,0)';
    outerDiv.style.backgroundImage = 'radial-gradient(closest-side at 50% 50%, #2B7CFF, #2B7CFF, rgba(0,0,0,0))'; // grey that fades toward the elliptical edges
    outerDiv.style.display = 'flex';
    // outerDiv.style.marginTop = '2.5%';
    outerDiv.style.width = '100%';
    outerDiv.style.height = '100%';
    outerDiv.style.textAlign = 'center';
    outerDiv.style.justifyContent = 'center';
    outerDiv.style.alignItems = 'center';
    // outerDiv.style.padding = '20%';

    const textHolder = document.createElement('p');
    textHolder.textContent = InfoHeader.DEFAULT_TEXT;
    textHolder.id = InfoHeader._DIV_ID;
    textHolder.style.color = 'white';
    textHolder.style.fontFamily = 'Roboto,Arial,sans-serif';
    textHolder.style.fontSize = '14px';
    textHolder.style.lineHeight = '38px';
    textHolder.style.textTransform = 'none'; // without this, the text is in all capital letters for some reason

    outerDiv.appendChild(textHolder);
    parentDiv.appendChild(outerDiv);
  }, // make

  update: function(text) {

    const infoHeaderTextHolder = document.getElementById(InfoHeader._DIV_ID);
    infoHeaderTextHolder.textContent = text;
  },

  // the duration text is (usually...) pre-formatted by the Duration class
  formattedText: function(distanceInKm, durationText) {

    return `${distanceInKm.toFixed(1)} km | ${durationText}`;
  }

}; // InfoHeader