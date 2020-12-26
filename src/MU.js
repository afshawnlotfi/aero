//--------------------------------------------------
THREE.WingGeometry = function (
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
) {
  // DFH
  THREE.Geometry.call(this)
  this.type = "WingGeometry"
  this.parameters = {
    is_main: is_main,
    side: side,
    span: span,
    sweep: sweep,
    dihedral: dihedral,
    mount: mount,
    washout: washout,
    root_chord: root_chord,
    tip_chord: tip_chord,
    root_airfoil: root_airfoil,
    tip_airfoil: tip_airfoil,
    nSeg: nSeg,
    nAFseg: nAFseg,
    left_start: left_start,
    right_start: right_start,
    dy: dy,
    control: control,
    same_as_root: same_as_root,
  }

  is_main = is_main || true
  side = side || "both"
  span = span || 4.0
  sweep = sweep || 0.0
  dihedral = dihedral || 0.0
  mount = mount || 0.0
  washout = washout || 0.0
  root_chord = root_chord || 1.0
  tip_chord = tip_chord || 1.0
  root_airfoil = root_airfoil || {
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
  tip_airfoil = tip_airfoil || {
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
  nSeg = nSeg || 40
  nAFseg = nAFseg || 50
  left_start = left_start || new THREE.Vector3(0.0, 0.0, 0.0)
  right_start = right_start || new THREE.Vector3(0.0, 0.0, 0.0)
  dy = dy || 0.0
  control = control || {
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
  same_as_root = same_as_root || true // DFH
  for (var afname in root_airfoil) break
  var my_root_airfoil = read_airfoil(afname, nAFseg)
  for (var afname in tip_airfoil) break
  var my_tip_airfoil = read_airfoil(afname, nAFseg)
  var nairfoilpts = my_root_airfoil[0]

  var iwing,
    startwing,
    stopwing,
    my_start = new THREE.Vector3()
  var aerocenter = new THREE.Vector3(0, 0, 0)
  if (side == "both") {
    startwing = 1
    stopwing = 2
  }
  if (side == "right") {
    startwing = 1
    stopwing = 1
  }
  if (side == "left") {
    startwing = 2
    stopwing = 2
  }
  var dtheta = Math.PI / nSeg

  for (iwing = startwing; iwing <= stopwing; iwing++) {
    var percent, my_chord, my_twist
    var csrooti, cstipi, mindistroot, mindisttip, my_control_deflection

    //Find sections closest to flap break points
    mindistroot = 1.0
    mindisttip = 1.0
    if (control.has_control_surface) {
      for (y = 0; y <= nSeg; y++) {
        percent = 0.5 * (1.0 - Math.cos(dtheta * y))
        if (Math.abs(percent - control.span_root) < Math.abs(mindistroot)) {
          mindistroot = percent - control.span_root // preserve the sign
          csrooti = y
        }
        if (Math.abs(percent - control.span_tip) < Math.abs(mindisttip)) {
          mindisttip = percent - control.span_tip // preserve the sign
          cstipi = y
        }
      }
    }

    csrooti = csrooti - 1
    if (mindisttip > 0) {
      cstipi = cstipi - 1
    }

    var my_side = "right"
    my_start = right_start.clone()
    my_control_deflection =
      analysis.controls.elevator.deflection * control.mix.elevator +
      analysis.controls.rudder.deflection * control.mix.rudder + //switched in the MU Pro output
      analysis.controls.aileron.deflection * control.mix.aileron +
      analysis.controls.flap.deflection * control.mix.flap
    if (iwing == 2) {
      my_side = "left"
      my_start = left_start.clone()
      my_control_deflection =
        analysis.controls.elevator.deflection * control.mix.elevator -
        analysis.controls.rudder.deflection * control.mix.rudder - // switched in the MU Pro output
        analysis.controls.aileron.deflection * control.mix.aileron +
        analysis.controls.flap.deflection * control.mix.flap
    }

    var x,
      y,
      vertices = [],
      uvs = []

    var nloop = 1

    if (control.has_control_surface) nloop = 3
    for (iloop = 0; iloop < nloop; iloop++) {
      var loopstart = 0
      var loopend = nSeg

      if (control.has_control_surface) {
        if (iloop == 0) {
          loopstart = 0
          loopend = csrooti
        } // paint inboard of flap
        if (iloop == 1) {
          loopstart = csrooti + 1
          loopend = cstipi
        } // paint flap
        if (iloop == 2) {
          loopstart = cstipi + 1
          loopend = nSeg
        } // paint outboard of flap
      }

      for (y = loopstart; y <= loopend; y++) {
        var verticesRow = []
        var uvsRow = []
        //            var v = y/nSeg;
        var v = 0.5 * (1.0 - Math.cos(dtheta * y))
        percent = v

        if (control.has_control_surface) {
          //Move nearest stradling sections to exact control endpoint
          if (y == csrooti) {
            percent = control.span_root
          }
          if (y == csrooti + 1) {
            percent = control.span_root
          }
          if (y == cstipi) {
            percent = control.span_tip
          }
          if (y == cstipi + 1) {
            percent = control.span_tip
          }
        }

        var cf_c = 0.0
        if (control.has_control_surface) {
          cf_c =
            control.chord_root +
            ((percent - control.span_root) /
              (control.span_tip - control.span_root)) *
              (control.chord_tip - control.chord_root)
        }
        my_chord = root_chord + percent * (tip_chord - root_chord)
        /*
                if(tip_chord >= 0.0){
                    my_chord = root_chord + percent*(tip_chord - root_chord);
                } else {
                    RA = 8.0*span/Math.PI/root_chord;
                    my_chord = 8.0*span/Math.PI/RA*Math.sqrt(1.0-Math.pow(percent,2));
                }
                */
        my_twist = mount - percent * washout

        var qvec = new THREE.Vector3(
          0,
          span / Math.cos((sweep * Math.PI) / 180.0),
          0
        )
        math_rot_z(qvec, (sweep * Math.PI) / 180.0)
        math_rot_x(qvec, (-dihedral * Math.PI) / 180.0)

        var fvec = new THREE.Vector3(
          0,
          span / Math.cos((sweep * Math.PI) / 180.0),
          0
        )
        //            math_rot_z(fvec,sweep*Math.PI/180.0); // Fix this? Probably should also rotate by sweep at control surface hinge line
        math_rot_x(fvec, (-dihedral * Math.PI) / 180.0)

        if (my_side == "left") {
          qvec.y = -qvec.y
          fvec.y = -fvec.y
        }

        aerocenter.x = percent * qvec.x
        aerocenter.y = percent * qvec.y
        aerocenter.z = percent * qvec.z

        for (x = 0; x <= nairfoilpts - 1; x++) {
          var u = x / (nairfoilpts - 1)

          var vertex = new THREE.Vector3()
          var airfoilx =
            my_root_airfoil[1][x] +
            percent * (my_tip_airfoil[1][x] - my_root_airfoil[1][x]) // interpolates
          var airfoily =
            my_root_airfoil[2][x] +
            percent * (my_tip_airfoil[2][x] - my_root_airfoil[2][x]) // interpolates
          vertex.x = my_chord * (-airfoilx + 0.25)
          vertex.y = 0.0
          vertex.z = my_chord * -airfoily
          var control_rotation = 0.0 // don't rotate control surface
          if (control.has_control_surface) {
            if (y > csrooti && y < cstipi + 1) {
              //inside flap region
              if (vertex.x < my_chord * (-1.0 + cf_c + 0.25)) {
                // rotate control surface
                vertex.x = vertex.x - my_chord * (-1.0 + cf_c + 0.25)
                math_rot_y(vertex, (my_control_deflection * Math.PI) / 180.0)
                vertex.x = vertex.x + my_chord * (-1.0 + cf_c + 0.25)
              }
            }
          }
          math_rot_y(vertex, (my_twist * Math.PI) / 180.0)
          if (my_side == "right")
            math_rot_x(vertex, (-dihedral * Math.PI) / 180.0)
          if (my_side == "left")
            math_rot_x(vertex, (dihedral * Math.PI) / 180.0)
          vertex.x = vertex.x + aerocenter.x + my_start.x
          vertex.y = vertex.y + aerocenter.y + my_start.y + dy
          vertex.z = vertex.z + aerocenter.z + my_start.z

          if (my_side == "left") vertex.y = vertex.y - 2.0 * dy

          this.vertices.push(vertex)
          verticesRow.push(this.vertices.length - 1)
          uvsRow.push(new THREE.Vector2(u, 1 - v))
        }
        vertices.push(verticesRow)
        uvs.push(uvsRow)
      }
      if (my_side == "left") {
        this.leftTip.x = aerocenter.x + my_start.x
        this.leftTip.y = aerocenter.y + my_start.y - dy
        this.leftTip.z = aerocenter.z + my_start.z
      }
      if (my_side == "right") {
        this.rightTip.x = aerocenter.x + my_start.x
        this.rightTip.y = aerocenter.y + my_start.y + dy
        this.rightTip.z = aerocenter.z + my_start.z
      }

      //Wing Segments
      var v1, v2, v3, v4, uv1, uv2, uv3, uv4, n1, n2, n3, n4
      var v11, v22, v33, v44, v2x, v3x

      for (x = 0; x < nairfoilpts - 1; x++) {
        for (y = loopstart; y < loopend; y++) {
          if (my_side == "left") {
            v1 = vertices[y][x]
            v2 = vertices[y + 1][x]
            v3 = vertices[y + 1][x + 1]
            v4 = vertices[y][x + 1]

            v11 = vertices[y][Math.max(x - 1, 0)]
            v22 = vertices[y + 1][Math.max(x - 1, 0)]
            v33 = vertices[y + 1][Math.min(x + 2, nairfoilpts - 1)]
            v44 = vertices[y][Math.min(x + 2, nairfoilpts - 1)]

            v2x = vertices[Math.min(y + 2, loopend)][x]
            v3x = vertices[Math.min(y + 2, loopend)][x + 1]

            uv1 = uvs[y][x].clone()
            uv2 = uvs[y + 1][x].clone()
            uv3 = uvs[y + 1][x + 1].clone()
            uv4 = uvs[y][x + 1].clone()
          } else {
            v2 = vertices[y][x]
            v1 = vertices[y + 1][x]
            v4 = vertices[y + 1][x + 1]
            v3 = vertices[y][x + 1]

            v22 = vertices[y][Math.max(x - 1, 0)]
            v11 = vertices[y + 1][Math.max(x - 1, 0)]
            v44 = vertices[y + 1][Math.min(x + 2, nairfoilpts - 1)]
            v33 = vertices[y][Math.min(x + 2, nairfoilpts - 1)]

            v2x = vertices[Math.max(y - 1, 0)][x]
            v3x = vertices[Math.max(y - 1, 0)][x + 1]

            uv2 = uvs[y][x].clone()
            uv1 = uvs[y + 1][x].clone()
            uv4 = uvs[y + 1][x + 1].clone()
            uv3 = uvs[y][x + 1].clone()
          }
          var ans = new THREE.Vector3()
          math_compute_normal(
            this.vertices[v11],
            this.vertices[v2],
            this.vertices[v4],
            ans
          )
          n1 = ans.clone()
          math_compute_normal(
            this.vertices[v22],
            this.vertices[v2x],
            this.vertices[v3],
            ans
          )
          n2 = ans.clone()
          math_compute_normal(
            this.vertices[v2],
            this.vertices[v3x],
            this.vertices[v33],
            ans
          )
          n3 = ans.clone()
          math_compute_normal(
            this.vertices[v1],
            this.vertices[v3],
            this.vertices[v44],
            ans
          )
          n4 = ans.clone()

          /*                if(y < nSeg/2) {
                        math_compute_normal(this.vertices[v1],this.vertices[v2],this.vertices[v4],ans)
                        n1 = ans.clone();
                        n2 = ans.clone();
                        n3 = ans.clone();
                        n4 = ans.clone();
                    }
    */

          if (my_side == "left") {
            if (y == loopend - 1) {
              n2 = n1.clone()
              n3 = n4.clone()
            }
            if (y == loopstart) {
              n1 = n2.clone()
              n4 = n3.clone()
            }
          } else {
            if (y == loopstart) {
              //                        console.log(n2.x,n2.y,n2.z)
              n2 = n1.clone()
              n3 = n4.clone()
              //                        console.log(n2.x,n2.y,n2.z);
              //                        console.log('next');
            }
            if (y == loopend - 1) {
              n1 = n2.clone()
              n4 = n3.clone()
            }
          }

          this.faces.push(new THREE.Face3(v1, v2, v4, [n1, n2, n4]))
          this.faceVertexUvs[0].push([uv1, uv2, uv4])

          this.faces.push(
            new THREE.Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()])
          )
          this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()])
        }
      }
    }
    // root chord rib
    //        if(control.span_root > 0.0) {
    for (x = 0; x < (nairfoilpts - 2) / 2; x++) {
      if (my_side == "left") {
        var v1 = vertices[0][x]
        var v2 = vertices[0][x + 1]
        var v3 = vertices[0][nairfoilpts - x - 2]
        var v4 = vertices[0][nairfoilpts - x - 1]

        var uv1 = uvs[0][x].clone()
        var uv2 = uvs[0][x + 1].clone()
        var uv3 = uvs[0][nairfoilpts - x - 2].clone()
        var uv4 = uvs[0][nairfoilpts - x - 1].clone()

        var n1 = new THREE.Vector3(0, -1, 0)
      } else {
        var v2 = vertices[0][x]
        var v1 = vertices[0][x + 1]
        var v4 = vertices[0][nairfoilpts - x - 2]
        var v3 = vertices[0][nairfoilpts - x - 1]

        var uv2 = uvs[0][x]
        var uv1 = uvs[0][x + 1]
        var uv4 = uvs[0][nairfoilpts - x - 2]
        var uv3 = uvs[0][nairfoilpts - x - 1]

        var n1 = new THREE.Vector3(0, 1, 0)
      }

      var n2 = n1.clone()
      var n3 = n1.clone()
      var n4 = n1.clone()

      this.faces.push(new THREE.Face3(v1, v2, v4, [n1, n2, n4]))
      this.faceVertexUvs[0].push([uv1, uv2, uv4])

      this.faces.push(new THREE.Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()]))
      this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()])
    }
    //        }

    // tip chord rib

    //if(tip_chord >= 0.0) {
    for (x = 0; x < (nairfoilpts - 2) / 2; x++) {
      if (my_side == "left") {
        var v2 = vertices[nSeg][x]
        var v1 = vertices[nSeg][x + 1]
        var v4 = vertices[nSeg][nairfoilpts - x - 2]
        var v3 = vertices[nSeg][nairfoilpts - x - 1]

        var uv2 = uvs[nSeg][x].clone()
        var uv1 = uvs[nSeg][x + 1].clone()
        var uv4 = uvs[nSeg][nairfoilpts - x - 2].clone()
        var uv3 = uvs[nSeg][nairfoilpts - x - 1].clone()

        var n1 = new THREE.Vector3(0, -1, 0)
      } else {
        var v1 = vertices[nSeg][x]
        var v2 = vertices[nSeg][x + 1]
        var v3 = vertices[nSeg][nairfoilpts - x - 2]
        var v4 = vertices[nSeg][nairfoilpts - x - 1]

        var uv1 = uvs[nSeg][x]
        var uv2 = uvs[nSeg][x + 1]
        var uv3 = uvs[nSeg][nairfoilpts - x - 2]
        var uv4 = uvs[nSeg][nairfoilpts - x - 1]

        var n1 = new THREE.Vector3(0, 1, 0)
      }

      var n2 = n1.clone()
      var n3 = n1.clone()
      var n4 = n1.clone()

      this.faces.push(new THREE.Face3(v1, v2, v4, [n1, n2, n4]))
      this.faceVertexUvs[0].push([uv1, uv2, uv4])

      this.faces.push(new THREE.Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()]))
      this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()])
    }
    //}
  }
  this.computeFaceNormals()
  this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), span)
  if (side == "left") this.rightTip = this.leftTip.clone()
  if (side == "right") this.leftTip = this.rightTip.clone()
}
THREE.WingGeometry.prototype = Object.create(THREE.Geometry.prototype)

