const mongoose = require('./init')
const Joi = require('@hapi/joi')
Joi.ObjectId = require('joi-objectid')(Joi)

const urlRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  subtitle: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  description: {
    type: String,
    required: true
  },
  create_date: {
    type: Date, 
    default: Date.now() 
  },
  tags: [
    { 
      type: String,
      required: true
    }
  ],
  media: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
    }
  ],
  featured: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    required: true,
    // TODO: FIX THIS DEFAULT VALUE
    default: "5ea0e30cdd0122df7818792e"
   },
  link: {
    type: String,
    match: urlRegex
  },
  github: {
    type: String,
    match: urlRegex
  },
  archived: {
    type: Boolean,
    required: true,
    default: true
  }
})

const ProjectModel = mongoose.model('Project', projectSchema)

function validateProject(project) {
  const schema = Joi.object({
    title: Joi.string()
      .required()
      .min(1)
      .max(255),
    subtitle: Joi.string()
      .required()
      .min(1)
      .max(255),
    description: Joi.string()
      .required(),
    create_date: Joi.date(),
    tags: Joi.array()
      .items(Joi.string().required())
      .unique(),
    media: Joi.array()
      .items(
        Joi.ObjectId()
      )
      .unique(),
    featured: Joi.ObjectId(),
    link: Joi.string()
      .pattern(urlRegex),
    github: Joi.string()
      .pattern(urlRegex),
    archived: Joi.boolean().required()
  })
  return schema.validate(project, {abortEarly: false})
}

module.exports = { ProjectModel, validateProject }