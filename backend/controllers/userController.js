import User from "../models/User.js"
import cloudinary from "../database/cloudinary.js"

export const updateProfile = async (req, res) => {
    // image => cloudinary -> image.cloudinary.your -> mongodb
    try {
        const { image, ...otherData } = req.body
        let updatedData = otherData

        if (image) {
            //base64 format
            if (image.startsWith("data:image")) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(image)
                    updatedData.image = uploadResponse.secure_url
                } catch (error) {
                    console.error("error uploading image: ", uploadError)

                    return res.status(400).json({
                        success: false,
                        message: "error uploading image"
                    })
                }
            }
        }
        const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, { new: true })
        res.status(200).json({
            success: true,
            user: updatedUser
        })

    } catch (error) {
        console.log("error in updatedProfile:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}
