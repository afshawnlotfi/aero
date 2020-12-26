/**
 * @author mrdoob / http://mrdoob.com/
 */

//condition variables had to be pulled out of Sidebar.Condition so that they would be accessible from Analysis Tab
var unitType = new UI.Select()
  .setOptions({
    English: "English",
    SI: "SI",
  })
  .setWidth("100px")
  .setColor("#000")
  .setFontSize("12px")
unitType.onChange(updateCondition)

var velocityText = new UI.Text("Velocity (ft/s)").setWidth("140px")
var velocity = new UI.Number(analysis.condition.velocity).onChange(
  updateCondition
)

var densityText = new UI.Text("Density (slugs/ft^3)").setWidth("140px")
var density = new UI.Number(analysis.condition.density).onChange(
  updateCondition
)

var alpha = new UI.Number(analysis.condition.alpha).onChange(updateCondition)
var beta = new UI.Number(analysis.condition.beta).onChange(updateCondition)

var elevator = new UI.Number(analysis.controls.elevator.deflection).onChange(
  updateCondition
)
var rudder = new UI.Number(analysis.controls.rudder.deflection).onChange(
  updateCondition
)
var aileron = new UI.Number(analysis.controls.aileron.deflection).onChange(
  updateCondition
)
var flap = new UI.Number(analysis.controls.flap.deflection).onChange(
  updateCondition
)

var propRot = new UI.Integer(analysis.prop_controls.rot_per_sec * 60)
  .setRange(0, Infinity)
  .onChange(updateCondition)
var propRotRow = new UI.Row().setMarginLeft("10px")
var throttleRow = new UI.Row().setMarginLeft("10px")
var throttle = new UI.Integer(analysis.prop_controls.electric_throttle * 100)
  .setRange(0, 100)
  .onChange(updateCondition)
var indivControl = new UI.Checkbox(
  analysis.prop_controls.individual_control
).onChange(updateCondition)

function updateCondition() {
  //update_prop_controls(editor);

  analysis.condition.units = unitType.getValue()
  if (unitType.getValue() == "English") {
    velocityText.setValue("Velocity (ft/s)")
    densityText.setValue("Density (slugs/ft^3)")
    Ltrim_units.setValue("lbs")
    mtrim_units.setValue("lb-ft")
    weight_units.setValue("lbs")
  } else {
    velocityText.setValue("Velocity (m/s)")
    densityText.setValue("Density (kg/m^3)")
    Ltrim_units.setValue("N")
    mtrim_units.setValue("N-m")
    weight_units.setValue("N")
  }
  analysis.condition.velocity = velocity.getValue()
  if (density.getValue() == 0.0023769 || density.getValue() == 1.225) {
    if (unitType.getValue() == "English") {
      analysis.condition.density = 0.0023769
    } else {
      analysis.condition.density = 1.225
    }
    density.setValue(analysis.condition.density)
  } else {
    analysis.condition.density = density.getValue()
  }

  analysis.condition.alpha = alpha.getValue()
  analysis.condition.beta = beta.getValue()

  analysis.controls.elevator.deflection = elevator.getValue()
  analysis.controls.rudder.deflection = rudder.getValue()
  analysis.controls.aileron.deflection = aileron.getValue()
  analysis.controls.flap.deflection = flap.getValue()

  analysis.prop_controls.rot_per_sec = propRot.getValue() / 60
  analysis.prop_controls.electric_throttle = throttle.getValue() / 100
  analysis.prop_controls.individual_control = indivControl.getValue()

  if (analysis.prop_controls.individual_control) {
    propRotRow.setDisplay("none")
    throttleRow.setDisplay("none")
  } else {
    if (analysis.prop_controls.all_have_motor) {
      propRotRow.setDisplay("none")
      throttleRow.setDisplay("")
    } else {
      propRotRow.setDisplay("")
      throttleRow.setDisplay("none")
    }
  }
  //signals.analysisChanged.add( update );

  wing_update_children(editor.signals, editor.scene)
}

