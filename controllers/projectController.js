const { ProjectModel, validateProject } = require('../models/project')

async function validate(req, res, next) {

  let projectData = {...req.body}
  projectData.tags = projectData.tags.split(',')
  projectData.archived = false

  let {error} = validateProject(projectData) 
  if(error) {
    let messages = error.details.map((error) => {
      return error.message
    })
    res.status(400).json({message: `${messages.join(". ")}.`})
    return
  } else {
    next()
  }

}

async function read(req, res, next) {

  let project = await ProjectModel.findById(req.params.projectId).populate('media', 'url description tags')
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

  let projects = await ProjectModel.find({archived: false}).populate('media', 'url description tags')
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

  let projects = await ProjectModel.find({tags: { $in: queryTags }, archived: false}).populate('media', 'url description tags')
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

  projectData.media = req.media.map((item) => {
    return item._id.toString()
  })

  // Format Tags
  projectData.tags = projectData.tags.split(',')
  projectData.archived = false;

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

async function update(req, res, next) {

  let projectData = {...req.body}
  

  let projectMedia = req.media.map((item) => {
    return item._id.toString()
  })

  projectData.tags = projectData.tags.split(',')

  let {error} = validateProject(projectData) 
  if(error) {
    let messages = error.details.map((error) => {
      return error.message
    })
    res.status(400).json({message: `${messages.join(". ")}.`})
    return
  }

  let project = await ProjectModel.findByIdAndUpdate(req.params.projectId, {$set: projectData, $push: {media: projectMedia}}, {new: true, runValidators: true})
  .catch((err) => { 
    res.status(400).json({message: err.message})
    return
  })

  res.json(project)

}

async function destroy(req, res, next) {

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

module.exports = { create, read, update, destroy, list, listAll, listTags, validate }


// { public_id: 'portfolio/c5drhuwfmo5pxn8me5bq',
//     version: 1587012030,
//     signature: '13d56bb54a6b116c6cb09f079998971dcd5a4dc7',
//     width: 500,
//     height: 625,
//     format: 'jpg',
//     resource_type: 'image',
//     created_at: '2020-04-16T04:40:30Z',
//     tags: [ 'jew', 'bob' ],
//     bytes: 51141,
//     type: 'upload',
//     etag: 'bb124b5329d5e8fc12d484ea6f20c9ff',
//     placeholder: false,
//     url:
//      'http://res.cloudinary.com/dqfwgv9dg/image/upload/v1587012030/portfolio/c5drhuwfmo5pxn8me5bq.jpg',
//     secure_url:
//      'https://res.cloudinary.com/dqfwgv9dg/image/upload/v1587012030/portfolio/c5drhuwfmo5pxn8me5bq.jpg',
//     backup_url:
//      'api.cloudinary.com/v1_1/dqfwgv9dg/resources/86b9036686fa2385715ac1c06bb5ce7c/backup/cbd69b271dc0aaf48d249f43af9bd492' } 