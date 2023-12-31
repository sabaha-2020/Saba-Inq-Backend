const Enquiry = require("../models/enquiry");
const cron = require('node-cron');
// Create Enquiry
exports.CreateEnquiryController = async (req, res) => {
  try {
    const {
     
      enqSource,
      enqType,
      enqMode,
      supportType,
      enqDescp,
      fName,
      lName,
      gender,
      email,
      mobile,
      district,
      location,
      state,
      leadQuality,
      enqTo,
      referenceId,
      remarks,
    } = req.body;

    if ( !enqDescp || !fName || !lName || !email ||!mobile || !location ) {
      return res.status(400).send({ message: "All required fields must be provided" });
    }

    const existingEnquiry = await Enquiry.findOne({email});

    if (existingEnquiry) {
      return res.status(200).send({
        success: true,
        message: "Enquiry with this email already exists",
      });
    }

 // Fetch the maximum existing enqNo
 const maxEnqNo = await Enquiry.find().sort({ enqNo: -1 }).limit(1);

 // Increment the maximum enqNo or start from 1 if no records exist
 const newEnqNo = maxEnqNo.length > 0 ? maxEnqNo[0].enqNo + 1 : 1;


    const enquiry = await new Enquiry({
      enqNo: newEnqNo,
      enqSource,
      enqType,
      enqMode,
      supportType,
      enqDescp,
      fName,
      lName,
      gender,
      email,
      mobile,
      district,
      location,
      state,
      leadQuality,
      enqTo,
      status :'new',
      referenceId,
      remarks,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy :'admin',
      updatedBy :'admin',
      isDeleted: false
    }).save();

    res.status(201).send({
      success: true,
      message: "Successfully created an enquiry",
      enquiry,
    });
  } catch (error) {
    console.log(error);


    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).send({
          success: false,
          message: "Email must be unique. The provided email is already in use."
      });
  }

    res.status(500).send({
      success: false,
      message: "Error in creating an enquiry",
      error,
    });
  }
};

// Function to check and update the status
const checkAndUpdateStatus = async () => {
  try {
    const enquiries = await Enquiry.find({ status: 'new', isDeleted: false });

    enquiries.forEach(async (enquiry) => {
      const createdDate = new Date(enquiry.createdAt);
      const currentDate = new Date();

      // Check if the created date is in the future
      if (createdDate > currentDate) {
        console.warn(`Enquiry ${enquiry._id} has a future created date.`);
        return;
      }

      const timeDifference = currentDate - createdDate;

      if (timeDifference > 24 * 60 * 60 * 1000) {
        await Enquiry.findByIdAndUpdate(enquiry._id, { status: 'pending' });
      }
    });
  } catch (error) {
    console.error('Error checking and updating status:', error);
  }
};

// Run the checkAndUpdateStatus function every hour
cron.schedule('0 * * * *', () => {
  checkAndUpdateStatus();
});


// Get all Enquiries
exports.GetAllEnquiriesController = async (req, res) => {
  try {

    const { page = 1, pageSize = 5 } = req.query;
    const skip = (page - 1) * pageSize;
    const enquiry = await Enquiry.find({isDeleted:false}).sort({ createdAt :-1}).skip(skip).limit(pageSize)
    .populate('followUpData', '_id')
    .populate('enqSource')
    .populate('enqType')
    .populate('enqMode')
    .populate('enqTo')
    .populate('supportType');

    const formattedEnquiries = enquiry.map((enq) => ({
      ...enq.toObject(),
      followUpDataPrsnt: enq.followUpData && enq.followUpData.length > 0,
      
    }));


    res.status(200).send({
      

      success:true,
      message: "All enquiries" ,
      enquiry:formattedEnquiries,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting all enquiries",
      error,
    });
  }
};

// Get Single Enquiry by ID
exports.GetSingleEnquiryController = async (req, res) => {

  try {
      const {id} = req.params.id;

    const enquiry = await Enquiry.findById(id)
    .populate('enqSource')
    .populate('enqType')
    .populate('enqMode')
    .populate('enqTo')
    .populate('supportType');

    if (!enquiry) {
      return res.status(404).send({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Getting single enquiry successfully",
      enquiry,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting a single enquiry",
      error,
    });
  }
};

// Update Enquiry
exports.UpdateEnquiryController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).populate('enqSource')
    .populate('enqType')
    .populate('enqMode')
    .populate('enqTo')
    .populate('supportType');
    

    if (!enquiry) {
      return res.status(404).send({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Successfully updated the enquiry",
      enquiry: updatedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating the enquiry",
      error,
    });
  }
};

// Delete Enquiry by ID
exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByIdAndUpdate(id,
    { isDeleted: true, updatedAt: Date.now() },
    { new: true, runValidators: true })
    .populate('enqSource')
    .populate('enqType')
    .populate('enqMode')
    .populate('enqTo')
    .populate('supportType');

    res.status(200).send({
      success: true,
      message: "Successfully deleted the enquiry",
      enquiry,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting the enquiry",
      error,
    });
  }
};

//enquiry count
exports.enquiryCount = async(req,res)=>{

  try {
 const  enquiry = await Enquiry.find({}).countDocuments()
 res.status(200).send({
  success:true,
  enquiry
})
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success:false,
          message:"Error in getting count",
          error
      })
}
}


