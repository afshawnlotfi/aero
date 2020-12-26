/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Tutorials = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Tutorials' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );


	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Flying Wing' );
	option.onClick( function () {window.open('http://aero.go.usu.edu/machup/films/#flyingwing');} );
	options.add( option );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Conventional Aircraft' );
	option.onClick( function () {window.open('http://aero.go.usu.edu/machup/films/#conventional');} );
	options.add( option );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Airfoil Analysis Tool' );
	option.onClick( function () {window.open('https://drive.google.com/open?id=0B-YSHgc1dr49ZnFQcmI1d1ZPclU');} );
	options.add( option );

	return container;

};
