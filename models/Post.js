const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  pageName: {
    type: String,
    enum: ['Home', 'FindMore', 'About'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // e.g. /pic/filename.jpg or full URL
  link: { type: String },  // optional source url
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
