const { ProjectModel } = require('../models/project')

async function retrieveProject(req, res, next) {

  let project = await ProjectModel.findById(req.params.projectId)
  .catch((err) => { 
    res.status(404).json({message: err.message})
    return
  })

  if (!project) {
    res.status(404).json({message: "Project not found."})
    return
  }

  req.project = project
  next()

}

module.exports = { retrieveProject }