/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.File = function (editor) {
  var container = new UI.Panel()
  container.setClass("menu")

  var title = new UI.Panel()
  title.setClass("title")
  title.setTextContent("File")
  container.add(title)

  var options = new UI.Panel()
  options.setClass("options")
  container.add(options)

  // New

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("New")
  option.onClick(function () {
    if (confirm("Are you sure? This will clear the current design.")) {
      // DFH

      editor.clear()

      location.href = location.pathname
    }
  })
  options.add(option)

  //

  options.add(new UI.HorizontalRule())

  // Open // DFH

  var fileInput = document.createElement("input")
  fileInput.type = "file"
  fileInput.addEventListener("change", function (event) {
    editor.loader.loadFile(fileInput.files[0])
  })

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Open")
  option.onClick(function () {
    fileInput.click()
  })
  options.add(option)

  // Save As... // DFH

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Save As...")
  option.onClick(function () {
    var filename = prompt("Enter a filename", editor.scene.name)
    if (filename != null) {
      var output = editor.scene.toJSON()
      output = JSON.stringify(output, null, "\t")
      output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, "$1")

      saveString(output, filename + ".mu")
    }
  })
  options.add(option)

  //

  options.add(new UI.HorizontalRule())

  // Export to MU Pro

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Export to MU Pro")
  option.onClick(function () {
    var filename = prompt("Enter a filename", editor.scene.name)
    if (filename != null) {
      var output = (data_json = write_machup_analysis_json(editor))
      output = JSON.stringify(output, null, "\t")
      output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, "$1")

      saveString(output, filename + ".json")
    }
  })
  options.add(option)

  //

  options.add(new UI.HorizontalRule())

  // Import STL // DFH

  var fileInput = document.createElement("input")
  fileInput.type = "file"
  fileInput.addEventListener("change", function (event) {
    editor.loader.loadFile(fileInput.files[0])
  })

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Import STL")
  option.onClick(function () {
    alert(
      "Imported STL geometries are not included in the aerodynamic analysis. They are only for viewing purposes."
    )
    fileInput.click()
  })
  options.add(option)

  // Export STL

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Export STL")
  option.onClick(function () {
    var filename = prompt("Enter a filename", "model")
    if (filename !== null) {
      var exporter = new THREE.STLExporter()

      saveString(exporter.parse(editor.scene), filename + ".stl")
    }
  })
  options.add(option)

  //

  // Export OBJ

  var option = new UI.Row()
  option.setClass("option")
  option.setTextContent("Export OBJ")
  option.onClick(function () {
    var filename = prompt("Enter a filename", "model")
    if (filename !== null) {
      var exporter = new THREE.OBJExporter()

      saveString(exporter.parse(editor.scene), filename + ".obj")
    }
  })
  options.add(option)

  //

  var link = document.createElement("a")
  link.style.display = "none"
  document.body.appendChild(link) // Firefox workaround, see #6594

  function save(blob, filename) {
    link.href = URL.createObjectURL(blob)
    link.download = filename || "data.json"
    link.click()

    // URL.revokeObjectURL( url ); breaks Firefox...
  }

  function saveString(text, filename) {
    save(new Blob([text], { type: "text/plain" }), filename)
  }

  return container
}
