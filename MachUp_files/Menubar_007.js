/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.PrintFoam = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( '[Order Foam Core]' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );


	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'EPS Foam' );
	option.onClick( function () {window.open('https://docs.google.com/forms/d/e/1FAIpQLSc8j_s4xfGKwNqg6M62U2DyHSGwNlyYm8ATeb_oCJ_ShYoPdg/viewform?usp=sf_link');} );
	options.add( option );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'EPP Foam' );
	option.onClick( function () {window.open('https://docs.google.com/forms/d/e/1FAIpQLSc8j_s4xfGKwNqg6M62U2DyHSGwNlyYm8ATeb_oCJ_ShYoPdg/viewform?usp=sf_link');} );
	options.add( option );

	return container;

};
