/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Edit = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Edit' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// Undo

	var undo = new UI.Row();
	undo.setClass( 'option' );
	undo.setTextContent( 'Undo (Ctrl+Z)' );
	undo.onClick( function () {

		editor.undo();

	} );
	options.add( undo );

	// Redo

	var redo = new UI.Row();
	redo.setClass( 'option' );
	redo.setTextContent( 'Redo (Ctrl+Shift+Z)' );
	redo.onClick( function () {

		editor.redo();

	} );
	options.add( redo );

	// Clear History

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Clear History' );
	option.onClick( function () {

		if ( confirm( 'The Undo/Redo History will be cleared. Are you sure?' ) ) {

			editor.history.clear();

		}

	} );
	//options.add( option );


	editor.signals.historyChanged.add( function () {

		var history = editor.history;

		undo.setClass( 'option' );
		redo.setClass( 'option' );

		if ( history.undos.length == 0 ) {

			undo.setClass( 'inactive' );

		}

		if ( history.redos.length == 0 ) {

			redo.setClass( 'inactive' );

		}

	} );

	// ---

	options.add( new UI.HorizontalRule() );

	// Clone

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Clone Object' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object.parent === null ) return; // avoid cloning the camera or scene

		object_clone = object.clone();
        object_clone.name = object.name+"_clone";

		editor.execute( new AddObjectCommand( object_clone ) );

	} );
	options.add( option );

	// Delete

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Delete (Del)' );
	option.onClick( function () {

		var object = editor.selected;

		if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;

		var parent = object.parent;
		if ( parent === undefined ) return; // avoid deleting the camera or scene
		if ( object.name === 'Center of Gravity' ) return; //avoid deleting the CG Sphere
		if ( object.name === 'Aerodynamic Center' ) return; //avoid deleting the CG Sphere

		editor.execute( new RemoveObjectCommand( object ) );

	} );
	options.add( option );

	return container;

};