//-------------------------------

try_set_parent = function (editor, childObject, parentObject) {
  var ok_2_connect = 1

  if (parentObject.type !== undefined) {
    //console.log(childObject.type, parentObject.type)
    if (childObject.type == "Mesh") {
      if (
        childObject.geometry.type == "WingGeometry" ||
        childObject.geometry.type == "PropGeometry"
      ) {
        if (parentObject.type == "Mesh") {
          if (parentObject.geometry.type !== "WingGeometry") {
            ok_2_connect = 0
          }
        }
        if (parentObject.type == "Light") {
          ok_2_connect = 0
        }
        //different from mu1
        if (parentObject.type == "Group") {
          ok_2_connect = 0
        }
      }
    }
  } else {
    ok_2_connect = -1
  }

  switch (ok_2_connect) {
    case 1:
      editor.parent(
        childObject,
        editor.scene.getObjectById(parentObject.id, true)
      )
      break
    case 0:
      console.log(
        "Cannot connect ",
        childObject.geometry.type,
        " to ",
        parentObject.geometry.type
      )
      //            alert('Illegal Connection. Object will be linked to Origin.');
      break
    case -1:
      console.log("try_set_parent: Parent object is undefined. Cannot connect.")
      break
  }
}

//-------------------------------

wing_update_children = function (signals, parentObject) {
  //    if(parentObject !== undefined) {
  for (var ichild = 0; ichild < parentObject.children.length; ichild++) {
    var childObject = parentObject.children[ichild]
    if (
      childObject.type == "Mesh" &&
      childObject.geometry.type == "WingGeometry"
    ) {
      console.log(
        "parent = ",
        childObject.parent.name,
        " updating ",
        childObject.name
      )

      childObject.geometry.dispose()
      var parameters = childObject.geometry.parameters
      var left_start = new THREE.Vector3(0.0, 0.0, 0.0)
      var right_start = new THREE.Vector3(0.0, 0.0, 0.0)

      if (
        childObject.parent.type == "Mesh" &&
        childObject.parent.geometry.type == "WingGeometry"
      ) {
        left_start = childObject.parent.geometry.leftTip.clone()
        right_start = childObject.parent.geometry.rightTip.clone()
      }

      childObject.geometry = new THREE.WingGeometry(
        parameters.is_main,
        parameters.side,
        parameters.span,
        parameters.sweep,
        parameters.dihedral,
        parameters.mount,
        parameters.washout,
        parameters.root_chord,
        parameters.tip_chord,
        parameters.root_airfoil,
        parameters.tip_airfoil,
        parameters.nSeg,
        parameters.nAFseg,
        left_start,
        right_start,
        parameters.dy,
        parameters.control,
        parameters.same_as_root
      )

      childObject.geometry.computeBoundingSphere()
      childObject.geometry.computeBoundingBox()

      signals.objectChanged.dispatch(childObject)
    }
    wing_update_children(signals, childObject)
  }
  //  }
}

