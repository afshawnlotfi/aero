/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function (editor) {
  var container = new UI.Panel()
  container.setId("sidebar")

  //

  var sceneTab = new UI.Text("PARTS").onClick(onClick)
  var conditionTab = new UI.Text("CONDITION").onClick(onClick)
  var projectTab = new UI.Text("ANALYSIS").onClick(onClick)
  var settingsTab = new UI.Text("SETTINGS").onClick(onClick)

  var tabs = new UI.Div()
  tabs.setId("tabs")
  tabs.add(sceneTab, conditionTab, projectTab) //to add settings tab insert, settingsTab here
  container.add(tabs)

  function onClick(event) {
    select(event.target.textContent)
  }

  //

  var scene = new UI.Span().add(
    new Sidebar.Scene(editor), //Components tree
    new Sidebar.Properties(editor), //object, geometry, and material tabs or various objects
    new Sidebar.Animation(editor) //Animation display is currently set to 'none', so its invisible
    //new Sidebar.Script( editor )
  )
  container.add(scene)

  var condition = new UI.Span().add(new Sidebar.Condition(editor))
  container.add(condition)

  var project = new UI.Span().add(
    new Sidebar.Analysis(editor),
    new Sidebar.Project(editor)
  )
  container.add(project)

  //setting tab is not currently in tabs
  var settings = new UI.Span().add(
    new Sidebar.Settings(editor),
    new Sidebar.History(editor)
  )
  container.add(settings)

  //

  function select(section) {
    sceneTab.setClass("")
    conditionTab.setClass("")
    projectTab.setClass("")
    settingsTab.setClass("")

    scene.setDisplay("none")
    condition.setDisplay("none")
    project.setDisplay("none")
    settings.setDisplay("none")

    switch (section) {
      case "PARTS":
        sceneTab.setClass("selected")
        scene.setDisplay("")
        break
      case "CONDITION":
        conditionTab.setClass("selected")
        condition.setDisplay("")
        break
      case "ANALYSIS":
        projectTab.setClass("selected")
        project.setDisplay("")
        break
      case "SETTINGS":
        settingsTab.setClass("selected")
        settings.setDisplay("")
        break
    }
  }

  select("PARTS")

  return container
}
