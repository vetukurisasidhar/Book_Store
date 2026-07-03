const mongoose = require('mongoose');

const normalizeImage = (imagePath) => {
  if (!imagePath) return '';
  if (String(imagePath).startsWith('http://') || String(imagePath).startsWith('https://')) {
    return imagePath;
  }
  const parts = String(imagePath).split(/[/\\]/);
  return parts[parts.length - 1];
};

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }
}, { timestamps: true });

BookSchema.post('init', function(doc) {
  if (doc.image) {
    doc.image = normalizeImage(doc.image);
  }
});

BookSchema.post('save', function(doc) {
  if (doc.image) {
    doc.image = normalizeImage(doc.image);
  }
});

module.exports = mongoose.model('Book', BookSchema);

