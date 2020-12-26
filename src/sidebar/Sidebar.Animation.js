/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Animation = function (editor) {
  var signals = editor.signals

  var options = {}
  var possibleAnimations = {}

  var container = new UI.CollapsiblePanel()
  container.setCollapsed(editor.config.getKey("ui/sidebar/animation/collapsed"))
  container.onCollapsedChange(function (boolean) {
    editor.config.setKey("ui/sidebar/animation/collapsed", boolean)
  })
  container.setDisplay("none")

  container.addStatic(new UI.Text("Animation").setTextTransform("uppercase"))
  container.add(new UI.Break())

  var animationsRow = new UI.Row()
  container.add(animationsRow)

  return container
}
