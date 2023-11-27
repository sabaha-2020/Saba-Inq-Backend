const Enquiry = require("../models/enquiry");

// Create Enquiry
exports.CreateEnquiryController = async (req, res) => {
  try {
    const {
      enqNo,
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

    if (!enqNo || !enqDescp || !fName || !lName || !email ||!mobile || !location ) {
      return res.status(400).send({ message: "All required fields must be provided" });
    }

    const existingEnquiry = await Enquiry.findOne({email});

    if (existingEnquiry) {
      return res.status(200).send({
        success: true,
        message: "Enquiry with this email already exists",
      });
    }

    const enquiry = await new Enquiry({
      enqNo,
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
      enqStatus :'open',
      referenceId,
      remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

// Get all Enquiries
exports.GetAllEnquiriesController = async (req, res) => {
  try {
    const enquiry = await Enquiry.find().sort({ createdAt :-1}) 
    .populate('enqSource')
    .populate('enqType')
    .populate('enqMode')
    .populate('enqTo')
    .populate('supportType');

    res.status(200).send({
      success: true,
      message: "All enquiries",
      enquiry,
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
