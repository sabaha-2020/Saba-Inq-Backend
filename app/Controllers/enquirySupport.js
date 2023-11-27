
const EnquirySupport = require("../models/enquirySupport");
const mongoose = require("mongoose");

// Create User
exports.CreateEnquirySupport = async (req, res) => {
  try {
    const { name, descp, isActive } = req.body;


    const enquirySupport = await new EnquirySupport({
      name,
      descp,
      isActive: Boolean(isActive) ,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin',
      updatedBy: 'admin',
      isDeleted: false
    }).save()

    res.status(201).send({
      success: true,
      message: "Successfully created a enquirySupport",
      enquirySupport,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating a enquirySupport",
      error,
    });
  }
};


// Get all Users
exports.GetAllEnquirySupport = async (req, res) => {
  try {
    const enquirySupport = await EnquirySupport.find().sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All enquirySupport",
      enquirySupport,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting all enquirySupport",
      error,
    });
  }
};


//get EnquirySupport by id


exports.GetSingleEnquirySupport = async (req, res) => {
  try {
    const { id } = req.params;


    if (!id || id.toLowerCase() === 'null') {
      return res.status(400).send({
        success: false,
        message: "Invalid ID provided",
      });
    }

    const enquirySupport = await EnquirySupport.findById(id);

    if (!enquirySupport) {
      return res.status(404).send({
        success: false,
        message: "enquirySupport not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Getting single enquirySupport successfully",
      enquirySupport,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting a single enquirySupport",
      error,
    });
  }
};


exports.UpdateEnquirySupport = async (req, res) => {

  try {
    const { id } = req.params;
    const updatedData = req.body;

    const enquirySupport = await EnquirySupport.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!enquirySupport) {
      return res.status(404).send({
        success: false,
        message: "Support not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Successfully updated the Enquiry Support",
      enquirySupport: updatedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating the Enquiry Support",
      error,
    });
  }
};

// Delete Organization Type by ID (soft delete)
exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const enquirySupport = await EnquirySupport.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!enquirySupport) {
      return res.status(404).send({
        success: false,
        message: 'Organization type not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Successfully soft-deleted the organization type',
      enquirySupport,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in soft-deleting the organization type',
      error,
    });
  }
};



// Delete User by ID
/*exports.DeleteEnquirySupport = async (req, res) => {
    try {
      const { id } = req.params;
      const enquirySupport = await EnquirySupport.findByIdAndDelete(id);


      if (!enquirySupport) {
        return res.status(404).send({
          success: false,
          message: "EnquirySupport not found",
        });
      }


      res.status(200).send({
        success: true,
        message: "Successfully deleted the enquirySupport",
        enquirySupport,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in deleting the enquirySupport",
        error,
      });
    }
  };
  
*/




// search enquirysupport 


exports.searchEnquirySupportController = async (req, res) => {
  try {

    const { keyword } = req.params;

    console.log('Received search keyword:', keyword);
    const results = await EnquirySupport.find({ $or: [{ name: { $regex: keyword, $options: "i" } }] })

    res.json(results)
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Sry cannot find what you are looking for",
      error,
    });
  }
}


// GET FULL COUNT OF user
exports.findTotalSupportCount = async (req, res) => {
  try {
    const { keyword } = req.query;
    const query = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

    const enquirySupport = await EnquirySupport.countDocuments(query);
    res.status(200).send({
      success: true,
      message: "Successfully found the count",
      enquirySupport,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in counting the enquirySupport",
      error,
    });
  }
};


