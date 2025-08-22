import { Request, Response } from 'express';
import cloudinary from '../lib/cloudinary.js';
import Destination from '../models/Destination.js';

export const createDestination = async (req: Request, res: Response) => {
    try {
        const { name, description, images, state, bestTimeToVisit, travelTips, averageBudget } = req.body;

        // Validate required fields
        if (!name || !description || !state || !images || !bestTimeToVisit || !travelTips || !averageBudget) {
            return res.status(400).json({ message: "Name, description, state , images, bestTimeToVisit, travelTips, averageBudget are required" });
        }

        let uploadedImageUrls: string[] = [];

      
        if (images && Array.isArray(images) && images.length > 0) {
            for (const img of images) {
                try {
                    // Ensure image is base64 format
                    if (!img || typeof img !== 'string') {
                        console.log('Invalid image format:', typeof img);
                        continue;
                    }
                    
                    const uploadRes = await cloudinary.uploader.upload(img, { 
                        folder: 'destinations',
                        resource_type: 'auto'
                    });
                    uploadedImageUrls.push(uploadRes.secure_url);
                } catch (cloudinaryError: any) {
                    console.log('Cloudinary upload error:', cloudinaryError.message);
                    // Continue with other images instead of failing completely
                }
            }
        }

        const destination = await Destination.create({
            name,
            description,
            images: uploadedImageUrls,
            state,
            bestTimeToVisit,
            travelTips,
            averageBudget,
        });

        res.status(201).json(destination);
    } catch (error: any) {
        console.log("Error in createDestination controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const deleteDestination = async (req: Request, res: Response) => {
    try {
        const destination = await Destination.findById(req.params.id);

        if (!destination) {
            return res.status(404).json({ message: "Destination not Found" });
        }

        if (destination.images && Array.isArray(destination.images)) {
            for (const imgUrl of destination.images) {
                const publicId = imgUrl.split("/").pop()?.split(".")[0];
                try {
                    await cloudinary.uploader.destroy(`destinations/${publicId}`);
                    console.log(`Deleted image ${publicId} from Cloudinary`);
                } catch (error) {
                    console.log(`Error deleting image ${publicId} from Cloudinary`, error);
                }
            }
        }


        await Destination.findByIdAndDelete(req.params.id);
        res.json({ message: "Destination Deleted Successfully" });
    } catch (error: any) {
        console.log("Error in deleteDestination controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getAllDestinations = async (req: Request, res: Response) => {
    try {
        const destinations = await Destination.find();
        res.status(200).json(destinations);
    } catch (error: any) {
        console.log("Error in getAllDestinations controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getBasicDestinations = async (req: Request, res: Response) => {
    try {
        const destinations = await Destination.find().select('name description');
        res.status(200).json(destinations);
    } catch (error: any) {
        console.log("Error in getBasicDestinations controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getDestinationById = async (req: Request, res: Response) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.status(200).json(destination);
    } catch (error: any) {
        console.log("Error in getDestinationById controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateDestination = async (req: Request, res: Response) => {
    try {
        const { name, description, images, state, bestTimeToVisit, travelTips, averageBudget } = req.body;
        
        let uploadedImageUrls: string[] = [];
        
        if (images && Array.isArray(images) && images.length > 0) {
            for (const img of images) {
                try {
                    if (!img || typeof img !== 'string') continue;
                    
                    const uploadRes = await cloudinary.uploader.upload(img, { 
                        folder: 'destinations',
                        resource_type: 'auto'
                    });
                    uploadedImageUrls.push(uploadRes.secure_url);
                } catch (cloudinaryError: any) {
                    console.log('Cloudinary upload error:', cloudinaryError.message);
                }
            }
        }
        
        const updateData: any = {
            name,
            description,
            state,
            bestTimeToVisit,
            travelTips,
            averageBudget,
        };
        
        if (uploadedImageUrls.length > 0) {
            updateData.images = uploadedImageUrls;
        }
        
        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        
        res.status(200).json(destination);
    } catch (error: any) {
        console.log("Error in updateDestination controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getDestinationsByState = async (req: Request, res: Response) => {
    try {
        const { state } = req.params;

        if (!state) {
            return res.status(400).json({ message: "State parameter is required" });
        }

        const destinations = await Destination.find({ state: { $regex: new RegExp(`^${state}$`, 'i') } });

        if (destinations.length === 0) {
            return res.status(404).json({ message: `No destinations found in ${state}` });
        }

        res.status(200).json(destinations);
    } catch (error: any) {
        console.error("Error fetching destinations by state:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

