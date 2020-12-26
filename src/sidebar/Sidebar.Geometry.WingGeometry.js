/**
 * @author doughunsaker / http://doughunsaker.com
 */

Sidebar.Geometry.WingGeometry = function (editor, object) {
  var signals = editor.signals

  var container = new UI.Row()

  var parameters = object.geometry.parameters

  // is_mainwing
  var mainwingRow = new UI.Row()
  var is_main_wing = new UI.Checkbox(parameters.is_main)
    .setMarginLeft("-40px")
    .onChange(update)
  mainwingRow.add(new UI.Text("Main Wing").setWidth("140px"))
  mainwingRow.add(is_main_wing)
  container.add(mainwingRow)

  // side
  var sideRow = new UI.Row()
  var sideType = new UI.Select()
    .setOptions({
      both: "Both",
      right: "Right",
      left: "Left",
    })
    .setWidth("100px")
    .setColor("#000")
    .setFontSize("12px")
  sideType.onChange(update)
  sideRow.add(new UI.Text("Side").setWidth("100px"))
  sideRow.add(sideType)
  container.add(sideRow)
  sideType.setValue(parameters.side)

  // y-offset
  var dyRow = new UI.Row()
  var dy = new UI.Number(parameters.dy).onChange(update)
  dyRow.add(new UI.Text("y-Offset").setWidth("100px"))
  dyRow.add(dy)
  container.add(dyRow)

  // span
  var spanRow = new UI.Row()
  var span = new UI.Number(parameters.span).onChange(update)
  spanRow.add(new UI.Text("Semispan").setWidth("100px"))
  spanRow.add(span)
  container.add(spanRow)

  // --------------------------------------
  container.add(new UI.HorizontalRule())

  // mount
  var mountRow = new UI.Row()
  var mount = new UI.Number(parameters.mount).onChange(update)
  mountRow.add(new UI.Text("Mount Angle (deg)").setWidth("100px"))
  mountRow.add(mount)
  container.add(mountRow)

  // washout
  var washoutRow = new UI.Row()
  var washout = new UI.Number(parameters.washout).onChange(update)
  washoutRow.add(new UI.Text("Washout (deg)").setWidth("100px"))
  washoutRow.add(washout)
  container.add(washoutRow)

  // sweep
  var sweepRow = new UI.Row()
  var sweep = new UI.Number(parameters.sweep)
    .setRange(-80.0, 80.0)
    .onChange(update)
  sweepRow.add(new UI.Text("Sweep (deg)").setWidth("100px"))
  sweepRow.add(sweep)
  container.add(sweepRow)

  // dihedral
  var dihedralRow = new UI.Row()
  var dihedral = new UI.Number(parameters.dihedral).onChange(update)
  dihedralRow.add(new UI.Text("Dihedral (deg)").setWidth("100px"))
  dihedralRow.add(dihedral)
  container.add(dihedralRow)

  // --------------------------------------
  container.add(new UI.HorizontalRule())

  // root_chord
  var root_chordRow = new UI.Row()
  var root_chord = new UI.Number(parameters.root_chord).onChange(update)
  root_chordRow.add(new UI.Text("Root Chord").setWidth("100px"))
  root_chordRow.add(root_chord)
  container.add(root_chordRow)

  // tip_chord
  var tip_chordRow = new UI.Row()
  var tip_chord = new UI.Number(parameters.tip_chord).onChange(update)
  tip_chordRow.add(new UI.Text("Tip Chord").setWidth("100px"))
  tip_chordRow.add(tip_chord)
  container.add(tip_chordRow)

  // --------------------------------------
  // root_airfoil
  // --------------------------------------
  var rootAirfoil = new UI.CollapsiblePanel()
  rootAirfoil.setCollapsed(true)
  rootAirfoil.addStatic(new UI.Text("Root Airfoil"))
  rootAirfoil.add(new UI.Break())

  var root_nameRow = new UI.Row().setWidth("300px") // DFH
  var root_nameType = new UI.Input()
    .setWidth("100px")
    .setColor("#444")
    .setFontSize("12px")
    .onChange(update)
  root_nameRow.add(new UI.Text("Airfoil (graphics only)").setWidth("140px"))
  root_nameRow.add(root_nameType)
  rootAirfoil.add(root_nameRow)
  for (var root_name in parameters.root_airfoil) break
  root_nameType.setValue(root_name)

  // root al0
  var root_al0Row = new UI.Row().setWidth("300px")
  var root_al0 = new UI.Number(
    parameters.root_airfoil[root_name].properties.alpha_L0
  ).onChange(update)
  root_al0Row.add(new UI.Text("Zero-Lift Alpha (rad)").setWidth("140px"))
  root_al0Row.add(root_al0)
  rootAirfoil.add(root_al0Row)

  // root cla
  var root_ClaRow = new UI.Row().setWidth("300px") // DFH
  var root_Cla = new UI.Number(
    parameters.root_airfoil[root_name].properties.CL_alpha
  ).onChange(update)
  root_ClaRow.add(new UI.Text("Lift Slope (1/rad)").setWidth("140px"))
  root_ClaRow.add(root_Cla)
  rootAirfoil.add(root_ClaRow)

  // root Cml0
  var root_Cml0Row = new UI.Row().setWidth("300px") // DFH
  var root_Cml0 = new UI.Number(
    parameters.root_airfoil[root_name].properties.Cm_L0
  ).onChange(update)
  root_Cml0Row.add(new UI.Text("Zero-Lift Cm").setWidth("140px"))
  root_Cml0Row.add(root_Cml0)
  rootAirfoil.add(root_Cml0Row)

  // root Cma
  var root_CmaRow = new UI.Row().setWidth("300px") // DFH
  var root_Cma = new UI.Number(
    parameters.root_airfoil[root_name].properties.Cm_alpha
  ).onChange(update)
  root_CmaRow.add(new UI.Text("Moment Slope (1/rad)").setWidth("140px"))
  root_CmaRow.add(root_Cma)
  rootAirfoil.add(root_CmaRow)

  // root CD0
  var root_CD0Row = new UI.Row().setWidth("300px") // DFH
  var root_CD0 = new UI.Number(
    parameters.root_airfoil[root_name].properties.CD0
  ).onChange(update)
  root_CD0Row.add(new UI.Text("Zero-Lift CD").setWidth("140px"))
  root_CD0Row.add(root_CD0)
  rootAirfoil.add(root_CD0Row)

  // root CD0_L
  var root_CD0_LRow = new UI.Row().setWidth("300px") // DFH
  var root_CD0_L = new UI.Number(
    parameters.root_airfoil[root_name].properties.CD0_L
  ).onChange(update)
  root_CD0_LRow.add(new UI.Text("CD,L").setWidth("140px"))
  root_CD0_LRow.add(root_CD0_L)
  rootAirfoil.add(root_CD0_LRow)

  // root CD0_L2
  var root_CD0_L2Row = new UI.Row().setWidth("300px") // DFH
  var root_CD0_L2 = new UI.Number(
    parameters.root_airfoil[root_name].properties.CD0_L2
  ).onChange(update)
  root_CD0_L2Row.add(new UI.Text("CD,L^2").setWidth("140px"))
  root_CD0_L2Row.add(root_CD0_L2)
  rootAirfoil.add(root_CD0_L2Row)

  // root CLmax
  var root_CLmaxRow = new UI.Row().setWidth("300px") // DFH
  var root_CLmax = new UI.Number(
    parameters.root_airfoil[root_name].properties.CL_max
  ).onChange(update)
  root_CLmaxRow.add(new UI.Text("Max Lift Coefficient").setWidth("140px"))
  root_CLmaxRow.add(root_CLmax)
  rootAirfoil.add(root_CLmaxRow)

  container.add(rootAirfoil)

  // --------------------------------------
  // tip_airfoil
  // --------------------------------------
  var tipAirfoil = new UI.CollapsiblePanel()
  tipAirfoil.setCollapsed(true)
  tipAirfoil.addStatic(new UI.Text("Tip Airfoil"))
  rootAirfoil.add(new UI.Break())

  var same_as_rootRow = new UI.Row().setWidth("300px").setMarginTop("10px")
  var sameAsRoot = new UI.Checkbox(parameters.same_as_root).onChange(update) // DFH
  same_as_rootRow.add(new UI.Text("Same as Root").setWidth("140px"))
  same_as_rootRow.add(sameAsRoot)
  tipAirfoil.add(same_as_rootRow) // DFH

  var tip_nameRow = new UI.Row().setWidth("300px") // DFH
  var tip_nameType = new UI.Input()
    .setWidth("100px")
    .setColor("#444")
    .setFontSize("12px")
    .onChange(update)
  tip_nameRow.add(new UI.Text("Airfoil (graphics only)").setWidth("140px"))
  tip_nameRow.add(tip_nameType)
  tipAirfoil.add(tip_nameRow)
  for (var tip_name in parameters.tip_airfoil) break
  tip_nameType.setValue(tip_name)

  // tip al0
  var tip_al0Row = new UI.Row().setWidth("300px") // DFH
  var tip_al0 = new UI.Number(
    parameters.tip_airfoil[tip_name].properties.alpha_L0
  ).onChange(update)
  tip_al0Row.add(new UI.Text("Zero-Lift Alpha (rad)").setWidth("140px"))
  tip_al0Row.add(tip_al0)
  tipAirfoil.add(tip_al0Row)

  // tip cla
  var tip_ClaRow = new UI.Row().setWidth("300px") // DFH
  var tip_Cla = new UI.Number(
    parameters.tip_airfoil[tip_name].properties.CL_alpha
  ).onChange(update)
  tip_ClaRow.add(new UI.Text("Lift Slope (1/rad)").setWidth("140px"))
  tip_ClaRow.add(tip_Cla)
  tipAirfoil.add(tip_ClaRow)

  // tip Cml0
  var tip_Cml0Row = new UI.Row().setWidth("300px") // DFH
  var tip_Cml0 = new UI.Number(
    parameters.tip_airfoil[tip_name].properties.Cm_L0
  ).onChange(update)
  tip_Cml0Row.add(new UI.Text("Zero-Lift Cm").setWidth("140px"))
  tip_Cml0Row.add(tip_Cml0)
  tipAirfoil.add(tip_Cml0Row)

  // tip Cma
  var tip_CmaRow = new UI.Row().setWidth("300px") // DFH
  var tip_Cma = new UI.Number(
    parameters.tip_airfoil[tip_name].properties.Cm_alpha
  ).onChange(update)
  tip_CmaRow.add(new UI.Text("Moment Slope (1/rad)").setWidth("140px"))
  tip_CmaRow.add(tip_Cma)
  tipAirfoil.add(tip_CmaRow)

  // tip CD0
  var tip_CD0Row = new UI.Row().setWidth("300px") // DFH
  var tip_CD0 = new UI.Number(
    parameters.tip_airfoil[tip_name].properties.CD0
  ).onChange(update)
  tip_CD0Row.add(new UI.Text("Zero-Lift CD").setWidth("140px"))
  tip_CD0Row.add(tip_CD0)
  tipAirfoil.add(tip_CD0Row)

  // tip CD0_L
  var tip_CD0_LRow = new UI.Row().setWidth("300px") // DFH
  var tip_CD0_L = new UI.Number(
    parameters.tip_airfoil[tip_name].properties.CD0_L
  ).onChange(update)
  tip_CD0_LRow.add(new UI.Text("CD,L").setWidth("140px"))
  tip_CD0_LRow.add(tip_CD0_L)
  tipAirfoil.add(tip_CD0_LRow)

  // tip CD0_L2
  var tip_CD0_L2Row = new UI.Row().setWidth("300px") // DFH
  var tip_CD0_L2 = new UI.Number(
    parameters.tip_airfoil[tip_name].properties.CD0_L2
  ).onChange(update)
  tip_CD0_L2Row.add(new UI.Text("CD,L^2").setWidth("140px"))
  tip_CD0_L2Row.add(tip_CD0_L2)
  tipAirfoil.add(tip_CD0_L2Row)

  // tip CLmax
  var tip_CLmaxRow = new UI.Row().setWidth("300px") // DFH
  var tip_CLmax = new UI.Number(
    parameters.tip_airfoil[tip_name].properties.CL_max
  ).onChange(update)
  tip_CLmaxRow.add(new UI.Text("Max Lift Coefficient").setWidth("140px"))
  tip_CLmaxRow.add(tip_CLmax)
  tipAirfoil.add(tip_CLmaxRow)

  tipAirfoil.setMarginBottom("-8px")
  container.add(tipAirfoil)

  // --------------------------------------
  container.add(new UI.HorizontalRule())

  // nSeg

  var segmentsRow = new UI.Row().setWidth("300px") // DFH
  var nSeg = new UI.Integer(parameters.nSeg).setRange(5, 200).onChange(update)
  segmentsRow.add(new UI.Text("Spanwise Segments").setWidth("140px"))
  segmentsRow.add(nSeg)
  container.add(segmentsRow)

  // nAirfoilPoints
  var afSegRow = new UI.Row().setWidth("300px") // DFH
  var nAFseg = new UI.Select()
    .setOptions({ 50: "50", 100: "100", 200: "200" })
    .setWidth("80px")
    .setColor("#444")
    .setFontSize("12px")
  nAFseg.onChange(update)
  afSegRow.add(new UI.Text("Airfoil Segments").setWidth("140px"))
  afSegRow.add(nAFseg)
  container.add(afSegRow)
  nAFseg.setValue(parameters.nAFseg)

  // --------------------------------------
  // Control Surface
  // --------------------------------------
  var controlSurface = new UI.CollapsiblePanel()
  controlSurface.setCollapsed(true)
  controlSurface.addStatic(new UI.Text("Control Surface"))
  controlSurface.add(new UI.Break())

  // has_control_surface
  var hasCSRow = new UI.Row()
  var has_control_surface = new UI.Checkbox(
    parameters.control.has_control_surface
  ).onChange(updateCS)
  hasCSRow.add(new UI.Text("Has control surface").setWidth("140px"))
  hasCSRow.add(has_control_surface)
  controlSurface.add(hasCSRow)

  // Root/Span
  var cs_spanrootRow = new UI.Row().setWidth("300px") // DFH
  var cs_spanroot = new UI.Number(parameters.control.span_root).onChange(update)
  cs_spanrootRow.add(new UI.Text("Root/Span").setWidth("140px"))
  cs_spanrootRow.add(cs_spanroot)
  controlSurface.add(cs_spanrootRow)
  cs_spanrootRow.setDisplay("none")

  // Tip/Span
  var cs_spantipRow = new UI.Row().setWidth("300px") // DFH
  var cs_spantip = new UI.Number(parameters.control.span_tip).onChange(update)
  cs_spantipRow.add(new UI.Text("Tip/Span").setWidth("140px"))
  cs_spantipRow.add(cs_spantip)
  controlSurface.add(cs_spantipRow)
  cs_spantipRow.setDisplay("none")

  // Chord Root
  var cs_chordrootRow = new UI.Row().setWidth("300px") // DFH
  var cs_chordroot = new UI.Number(parameters.control.chord_root).onChange(
    update
  )
  cs_chordrootRow.add(new UI.Text("C_f (root)").setWidth("140px"))
  cs_chordrootRow.add(cs_chordroot)
  controlSurface.add(cs_chordrootRow)
  cs_chordrootRow.setDisplay("none")

  // Chord Tip
  var cs_chordtipRow = new UI.Row().setWidth("300px") // DFH
  var cs_chordtip = new UI.Number(parameters.control.chord_tip).onChange(update)
  cs_chordtipRow.add(new UI.Text("C_f (tip)").setWidth("140px"))
  cs_chordtipRow.add(cs_chordtip)
  controlSurface.add(cs_chordtipRow)
  cs_chordtipRow.setDisplay("none")

  // Mix Elevator
  var elevatorRow = new UI.Row().setWidth("300px") // DFH
  var mixElevator = new UI.Number(parameters.control.mix.elevator).onChange(
    update
  )
  elevatorRow.add(new UI.Text("Elevator Mix").setWidth("140px"))
  elevatorRow.add(mixElevator)
  controlSurface.add(elevatorRow)
  elevatorRow.setDisplay("none")

  // Mix Rudder
  var rudderRow = new UI.Row().setWidth("300px") // DFH
  var mixRudder = new UI.Number(-parameters.control.mix.rudder).onChange(update)
  rudderRow.add(new UI.Text("Rudder Mix").setWidth("140px"))
  rudderRow.add(mixRudder)
  controlSurface.add(rudderRow)
  rudderRow.setDisplay("none")

  // Mix Aileron
  var aileronRow = new UI.Row().setWidth("300px") // DFH
  var mixAileron = new UI.Number(parameters.control.mix.aileron).onChange(
    update
  )
  aileronRow.add(new UI.Text("Aileron Mix").setWidth("140px"))
  aileronRow.add(mixAileron)
  controlSurface.add(aileronRow)
  aileronRow.setDisplay("none")

  // Mix Flap
  var flapRow = new UI.Row().setWidth("300px") // DFH
  var mixFlap = new UI.Number(parameters.control.mix.flap).onChange(update)
  flapRow.add(new UI.Text("Flap Mix").setWidth("140px"))
  flapRow.add(mixFlap)
  controlSurface.add(flapRow)
  flapRow.setDisplay("none")

  container.add(controlSurface)

  //

  function updateCS() {
    cs_spanrootRow.setDisplay(has_control_surface.getValue() ? "" : "none")
    cs_spantipRow.setDisplay(has_control_surface.getValue() ? "" : "none")
    cs_chordrootRow.setDisplay(has_control_surface.getValue() ? "" : "none")
    cs_chordtipRow.setDisplay(has_control_surface.getValue() ? "" : "none")

    elevatorRow.setDisplay(has_control_surface.getValue() ? "" : "none")
    rudderRow.setDisplay(has_control_surface.getValue() ? "" : "none")
    aileronRow.setDisplay(has_control_surface.getValue() ? "" : "none")
    flapRow.setDisplay(has_control_surface.getValue() ? "" : "none")

    update()
  }

  function update() {
    object.geometry.dispose()

    var left_start = new THREE.Vector3(0.0, 0.0, 0.0)
    var right_start = new THREE.Vector3(0.0, 0.0, 0.0)

    if (object.parent.type == "Mesh") {
      if (object.parent.geometry.type == "WingGeometry") {
        left_start = object.parent.geometry.leftTip.clone()
        right_start = object.parent.geometry.rightTip.clone()
      }
    }

    if (sameAsRoot.dom.checked === true) {
      // DFH

      var root_airfoil = {}
      var afname = check_airfoil(root_nameType.getValue())
      root_airfoil[afname] = {}
      root_airfoil[afname].properties = {}
      root_airfoil[afname].properties.type = "linear"
      root_airfoil[afname].properties.alpha_L0 = root_al0.getValue()
      root_airfoil[afname].properties.CL_alpha = root_Cla.getValue()
      root_airfoil[afname].properties.Cm_L0 = root_Cml0.getValue()
      root_airfoil[afname].properties.Cm_alpha = root_Cma.getValue()
      root_airfoil[afname].properties.CD0 = root_CD0.getValue()
      root_airfoil[afname].properties.CD0_L = root_CD0_L.getValue()
      root_airfoil[afname].properties.CD0_L2 = root_CD0_L2.getValue()
      root_airfoil[afname].properties.CL_max = root_CLmax.getValue()

      var tip_airfoil = root_airfoil // DFH
      var tip_afname = root_nameType.getValue() // DFH
      tip_airfoil[tip_afname] = {} // DFH
      tip_airfoil[tip_afname].properties = {} // DFH
      tip_airfoil[tip_afname].properties.type = "linear" // DFH
      tip_airfoil[tip_afname].properties.alpha_L0 = root_al0.getValue() // DFH
      tip_airfoil[tip_afname].properties.CL_alpha = root_Cla.getValue() // DFH
      tip_airfoil[tip_afname].properties.Cm_L0 = root_Cml0.getValue() // DFH
      tip_airfoil[tip_afname].properties.Cm_alpha = root_Cma.getValue() // DFH
      tip_airfoil[tip_afname].properties.CD0 = root_CD0.getValue() // DFH
      tip_airfoil[tip_afname].properties.CD0_L = root_CD0_L.getValue() // DFH
      tip_airfoil[tip_afname].properties.CD0_L2 = root_CD0_L2.getValue() // DFH
      tip_airfoil[tip_afname].properties.CL_max = root_CLmax.getValue() // DFH

      tip_nameRow.setDisplay("none") // DFH
      tip_al0Row.setDisplay("none") // DFH
      tip_ClaRow.setDisplay("none") // DFH
      tip_Cml0Row.setDisplay("none") // DFH
      tip_CmaRow.setDisplay("none") // DFH
      tip_CD0Row.setDisplay("none") // DFH
      tip_CD0_LRow.setDisplay("none") // DFH
      tip_CD0_L2Row.setDisplay("none") // DFH
      tip_CLmaxRow.setDisplay("none") // DFH
    } else {
      var root_airfoil = {}
      var afname = check_airfoil(root_nameType.getValue())
      root_airfoil[afname] = {}
      root_airfoil[afname].properties = {}
      root_airfoil[afname].properties.type = "linear"
      root_airfoil[afname].properties.alpha_L0 = root_al0.getValue()
      root_airfoil[afname].properties.CL_alpha = root_Cla.getValue()
      root_airfoil[afname].properties.Cm_L0 = root_Cml0.getValue()
      root_airfoil[afname].properties.Cm_alpha = root_Cma.getValue()
      root_airfoil[afname].properties.CD0 = root_CD0.getValue()
      root_airfoil[afname].properties.CD0_L = root_CD0_L.getValue()
      root_airfoil[afname].properties.CD0_L2 = root_CD0_L2.getValue()
      root_airfoil[afname].properties.CL_max = root_CLmax.getValue()

      var tip_airfoil = {}
      var afname = check_airfoil(tip_nameType.getValue())
      tip_airfoil[afname] = {}
      tip_airfoil[afname].properties = {}
      tip_airfoil[afname].properties.type = "linear"
      tip_airfoil[afname].properties.alpha_L0 = tip_al0.getValue()
      tip_airfoil[afname].properties.CL_alpha = tip_Cla.getValue()
      tip_airfoil[afname].properties.Cm_L0 = tip_Cml0.getValue()
      tip_airfoil[afname].properties.Cm_alpha = tip_Cma.getValue()
      tip_airfoil[afname].properties.CD0 = tip_CD0.getValue()
      tip_airfoil[afname].properties.CD0_L = tip_CD0_L.getValue()
      tip_airfoil[afname].properties.CD0_L2 = tip_CD0_L2.getValue()
      tip_airfoil[afname].properties.CL_max = tip_CLmax.getValue()

      tip_nameRow.setDisplay("block") // DFH
      tip_al0Row.setDisplay("block") // DFH
      tip_ClaRow.setDisplay("block") // DFH
      tip_Cml0Row.setDisplay("block") // DFH
      tip_CmaRow.setDisplay("block") // DFH
      tip_CD0Row.setDisplay("block") // DFH
      tip_CD0_LRow.setDisplay("block") // DFH
      tip_CD0_L2Row.setDisplay("block") // DFH
      tip_CLmaxRow.setDisplay("block") // DFH
    }

    var control = {}
    control.has_control_surface = has_control_surface.getValue()
    control.span_root = cs_spanroot.getValue()
    control.span_tip = cs_spantip.getValue()
    control.chord_root = cs_chordroot.getValue()
    control.chord_tip = cs_chordtip.getValue()
    control.is_sealed = 1
    control.mix = {}
    control.mix.elevator = mixElevator.getValue()
    control.mix.rudder = -mixRudder.getValue()
    control.mix.aileron = mixAileron.getValue()
    control.mix.flap = mixFlap.getValue()

    object.geometry = new THREE.WingGeometry(
      is_main_wing.getValue(),
      sideType.getValue(),
      span.getValue(),
      sweep.getValue(),
      dihedral.getValue(),
      mount.getValue(),
      washout.getValue(),
      root_chord.getValue(),
      tip_chord.getValue(),
      root_airfoil,
      tip_airfoil,
      nSeg.getValue(),
      parseInt(nAFseg.getValue()),
      left_start,
      right_start,
      dy.getValue(),
      control,
      sameAsRoot.getValue() // DFH
    )

    object.geometry.computeBoundingSphere()
    object.geometry.computeBoundingBox()

    signals.objectChanged.dispatch(object)

    wing_update_children(signals, object)

    signals.objectChanged.dispatch(object) // reset as selected object in GUI

    //Turn off Aero Center
    editor.scene.children[1].visible = false
    signals.objectChanged.dispatch(editor.scene.children[1])
  }

  updateCS()

  return container
}
