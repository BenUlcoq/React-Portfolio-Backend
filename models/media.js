const mongoose = require('./init')
const Joi = require('@hapi/joi')

const urlRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    match: urlRegex
  },
  public_id: {
    type: String,
    required: true
  },
  description: {
    type: String
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
  ]
})

const MediaModel = mongoose.model('Media', mediaSchema)

function validateMedia(media) {
  const schema = Joi.object({
    url: Joi.string()
      .required()
      .pattern(urlRegex),
    public_id: Joi.string()
      .required(),
    description: Joi.string()
      .required(),
    create_date: Joi.date(),
    tags: Joi.array()
      .items(Joi.string().required())
      .unique()
  })
  return schema.validate(media, {abortEarly: false})
}

module.exports = { MediaModel, validateMedia }