// Propeller Geometry
//-------------------------------
THREE.PropGeometry = function (
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
) {
  THREE.Geometry.call(this)
  this.type = "PropGeometry"
  this.parameters = {
    nblades: nblades,
    rotation: rotation,
    diameter: diameter,
    pitch: pitch,
    hub_radius: hub_radius,
    root_chord: root_chord,
    tip_chord: tip_chord,
    elliptical: elliptical,
    root_airfoil: root_airfoil,
    tip_airfoil: tip_airfoil,
    electric_motor: electric_motor,
    nSeg: nSeg,
    nAFseg: nAFseg,
    same_as_root: same_as_root,
  }

  nblades = nblades || 3
  rotation = rotation || "CCW"
  diameter = diameter || 1.0
  pitch = pitch || 0.4
  hub_radius = hub_radius || 0.05
  root_chord = root_chord || 0.1
  tip_chord = tip_chord || 0.02
  elliptical = elliptical || false
  root_airfoil = root_airfoil || {
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
  tip_airfoil = tip_airfoil || {
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
  electric_motor = electric_motor || {
    has_motor: false,
    motor_kv: 1100,
    gear_reduction: 1,
    motor_resistance: 0.108,
    motor_no_load_current: 0.6,
    battery_resistance: 0.0094,
    battery_voltage: 11.1,
    speed_control_resistance: 0.0038,
  }
  nSeg = nSeg || 50
  nAFseg = nAFseg || 50
  same_as_root = same_as_root || true

  for (var afname in root_airfoil) break
  var my_root_airfoil = read_airfoil(afname, nAFseg)
  for (var afname in tip_airfoil) break
  var my_tip_airfoil = read_airfoil(afname, nAFseg)
  var nairfoilpts = my_root_airfoil[0]

  var root = new THREE.Vector3(0.0, 0.0, 0.0)
  var span = diameter / 2.0 - hub_radius
  var my_side = "right"
  if (rotation == "CW") my_side = "left"
  var dtheta = Math.PI / nSeg

  for (var iblade = 1; iblade <= nblades; iblade++) {
    var percent, my_chord, my_twist

    var x,
      y,
      vertices = [],
      uvs = []

    for (y = 0; y <= nSeg; y++) {
      var verticesRow = []
      var uvsRow = []
      //            var v = y/nSeg;
      var v = 0.5 * (1.0 - Math.cos(dtheta * y))
      percent = v
      if (elliptical == false) {
        my_chord = root_chord + percent * (tip_chord - root_chord)
      } else {
        RA = (8.0 * span) / Math.PI / root_chord
        my_chord =
          ((8.0 * span) / Math.PI / RA) * Math.sqrt(1.0 - Math.pow(percent, 2))
      }
      var r1 = hub_radius + percent * span
      my_twist = Math.atan(pitch / (2.0 * Math.PI * r1)) // assumes aL0 = 0.0

      var qvec = new THREE.Vector3(0, span, 0)

      if (rotation == "CW") qvec.y = -qvec.y

      var aerocenter = new THREE.Vector3(0, 0, 0)
      aerocenter.x = percent * qvec.x
      aerocenter.y = percent * qvec.y
      aerocenter.z = percent * qvec.z

      for (x = 0; x <= nairfoilpts - 1; x++) {
        var u = x / (nairfoilpts - 1)

        var vertex = new THREE.Vector3()
        var airfoilx =
          my_root_airfoil[1][x] +
          percent * (my_tip_airfoil[1][x] - my_root_airfoil[1][x]) // interpolates
        var airfoily =
          my_root_airfoil[2][x] +
          percent * (my_tip_airfoil[2][x] - my_root_airfoil[2][x]) // interpolates
        vertex.x = my_chord * (-airfoilx + 0.25)
        vertex.y = 0.0
        vertex.z = my_chord * -airfoily
        math_rot_y(vertex, my_twist)
        vertex.x = vertex.x + aerocenter.x
        vertex.y = vertex.y + aerocenter.y + hub_radius
        vertex.z = vertex.z + aerocenter.z

        if (my_side == "left") vertex.y = vertex.y - 2.0 * hub_radius

        math_rot_z(vertex, (iblade * 2.0 * Math.PI) / nblades)
        math_rot_y(vertex, -0.5 * Math.PI) // rotate so pointing along x axis

        this.vertices.push(vertex)
        verticesRow.push(this.vertices.length - 1)
        uvsRow.push(new THREE.Vector2(u, 1 - v))
      }
      vertices.push(verticesRow)
      uvs.push(uvsRow)
    }

    //Prop Segments
    var v1, v2, v3, v4, uv1, uv2, uv3, uv4, n1, n2, n3, n4
    var v11, v22, v33, v44, v2x, v3x

    for (x = 0; x < nairfoilpts - 1; x++) {
      for (y = 0; y < nSeg; y++) {
        if (my_side == "left") {
          v1 = vertices[y][x]
          v2 = vertices[y + 1][x]
          v3 = vertices[y + 1][x + 1]
          v4 = vertices[y][x + 1]

          v11 = vertices[y][Math.max(x - 1, 0)]
          v22 = vertices[y + 1][Math.max(x - 1, 0)]
          v33 = vertices[y + 1][Math.min(x + 2, nairfoilpts - 1)]
          v44 = vertices[y][Math.min(x + 2, nairfoilpts - 1)]

          v2x = vertices[Math.min(y + 2, nSeg)][x]
          v3x = vertices[Math.min(y + 2, nSeg)][x + 1]

          uv1 = uvs[y][x].clone()
          uv2 = uvs[y + 1][x].clone()
          uv3 = uvs[y + 1][x + 1].clone()
          uv4 = uvs[y][x + 1].clone()
        } else {
          v2 = vertices[y][x]
          v1 = vertices[y + 1][x]
          v4 = vertices[y + 1][x + 1]
          v3 = vertices[y][x + 1]

          v22 = vertices[y][Math.max(x - 1, 0)]
          v11 = vertices[y + 1][Math.max(x - 1, 0)]
          v44 = vertices[y + 1][Math.min(x + 2, nairfoilpts - 1)]
          v33 = vertices[y][Math.min(x + 2, nairfoilpts - 1)]

          v2x = vertices[Math.max(y - 1, 0)][x]
          v3x = vertices[Math.max(y - 1, 0)][x + 1]

          uv2 = uvs[y][x].clone()
          uv1 = uvs[y + 1][x].clone()
          uv4 = uvs[y + 1][x + 1].clone()
          uv3 = uvs[y][x + 1].clone()
        }
        var ans = new THREE.Vector3()
        math_compute_normal(
          this.vertices[v11],
          this.vertices[v2],
          this.vertices[v4],
          ans
        )
        n1 = ans.clone()
        math_compute_normal(
          this.vertices[v22],
          this.vertices[v2x],
          this.vertices[v3],
          ans
        )
        n2 = ans.clone()
        math_compute_normal(
          this.vertices[v2],
          this.vertices[v3x],
          this.vertices[v33],
          ans
        )
        n3 = ans.clone()
        math_compute_normal(
          this.vertices[v1],
          this.vertices[v3],
          this.vertices[v44],
          ans
        )
        n4 = ans.clone()

        if (my_side == "left") {
          if (y == nSeg - 1) {
            n2 = n1.clone()
            n3 = n4.clone()
          }
          if (y == 0) {
            n1 = n2.clone()
            n4 = n3.clone()
          }
        } else {
          if (y == 0) {
            n2 = n1.clone()
            n3 = n4.clone()
          }
          if (y == nSeg - 1) {
            n1 = n2.clone()
            n4 = n3.clone()
          }
        }

        this.faces.push(new THREE.Face3(v1, v2, v4, [n1, n2, n4]))
        this.faceVertexUvs[0].push([uv1, uv2, uv4])

        this.faces.push(
          new THREE.Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()])
        )
        this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()])
      }
    }

    // root chord rib

    for (x = 0; x < (nairfoilpts - 2) / 2; x++) {
      if (my_side == "left") {
        var v1 = vertices[0][x]
        var v2 = vertices[0][x + 1]
        var v3 = vertices[0][nairfoilpts - x - 2]
        var v4 = vertices[0][nairfoilpts - x - 1]

        var uv1 = uvs[0][x].clone()
        var uv2 = uvs[0][x + 1].clone()
        var uv3 = uvs[0][nairfoilpts - x - 2].clone()
        var uv4 = uvs[0][nairfoilpts - x - 1].clone()

        var n1 = new THREE.Vector3(0, -1, 0)
      } else {
        var v2 = vertices[0][x]
        var v1 = vertices[0][x + 1]
        var v4 = vertices[0][nairfoilpts - x - 2]
        var v3 = vertices[0][nairfoilpts - x - 1]

        var uv2 = uvs[0][x]
        var uv1 = uvs[0][x + 1]
        var uv4 = uvs[0][nairfoilpts - x - 2]
        var uv3 = uvs[0][nairfoilpts - x - 1]

        var n1 = new THREE.Vector3(0, 1, 0)
      }

      var n2 = n1.clone()
      var n3 = n1.clone()
      var n4 = n1.clone()

      this.faces.push(new THREE.Face3(v1, v2, v4, [n1, n2, n4]))
      this.faceVertexUvs[0].push([uv1, uv2, uv4])

      this.faces.push(new THREE.Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()]))
      this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()])
    }

    // tip chord rib

    if (tip_chord >= 0.0) {
      for (x = 0; x < (nairfoilpts - 2) / 2; x++) {
        if (my_side == "left") {
          var v2 = vertices[nSeg][x]
          var v1 = vertices[nSeg][x + 1]
          var v4 = vertices[nSeg][nairfoilpts - x - 2]
          var v3 = vertices[nSeg][nairfoilpts - x - 1]

          var uv2 = uvs[nSeg][x].clone()
          var uv1 = uvs[nSeg][x + 1].clone()
          var uv4 = uvs[nSeg][nairfoilpts - x - 2].clone()
          var uv3 = uvs[nSeg][nairfoilpts - x - 1].clone()

          var n1 = new THREE.Vector3(0, -1, 0)
        } else {
          var v1 = vertices[nSeg][x]
          var v2 = vertices[nSeg][x + 1]
          var v3 = vertices[nSeg][nairfoilpts - x - 2]
          var v4 = vertices[nSeg][nairfoilpts - x - 1]

          var uv1 = uvs[nSeg][x]
          var uv2 = uvs[nSeg][x + 1]
          var uv3 = uvs[nSeg][nairfoilpts - x - 2]
          var uv4 = uvs[nSeg][nairfoilpts - x - 1]

          var n1 = new THREE.Vector3(0, 1, 0)
        }

        var n2 = n1.clone()
        var n3 = n1.clone()
        var n4 = n1.clone()

        this.faces.push(new THREE.Face3(v1, v2, v4, [n1, n2, n4]))
        this.faceVertexUvs[0].push([uv1, uv2, uv4])

        this.faces.push(
          new THREE.Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()])
        )
        this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()])
      }
    }
  }

  //Create propeller nosecone
  var x,
    y,
    vertices = [],
    uvs = []
  var heightSegments = 16
  var widthSegments = 32
  var radius = hub_radius * 1.05
  var phiStart = Math.PI / 2.0
  var phiLength = Math.PI
  var thetaStart = 0
  var thetaLength = Math.PI

  for (y = 0; y <= heightSegments; y++) {
    var verticesRow = []
    var uvsRow = []

    for (x = 0; x <= widthSegments; x++) {
      var u = x / widthSegments
      var v = y / heightSegments

      var vertex = new THREE.Vector3()
      vertex.x =
        -radius *
        Math.cos(phiStart + u * phiLength) *
        Math.sin(thetaStart + v * thetaLength)
      vertex.y = radius * Math.cos(thetaStart + v * thetaLength)
      vertex.z =
        radius *
        Math.sin(phiStart + u * phiLength) *
        Math.sin(thetaStart + v * thetaLength)

      this.vertices.push(vertex)

      verticesRow.push(this.vertices.length - 1)
      uvsRow.push(new THREE.Vector2(u, 1 - v))
    }

    vertices.push(verticesRow)
    uvs.push(uvsRow)
  }

  for (y = 0; y < heightSegments; y++) {
    for (x = 0; x < widthSegments; x++) {
      var v1 = vertices[y][x + 1]
      var v2 = vertices[y][x]
      var v3 = vertices[y + 1][x]
      var v4 = vertices[y + 1][x + 1]

      var n1 = this.vertices[v1].clone().normalize()
      var n2 = this.vertices[v2].clone().normalize()
      var n3 = this.vertices[v3].clone().normalize()
      var n4 = this.vertices[v4].clone().normalize()

      var uv1 = uvs[y][x + 1].clone()
      var uv2 = uvs[y][x].clone()
      var uv3 = uvs[y + 1][x].clone()
      var uv4 = uvs[y + 1][x + 1].clone()

      if (Math.abs(this.vertices[v1].y) === radius) {
        uv1.x = (uv1.x + uv2.x) / 2
        this.faces.push(new THREE.Face3(v1, v3, v4, [n1, n3, n4]))
        this.faceVertexUvs[0].push([uv1, uv3, uv4])
      } else if (Math.abs(this.vertices[v3].y) === radius) {
        uv3.x = (uv3.x + uv4.x) / 2
        this.faces.push(new THREE.Face3(v1, v2, v3, [n1, n2, n3]))
        this.faceVertexUvs[0].push([uv1, uv2, uv3])
      } else {
        this.faces.push(new THREE.Face3(v1, v2, v4, [n1, n2, n4]))
        this.faceVertexUvs[0].push([uv1, uv2, uv4])

        this.faces.push(
          new THREE.Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()])
        )
        this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()])
      }
    }
  }

  this.computeFaceNormals()
  this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), span)
}
THREE.PropGeometry.prototype = Object.create(THREE.Geometry.prototype)

