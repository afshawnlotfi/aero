/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Add = function (editor) {
  var container = new UI.Panel()
  container.setClass("menu")

  var title = new UI.Panel()
  title.setClass("title")
  title.setTextContent("Add")
  container.add(title)

  var options = new UI.Panel()
  options.setClass("options")
  container.add(options)

  //

  //var meshCount = 0; // DFH This is defined in MU.js
  var lightCount = 0
  var cameraCount = 0

  editor.signals.editorCleared.add(function () {
    meshCount = 0
    lightCount = 0
    cameraCount = 0
  })

  // Group

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Group")
  option.onClick(function () {
    var mesh = new THREE.Group()
    mesh.name = "Group " + ++meshCount

    editor.execute(new AddObjectCommand(mesh))
  })
  options.add(option)

  //

  options.add(new UI.HorizontalRule())

  // Wing // DFH

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Wing")
  option.onClick(function () {
    var tempObject = editor.selected

    var is_main = true
    var side = "both"
    var span = 4.0
    var sweep = 0.0
    var dihedral = 0.0
    var mount = 0.0
    var washout = 0.0
    var root_chord = 1.0
    var tip_chord = 1.0
    var root_airfoil = {
      "NACA 2412": {
        properties: {
          type: "linear",
          alpha_L0: -0.036899751,
          CL_alpha: 6.283185307,
          Cm_L0: -0.0527,
          Cm_alpha: -0.08,
          CD0: 0.0055,
          CD0_L: -0.0045,
          CD0_L2: 0.01,
          CL_max: 1.4,
        },
      },
    }
    var tip_airfoil = {
      "NACA 2412": {
        properties: {
          type: "linear",
          alpha_L0: -0.036899751,
          CL_alpha: 6.283185307,
          Cm_L0: -0.0527,
          Cm_alpha: -0.08,
          CD0: 0.0055,
          CD0_L: -0.0045,
          CD0_L2: 0.01,
          CL_max: 1.4,
        },
      },
    }
    var nSeg = 40
    var nAFseg = 50
    var left_start = new THREE.Vector3(0.0, 0.0, 0.0)
    var right_start = new THREE.Vector3(0.0, 0.0, 0.0)
    var dy = 0.0
    var control = {
      has_control_surface: false,
      span_root: 0.2,
      span_tip: 0.8,
      chord_root: 0.2,
      chord_tip: 0.2,
      is_sealed: 1,
      mix: {
        elevator: 1.0,
        rudder: 0.0,
        aileron: 0.0,
        flap: 0.0,
      },
    }
    var same_as_root = true

    if (tempObject !== null) {
      if (tempObject.geometry !== undefined) {
        if (tempObject.geometry.type == "WingGeometry") {
          console.log("parent is a wing")
          is_main = tempObject.geometry.parameters.is_main
          side = tempObject.geometry.parameters.side
          span = tempObject.geometry.parameters.span
          sweep = tempObject.geometry.parameters.sweep
          dihedral = tempObject.geometry.parameters.dihedral
          mount =
            tempObject.geometry.parameters.mount -
            tempObject.geometry.parameters.washout
          washout = tempObject.geometry.parameters.washout
          root_chord = tempObject.geometry.parameters.tip_chord
          tip_chord = tempObject.geometry.parameters.tip_chord
          root_airfoil = tempObject.geometry.parameters.tip_airfoil
          nSeg = tempObject.geometry.parameters.nSeg
          nAFseg = tempObject.geometry.parameters.nAFseg
          left_start = tempObject.geometry.leftTip.clone()
          right_start = tempObject.geometry.rightTip.clone()
          //control = tempObject.geometry.parameters.control;
          same_as_root = true
        }
      }
    }

    var geometry = new THREE.WingGeometry(
      is_main,
      side,
      span,
      sweep,
      dihedral,
      mount,
      washout,
      root_chord,
      tip_chord,
      root_airfoil,
      tip_airfoil,
      nSeg,
      nAFseg,
      left_start,
      right_start,
      dy,
      control,
      same_as_root
    )
    var material = new THREE.MeshPhongMaterial()
    var mesh = new THREE.Mesh(geometry, material)
    mesh.name = "Wing_" + ++meshCount
    editor.execute(new AddObjectCommand(mesh))
    editor.select(mesh) // DFH
    if (tempObject !== null) try_set_parent(editor, mesh, tempObject)
    editor.signals.objectChanged.dispatch(mesh)
    editor.select(tempObject) // We're cheating here. Not sure why, but we have to do this to get the object to update correctly.
    editor.select(mesh)
  })
  options.add(option)

  // Prop

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Propeller")
  option.onClick(function () {
    var tempObject = editor.selected

    var nblades = 2
    var rotation = "CCW"
    var diameter = 1.0
    var pitch = 0.4
    var hub_radius = 0.05
    var root_chord = 0.1
    var tip_chord = 0.02
    var elliptical = false
    var root_airfoil = {
      "NACA 2412": {
        properties: {
          type: "linear",
          alpha_L0: -0.036899751,
          CL_alpha: 6.283185307,
          Cm_L0: -0.0527,
          Cm_alpha: -0.08,
          CD0: 0.0055,
          CD0_L: -0.0045,
          CD0_L2: 0.01,
          CL_max: 1.4,
        },
      },
    }
    var tip_airfoil = {
      "NACA 2412": {
        properties: {
          type: "linear",
          alpha_L0: -0.036899751,
          CL_alpha: 6.283185307,
          Cm_L0: -0.0527,
          Cm_alpha: -0.08,
          CD0: 0.0055,
          CD0_L: -0.0045,
          CD0_L2: 0.01,
          CL_max: 1.4,
        },
      },
    }

    var electric_motor = {
      has_motor: false,
      motor_kv: 1100,
      gear_reduction: 1,
      motor_resistance: 0.108,
      motor_no_load_current: 0.6,
      battery_resistance: 0.0094,
      battery_voltage: 11.1,
      speed_control_resistance: 0.0038,
    }
    var nSeg = 50
    var nAFseg = 50
    var same_as_root = true

    var geometry = new THREE.PropGeometry(
      nblades,
      rotation,
      diameter,
      pitch,
      hub_radius,
      root_chord,
      tip_chord,
      elliptical,
      root_airfoil,
      tip_airfoil,
      electric_motor,
      nSeg,
      nAFseg,
      same_as_root
    )
    var material = new THREE.MeshPhongMaterial({ side: 2 })
    var mesh = new THREE.Mesh(geometry, material)
    mesh.name = "Prop_" + ++meshCount

    editor.execute(new AddObjectCommand(mesh))
    editor.select(mesh) // DFH
    if (tempObject !== null) try_set_parent(editor, mesh, tempObject)
    update_prop_controls(editor)
  })
  options.add(option)

  //

  options.add(new UI.HorizontalRule())

  // Plane

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("2-D Plane")
  option.onClick(function () {
    var tempObject = editor.selected // DFH

    var geometry = new THREE.PlaneBufferGeometry(2, 2)
    var material = new THREE.MeshPhongMaterial()
    var mesh = new THREE.Mesh(geometry, material)
    mesh.name = "Plane " + ++meshCount

    editor.execute(new AddObjectCommand(mesh))
    editor.select(mesh) // DFH
    if (tempObject !== null)
      editor.parent(mesh, editor.scene.getObjectById(tempObject.id, true)) // DFH
  })
  options.add(option)

  // Box

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Box")
  option.onClick(function () {
    var tempObject = editor.selected // DFH

    var geometry = new THREE.BoxBufferGeometry(1, 1, 1)
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial())
    mesh.name = "Box " + ++meshCount

    editor.execute(new AddObjectCommand(mesh))
    editor.select(mesh) // DFH
    if (tempObject !== null)
      editor.parent(mesh, editor.scene.getObjectById(tempObject.id, true)) // DFH
  })
  options.add(option)

  // Circle

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Circle")
  option.onClick(function () {
    var tempObject = editor.selected // DFH

    var radius = 1
    var segments = 32

    var geometry = new THREE.CircleBufferGeometry(radius, segments)
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial())
    mesh.name = "Circle " + ++meshCount

    editor.execute(new AddObjectCommand(mesh))
    editor.select(mesh) // DFH
    if (tempObject !== null)
      editor.parent(mesh, editor.scene.getObjectById(tempObject.id, true)) // DFH
  })
  options.add(option)

  // Cylinder

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Cylinder")
  option.onClick(function () {
    var tempObject = editor.selected // DFH

    var radiusTop = 1
    var radiusBottom = 1
    var height = 2
    var radiusSegments = 32
    var heightSegments = 1
    var openEnded = false

    var geometry = new THREE.CylinderBufferGeometry(
      radiusTop,
      radiusBottom,
      height,
      radiusSegments,
      heightSegments,
      openEnded
    )
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial())
    mesh.name = "Cylinder " + ++meshCount

    editor.execute(new AddObjectCommand(mesh))
    editor.select(mesh) // DFH
    if (tempObject !== null)
      editor.parent(mesh, editor.scene.getObjectById(tempObject.id, true)) // DFH
  })
  options.add(option)

  // Sphere

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Sphere")
  option.onClick(function () {
    var tempObject = editor.selected // DFH

    var radius = 1
    var widthSegments = 32
    var heightSegments = 16
    var phiStart = 0
    var phiLength = Math.PI * 2
    var thetaStart = 0
    var thetaLength = Math.PI

    var geometry = new THREE.SphereBufferGeometry(
      radius,
      widthSegments,
      heightSegments,
      phiStart,
      phiLength,
      thetaStart,
      thetaLength
    )
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial())
    mesh.name = "Sphere " + ++meshCount

    editor.execute(new AddObjectCommand(mesh))
    editor.select(mesh) // DFH
    if (tempObject !== null)
      editor.parent(mesh, editor.scene.getObjectById(tempObject.id, true)) // DFH
  })
  options.add(option)

  // Torus

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Torus")
  option.onClick(function () {
    var tempObject = editor.selected // DFH

    var radius = 2
    var tube = 1
    var radialSegments = 32
    var tubularSegments = 12
    var arc = Math.PI * 2

    var geometry = new THREE.TorusBufferGeometry(
      radius,
      tube,
      radialSegments,
      tubularSegments,
      arc
    )
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial())
    mesh.name = "Torus " + ++meshCount

    editor.execute(new AddObjectCommand(mesh))
    editor.select(mesh) // DFH
    if (tempObject !== null)
      editor.parent(mesh, editor.scene.getObjectById(tempObject.id, true)) // DFH
  })
  options.add(option)

  //

  options.add(new UI.HorizontalRule())

  // PointLight

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("PointLight")
  option.onClick(function () {
    var color = 0xffffff
    var intensity = 1
    var distance = 0

    var light = new THREE.PointLight(color, intensity, distance)
    light.name = "PointLight " + ++lightCount

    editor.execute(new AddObjectCommand(light))
    editor.select(light) // DFH
  })
  options.add(option)

  // SpotLight

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("SpotLight")
  option.onClick(function () {
    var color = 0xffffff
    var intensity = 1
    var distance = 0
    var angle = Math.PI * 0.1
    var penumbra = 0

    var light = new THREE.SpotLight(color, intensity, distance, angle, penumbra)
    light.name = "SpotLight " + ++lightCount
    light.target.name = "SpotLight " + lightCount + " Target"

    light.position.set(5, 10, 7.5)

    editor.execute(new AddObjectCommand(light))
    editor.select(light) // DFH
  })
  options.add(option)

  // DirectionalLight

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("DirectionalLight")
  option.onClick(function () {
    var color = 0xffffff
    var intensity = 1

    var light = new THREE.DirectionalLight(color, intensity)
    light.name = "DirectionalLight " + ++lightCount
    light.target.name = "DirectionalLight " + lightCount + " Target"

    light.position.set(5, 10, 7.5)

    editor.execute(new AddObjectCommand(light))
    editor.select(light) // DFH
  })
  options.add(option)

  // HemisphereLight

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("HemisphereLight")
  option.onClick(function () {
    var skyColor = 0x00aaff
    var groundColor = 0xffaa00
    var intensity = 1

    var light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
    light.name = "HemisphereLight " + ++lightCount

    light.position.set(0, 10, 0)

    editor.execute(new AddObjectCommand(light))
    editor.select(light) // DFH
  })
  options.add(option)

  // AmbientLight

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("AmbientLight")
  option.onClick(function () {
    var color = 0x222222

    var light = new THREE.AmbientLight(color)
    light.name = "AmbientLight " + ++lightCount

    editor.execute(new AddObjectCommand(light))
    editor.select(light) // DFH
  })
  options.add(option)

  return container
}
