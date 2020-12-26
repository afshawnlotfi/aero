/**
 * @author mrdoob / http://mrdoob.com/
 */

var Toolbar = function (editor) {
  var signals = editor.signals

  var container = new UI.Panel()
  container.setId("toolbar")

  var buttons = new UI.Panel()
  container.add(buttons)

  // translate / rotate / scale

  var translate = new UI.Button("translate")
  translate.dom.title = "T"
  translate.dom.className = "Button selected"
  translate.onClick(function () {
    signals.transformModeChanged.dispatch("translate")
  })
  buttons.add(translate)

  var rotate = new UI.Button("rotate")
  rotate.dom.title = "R"
  rotate.onClick(function () {
    signals.transformModeChanged.dispatch("rotate")
  })
  buttons.add(rotate)

  var scale = new UI.Button("scale")
  scale.dom.title = "S"
  scale.onClick(function () {
    signals.transformModeChanged.dispatch("scale")
  })
  buttons.add(scale)

  signals.transformModeChanged.add(function (mode) {
    translate.dom.classList.remove("selected")
    rotate.dom.classList.remove("selected")
    scale.dom.classList.remove("selected")

    switch (mode) {
      case "translate":
        translate.dom.classList.add("selected")
        break
      case "rotate":
        rotate.dom.classList.add("selected")
        break
      case "scale":
        scale.dom.classList.add("selected")
        break
    }
  })

  // grid

  var showGrid = new UI.THREE.Boolean(true, "Show Grid").onChange(update)
  buttons.add(showGrid)

  var snap = new UI.THREE.Boolean(false, "Snap").onChange(update)
  var grid = new UI.Number(25)
    .setWidth("90px")
    .setMarginTop("3px")
    .onChange(update)

  buttons.add(snap)
  buttons.add(grid)

  function update() {
    signals.snapChanged.dispatch(
      snap.getValue() === true ? grid.getValue() : null
    )
    signals.showGridChanged.dispatch(showGrid.getValue())
  }

  function updateButtons(object) {
    if (
      object instanceof THREE.Light ||
      (object instanceof THREE.Object3D && object.userData.targetInverse)
    ) {
      rotate.setDisplay("none")
      scale.setDisplay("none")
    } else {
      if (object.geometry !== undefined) {
        // DFH

        if (object.name == "Center of Gravity") {
          // DFH
          rotate.setDisplay("none")
          scale.setDisplay("none")
        }
        if (object.name == "Aerodynamic Center") {
          // DFH
          translate.setDisplay("none")
          rotate.setDisplay("none")
          scale.setDisplay("none")
        }
        if (object.geometry.type == "WingGeometry") {
          // DFH
          rotate.setDisplay("none")
          scale.setDisplay("none")
        }
        if (object.geometry.type == "PropGeometry") {
          // DFH
          scale.setDisplay("none")
        }
        if (object.geometry.type == "PlaneBufferGeometry") {
          // DFH
          translate.setDisplay("inline-block")
          rotate.setDisplay("inline-block")
          scale.setDisplay("inline-block")
        }
        if (object.geometry.type == "BoxBufferGeometry") {
          // DFH
          translate.setDisplay("inline-block")
          rotate.setDisplay("inline-block")
          scale.setDisplay("inline-block")
        }
        if (object.geometry.type == "CircleBufferGeometry") {
          // DFH
          translate.setDisplay("inline-block")
          rotate.setDisplay("inline-block")
          scale.setDisplay("inline-block")
        }
        if (object.geometry.type == "CylinderBufferGeometry") {
          // DFH
          translate.setDisplay("inline-block")
          rotate.setDisplay("inline-block")
          scale.setDisplay("inline-block")
        }
        if (object.geometry.type == "SphereBufferGeometry") {
          // DFH
          translate.setDisplay("inline-block")
          rotate.setDisplay("inline-block")
          scale.setDisplay("inline-block")
        }
        if (object.geometry.type == "TorusBufferGeometry") {
          // DFH
          translate.setDisplay("inline-block")
          rotate.setDisplay("inline-block")
          scale.setDisplay("inline-block")
        }
        signals.transformModeChanged.dispatch("translate")
      } else {
        // DFH origin or group

        translate.setDisplay("inline-block") // DFH
        rotate.setDisplay("inline-block") // DFH
        scale.setDisplay("inline-block") // DFh
      }
    }
  }

  // events

  signals.objectSelected.add(function (object) {
    // DFH

    if (object !== null) {
      updateButtons(object)
    }
  })

  return container
}