//-------------------------------
math_compute_normal = function (V1, V2, V3, ans) {
  var u = new THREE.Vector3(V2.x - V1.x, V2.y - V1.y, V2.z - V1.z)
  var v = new THREE.Vector3(V3.x - V2.x, V3.y - V2.y, V3.z - V2.z)

  ans.x = u.y * v.z - u.z * v.y
  ans.y = -(u.x * v.z) + u.z * v.x
  ans.z = u.x * v.y - u.y * v.x
  ans.normalize()
}

math_rot_x = function (V, th) {
  var x = V.x,
    y = V.y,
    z = V.z
  c = Math.cos(th)
  s = Math.sin(th)

  V.y = y * c - z * s
  V.z = y * s + z * c
}

math_rot_y = function (V, th) {
  var x = V.x,
    y = V.y,
    z = V.z
  c = Math.cos(th)
  s = Math.sin(th)

  V.x = x * c + z * s
  V.z = -x * s + z * c
}

math_rot_z = function (V, th) {
  var x = V.x,
    y = V.y,
    z = V.z
  c = Math.cos(th)
  s = Math.sin(th)

  V.x = x * c - y * s
  V.y = x * s + y * c
}

//-----------------------------------------------------------------
var update_prop_controls = function (editor) {
  scene = editor.scene
  //console.log("Updating Prop Controls");
  temp_controls = {}
  temp_controls.all_have_motor = true

  check_children(scene, temp_controls)

  temp_controls.electric_throttle = analysis.prop_controls.electric_throttle
  temp_controls.rot_per_sec = analysis.prop_controls.rot_per_sec
  temp_controls.individual_control = analysis.prop_controls.individual_control

  analysis.prop_controls = {}
  analysis.prop_controls = temp_controls
  //console.log(analysis.prop_controls);

  updateCondition() //updates prop controls options on condition tab
}

