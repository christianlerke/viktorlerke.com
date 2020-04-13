////////////////////////////////////////////////////// Dynamic AJAX //////////////////////////////////////////////////////
/*----------------------------------------------------------------------------------------------------------------------//
\\																														\\
//  Author:  Christian Lerke																							//
\\  Create Date: August 5, 2011																							\\
//  Description: This loads navigation, subnavigation and page content and switches it without reloading the entire page//
\\																														\\
//----------------------------------------------------------------------------------------------------------------------*/


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// GLOBAL VARIABLES ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var Language = "";				// the selected Language
var currentSection = "";		// will be empty if section is empty otherwise it will contain the name of the section as a string
var currentPage = "";			// will contain the name of the currently displayed page
var visibleSection = "";			// empty if no subnavigation is shown otherwise the name of the subnavigation
var seenNavigation = "";		// this will change to 1 once the user moves on form the initial page
var locationCheckerTime = 200;	// microseconds between location checks
var locationTimer;				// timer to check liocation hash
var HTMLRequest;				// the currently active HTML request
var HTMLkind;					// the kind of the currently active HTML request
var loadingHTML = 0;			// indicates if there is currently a page being loaded
var transitioning = "";			// indicates weather a transition is occuring


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// USECASE VARIABLES ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var startPage = "http://www.viktorlerke.com/";						// the location of the startpage

var divContainer;
var divSubNavigation;
var divContent;
var divContentList;
var divContentDetail;

