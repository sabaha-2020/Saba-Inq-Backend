const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  descp: {
    type: String,
    required: true,
  },

  status: {
    type: String,
      enum:['new','active','pending','blocked','converted']
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy:{
    /* type: mongoose.Schema.Types.ObjectId,
      ref: 'user'*/
      type: String,
      default:'admin'
    },
     updatedBy:{
    /* type: mongoose.Schema.Types.ObjectId,
      ref: 'user' */
      type:String,
      default :'admin'
     },
  isDeleted: {
    type: Boolean,
    default: false, 
  }

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
