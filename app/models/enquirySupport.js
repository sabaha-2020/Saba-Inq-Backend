const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
  },
 descp :{
  type: String,
  required: true,
},
 isActive:{
  type: Boolean,
  required: true,
  default:true
  
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
    type: String,
    required: true,
    default:'admin'

},
    updatedBy:{
    type: String,
    required: true,
    default:'admin'
},

isDeleted: {
  type: Boolean,
  default: false, 
},

});

const EnquirySupport = mongoose.model("EnquirySupport", EnquirySchema);

module.exports = EnquirySupport;