var check_children = function (parentObject, controls) {
  for (var ichild = 0; ichild < parentObject.children.length; ichild++) {
    var childObject = parentObject.children[ichild]
    if (
      childObject.type == "Mesh" &&
      childObject.geometry.type == "PropGeometry"
    ) {
      var parameters = childObject.geometry.parameters
      var prop_name = childObject.name
      if (prop_name in analysis.prop_controls) {
        controls[prop_name] = {}
        if (parameters.electric_motor.has_motor) {
          if ("electric_throttle" in analysis.prop_controls[prop_name]) {
            controls[prop_name].electric_throttle =
              analysis.prop_controls[prop_name].electric_throttle
          } else {
            controls[prop_name].electric_throttle = 1.0
          }
        } else {
          controls.all_have_motor = false
          if ("rot_per_sec" in analysis.prop_controls[prop_name]) {
            controls[prop_name].rot_per_sec =
              analysis.prop_controls[prop_name].rot_per_sec
          } else {
            controls[prop_name].rot_per_sec = 30
          }
        }
      } else {
        controls[prop_name] = {}
        if (parameters.electric_motor.has_motor) {
          controls[prop_name].electric_throttle = 1.0
        } else {
          controls.all_have_motor = false
          controls[prop_name].rot_per_sec = 30
        }
      }
    }
    check_children(childObject, controls)
  }
}

