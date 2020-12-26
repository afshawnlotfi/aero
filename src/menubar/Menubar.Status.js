/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Status = function (editor) {
  var container = new UI.Panel()
  container.setClass("menu right").setMarginTop("8px")

  var autosave = new UI.THREE.Boolean(
    editor.config.getKey("autosave"),
    "Autosave"
  )
  autosave.text.setColor("#888").setMarginTop("-6px")
  autosave.onChange(function () {
    var value = this.getValue()

    editor.config.setKey("autosave", value)

    if (value == true) {
      editor.singals.sceneGraphChanged.dispatch()
    }
  })
  container.add(autosave)

  editor.signals.savingStarted.add(function () {
    autosave.text.setTextDecoration("underline")
  })

  editor.signals.savingFinished.add(function () {
    autosave.text.setTextDecoration("none")
  })

  var version = new UI.Text("r" + THREE.REVISION)
  version.setClass("title")
  version.setOpacity(0.5)
  //container.add( version );

  return container
}
