///////////////////////////////////////////////////////// Startup ////////////////////////////////////////////////////////
/*----------------------------------------------------------------------------------------------------------------------//
\\																														\\
//  Author:  Christian Lerke																							//
\\  Create Date: August 5, 2011																							\\
//  Description: 																										//
\\																														\\
//----------------------------------------------------------------------------------------------------------------------*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// GLOBAL VARIABLES ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var centerCheckerTime = 200;	// microseconds between center checks
var centerTimer;				// timer to check if startup is centered


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: initiate																										\\
//  Description: 																										//
\\  Expects: VOID																										\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function initiate() {

	if( window.innerWidth < 1200 && screen.availWidth >= 1250 ) { self.resizeTo(1200, screen.availHeight); }
	
	setUpVariables();
	
	centerNavigation();
	
	// needs to rerun incase it was not fully loaded
	window.setTimeout( function() {
	
		centerNavigation();
	
	}, 1000);
	
	centerTimer = setInterval ( centerStartup, centerCheckerTime );
	
}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: centerStartup																									\\
//  Description: keeps the startup centered																				//
\\  Expects: VOID																										\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function centerStartup() {

	var divHeader = document.getElementById("Header");
	
	divHeader.style.paddingTop = "";
	
	var myHeight = 0;
	if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		myHeight = window.innerHeight;
	} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE 6+ in 'standards compliant mode'
		myHeight = document.documentElement.clientHeight;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		//IE 4 compatible
		myHeight = document.body.clientHeight;
	}
	
	divHeader.style.paddingTop = Math.round( ( ( myHeight / 2 ) - ( divHeader.offsetHeight / 2 ) ) * 2/3 );
	
}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: toogleMap																										\\
//  Description: shows and hides the map																				//
\\  Expects: VOID																										\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function toogleMap() {

	var Map = document.getElementById("Map");

	if( Map.className == "Map" ) {

		Map.className = "MapHidden";

	} else {

		Map.className = "Map";

	}

}

/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: extendHeight																									\\
//  Description: makes sure the height of the content is at least the same as the browser window						//
\\  Expects: VOID																										\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function extendHeight() {
	
	divContainer.style.height = "";
	
	divFooter = document.getElementById("Footer");
	
	removeClassName ( divFooter, "bottom");
	
	var containerHeight = divContainer.offsetHeight;
	
	var browserHeight = window.innerHeight;
	
	if ( containerHeight < browserHeight ) {
	
		divContainer.style.height = browserHeight;
		
		addClassName ( divFooter, "bottom");
		
	}

}

