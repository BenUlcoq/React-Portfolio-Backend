const { uploader } = require('../config/cloudinary')
const { dataUri } = require('../config/multer')
const { MediaModel, validateMedia } = require('../models/media')


async function uploadCloudImage(files, tags) {
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

  let items = []
  return Promise.all(uploads)
  .then((results => {
    results.map((result) => {
      items.push(result)
    })
    return(items)

  }))
  .catch((err) => {
    throw(err)
  })

}

async function deleteCloudImage(id) {
  return await uploader.destroy(id)
  .then((result) => {
    console.log(result)
    return result
  })
  .catch((err) => {
    return err
  })
}


async function create(req, res, next) {

  let projectData = {...req.body}
  projectData.tags = projectData.tags.split(',')
  
  let projectMedia = []
  
  if (req.files.length > 0) {
    try {
      let files = await uploadCloudImage(req.files, projectData.tags)

      let media = files.map((file) => {
        let item = {}
        item.public_id = file.public_id
        item.tags = file.tags
        item.url = file.secure_url
        return item
      })

      projectMedia = media
    }
    catch(err) {
      res.status(400).json({message: err.message})
      return
    }

    let items = []
    for (let item of projectMedia) {
      let media = new MediaModel(item)
        items.push(
          await media.save()
      )
    }

    await Promise.all(items)
    .then((results) => {
      req.media = results
      // console.log(req.media)
    })
    .catch((err) => {
      res.status(400).json({message: err.message})
      return
    })

    next()
  } else {
    next()
  }
}

async function read(req, res, next) {
  
  let media = await MediaModel.findById(req.params.mediaId)
  .catch((err) => {
    res.status(404).json({message: err.message})
    return
  })

  if (!media) {
    res.status(404).json({message: "Media not found."})
    return
  }

  res.json(media)

}

async function update(req, res, next) {

  let media = await MediaModel.findById(req.params.mediaId)
  .catch((err) => {
    res.status(404).json({message: err.message})
    return
  })

  if (!media) {
    res.status(404).json({message: "Media not found."})
    return
  }

  let tags = {tags: req.body.tags.split(',')}

  console.log(tags)

  media = await MediaModel.findByIdAndUpdate(req.params.mediaId, {$set: tags}, {new: true, runValidators: true})
  .catch((err) => {
    res.status(400).json({message: err.message})
    return
  })

  res.json(media)

}

async function destroy(req, res, next) {

  let media = await MediaModel.findById(req.params.mediaId)
  .catch((err) => {
    res.status(404).json({message: err.message})
    return
  })

  if (!media) {
    res.status(404).json({message: "Media not found."})
    return
  }

  await deleteCloudImage(media.public_id)

  MediaModel.findByIdAndDelete(req.params.mediaId)
  .then((media) => {
    console.log(media)
    res.json({message: "Deleted!", media})
  })
  .catch((err) => {
    res.status(404).json({message: err.message})
    return
  })

}

async function list(req, res, next) {

  let media = await MediaModel.find()
  .catch((err) => {
    res.status(404).json({message: err.message})
    return
  })

  if (!media) {
    res.status(404).json({message: "Media not found."})
    return
  }

  res.json({results: media.length, media})

}

module.exports = {create, read, destroy, update, list}