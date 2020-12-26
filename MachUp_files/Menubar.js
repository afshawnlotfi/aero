/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Help = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Help' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// About Mach-Up

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'About MachUp' );
	option.onClick( function () {
				var modal = document.getElementById( 'aboutModal' );
				var span = document.getElementsByClassName( 'close' )[0];

				modal.style.display = "block";
				span.onclick = function () {
					modal.style.display = "none";
				}

	} );
	options.add( option );


	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'threejs.org License' );
	option.onClick( function () {

		window.open('http://aero.go.usu.edu/license_threejs');

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Request a feature

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Request a feature' );
	option.onClick( function () {

		window.location.href = 'mailto:doug.hunsaker@usu.edu?Subject=MachUp%20Feature%20Request';

	} );
	options.add( option );

	// Submit a Bug

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Report a bug' );
	option.onClick( function () {

		window.location.href = 'mailto:doug.hunsaker@usu.edu?Subject=MachUp%20bug%20report';

	} );
	options.add( option );

	// Subscribe to updates

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Get update notifications' );
	option.onClick( function () {

		window.open('http://aero.go.usu.edu/subscription');

	} );
	options.add( option );

	return container;

};
