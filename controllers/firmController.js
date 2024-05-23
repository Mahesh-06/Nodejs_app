const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");
const Path = require("path")

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+ Path.extname(file.originalname))
    }
});
const upload = multer({storage:storage})


const addFirm = async(req,res)=>{
    try{
        const {firmName,area,category,region,offer}=req.body;

    const image = req.file?req.file.filename:undefined;
    const vendor = await Vendor.findById(req.vendorId);

    const firm = new Firm({
        firmName,area,category,region,offer,image,vendor:vendor._id
    })
     const savedFirm =  await firm.save()
     vendor.firm.push(savedFirm)

     await vendor.save()

    return res.status(200).json({message:"firm added successfully"})
    }
    catch(err){
        console.log(err)
        res.status(500).json("internal sever error")
    }
}


const  deleteFirmById= async(req,res)=>{
    try{
        const firmId = req.params.firmId;
        const deleteFirm = await Firm.findByIdAndDelete(firmId)
        if(!deleteFirm){
            return res.status(404).json({error:"Not Product Found"})
        }
    }
    catch(error){
         res.status(500).json({error:"Internal server error"})

    }
}
module.exports = {addFirm:[upload.single('image'),addFirm],deleteFirmById}