var check_controls = function () {}

//-----------------------------------------------------------------

//-------------------------------
//     Airfoils
//-------------------------------
var check_airfoil = function (airfoilName) {
  var retAirfoil = ""
  var problem = 0

  if (
    airfoilName == "Circle" ||
    airfoilName == "circle" ||
    airfoilName == "CIRCLE"
  ) {
    return "Circle"
  }

  if (
    airfoilName.substring(0, 4) == "NACA" ||
    airfoilName.substring(0, 4) == "naca" ||
    airfoilName.substring(0, 4) == "Naca"
  ) {
    var length = airfoilName.length
    var temp = airfoilName.substring(4, length)
    var code = temp.trim()
  } else {
    code = airfoilName
  }

  if (code.length != 4 || isNaN(code)) {
    problem = 1
  } else {
    retAirfoil = "NACA " + code
  }

  if (problem == 1) {
    alert(
      "Unrecognizeable airfoil name. \n\n Try any 4-digit NACA airfoil like 'NACA 2412'."
    )
    return "NACA 2412"
  }
  return retAirfoil
}

//-------------------------------
var naca_geometry = function (code, x) {
  var temp, ymc, xmc, tm, yc, dydx, thick

  temp = parseInt(code.substring(0, 1))
  ymc = temp / 100.0
  temp = parseInt(code.substring(1, 2))
  xmc = temp / 10.0
  temp = parseInt(code.substring(2, 4))
  tm = temp / 100.0
  if (x == 0.0) {
    xu = 0.0
    yu = 0.0
    xl = 0.0
    yl = 0.0
  } else {
    if (x < xmc) {
      yc = ymc * (2.0 * (x / xmc) - Math.pow(x / xmc, 2))
      dydx = ((2.0 * ymc) / xmc) * (1.0 - x / xmc)
    } else {
      yc =
        ymc *
        ((2.0 * (1.0 - x)) / (1.0 - xmc) - Math.pow((1.0 - x) / (1.0 - xmc), 2))
      dydx = ((-2.0 * ymc) / (1.0 - xmc)) * (1.0 - (1.0 - x) / (1.0 - xmc))
    }
    //        if(OpenTE .eq. 1) then
    //            thick = tm*(2.969*sqrt(x) - 1.260*x - 3.516*x**2 + 2.843*x**3 - 1.015*x**4) !Original NACA
    //        else
    thick =
      tm *
      (2.969 * Math.sqrt(x) -
        1.26 * x -
        3.523 * Math.pow(x, 2) +
        2.836 * Math.pow(x, 3) -
        1.022 * Math.pow(x, 4)) //Modified to close TE
    //        end if
    xu = x - (thick / (2.0 * Math.sqrt(1.0 + Math.pow(dydx, 2)))) * dydx
    yu = yc + thick / (2.0 * Math.sqrt(1.0 + Math.pow(dydx, 2)))
    xl = x + (thick / (2.0 * Math.sqrt(1.0 + Math.pow(dydx, 2)))) * dydx
    yl = yc - thick / (2.0 * Math.sqrt(1.0 + Math.pow(dydx, 2)))
  }
  return [xu, yu, xl, yl]
}

