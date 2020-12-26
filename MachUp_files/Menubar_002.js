Menubar.Settings = function ( editor ) {

  var container = new UI.Panel();
  container.setClass( 'menu' );

  var title = new UI.Panel();
  title.setClass( 'title' );
  title.setTextContent( 'Settings' );
  container.add( title );

  var options = new UI.Panel();
  options.setClass( 'options' );
  container.add( options );

  // Background Color

  function onBackgroundChanged() {

		editor.signals.sceneBackgroundChanged.dispatch( backgroundColor.getHexValue() );

	}

  var option = new UI.Row();
  option.setClass( 'option' );
  option.setTextContent( 'Background Color' );
  var backgroundColor = new UI.Color().setValue( '#aaaaaa' ).onChange( onBackgroundChanged );
  option.add( backgroundColor );
  option.onClick( function () {} );
  options.add( option );

  /*
  var backgroundRow = new UI.Row();

	var backgroundColor = new UI.Color().setValue( '#aaaaaa' ).onChange( onBackgroundChanged );

	backgroundRow.add( new UI.Text( 'Background' ).setWidth( '90px' ) );
	backgroundRow.add( backgroundColor );

	container.add( backgroundRow );
  */

  // Theme
  /*
  var option = new UI.Row();
  option.setClass( 'option' );
  option.setTextContent( 'Theme' );
  option.onClick( function () {

    var subcontainer = new UI.Panel();
    subcontainer.setClass( 'menu' );
  */

  // Light theme

  var option = new UI.Row();
  option.setClass( 'option' );
  option.setTextContent( 'Light Theme' );
  option.onClick( function () {

  	editor.setTheme( 'http://aero.go.usu.edu/wp-content/themes/aperture-child/MachUp/gui/V5.0/css/light.css' );
  	editor.config.setKey( 'theme', 'http://aero.go.usu.edu/wp-content/themes/aperture-child/MachUp/gui/V5.0/css/light.css' );

  } );
  options.add( option );

  // Dark theme

  var option = new UI.Row();
  option.setClass( 'option' );
  option.setTextContent( 'Dark Theme' );
  option.onClick( function () {

  	editor.setTheme( 'http://aero.go.usu.edu/wp-content/themes/aperture-child/MachUp/gui/V5.0/css/dark.css' );
  	editor.config.setKey( 'theme', 'http://aero.go.usu.edu/wp-content/themes/aperture-child/MachUp/gui/V5.0/css/dark.css' );

  } );
  options.add( option );

  /* Theme closing bracket
  } );
  options.add( option );
  */

  // History
  /*
  var option = new UI.Row();
  option.setClass( 'option' );
  option.setTextContent( 'History' );
  option.onClick( function () {

  } );
  options.add( option );
  */

  return container;
}
