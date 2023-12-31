const OrgCategory = require('../models/orgCategory');

// Create Organization Category
exports.createOrgCategory = async (req, res) => {
  try {
    const { name, descp} = req.body;

    
    const existingEnquiry = await OrgCategory.findOne({ name });
    if (existingEnquiry) {
        return res.status(200).send({
            success: true,
        message: "This Category  name already exists",
        });
    }
    const orgCategory = await new OrgCategory({
      name,
      descp,
      status: 'new',
      createdBy :'admin',
      updatedBy :'admin',
      createdAt: new Date().toISOString(),
      updatedAt:  new Date().toISOString(),
    }).save();

    res.status(201).send({
      success: true,
      message: 'Successfully created an organization Category',
      orgCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in creating an organization Category',
      error,
    });
  }
};

// // Get all Organization Category
// exports.getAllOrgCategory = async (req, res) => {
//   try {
//     const orgCategory = await OrgCategory.find({isDeleted:false}).sort({ createdAt: -1 });
//     res.status(200).send({
//       success: true,
//       message: 'All organization Category',
//       orgCategory,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: 'Error in getting all organization Category',
//       error,
//     });
//   }
// };

// Example modification in getAllOrgCategory
exports.getAllOrgCategory = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const skip = (page - 1) * pageSize; 
    const orgCategory = await OrgCategory.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(pageSize));

    res.status(200).send({
      success: true,
      message: 'Paginated organization Category',
      orgCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in paginating organization Category',
      error,
    });
  }
};


// Get Organization Category by ID
exports.getSingleOrgCategory = async (req, res) => {
  try {
    const {id} =req.params;
    const orgCategory = await OrgCategory.findById(id);

    if (!orgCategory) {
      return res.status(404).send({
        success: false,
        message: 'Organization Category not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Getting single organization Category successfully',
      orgCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in getting a single organization Category',
      error,
    });
  }
};

// Update Organization Category by ID
exports.updateOrgCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const orgCategory = await OrgCategory.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!orgCategory) {
      return res.status(404).send({
        success: false,
        message: 'Organization Category not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Successfully updated the organization Category',
      orgCategory: updatedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in updating the organization Category',
      error,
    });
  }
};

  
// Delete Organization Type by ID (soft delete)
exports.softDeleteOrgCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const orgCategory = await OrgCategory.findByIdAndUpdate(
          id,
        { isDeleted: true, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
  
      if (!orgCategory) {
        return res.status(404).send({
          success: false,
          message: 'Organization Category not found',
        });
      }
  
      res.status(200).send({
        success: true,
        message: 'Successfully soft-deleted the organization Category',
        orgCategory,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error in soft-deleting the organization Category',
        error,
      });
    }
  };

//  // search 

//  exports.searchOrgCatg = async(req,res)=>{
//   try {
     
//       const {keyword} = req.query;

//       const results = await OrgCategory.find({
//         $or: [
//           { name: { $regex: new RegExp(keyword, 'i') } },  
//           { descp: { $regex: new RegExp(keyword, 'i') } },
//           {isDeleted: false}
          
//         ] , }).sort({ createdAt: -1 });

//       res.status(200).send({
//         success: true,
//         results,
//       });

//   } catch (error) {
//       console.log(error);
//       res.status(400).send({
//         success: false,
//         message: "error in per page ctrl",
//         error,
//       });
//   }
// }

 // search 

 exports.searchOrgCatg = async(req,res)=>{
  try {
     
      const {keyword} = req.query;

      const results = await OrgCategory.find({
        $and: [
          {isDeleted: false},
         { $or:[
          { name: { $regex: new RegExp(keyword, 'i') } },  
          { descp: { $regex: new RegExp(keyword, 'i') } },]}
        ] , }).sort({ createdAt: -1 });

      res.status(200).send({
        success: true,
        results,
      });

  } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "error in per page ctrl",
        error,
      });
  }
}