//-------------------------------
var read_airfoil = function (airfoil, nairfoilpts) {
  var airfoilx = []
  var airfoily = []

  //    console.log(airfoil.substring(0,4));
  if (airfoil.substring(0, 4) == "NACA") {
    var length = airfoil.length
    var temp = airfoil.substring(4, length)
    var code = temp.trim()

    var dtheta = (2.0 * Math.PI) / (nairfoilpts - 1)
    var x
    for (var i = 1; i <= nairfoilpts / 2; i++) {
      x = 0.5 * (1.0 - Math.cos((i - 0.5) * dtheta))
      result = naca_geometry(code, x)
      airfoilx[nairfoilpts / 2 - 1 + i] = result[0]
      airfoily[nairfoilpts / 2 - 1 + i] = result[1]
      airfoilx[nairfoilpts / 2 - i] = result[2]
      airfoily[nairfoilpts / 2 - i] = result[3]
    }
    //        console.log(airfoilx);
    //        console.log(airfoily);
  }

  if (airfoil == "Circle") {
    var dtheta = (2.0 * Math.PI) / (nairfoilpts - 1)
    var x, theta
    for (var i = 1; i <= nairfoilpts / 2; i++) {
      x = 0.5 * (1.0 - Math.cos((i - 0.5) * dtheta))
      theta = Math.acos(2.0 * (x - 0.5))
      y = 0.5 * Math.sin(theta)
      airfoilx[nairfoilpts / 2 - 1 + i] = x
      airfoily[nairfoilpts / 2 - 1 + i] = y
      airfoilx[nairfoilpts / 2 - i] = x
      airfoily[nairfoilpts / 2 - i] = -y
    }
  }

  return [nairfoilpts, airfoilx, airfoily]
}

var meshCount = 0

//----------------------------------------------------------------------------------
// ANALYSIS
//----------------------------------------------------------------------------------
var analysis = {
  reference: {
    area: 0.0,
    longitudinal_length: 0.0,
    lateral_length: 0.0,
  },
  condition: {
    units: "English",
    velocity: 10,
    density: 0.0023769,
    alpha: 0.0,
    beta: 0.0,
  },
  solver: {
    type: "linear",
    convergence: 1.0e-6,
    relaxation: 0.9,
  },
  run: {
    forces: "",
  },
  controls: {
    elevator: { is_symmetric: 1, deflection: 0.0 },
    rudder: { is_symmetric: 0, deflection: 0.0 },
    aileron: { is_symmetric: 0, deflection: 0.0 },
    flap: { is_symmetric: 1, deflection: 0.0 },
  },
  prop_controls: {
    rot_per_sec: 30,
    electric_throttle: 1.0,
    individual_control: false,
  },
}

//----------------------------------------------------------------------------------
var runAnalysis = function (editor, callback) {
  console.log("Writing Analysis JSON Object")

  data_json = write_machup_analysis_json(editor)

  console.log("Running Analysis...")

  //    var data_json = editor.scene.toJSON();
  var result_json
  //    console.log(data_json);

  var data_str = JSON.stringify(data_json, null, "\t")
  data_str = data_str.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, "$1")
  console.log(data_str)
  var url =
    "https://aero.go.usu.edu/wp-content/themes/aperture-child/MachUp/analysis/V5.0/analysis.php/"
  // var url= "/wp-content/themes/aperture-child/MachUp/analysis/V5.0/analysis.php/";
  $.ajax({
    type: "post",
    url: url,
    //          data: {data_json:data_json}, // this has issues with the wing for some reason
    data: { data_str: data_str },
    beforeSend: function () {
      // before send the request, displays a "Loading..." message in the element where the server response will be placed
      $("#resp").html("Loading...")
    },
    //          async: false,
    timeout: 100000, // sets timeout for the request (100 seconds)
    error: function (xhr, status, error) {
      console.log("Error in ajax call to server.")
      alert("Error: " + xhr.status + " - " + error)
    },
    success: function (Result) {
      console.log(Result)
      result_json = $.parseJSON(Result)
      console.log("Analysis Complete.")
      console.log(editor)
      callback(result_json)
    },
  })

  //    console.log(result_json);

  //    return result_json;
}

var global_wing_ID = 0
var global_wings = {}
var global_prop_ID = 0
var global_props = {}

//----------------------------------------------------------------------------------
var write_machup_analysis_json = function (editor) {
  //Find CG location
  var CGobject = get_CG_object(editor.scene)
  var CGx = CGobject.position.x
  var CGy = CGobject.position.y
  var CGz = CGobject.position.z

  global_wing_ID = 0
  global_wings = {}
  global_prop_ID = 0
  global_props = {}
  write_analysis_wings_json(editor.scene, 0)
  write_analysis_props_json(editor.scene, 0)
  var data_json = {
    tag: {},
    run: analysis.run,
    solver: analysis.solver,
    plane: { name: "MyAirplane", CGx: CGx, CGy: CGy, CGz: CGz },
    reference: analysis.reference,
    condition: analysis.condition,
    controls: analysis.controls,
    prop_controls: analysis.prop_controls,
    airfoil_DB: ".",
    wings: global_wings,
    propellers: global_props,
  }
  data_json.tag.UUID = THREE.Math.generateUUID()
  data_json.tag.date = new Date()
  data_json.tag.version = "MachUp 5.0"

  console.log(data_json)
  return data_json
}

//----------------------------------------------------------------------------------
var write_analysis_wings_json = function (myObject, connectID) {
  console.log("looking at object:", myObject.name)

  for (var ichild = 0; ichild < myObject.children.length; ichild++) {
    var childObject = myObject.children[ichild]
    if (
      childObject.type == "Mesh" &&
      childObject.geometry.type == "WingGeometry"
    ) {
      global_wing_ID = global_wing_ID + 1
      console.log("Adding Wing #", global_wing_ID)
      var parameters = childObject.geometry.parameters

      var mycontrol = {}
      if (parameters.control.has_control_surface) {
        mycontrol = parameters.control
        //                mycontrol.mix.rudder = -parameters.control.mix.rudder; //Switch it so that positive rudder is the right direction
      }

      var my_is_main = 0
      if (parameters.is_main) {
        my_is_main = 1
      }
      console.log(parameters)
      for (var root_name in parameters.root_airfoil) break
      for (var tip_name in parameters.tip_airfoil) break

      global_wings[childObject.name] = {
        name: childObject.name,
        ID: global_wing_ID,
        is_main: my_is_main,
        side: parameters.side,
        connect: {
          ID: connectID,
          location: "tip",
          dx: childObject.position.x,
          dy: childObject.position.y,
          dz: childObject.position.z,
          yoffset: parameters.dy,
        },
        span: parameters.span,
        sweep: parameters.sweep,
        dihedral: parameters.dihedral,
        mounting_angle: parameters.mount,
        washout: parameters.washout,
        root_chord: parameters.root_chord,
        tip_chord: parameters.tip_chord,
        airfoils: {
          af1: parameters.root_airfoil[root_name],
          af2: parameters.tip_airfoil[tip_name],
        },
        grid: parameters.nSeg,
        control: mycontrol,
        sameAsRoot: parameters.same_as_root, // DFH
      }
    }
    write_analysis_wings_json(childObject, global_wing_ID)
  }
}

