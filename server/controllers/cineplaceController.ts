import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
import Cineplace from "../models/Cineplace";
import redis from "../lib/redis.js";

interface ICineplace {
  name: string;
  description: string;
  movie: string;
  images: string[];
  state: string;
  bestTimeToVisit: string[];
  travelTips: string[];
  averageBudget: number;
  latitude: number;
  longitude: number;
}

export const createCineplace = async (req: Request, res: Response) => {
  try {
    // CHANGED: Use the ICineplace interface to type req.body
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
    } = req.body as ICineplace;

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

    const uploadedImageUrls: string[] = [];

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
        } catch (cloudinaryError: unknown) {
          if (cloudinaryError instanceof Error) {
            console.log("Cloudinary upload error:", cloudinaryError.message);
          } else {
            console.log("An unknown Cloudinary upload error occurred");
          }
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
    // --- CACHE INVALIDATION ---
    console.log("Invalidating all_cineplaces cache after creation...");
    await redis.del("all_cineplaces");
    // --- END CACHE INVALIDATION ---
    res.status(201).json(cineplace);
  } catch (error: unknown) {
    // CHANGED: from 'any' to 'unknown'
    let errorMessage = "Server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log("Error in createCineplace controller", errorMessage);
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
};

export const getAllCineplace = async (req: Request, res: Response) => {
  const cacheKey = "all_cineplaces";

  try {
    const cachedCineplaces = await redis.get(cacheKey);

    if (cachedCineplaces) {
      console.log("Cache HIT for all_cineplaces!");
      const parsedCineplaces =
        typeof cachedCineplaces === "string"
          ? JSON.parse(cachedCineplaces)
          : cachedCineplaces;
      return res.status(200).json(parsedCineplaces);
    }

    console.log("Cache MISS for all_cineplaces. Fetching from DB.");
    const cineplaces = await Cineplace.find();

    await redis.set(cacheKey, JSON.stringify(cineplaces), { ex: 43200 });

    res.status(200).json(cineplaces);
  } catch (error: unknown) {
    let errorMessage = "Server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log("Error in getAllCineplace controller", errorMessage);
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
};

export const getCineplaceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cacheKey = `cineplace:${id}`;

  try {
    const cachedCineplace = await redis.get(cacheKey);

    if (cachedCineplace) {
      console.log(`Cache HIT for ${cacheKey}!`);
      const parsedCineplace =
        typeof cachedCineplace === "string"
          ? JSON.parse(cachedCineplace)
          : cachedCineplace;
      return res.status(200).json(parsedCineplace);
    }

    console.log(`Cache MISS for ${cacheKey}. Fetching from DB.`);
    const cineplace = await Cineplace.findById(id);

    if (!cineplace) {
      return res.status(404).json({ message: "Cineplace not found" });
    }

    await redis.set(cacheKey, JSON.stringify(cineplace), { ex: 3600 });

    res.status(200).json(cineplace);
  } catch (error: unknown) {
    let errorMessage = "Server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log("Error in getCineplaceById controller", errorMessage);
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
};

export const updateCineplace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    } = req.body as Partial<ICineplace>;

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
        } catch (cloudinaryError: unknown) {
          if (cloudinaryError instanceof Error) {
            console.log("Cloudinary upload error:", cloudinaryError.message);
          }
        }
      }
    }

    const updateData: Partial<ICineplace> = {
      name,
      description,
      movie,
      state,
      bestTimeToVisit,
      travelTips,
      averageBudget,
    };

    // Handle numeric fields carefully
    if (latitude !== undefined) updateData.latitude = Number(latitude);
    if (longitude !== undefined) updateData.longitude = Number(longitude);

    // Only update images if new ones were uploaded
    if (uploadedImageUrls.length > 0) {
      updateData.images = uploadedImageUrls;
    }

    // Remove undefined fields so they don't overwrite with undefined
    Object.keys(updateData).forEach(
      (key) =>
        (updateData as any)[key] === undefined &&
        delete (updateData as any)[key]
    );

    const cineplace = await Cineplace.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!cineplace) {
      return res.status(404).json({ message: "Cineplace not found" });
    }

    // --- CACHE INVALIDATION ---
    // After successfully updating the DB, delete the old cache entries.
    console.log(`Invalidating cache for cineplace:${id} and all_cineplaces`);
    await redis.del(`cineplace:${id}`);
    await redis.del("all_cineplaces");
    // --- END CACHE INVALIDATION ---

    res.status(200).json(cineplace);
  } catch (error: unknown) {
    let errorMessage = "Server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log("Error in updateCineplace controller", errorMessage);
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
};

export const deleteCineplace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    // --- CACHE INVALIDATION ---
    // After successfully deleting from the DB, delete the cache entries.
    console.log(`Invalidating cache for cineplace:${id} and all_cineplaces`);
    await redis.del(`cineplace:${id}`);
    await redis.del("all_cineplaces");
    // --- END CACHE INVALIDATION ---
    res.json({ message: "Cineplace deleted successfully" });
  } catch (error: unknown) {
    let errorMessage = "Server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log("Error in deleteCineplace controller", errorMessage);
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
};
