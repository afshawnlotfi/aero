/**
 * @author doughunsaker / http://doughunsaker.com
 */

Sidebar.Geometry.PropGeometry = function ( editor, object ) {

	var signals = editor.signals;

	var container = new UI.Row();

	var parameters = object.geometry.parameters;

    // rotation
	var rotationRow = new UI.Row();
	var rotationType = new UI.Select().setOptions( {

		'CCW':  'CCW',
		'CW': 'CW'

	} ).setWidth( '100px' ).setColor( '#000' ).setFontSize( '12px' )
	rotationType.onChange( update );
	rotationRow.add( new UI.Text( 'Rotation' ).setWidth( '100px' ) );
	rotationRow.add( rotationType );
	container.add( rotationRow );
    rotationType.setValue(parameters.rotation);

	// n Blades
	var nbladesRow = new UI.Row();
	var nblades = new UI.Integer( parameters.nblades ).setRange( 1, 10 ).onChange( update );
	nbladesRow.add( new UI.Text( '# of Blades' ).setWidth( '100px' ) );
	nbladesRow.add( nblades );
	container.add( nbladesRow );

	// diameter
	var diameterRow = new UI.Row();
	var diameter = new UI.Number( parameters.diameter ).onChange( update );
	diameterRow.add( new UI.Text( 'Diameter' ).setWidth( '100px' ) );
	diameterRow.add( diameter );
	container.add( diameterRow );

	// pitch
	var pitchRow = new UI.Row();
	var pitch = new UI.Number( parameters.pitch ).onChange( update );
    pitchRow.add( new UI.Text( 'Pitch' ).setWidth( '100px' ) );
	pitchRow.add( pitch );
	container.add( pitchRow );

	// hub radius
	var hubRow = new UI.Row();
	var hub_radius = new UI.Number( parameters.hub_radius ).onChange( update );
	hubRow.add( new UI.Text( 'Hub Radius' ).setWidth( '100px' ) );
	hubRow.add( hub_radius );
	container.add( hubRow );

    // --------------------------------------
	container.add( new UI.HorizontalRule() );

	var ellipticalRow = new UI.Row().setWidth( '300px' ).setMarginTop( '10px' );
	var elliptical = new UI.Checkbox( parameters.elliptical ).onChange( update ); // DFH
	ellipticalRow.add( new UI.Text( 'Elliptical').setWidth( '100px' ) );
	ellipticalRow.add( elliptical );
	container.add( ellipticalRow ); // DFH

	// root_chord
	var root_chordRow = new UI.Row();
	var root_chord = new UI.Number( parameters.root_chord ).onChange( update );
	root_chordRow.add( new UI.Text( 'Root Chord' ).setWidth( '100px' ) );
	root_chordRow.add( root_chord );
	container.add( root_chordRow );

	// tip_chord
	var tip_chordRow = new UI.Row();
	var tip_chord = new UI.Number( parameters.tip_chord ).onChange( update );
	tip_chordRow.add( new UI.Text( 'Tip Chord' ).setWidth( '100px' ) );
	tip_chordRow.add( tip_chord );
	container.add( tip_chordRow );

    if (elliptical.dom.checked == true){tip_chordRow.setDisplay( 'none' );}
    else{tip_chordRow.setDisplay( 'block' );}



    // --------------------------------------
    // root_airfoil
    // --------------------------------------
	var rootAirfoil = new UI.CollapsiblePanel();
    rootAirfoil.setCollapsed( true );
	rootAirfoil.addStatic( new UI.Text( 'Root Airfoil' ) );
	rootAirfoil.add( new UI.Break() );

	var root_nameRow = new UI.Row().setWidth( '300px'); // DFH
	var root_nameType = new UI.Input().setWidth( '100px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( update );
	root_nameRow.add( new UI.Text( 'Airfoil (graphics only)' ).setWidth( '140px' ) );
	root_nameRow.add( root_nameType );
	rootAirfoil.add( root_nameRow );
	for (var root_name in parameters.root_airfoil) break;
    root_nameType.setValue( root_name );

	// root al0
	var root_al0Row = new UI.Row().setWidth( '300px');
	var root_al0 = new UI.Number( parameters.root_airfoil[root_name].properties.alpha_L0 ).onChange( update );
	root_al0Row.add( new UI.Text( 'Zero-Lift Alpha (rad)' ).setWidth( '140px' ) );
	root_al0Row.add( root_al0 );
	rootAirfoil.add( root_al0Row );

	// root cla
	var root_ClaRow = new UI.Row().setWidth( '300px'); // DFH
	var root_Cla = new UI.Number( parameters.root_airfoil[root_name].properties.CL_alpha ).onChange( update );
	root_ClaRow.add( new UI.Text( 'Lift Slope (1/rad)' ).setWidth( '140px' ) );
	root_ClaRow.add( root_Cla );
	rootAirfoil.add( root_ClaRow );

	// root Cml0
	var root_Cml0Row = new UI.Row().setWidth( '300px'); // DFH
	var root_Cml0 = new UI.Number( parameters.root_airfoil[root_name].properties.Cm_L0 ).onChange( update );
	root_Cml0Row.add( new UI.Text( 'Zero-Lift Cm' ).setWidth( '140px' ) );
	root_Cml0Row.add( root_Cml0 );
	rootAirfoil.add( root_Cml0Row );

	// root Cma
	var root_CmaRow = new UI.Row().setWidth( '300px'); // DFH
	var root_Cma = new UI.Number( parameters.root_airfoil[root_name].properties.Cm_alpha ).onChange( update );
	root_CmaRow.add( new UI.Text( 'Moment Slope (1/rad)' ).setWidth( '140px' ) );
	root_CmaRow.add( root_Cma );
	rootAirfoil.add( root_CmaRow );

	// root CD0
	var root_CD0Row = new UI.Row().setWidth( '300px'); // DFH
	var root_CD0 = new UI.Number( parameters.root_airfoil[root_name].properties.CD0 ).onChange( update );
	root_CD0Row.add( new UI.Text( 'Zero-Lift CD' ).setWidth( '140px' ) );
	root_CD0Row.add( root_CD0 );
	rootAirfoil.add( root_CD0Row );

	// root CD0_L
	var root_CD0_LRow = new UI.Row().setWidth( '300px'); // DFH
	var root_CD0_L = new UI.Number( parameters.root_airfoil[root_name].properties.CD0_L ).onChange( update );
	root_CD0_LRow.add( new UI.Text( 'CD,L' ).setWidth( '140px' ) );
	root_CD0_LRow.add( root_CD0_L );
	rootAirfoil.add( root_CD0_LRow );

	// root CD0_L2
	var root_CD0_L2Row = new UI.Row().setWidth( '300px'); // DFH
	var root_CD0_L2 = new UI.Number( parameters.root_airfoil[root_name].properties.CD0_L2 ).onChange( update );
	root_CD0_L2Row.add( new UI.Text( 'CD,L^2' ).setWidth( '140px' ) );
	root_CD0_L2Row.add( root_CD0_L2 );
	rootAirfoil.add( root_CD0_L2Row );

	// root CLmax
	var root_CLmaxRow = new UI.Row().setWidth( '300px'); // DFH
	var root_CLmax = new UI.Number( parameters.root_airfoil[root_name].properties.CL_max ).onChange( update );
	root_CLmaxRow.add( new UI.Text( 'Max Lift Coefficient' ).setWidth( '140px' ) );
	root_CLmaxRow.add( root_CLmax );
	rootAirfoil.add( root_CLmaxRow );

	container.add( rootAirfoil );

    // --------------------------------------
    // tip_airfoil
    // --------------------------------------
	var tipAirfoil = new UI.CollapsiblePanel();
    tipAirfoil.setCollapsed( true );
	tipAirfoil.addStatic( new UI.Text( 'Tip Airfoil' ) );
	//tipAirfoil.add( new UI.Break() );

	var same_as_rootRow = new UI.Row().setWidth( '300px' ).setMarginTop( '10px' );
	var sameAsRoot = new UI.Checkbox( parameters.same_as_root ).onChange( update ); // DFH
	same_as_rootRow.add( new UI.Text( 'Same as Root').setWidth( '140px' ) );
	same_as_rootRow.add( sameAsRoot );
	tipAirfoil.add( same_as_rootRow ); // DFH

	var tip_nameRow = new UI.Row().setWidth( '300px'); // DFH
	var tip_nameType = new UI.Input().setWidth( '100px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( update );
	tip_nameRow.add( new UI.Text( 'Airfoil (graphics only)' ).setWidth( '140px' ) );
	tip_nameRow.add( tip_nameType );
	tipAirfoil.add( tip_nameRow );
	for (var tip_name in parameters.tip_airfoil) break;
    tip_nameType.setValue( tip_name );

	// tip al0
	var tip_al0Row = new UI.Row().setWidth( '300px'); // DFH
	var tip_al0 = new UI.Number( parameters.tip_airfoil[tip_name].properties.alpha_L0 ).onChange( update );
	tip_al0Row.add( new UI.Text( 'Zero-Lift Alpha (rad)' ).setWidth( '140px' ) );
	tip_al0Row.add( tip_al0 );
	tipAirfoil.add( tip_al0Row );

	// tip cla
	var tip_ClaRow = new UI.Row().setWidth( '300px'); // DFH
	var tip_Cla = new UI.Number( parameters.tip_airfoil[tip_name].properties.CL_alpha ).onChange( update );
	tip_ClaRow.add( new UI.Text( 'Lift Slope (1/rad)' ).setWidth( '140px' ) );
	tip_ClaRow.add( tip_Cla );
	tipAirfoil.add( tip_ClaRow );

	// tip Cml0
	var tip_Cml0Row = new UI.Row().setWidth( '300px'); // DFH
	var tip_Cml0 = new UI.Number( parameters.tip_airfoil[tip_name].properties.Cm_L0 ).onChange( update );
	tip_Cml0Row.add( new UI.Text( 'Zero-Lift Cm' ).setWidth( '140px' ) );
	tip_Cml0Row.add( tip_Cml0 );
	tipAirfoil.add( tip_Cml0Row );

	// tip Cma
	var tip_CmaRow = new UI.Row().setWidth( '300px'); // DFH
	var tip_Cma = new UI.Number( parameters.tip_airfoil[tip_name].properties.Cm_alpha ).onChange( update );
	tip_CmaRow.add( new UI.Text( 'Moment Slope (1/rad)' ).setWidth( '140px' ) );
	tip_CmaRow.add( tip_Cma );
	tipAirfoil.add( tip_CmaRow );

	// tip CD0
	var tip_CD0Row = new UI.Row().setWidth( '300px'); // DFH
	var tip_CD0 = new UI.Number( parameters.tip_airfoil[tip_name].properties.CD0 ).onChange( update );
	tip_CD0Row.add( new UI.Text( 'Zero-Lift CD' ).setWidth( '140px' ) );
	tip_CD0Row.add( tip_CD0 );
	tipAirfoil.add( tip_CD0Row );

	// tip CD0_L
	var tip_CD0_LRow = new UI.Row().setWidth( '300px'); // DFH
	var tip_CD0_L = new UI.Number( parameters.tip_airfoil[tip_name].properties.CD0_L ).onChange( update );
	tip_CD0_LRow.add( new UI.Text( 'CD,L' ).setWidth( '140px' ) );
	tip_CD0_LRow.add( tip_CD0_L );
	tipAirfoil.add( tip_CD0_LRow );

	// tip CD0_L2
	var tip_CD0_L2Row = new UI.Row().setWidth( '300px'); // DFH
	var tip_CD0_L2 = new UI.Number( parameters.tip_airfoil[tip_name].properties.CD0_L2 ).onChange( update );
	tip_CD0_L2Row.add( new UI.Text( 'CD,L^2' ).setWidth( '140px' ) );
	tip_CD0_L2Row.add( tip_CD0_L2 );
	tipAirfoil.add( tip_CD0_L2Row );

	// tip CLmax
	var tip_CLmaxRow = new UI.Row().setWidth( '300px'); // DFH
	var tip_CLmax = new UI.Number( parameters.tip_airfoil[tip_name].properties.CL_max ).onChange( update );
	tip_CLmaxRow.add( new UI.Text( 'Max Lift Coefficient' ).setWidth( '140px' ) );
	tip_CLmaxRow.add( tip_CLmax );
	tipAirfoil.add( tip_CLmaxRow );

	//tipAirfoil.setMarginBottom( '-8px' );
	container.add( tipAirfoil );
    // --------------------------------------
    // electric motor info

	var eMotor = new UI.CollapsiblePanel();
    eMotor.setCollapsed( true );
	eMotor.addStatic( new UI.Text( 'Electric Motor' ) );
	var has_eMotorRow = new UI.Row().setWidth( '300px' ).setMarginTop( '10px' );
	var has_eMotor = new UI.Checkbox( parameters.electric_motor.has_motor ).onChange( update ); // DFH
	has_eMotorRow.add( new UI.Text( 'Has Electric Motor').setWidth( '140px' ) );
	has_eMotorRow.add( has_eMotor );
	eMotor.add( has_eMotorRow ); 

	// motor Kv
	var kvRow = new UI.Row(); // DFH
	var kv = new UI.Number( parameters.electric_motor.motor_kv ).onChange( update );
	kvRow.add( new UI.Text( 'Motor KV' ).setWidth( '300px' ) );
	kvRow.add( kv );
	eMotor.add( kvRow );

	// motor resistance
	var mrRow = new UI.Row(); // DFH
	var mr = new UI.Number( parameters.electric_motor.motor_resistance ).onChange( update );
	mrRow.add( new UI.Text( 'Motor Resistance (ohms)' ).setWidth( '300px' ) );
	mrRow.add( mr );
	eMotor.add( mrRow );

	// motor no load current
	var nlcRow = new UI.Row(); // DFH
	var nlc = new UI.Number( parameters.electric_motor.motor_no_load_current ).onChange( update );
	nlcRow.add( new UI.Text( 'Motor No Load Current (amps)' ).setWidth( '300px' ) );
	nlcRow.add( nlc );
	eMotor.add( nlcRow );

	// gear reduction
	var grRow = new UI.Row(); // DFH
	var gr = new UI.Number( parameters.electric_motor.gear_reduction ).onChange( update );
	grRow.add( new UI.Text( 'Gear Reduction Ratio' ).setWidth( '300px' ) );
	grRow.add( gr );
	eMotor.add( grRow );

	// battery voltage
	var bvRow = new UI.Row(); // DFH
	var bv = new UI.Number( parameters.electric_motor.battery_voltage ).onChange( update );
	bvRow.add( new UI.Text( 'Battery No Load Voltage (volts)' ).setWidth( '300px' ) );
	bvRow.add( bv );
	eMotor.add( bvRow );

	// battery resistance
	var brRow = new UI.Row(); // DFH
	var br = new UI.Number( parameters.electric_motor.battery_resistance ).onChange( update );
	brRow.add( new UI.Text( 'Battery Internal Resistance (ohms)' ).setWidth( '300px' ) );
	brRow.add( br );
	eMotor.add( brRow );

	// speed control resistance
	var scrRow = new UI.Row(); // DFH
	var scr = new UI.Number( parameters.electric_motor.speed_control_resistance ).onChange( update );
	scrRow.add( new UI.Text( 'Speed Controller Resistance (ohms)' ).setWidth( '300px' ) );
	scrRow.add( scr );
	eMotor.add( scrRow );

	eMotor.setMarginBottom( '-8px' );
	container.add( eMotor);

    //-------------------------------------
	container.add( new UI.HorizontalRule() );
	// nSeg
	var segmentsRow = new UI.Row().setWidth( '300px');
	var nSeg = new UI.Integer( parameters.nSeg ).setRange( 20, 200 ).onChange( update );
	segmentsRow.add( new UI.Text( 'Spanwise Segments' ).setWidth( '140px' ) );
	segmentsRow.add( nSeg );
	container.add( segmentsRow );

	// nAirfoilPoints
	var afSegRow = new UI.Row();
	var nAFseg = new UI.Select().setOptions( {"50" : "50", "100" : "100", "200" : "200"} ).setWidth( '80px' ).setColor( '#000' ).setFontSize( '12px' )
	nAFseg.onChange( update );
	afSegRow.add( new UI.Text( 'Airfoil Segments' ).setWidth( '120px' ) );
	afSegRow.add( nAFseg );
	container.add( afSegRow );
    nAFseg.setValue( parameters.nAFseg );

	//

	function update() {
		object.geometry.dispose();


	if ( sameAsRoot.dom.checked === true ) {
		var root_airfoil = {};
		var afname = check_airfoil(root_nameType.getValue());
		root_airfoil[afname] = {};
		root_airfoil[afname].properties = {};
		root_airfoil[afname].properties.type = 'linear';
		root_airfoil[afname].properties.alpha_L0 = root_al0.getValue();
		root_airfoil[afname].properties.CL_alpha = root_Cla.getValue();
		root_airfoil[afname].properties.Cm_L0 = root_Cml0.getValue();
		root_airfoil[afname].properties.Cm_alpha = root_Cma.getValue();
		root_airfoil[afname].properties.CD0 = root_CD0.getValue();
		root_airfoil[afname].properties.CD0_L = root_CD0_L.getValue();
		root_airfoil[afname].properties.CD0_L2 = root_CD0_L2.getValue();
		root_airfoil[afname].properties.CL_max = root_CLmax.getValue();

		var tip_airfoil = {};
		var afname = check_airfoil(tip_nameType.getValue());
		tip_airfoil[afname] = {};
		tip_airfoil[afname].properties = {};
		tip_airfoil[afname].properties.type = 'linear';
		tip_airfoil[afname].properties.alpha_L0 = root_al0.getValue();
		tip_airfoil[afname].properties.CL_alpha = root_Cla.getValue();
		tip_airfoil[afname].properties.Cm_L0 = root_Cml0.getValue();
		tip_airfoil[afname].properties.Cm_alpha = root_Cma.getValue();
		tip_airfoil[afname].properties.CD0 = root_CD0.getValue();
		tip_airfoil[afname].properties.CD0_L = root_CD0_L.getValue();
		tip_airfoil[afname].properties.CD0_L2 = root_CD0_L2.getValue();
		tip_airfoil[afname].properties.CL_max = root_CLmax.getValue();

		tip_nameRow.setDisplay( 'none' ); // DFH
		tip_al0Row.setDisplay( 'none' ); // DFH
		tip_ClaRow.setDisplay( 'none' ); // DFH
		tip_Cml0Row.setDisplay( 'none' ); // DFH
		tip_CmaRow.setDisplay( 'none' ); // DFH
		tip_CD0Row.setDisplay( 'none' ); // DFH
		tip_CD0_LRow.setDisplay( 'none' ); // DFH
		tip_CD0_L2Row.setDisplay( 'none' ); // DFH
		tip_CLmaxRow.setDisplay( 'none' ); // DFH
	}else{
	        var root_airfoil = {};
	        var afname = check_airfoil(root_nameType.getValue());
	        root_airfoil[afname] = {};
	        root_airfoil[afname].properties = {};
	        root_airfoil[afname].properties.type = 'linear';
	        root_airfoil[afname].properties.alpha_L0 = root_al0.getValue();
	        root_airfoil[afname].properties.CL_alpha = root_Cla.getValue();
	        root_airfoil[afname].properties.Cm_L0 = root_Cml0.getValue();
	        root_airfoil[afname].properties.Cm_alpha = root_Cma.getValue();
	        root_airfoil[afname].properties.CD0 = root_CD0.getValue();
	        root_airfoil[afname].properties.CD0_L = root_CD0_L.getValue();
	        root_airfoil[afname].properties.CD0_L2 = root_CD0_L2.getValue();
	        root_airfoil[afname].properties.CL_max = root_CLmax.getValue();

	        var tip_airfoil = {};
	        var afname = check_airfoil(tip_nameType.getValue());
	        tip_airfoil[afname] = {};
	        tip_airfoil[afname].properties = {};
	        tip_airfoil[afname].properties.type = 'linear';
	        tip_airfoil[afname].properties.alpha_L0 = tip_al0.getValue();
	        tip_airfoil[afname].properties.CL_alpha = tip_Cla.getValue();
	        tip_airfoil[afname].properties.Cm_L0 = tip_Cml0.getValue();
	        tip_airfoil[afname].properties.Cm_alpha = tip_Cma.getValue();
	        tip_airfoil[afname].properties.CD0 = tip_CD0.getValue();
	        tip_airfoil[afname].properties.CD0_L = tip_CD0_L.getValue();
	        tip_airfoil[afname].properties.CD0_L2 = tip_CD0_L2.getValue();
	        tip_airfoil[afname].properties.CL_max = tip_CLmax.getValue();

		tip_nameRow.setDisplay( 'block' ); // DFH
		tip_al0Row.setDisplay( 'block' ); // DFH
		tip_ClaRow.setDisplay( 'block' ); // DFH
		tip_Cml0Row.setDisplay( 'block' ); // DFH
		tip_CmaRow.setDisplay( 'block' ); // DFH
		tip_CD0Row.setDisplay( 'block' ); // DFH
		tip_CD0_LRow.setDisplay( 'block' ); // DFH
		tip_CD0_L2Row.setDisplay( 'block' ); // DFH
		tip_CLmaxRow.setDisplay( 'block' ); // DFH

	}

    if (elliptical.dom.checked == true){tip_chordRow.setDisplay( 'none' );}
    else{tip_chordRow.setDisplay( 'block' );}

    var electric_motor = {}
    electric_motor.has_motor = has_eMotor.getValue();
    electric_motor.motor_kv = kv.getValue();
    electric_motor.gear_reduction = gr.getValue();
    electric_motor.motor_resistance = mr.getValue();
    electric_motor.motor_no_load_current = nlc.getValue();
    electric_motor.battery_resistance = br.getValue();
    electric_motor.battery_voltage = bv.getValue();
    electric_motor.speed_control_resistance = scr.getValue();

    if (has_eMotor.dom.checked == true){
		kvRow.setDisplay( 'block' ); // DFH
		mrRow.setDisplay( 'block' ); // DFH
		nlcRow.setDisplay( 'block' ); // DFH
		grRow.setDisplay( 'block' ); // DFH
		bvRow.setDisplay( 'block' ); // DFH
		brRow.setDisplay( 'block' ); // DFH
		scrRow.setDisplay( 'block' ); // DFH
    }else{
		kvRow.setDisplay( 'none' ); // DFH
		mrRow.setDisplay( 'none' ); // DFH
		nlcRow.setDisplay( 'none' ); // DFH
		grRow.setDisplay( 'none' ); // DFH
		bvRow.setDisplay( 'none' ); // DFH
		brRow.setDisplay( 'none' ); // DFH
		scrRow.setDisplay( 'none' ); // DFH
    }

	object.geometry = new THREE.PropGeometry(
	    nblades.getValue(),
            rotationType.getValue(),
            diameter.getValue(),
            pitch.getValue(),
            hub_radius.getValue(),
            root_chord.getValue(),
	    tip_chord.getValue(),
            elliptical.getValue(),
            root_airfoil,
            tip_airfoil,
            electric_motor,
            nSeg.getValue(),
            parseInt(nAFseg.getValue()),
            sameAsRoot.getValue()
		);

		object.geometry.computeBoundingSphere();
		object.geometry.computeBoundingBox();

        signals.objectChanged.dispatch( object );
        update_prop_controls(editor);

	}

    update();
	return container;

}