//----------------------------------------------------------------------------------

var write_analysis_props_json = function (myObject) {
  //    console.log('looking at object:',myObject.name)

  for (var ichild = 0; ichild < myObject.children.length; ichild++) {
    var childObject = myObject.children[ichild]
    if (
      childObject.type == "Mesh" &&
      childObject.geometry.type == "PropGeometry"
    ) {
      global_prop_ID = global_prop_ID + 1
      console.log("Adding Prop #", global_prop_ID)
      var parameters = childObject.geometry.parameters

      var myMotor = {}
      if (parameters.electric_motor.has_motor) {
        myMotor = parameters.electric_motor
      }

      //var my_is_main = 0;
      //if(parameters.is_main) {my_is_main = 1;}
      console.log(parameters)
      for (var root_name in parameters.root_airfoil) break
      for (var tip_name in parameters.tip_airfoil) break

      var chord_info = {}

      if (parameters.elliptical == true) {
        chord_info.type = "elliptical"
        chord_info.root = parameters.root_chord
      } else {
        chord_info.type = "linear"
        chord_info.root = parameters.root_chord
        chord_info.tip = parameters.tip_chord
      }

      global_props[childObject.name] = {
        name: childObject.name,
        position: {
          dx: childObject.position.x + myObject.position.x,
          dy: childObject.position.y + myObject.position.y,
          dz: childObject.position.z + myObject.position.z,
        },
        orientation: {
          elevation_angle: (childObject.rotation.y * 180) / Math.PI,
          heading_angle: (childObject.rotation.z * 180) / Math.PI,
        },
        radial_nodes: parameters.nSeg,
        diameter: parameters.diameter,
        hub_diameter: parameters.hub_radius * 2.0,
        num_of_blades: parameters.nblades,
        rotation_direction: parameters.rotation,
        pitch: { type: "value", value: parameters.pitch },
        chord: chord_info,
        electric_motor: myMotor,
        airfoils: {
          af1: parameters.root_airfoil[root_name],
          af2: parameters.tip_airfoil[tip_name],
        },
      }
    }
    write_analysis_props_json(childObject, global_prop_ID)
  }
}

//----------------------------------------------------------------------------------

var get_CG_object = function (myObject) {
  //    console.log('looking at object:',myObject.name)
  if (myObject.name === "Center of Gravity") return myObject

  for (var ichild = 0; ichild < myObject.children.length; ichild++) {
    var retObject = get_CG_object(myObject.children[ichild])

    if (retObject.name === "Center of Gravity") return retObject
  }

  return myObject
}

//----------------------------------------------------------------------------------
var delete_duplicate_components = function (editor) {
  console.log("Checking for duplicate components...")

  for (var ichild = 3; ichild < editor.scene.children.length; ichild++) {
    var childObject = editor.scene.children[ichild]
    //        console.log(ichild, childObject.name);
    if (childObject.name === "Center of Gravity") {
      editor.scene.children[0].position.x = childObject.position.x
      editor.scene.children[0].position.y = childObject.position.y
      editor.scene.children[0].position.z = childObject.position.z
      delete_component(editor, childObject)
      ichild--
    }
    if (childObject.name === "Aerodynamic Center") {
      delete_component(editor, childObject)
      ichild--
    }
    if (childObject.name === "PointLight") {
      editor.scene.children[2].position.x = childObject.position.x
      editor.scene.children[2].position.y = childObject.position.y
      editor.scene.children[2].position.z = childObject.position.z
      delete_component(editor, childObject)
      ichild--
    }
  }
}

//----------------------------------------------------------------------------------

var delete_component = function (editor, object) {
  console.log("Deleting extra ", object.name)

  var scope = editor

  object.traverse(function (child) {
    scope.removeHelper(child)
  })

  object.parent.remove(object)

  editor.signals.objectRemoved.dispatch(object)
  editor.signals.sceneGraphChanged.dispatch()
}

//----------------------------------------------------------------------------------

var calculate_reference_values = function (editor) {
  analysis.reference.area = 0.0
  analysis.reference.lateral_length = 0.0

  add_wing_reference_values(editor.scene)

  analysis.reference.longitudinal_length =
    analysis.reference.area / analysis.reference.lateral_length

  if (isNaN(analysis.reference.longitudinal_length)) {
    analysis.reference.longitudinal_length = 0.0
  }

  console.log(analysis.reference)
}

//----------------------------------------------------------------------------------
var add_wing_reference_values = function (myObject) {
  for (var ichild = 0; ichild < myObject.children.length; ichild++) {
    var childObject = myObject.children[ichild]
    if (
      childObject.type == "Mesh" &&
      childObject.geometry.type == "WingGeometry"
    ) {
      var parameters = childObject.geometry.parameters
      if (parameters.is_main) {
        console.log("Including area of ", childObject.name)
        var length = parameters.span
        var area = length * 0.5 * (parameters.root_chord + parameters.tip_chord)
        if (parameters.tip_chord < 0.0) {
          //elliptic wing
          var cbar = (Math.PI * parameters.root_chord) / 4.0
          area = length * cbar
        }
        if (parameters.side == "both") {
          length = length * 2.0
          area = area * 2.0
        }
        analysis.reference.area = analysis.reference.area + area
        analysis.reference.lateral_length =
          analysis.reference.lateral_length + length
      }
    }
    add_wing_reference_values(childObject)
  }
}

//----------------------------------------------------------------------------------

//----------------------------------------------------------------------------------
var unlockAccount = function (callback) {
  var data_json = {}
  data_json.pswrd = prompt("Please enter your password")

  var result_json
  console.log(data_json)

  var data_str = JSON.stringify(data_json, null, "\t")
  data_str = data_str.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, "$1")

  console.log(data_str)
  var url = "/wp-content/themes/aperture-child/MachUp/analysis/V2.0/unlock.php/"
  $.ajax({
    type: "post",
    url: url,
    //          data: {data_json:data_json}, // this has issues with the wing for some reason
    data: { data_str: data_str },
    beforeSend: function () {
      // before send the request, displays a "Loading..." message in the element where the server response will be placed
      $("#resp").html("Loading...")
    },
    //          async: false,
    timeout: 100000, // sets timeout for the request (100 seconds)
    error: function (xhr, status, error) {
      console.log("Error in ajax call to server.")
      alert("Error: " + xhr.status + " - " + error)
    },
    success: function (Result) {
      console.log(Result)
      result_json = $.parseJSON(Result)
      console.log("Complete.")
      callback(result_json)
    },
  })
}
