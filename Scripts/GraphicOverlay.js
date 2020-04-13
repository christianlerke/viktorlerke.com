/*----------------------------------------------------------------------------------------------------------------------//
\\																														\\
//  Author:  Christian Lerke																							//
\\  Create Date: August 13, 2011																						\\
//  Description: 																										//
\\																														\\
//----------------------------------------------------------------------------------------------------------------------*/

var GraphicOverlay = document.getElementById("GraphicOverlay");
var OverlayContainer = document.getElementById("OverlayContainer");
var OverlayContent = document.getElementById("OverlayContent");
var OverlayCloser = document.getElementById("OverlayCloser")

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: showGraphic																									\\
//  Description: shows the selected graphic																				//
\\  Expects: VOID																										\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function showGraphic( target ) {
	
	GraphicOverlay = document.getElementById("GraphicOverlay");
	OverlayContainer = document.getElementById("OverlayContainer");
	OverlayContent = document.getElementById("OverlayContent");
	OverlayCloser = document.getElementById("OverlayCloser");
	
	//position on page
	OverlayContainer.style.top = currentYPosition() + 20;
	OverlayContainer.style.left =  ( window.innerWidth - 160 ) / 2;
	
	//show loading indicator
	GraphicOverlay.className = "loading";
	
	//load image
	var newGraphic = new Image();	
	newGraphic.src = "Pages/Diploma/" + target + ".jpg";
	newGraphic.onload = function() { graphicLoaded( newGraphic ); }

}

/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: graphicLoaded																									\\
//  Description: checks if the graphic is loaded and displays it														//
\\  Expects: VOID																										\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function graphicLoaded( newGraphic ) {
	
	if( newGraphic.complete == true ) {
		
		//place image
		OverlayContent.appendChild( newGraphic );
		
		//display image
		window.setTimeout( function() {
			
			OverlayContainer.style.height = newGraphic.height;
			OverlayContainer.style.width = newGraphic.width;
			OverlayContainer.style.left =  ( window.innerWidth - newGraphic.width - 60 ) / 2;
			
			GraphicOverlay.className = "";
			
		}, 0);
		
	} else {
		
		window.setTimeout(function() {
			
			graphicLoaded( newGraphic );
			
		}, 500);
		
	}
	
}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: hideGraphic																									\\
//  Description: hides the graphic and cleans up																		//
\\  Expects: VOID																										\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function hideGraphic() {
	
	GraphicOverlay = document.getElementById("GraphicOverlay");
	OverlayContainer = document.getElementById("OverlayContainer");
	OverlayContent = document.getElementById("OverlayContent");
	
	GraphicOverlay.className = "hidden";
	
	OverlayContent.innerHTML = "";
	OverlayContainer.style.height = null;
	OverlayContainer.style.width = null;
	
}