Sidebar.Condition = function (editor) {
  var signals = editor.signals

  var inputs = {}
  inputs.Ltrim = 0.0
  inputs.mtrim = 0.0
  inputs.weight = 10.0

  var doSave = 0

  var container = new UI.Panel()
  container.setBorderTop("0")
  container.setPaddingTop("20px")

  // --------------------------------------
  // Condition
  // --------------------------------------
  var condition = new UI.Row()
  //condition.add( new UI.Text( 'Condition' ) );
  //condition.add( new UI.Break() );
  // --------------------------------------
  condition.add(new UI.HorizontalRule())

  //Units
  var unitRow = new UI.Row()
  unitRow.add(new UI.Text("Units").setWidth("140px"))
  unitRow.add(unitType)
  container.add(unitRow)
  unitType.setValue(analysis.condition.units)

  // velocity
  var velocityRow = new UI.Row().setMarginLeft("10px")
  velocityRow.add(velocityText)
  velocityRow.add(velocity)
  condition.add(velocityRow)

  // density
  var densityRow = new UI.Row().setMarginLeft("10px")
  densityRow.add(densityText)
  densityRow.add(density)
  condition.add(densityRow)

  // alpha
  var alphaRow = new UI.Row().setMarginLeft("10px")
  alphaRow.add(new UI.Text("Angle of Attack (deg)").setWidth("140px"))
  alphaRow.add(alpha)
  condition.add(alphaRow)

  // beta
  var betaRow = new UI.Row().setMarginLeft("10px")
  betaRow.add(new UI.Text("Sideslip (deg)").setWidth("140px"))
  betaRow.add(beta)
  condition.add(betaRow)

  // --------------------------------------
  condition.add(new UI.HorizontalRule())
  container.add(condition)
  // --------------------------------------
  // Control Surfaces
  // --------------------------------------
  var control = new UI.Row()
  control.add(new UI.Text("Control Surfaces"))
  control.add(new UI.Break())
  // --------------------------------------
  control.add(new UI.HorizontalRule())

  // elevator
  var elevatorRow = new UI.Row().setMarginLeft("10px")
  elevatorRow.add(new UI.Text("Elevator (deg)").setWidth("140px"))
  elevatorRow.add(elevator)
  control.add(elevatorRow)

  // rudder
  var rudderRow = new UI.Row().setMarginLeft("10px")
  rudderRow.add(new UI.Text("Rudder (deg)").setWidth("140px"))
  rudderRow.add(rudder)
  control.add(rudderRow)

  // aileron
  var aileronRow = new UI.Row().setMarginLeft("10px")
  aileronRow.add(new UI.Text("Aileron (deg)").setWidth("140px"))
  aileronRow.add(aileron)
  control.add(aileronRow)

  // flap
  var flapRow = new UI.Row().setMarginLeft("10px")
  flapRow.add(new UI.Text("Flap (deg)").setWidth("140px"))
  flapRow.add(flap)
  control.add(flapRow)

  //------------------------------------------
  control.add(new UI.HorizontalRule())

  container.add(control)

  // --------------------------------------
  // Propeller Controls
  // --------------------------------------
  var propControl = new UI.Row()
  propControl.add(new UI.Text("Propeller"))
  propControl.add(new UI.Break())
  // --------------------------------------
  propControl.add(new UI.HorizontalRule())

  //propeller condition

  propRotRow.add(new UI.Text("Rotation Rate (rpm)").setWidth("140px"))
  propRotRow.add(propRot)
  propControl.add(propRotRow)
  propRotRow.setDisplay("none")

  throttleRow.add(new UI.Text("Throttle (%)").setWidth("140px"))
  throttleRow.add(throttle)
  propControl.add(throttleRow)
  throttleRow.setDisplay("none")

  var indivControlRow = new UI.Row().setMarginLeft("10px")
  indivControlRow.add(new UI.Text("Individual Control").setWidth("140px"))
  indivControlRow.add(indivControl)
  propControl.add(indivControlRow)
  indivControlRow.setDisplay("none")

  container.add(propControl)

  // --------------------------------------
  container.add(new UI.HorizontalRule())

  updateCondition()
  return container
}