function setUpVariables() {

	divContainer = document.getElementById("Container");			// the Container div
	divNavigation = document.getElementById("Navigation");			// the Navigation div
	divSubNavigation = document.getElementById("SubNavigation");	// the SubNavigation div
	divContent = document.getElementById("Content");				// the Page content div
	divContentList = document.getElementById("ContentList");		// the div containing the list of items
	divContentDetail = document.getElementById("ContentDetail");	// the div containing the content of the selected list item
	
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: setHash																										\\
//  Description: sets the location hash																					//
\\  Expects: VOID																										\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function setHash () {

	var locationHash;

	if ( currentSection == "" ) {

		locationHash = currentPage;

	} else {

		locationHash = currentSection + "-" + currentPage;

	}

	parent.location.hash = locationHash;

}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: parseHash																										\\
//  Description: sets the location hash																					//
\\  Expects: VOID																										\\
//  Returns: STRING empty if no hash present, "changeless" no change was made,											//
\\		"changed" if the global variables have been set and "wrong" if the hash is invalid								\\
 \\---------------------------------------------------------------------------------------------------------------------*/

function parseHash () {

	var locationHash = String(document.location.hash.substring(1));

	if ( locationHash == "" ) {

		currentPage = "";
		currentSection = "";

		return "empty";

	}

	var locationArray = locationHash.split("-");

	if ( locationArray.length == 1 ) {

		var newPage = locationArray[0];

		currentSection = "";

		if ( newPage != currentPage ) {

			currentPage = newPage;

			return "changed";

		} else {

			return "changeless";

		}

	} else if ( locationArray.length == 2 ) {

		var newSection = locationArray[0];
		var newPage = locationArray[1];

		if ( newPage != currentPage || newSection != currentSection ) {

			currentPage = newPage;
			currentSection = newSection;

			return "changed";

		} else {

			return "changeless";

		}


	} else {

		currentPage = "";
		currentSection = "";

		return "wrong";

	}

}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: waitAndLoad																									\\
//  Description: loads the page is something else is loading it waits until its done									//
\\  Expects: STRING kind (page, navigation, subnavigation, contentdetail) shows what kind of data it is loading,		\\
//		page the name of the page, section, selected list item   !!NOTE!! some of these are optional					//
\\  Returns: INT 0 if request failed, 1 if request was submitted														\\
 \\---------------------------------------------------------------------------------------------------------------------*/

function waitAndLoad ( kind, page, section, item ) {

	if ( loadingHTML == 0 ) {
		
		document.body.style.cursor = "progress";
		transitioning = 1;
			
		switch( kind ) {

			case "page":
				
				smoothScroll('Header');
				
				addClassName( divContent, "outgoing");

				window.setTimeout( function() {
					
					if( hasClassName( divContent, "outgoing" ) ) {
					
						addClassName( divContent, "loading");
						
						extendHeight();
					
					}
					
				}, 1100);

				setHash();

				if ( currentSection == "" ) {

					loadHTMLDoc('Pages/' + Language + '/' + currentPage + '/index.html', kind);

				} else {

					loadHTMLDoc('Pages/' + Language + '/' + currentSection + '/' + currentPage + '/index.html', kind);

					selectNavigation ( page, divSubNavigation );

				}

				break;


			case "navigation":
				
				smoothScroll('Header');
				
				addClassName( divNavigation, "outgoing");

				loadHTMLDoc('Pages/' + Language + '/index.html', kind);

				break;


			case "subnavigation":
				
				smoothScroll('Header');
				
				visibleSection = section;
				
				addClassName( divSubNavigation, "outgoing");

				loadHTMLDoc('Pages/' + Language + "/" + visibleSection + '/index.html', kind);

				selectNavigation( visibleSection, divNavigation );

				break;

			case "contentdetail":
				
				smoothScroll('Content');
				
				addClassName( divContentDetail, "outgoing" );
								
				window.setTimeout( function() {
					
					if( hasClassName( divContentDetail, "outgoing" ) )
						addClassName( divContentDetail, "loading" );
					
				}, 1100);

				loadHTMLDoc('Pages/' + Language + '/' + currentSection + '/' + currentPage + '/' + item + '.html', kind);

				selectNavigation( item, divContentList );

				break;

		}

	} else {

		window.setTimeout( function() {

			waitAndLoad( kind, page, section, item );

		}, 200 );

	}

}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: selectNavigation																								\\
//  Description: highlights the currently selected Navigation item														//
\\  Expects: STRING subsection name, navigation id																		\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function selectNavigation ( sectionName, navigation) {
	
	var navigationItems = navigation.getElementsByTagName("li");

	for ( i = 0; i < navigationItems.length; i++ ) {

		if ( navigationItems[i].title == sectionName ) {

			addClassName( navigationItems[i], "selected");

		} else {

			removeClassName( navigationItems[i], "selected" );

		}

	}
	
	if ( navigation == divNavigation )
		visibleSection = sectionName;
	else {
		selectNavigation( visibleSection, divNavigation );
	}
}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: locationChange																								\\
//  Description: responds to a change in the location																	//
\\  Expects: VOID																										\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function locationChange () {

	var currentHash = parseHash();
	
	
	if ( currentHash == "changed" ) {
		
		loadPage ( currentPage, currentSection, 1 );
		
	} else if ( currentHash == "wrong" || currentHash == "empty" ) {

		loadPage ( "welcome", currentSection, 1 );
		
	}

}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: loadPage																										\\
//  Description: responds to a change in the location																	//
\\  Expects: STRING page name, section name	, INT force 0 no 1 yes																			\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function loadPage ( page, section, force ) {

	if( page == currentPage && section == currentSection && seenNavigation && force == 0 )
		return;

	if( validatePage ( page, section ) ) { 

		currentPage = page;
		currentSection = section;
		
	} else {
		
		currentPage = "welcome";
		currentSection = "";
		visibleSection = "";
		
	}
	
	setHash();
	
	if ( currentSection != visibleSection && currentSection != "") {
		
		waitAndLoad ( "subnavigation", "", currentSection, "" );
		
	}
	
	waitAndLoad ( "page", currentPage, currentSection, "" );

}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: validatePage																									\\
//  Description: check if the page exsists																				//
\\  Expects: STRING page name, section name																				\\
//  Returns: INT 0 if invalid, 1 if valid																				//
\\---------------------------------------------------------------------------------------------------------------------*/

function validatePage ( page, section ) {

	var exsists = 0;
	var database;

	switch( Language ) {

		case "german":
 			database = german;
 			break;

		case "english":
			database = english;
			break;

		case "spanish":
 			database = spanish;
 			break;

		case "russian":
			database = russian;
			break;

		default:
			window.location.href = startPage;

	}

	var validationstring = section + "-" + page;

	for ( i = 0; i < database.length; i++ ) {

		if( database[i] == validationstring ) {
		
			exsists = 1;
		
			break;
			
		}

	}

	if ( exsists == 1 ) {

		return 1;

	} else {

		return 0;

	}

}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: loadSubNavigation																								\\
//  Description: loads the SubNavigation clicked on																		//
\\  Expects: STRING page name, section name																				\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function loadSubNavigation ( targetNavigation ) {
	
	if( targetNavigation != visibleSection ) {
		
		visibleSection = targetNavigation;
		
		waitAndLoad ( 'subnavigation', "", targetNavigation, "" );
	
	}
	
}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: loadLanguage																									\\
//  Description: starts the page in the selected language																//
\\  Expects: STRING language name																						\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function loadLanguage ( target ) {
	
	divOtherbrowsers = document.getElementById("otherbrowsers");
	
	if ( divOtherbrowsers != null ) {
		
		divOtherbrowsers.innerHTML = "";
		
	}
	
	clearInterval( centerTimer );
	document.getElementById("Header").style.paddingTop = "";
	
	addClassName( divContainer, "hiddenSubMenu");
	removeClassName( divContainer, "startup");
	
	Language = target;
	
	// load navigation
	waitAndLoad( "navigation", "", "", "" );
	
	parseHash();
	
	if ( currentPage == "" ) {

		loadPage ( "welcome", "", 1 );

	} else {

		loadPage ( currentPage, currentSection, 1 );

	}
	
	locationTimer = setInterval ( locationChange, locationCheckerTime );

}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: loadWelcomePage																								\\
//  Description: loads the welcome page and resets navigation															//
\\  Expects: VOID																										\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function loadWelcomePage () {

	if ( Language != 0 ) {
		
		loadPage( 'welcome', "", 0 );
	
		selectNavigation( "welcome", divNavigation );
	
		addClassName( divContainer, "hiddenSubMenu" );

	}

}

/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: loadHTMLDoc																									\\
//  Description: starts the page in the selected language																//
\\  Expects: STRING url, kind																							\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function loadHTMLDoc ( url, kind ) {

	HTMLRequest = false;
	loadingHTML = 1;
	
	HTMLkind = kind;
	
	// branch for native XMLHttpRequest object
	if(window.XMLHttpRequest && !(window.ActiveXObject)) {

		try {

			HTMLRequest = new XMLHttpRequest();

		} catch(e) {

			HTMLRequest = false;

		}

	// branch for IE/Windows ActiveX version
	} else if(window.ActiveXObject) {
       		try {
        		HTMLRequest = new ActiveXObject("Msxml2.XMLHTTP");
      		} catch(e) {
        		try {
          			HTMLRequest = new ActiveXObject("Microsoft.XMLHTTP");
        		} catch(e) {
          			HTMLRequest = false;
        		}
		}
	}

	if(HTMLRequest) {

		HTMLRequest.onreadystatechange = verifyHTML;
		HTMLRequest.open("GET", url, true);
		HTMLRequest.send("");
		
	}

}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: verifyHTML																									\\
//  Description: verifies the HTML																						//
\\  Expects: VOID																										\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function verifyHTML() { 

	if ( HTMLRequest.readyState == 4 ) {

		HTMLfinishedLoading(HTMLRequest.responseText);

	}

}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: centerNavigation																								\\
//  Description: centers the navigation																					//
\\  Expects: VOID																										\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function centerNavigation() {

	//get all items
	var navigationItems = divNavigation.getElementsByTagName("li");
	
	//find out space they take up
	var width = 0;
	
	for ( i = 0; i < navigationItems.length; i++ ) {
		
		navigationItems[i].style.paddingLeft = 0;
		navigationItems[i].style.paddingRight = 0;
		
		width += navigationItems[i].offsetWidth;

	}
	
	paddingAmount = Math.round( ( ( divNavigation.offsetWidth - width - 40 ) / navigationItems.length ) / 2 ) - 1;
	
	for ( i = 0; i < navigationItems.length; i++ ) {
		
		navigationItems[i].style.paddingLeft = paddingAmount;
		navigationItems[i].style.paddingRight = paddingAmount;
	
	}
	
}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: HTMLfinishedLoading																							\\
//  Description: 																										//
\\  Expects: STRING HTML source																							\\
//  Returns: VOID																										//
\\---------------------------------------------------------------------------------------------------------------------*/

function HTMLfinishedLoading( source ) {

	//smoothScroll('Header');

	switch( HTMLkind ) {

		case "navigation":
			
			if( transitioning == 0 ) {

				divNavigation.innerHTML = "";
				divNavigation.innerHTML = source;
				removeClassName( divNavigation, "outgoing" );
				removeClassName( divNavigation, "loading" );
				
				selectNavigation( visibleSection, divNavigation );
				
				centerNavigation();
				
				// needs to rerun incase it was not fully loaded
				window.setTimeout( function() {
				
					centerNavigation();
				
				}, 1000);
				
			} else {
			
				window.setTimeout( function() {
					
					divNavigation.innerHTML = "";
					divNavigation.innerHTML = source;
					removeClassName( divNavigation, "outgoing" );
					removeClassName( divNavigation, "loading" );
					
					selectNavigation( visibleSection, divNavigation );
					
					centerNavigation();
					
					// needs to rerun incase it was not fully loaded
					window.setTimeout( function() {
				
						centerNavigation();
				
					}, 1000);
					
				}, 1000);
			
			}

			break;


		case "subnavigation":
		
			removeClassName( SubNavigation.parentNode, "hiddenSubMenu" );
				
			if( transitioning == 0 ) {

				divSubNavigation.innerHTML = "";
				divSubNavigation.innerHTML = source;
				
				selectNavigation ( currentPage, divSubNavigation );
				
				window.setTimeout( function() {
				
					removeClassName( SubNavigation, "outgoing" );
					removeClassName( SubNavigation, "loading" );
					
				}, 0);
			
			} else {
			
				window.setTimeout( function() {
					
					divSubNavigation.innerHTML = "";
					divSubNavigation.innerHTML = source;
					
					selectNavigation ( currentPage, divSubNavigation );
					
					window.setTimeout( function() {
					
						removeClassName( SubNavigation, "outgoing" );
						removeClassName( SubNavigation, "loading" );
						
					}, 0);
					
				}, 500);
			
			}

			break;


		case "page":
			
			selectNavigation ( currentPage, divSubNavigation );
			
			if ( currentPage == "welcome" ) {
	
				addClassName( SubNavigation.parentNode, "hiddenSubMenu" );
				
			} else {
			
				removeClassName( SubNavigation.parentNode, "hiddenSubMenu" );
			
			}
			
			if( transitioning == 0 ) {

				divContent.innerHTML = "";
				divContent.innerHTML = source;
				removeClassName( divContent, "outgoing" );
				removeClassName( divContent, "loading" );
				
				window.setTimeout( function() {
					
					extendHeight();
					
				}, 500);
				
				setUpVariables();
				
				if( seenNavigation )
					smoothScroll('Content');
				else
					seenNavigation = 1;
				
			} else {
			
				window.setTimeout( function() {
					
					divContent.innerHTML = "";
					divContent.innerHTML = source;
					removeClassName( divContent, "outgoing" );
					removeClassName( divContent, "loading" );
					
					window.setTimeout( function() {
					
						extendHeight();
					
					}, 500);
					
					setUpVariables();
					
					if( seenNavigation )
						smoothScroll('Content');
					else
						seenNavigation = 1;
					
				}, 1000);
			
			}
			
			// Google Analytics
			//_gaq.push(['_trackEvent', 'Pageload', 'finishedloading', Language, currentPage]);
			
			break;


		case "contentdetail":

			if( transitioning == 0 ) {

				divContentDetail.innerHTML = "";
				divContentDetail.innerHTML = source;
				
				removeClassName( divContentDetail, "outgoing" );
				removeClassName( divContentDetail, "loading" );
				
				if( seenNavigation )
					smoothScroll('Content');
				else
					seenNavigation = 1;
				
			} else {
			
				window.setTimeout( function() {
					
					divContentDetail.innerHTML = "";
					divContentDetail.innerHTML = source;
					
					removeClassName( divContentDetail, "outgoing" );
					removeClassName( divContentDetail, "loading" );
					
					if( seenNavigation )
						smoothScroll('Content');
					else
						seenNavigation = 1;
					
				}, 1000);
			
			}

			break;

	}

	loadingHTML = 0;
	document.body.style.cursor = "default";
	
}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: addClassName																									\\
//  Description: add the newClassName to the element																	//
\\  Expects: OBJECT element, STRING new class name																		\\
//  Returns: OBJECT element																								//
\\	Note: Modified version from: http://www.prototypejs.org/															\\
//----------------------------------------------------------------------------------------------------------------------*/

function addClassName (element, newClassName) {
	
	if (!hasClassName(element, newClassName))
		
		element.className += (element.className ? ' ' : '') + newClassName;
	
	return element;
	
}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: removeClassName																								\\
//  Description: remove the newClassName from the element																//
\\  Expects: OBJECT element, STRING remove class name																	\\
//  Returns: OBJECT element																								//
\\	Note: Modified version from: http://www.prototypejs.org/															\\
//----------------------------------------------------------------------------------------------------------------------*/

function removeClassName (element, removeClassName) {
	
	element.className = element.className.replace(new RegExp("(^|\\s+)" + removeClassName + "(\\s+|$)"), ' ');
	
	return element;
	
}


/*----------------------------------------------------------------------------------------------------------------------//
\\  Name: hasClassName																									\\
//  Description: checks if the class name is assigned to the element													//
\\  Expects: OBJECT element, STRING class name to check																	\\
//  Returns: true or false																								//
\\	Note: Modified version from: http://www.prototypejs.org/															\\
//----------------------------------------------------------------------------------------------------------------------*/
function  hasClassName (element, checkClassName) {
    
	return (element.className.length > 0 && (element.className == checkClassName || new RegExp("(^|\\s)" + checkClassName + "(\\s|$)").test(element.className)));

}