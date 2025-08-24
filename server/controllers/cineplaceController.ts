import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
import Cineplace from "../models/Cineplace";

export const createCineplace = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      movie,
      images,
      state,
      bestTimeToVisit,
      travelTips,
      averageBudget,
      latitude,
      longitude,
    } = req.body;

    if (
      !name ||
      !description ||
      !movie ||
      !state ||
      !images ||
      !bestTimeToVisit ||
      !travelTips ||
      !averageBudget ||
      !latitude ||
      !longitude
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let uploadedImageUrls: string[] = [];

    if (images && Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        try {
          if (!img || typeof img !== "string") {
            continue;
          }

          const uploadRes = await cloudinary.uploader.upload(img, {
            folder: "cineplaces",
            resource_type: "auto",
          });
          uploadedImageUrls.push(uploadRes.secure_url);
        } catch (cloudinaryError: any) {
          console.log("Cloudinary upload error:", cloudinaryError.message);
        }
      }
    }

    const cineplace = await Cineplace.create({
      name,
      description,
      movie,
      images: uploadedImageUrls,
      state,
      bestTimeToVisit,
      travelTips,
      averageBudget,
      latitude,
      longitude,
    });

    res.status(201).json(cineplace);
  } catch (error: any) {
    console.log("Error in createCineplace controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllCineplace = async (req: Request, res: Response) => {
  try {
    const cineplaces = await Cineplace.find();
    res.status(200).json(cineplaces);
  } catch (error: any) {
    console.log("Error in getAllCineplace controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCineplaceById = async (req: Request, res: Response) => {
  try {
    const cineplace = await Cineplace.findById(req.params.id);
    if (!cineplace) {
      return res.status(404).json({ message: "Cineplace not found" });
    }
    res.status(200).json(cineplace);
  } catch (error: any) {
    console.log("Error in getCineplaceById controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateCineplace = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      movie,
      images,
      state,
      bestTimeToVisit,
      travelTips,
      averageBudget,
      latitude,
      longitude,
    } = req.body;

    let uploadedImageUrls: string[] = [];

    if (images && Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        try {
          if (!img || typeof img !== "string") continue;

          const uploadRes = await cloudinary.uploader.upload(img, {
            folder: "cineplaces",
            resource_type: "auto",
          });
          uploadedImageUrls.push(uploadRes.secure_url);
        } catch (cloudinaryError: any) {
          console.log("Cloudinary upload error:", cloudinaryError.message);
        }
      }
    }

    // Ensure latitude and longitude are numbers if sent as strings
    const updateData: any = {
      name,
      description,
      movie,
      state,
      bestTimeToVisit,
      travelTips,
      averageBudget,
      latitude: latitude !== undefined ? Number(latitude) : undefined,
      longitude: longitude !== undefined ? Number(longitude) : undefined,
    };

    // Remove undefined fields so they don't overwrite with undefined
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    if (uploadedImageUrls.length > 0) {
      updateData.images = uploadedImageUrls;
    }

    const cineplace = await Cineplace.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!cineplace) {
      return res.status(404).json({ message: "Cineplace not found" });
    }

    res.status(200).json(cineplace);
  } catch (error: any) {
    console.log("Error in updateCineplace controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteCineplace = async (req: Request, res: Response) => {
  try {
    const cineplace = await Cineplace.findById(req.params.id);

    if (!cineplace) {
      return res.status(404).json({ message: "Cineplace not found" });
    }

    if (cineplace.images && Array.isArray(cineplace.images)) {
      for (const imgUrl of cineplace.images) {
        const publicId = imgUrl.split("/").pop()?.split(".")[0];
        try {
          await cloudinary.uploader.destroy(`cineplaces/${publicId}`);
        } catch (error) {
          console.log(
            `Error deleting image ${publicId} from Cloudinary`,
            error
          );
        }
      }
    }

    await Cineplace.findByIdAndDelete(req.params.id);
    res.json({ message: "Cineplace deleted successfully" });
  } catch (error: any) {
    console.log("Error in deleteCineplace controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
