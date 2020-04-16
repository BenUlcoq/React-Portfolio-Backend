const { uploader } = require('../config/cloudinary')
const { dataUri } = require('../config/multer')
const { ProjectModel, validateProject } = require('../models/project')

async function read(req, res, next) {

  let project = await ProjectModel.findById(req.params.projectId)
  .catch((err) => { 
    res.status(404).json({message: err.message})
    return
  })

  if (!project) {
    res.status(404).json({message: "Project not found."})
    return
  }

  res.json(project)

}

async function listAll(req, res, next) {

  let projects = await ProjectModel.find()
  .catch((err) => { 
    res.status(404).json({message: err.message})
    return
  })

  if (!projects) {
    res.status(404).json({message: "No projects found."})
    return
  }

  res.json({results: projects.length, projects})

}

async function list(req,res,next) {

  let projects = await ProjectModel.find({archived: false})
  .catch((err) => { 
    res.status(404).json({message: err.message})
    return
  })

  if (!projects) {
    res.status(404).json({message: "No projects found."})
    return
  }

  res.json({results: projects.length, projects})
  
}

async function listTags(req, res, next) {

  let queryTags = req.params.tags.split(',')

  let projects = await ProjectModel.find({tags: { $in: queryTags }, archived: false})
  .catch((err) => {
    res.status(404).json({message: err.message})
  })

  if (!projects) {
    res.status(404).json({message: "No projects found."})
    return
  }

  res.json({results: projects.length, projects})

}

async function create(req, res, next) {

  let projectData = {...req.body}
  console.log(projectData)
  // console.log(req)

  // Format Tags
  projectData.tags = projectData.tags.split(',')
  projectData.archived = false

  // Validate Data
  let {error} = validateProject(projectData) 
  if(error) {
    let messages = error.details.map((error) => {
      return error.message
    })
    res.status(400).json({message: `${messages.join(". ")}.`})
    return
  }

  // Check for Media and Upload
  if (req.files.length > 0) {
    try {
      projectData.media = []
      let urls = await upload(req.files, projectData.tags)
      let media = urls.map((url) => {
        return { url, featured: false }
      })
      projectData.media = media
    }
    catch(err) {
      res.status(400).json({message: err.message})
      return
    }
  }

  ({error} = validateProject(projectData))
  if(error) {
    let messages = error.details.map((error) => {
      return error.message
    })
    res.status(400).json({message: `${messages.join(". ")}.`})
    return
  }

  // Save Project
  let project = new ProjectModel(projectData)
  try {
    await project.save()
    res.status(200).json({message: `Project "${projectData.title}" Successfully created.`, project: project})
    return
  }
  catch(err) {
    res.status(400).json({message: err.message})
    return
  }
}


async function upload(files, tags) {
    let uploads = []
    for(let file of files) {
      const dataUriFile = dataUri(file).content
      uploads.push(
        await uploader.upload(dataUriFile, null, 
          { 
            tags: tags, 
            folder: process.env.CLOUDINARY_FOLDER,
            resource_type: 'auto'
          }
          )
      )
    }

    let urls = []
    return Promise.all(uploads)
    .then((results => {

      results.map((result) => {
        urls.push(result.url)
      })
      return(urls)

    }))
    .catch((err) => {
      throw(err)
    })

}

async function update(req, res, next) {

  

  let projectData = {...req.body}
  let projectMedia = []

  console.log(projectData)

  projectData.tags = projectData.tags.split(',')
  
  let {error} = validateProject(projectData) 
  if(error) {
    let messages = error.details.map((error) => {
      return error.message
    })
    res.status(400).json({message: `${messages.join(". ")}.`})
    return
  }

  if (req.files.length > 0) {
    try {
      let urls = await upload(req.files, req.body.project.tags)
      let media = urls.map((url) => {
        return { url, featured: false }
      })
      projectMedia = media
    }
    catch(err) {
      res.status(400).json({message: err.message})
      return
    }
  }

  let project = await ProjectModel.findByIdAndUpdate(req.params.projectId, {$set: projectData, $push: {media: projectMedia}}, {new: true, runValidators: true})
  .catch((err) => { 
    res.status(400).json({message: err.message})
    return
  })

  res.json(project)

}

async function destroy(req, res, next) {

  let project = await ProjectModel.findById(req.params.projectId)
  .catch((err) => { 
    res.status(404).json({message: err.message})
    return
  })

  if (!project) {
    res.status(404).json({message: "Project not found."})
    return
  }

  ProjectModel.findByIdAndDelete(req.params.projectId)
  .then((project) => {
    console.log(project)
    res.json({message: "Deleted!", project})
  })
  .catch((err) => {
    res.status(404).json({message: err.message})
    return
  })
  

}

module.exports = { create, read, update, destroy, list, listAll, listTags }