/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.MachUp = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setClass( 'menu-title' );
	title.setTextContent( 'MachUp 5' );
	container.add( title );

	return container;

	function unlock_callback(result) {
			if(result.error == undefined) { // success
					var msg = result.success;
			} else {
					var msg = result.error;
			}
			alert(msg);
	}

};
