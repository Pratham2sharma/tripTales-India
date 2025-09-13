import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary.js";
import Destination from "../models/Destination.js";
import redis from "../lib/redis.js";

export const createDestination = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      images,
      state,
      bestTimeToVisit,
      travelTips,
      averageBudget,
      latitude,
      longitude,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !description ||
      !state ||
      !images ||
      !bestTimeToVisit ||
      !travelTips ||
      !averageBudget ||
      !latitude ||
      !longitude
    ) {
      return res.status(400).json({
        message:
          "Name, description, state , images, bestTimeToVisit, travelTips, averageBudget are required",
      });
    }

    let uploadedImageUrls: string[] = [];

    if (images && Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        try {
          // Ensure image is base64 format
          if (!img || typeof img !== "string") {
            console.log("Invalid image format:", typeof img);
            continue;
          }

          const uploadRes = await cloudinary.uploader.upload(img, {
            folder: "destinations",
            resource_type: "auto",
          });
          uploadedImageUrls.push(uploadRes.secure_url);
        } catch (cloudinaryError: any) {
          console.log("Cloudinary upload error:", cloudinaryError.message);
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
      latitude,
      longitude,
    });

    res.status(201).json(destination);
  } catch (error: any) {
    console.log("Error in createDestination controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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
          console.log(
            `Error deleting image ${publicId} from Cloudinary`,
            error
          );
        }
      }
    }

    await Destination.findByIdAndDelete(req.params.id);
    res.json({ message: "Destination Deleted Successfully" });
  } catch (error: any) {
    console.log("Error in deleteDestination controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllDestinations = async (req: Request, res: Response) => {
  const cacheKey = "all_destinations";

  try {
    // Try to get the data from the Redis cache first
    const cachedDestinations = await redis.get(cacheKey);

    // If data is found in cache (cache hit), send it back immediately
    if (cachedDestinations) {
      console.log("Cache HIT for all_destinations!");
      // Handle both string and object responses from Redis
      const parsedDestinations =
        typeof cachedDestinations === "string"
          ? JSON.parse(cachedDestinations)
          : cachedDestinations;
      return res.status(200).json(parsedDestinations);
    }

    // If not in cache (cache miss), fetch from the database
    console.log("Cache MISS for all_destinations. Fetching from DB.");
    const destinations = await Destination.find();

    // Store in cache for next time
    await redis.set(cacheKey, JSON.stringify(destinations), { ex: 43200 });

    // Send the fresh data
    res.status(200).json(destinations);
  } catch (error: any) {
    console.log("Error in getAllDestinations controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBasicDestinations = async (req: Request, res: Response) => {
  const cacheKey = "basic_destinations"; // A unique key for this specific list

  try {
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log(`Cache HIT for ${cacheKey}!`);
      const parsedData =
        typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;
      return res.status(200).json(parsedData);
    }

    console.log(`Cache MISS for ${cacheKey}. Fetching from DB.`);
    const destinations = await Destination.find().select("name description");

    // Cache the result for 12 hours
    await redis.set(cacheKey, JSON.stringify(destinations), { ex: 43200 });

    res.status(200).json(destinations);
  } catch (error: any) {
    console.log("Error in getBasicDestinations controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDestinationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cacheKey = `destination:${id}`;

  try {
    const cachedDestination = await redis.get(cacheKey);

    if (cachedDestination) {
      console.log(`Cache HIT for ${cacheKey}!`);
      const parsedDestination =
        typeof cachedDestination === "string"
          ? JSON.parse(cachedDestination)
          : cachedDestination;
      return res.status(200).json(parsedDestination);
    }

    console.log(`Cache MISS for ${cacheKey}. Fetching from DB.`);
    const destination = await Destination.findById(id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    // Cache this specific destination for 1 hour (3600 seconds)
    // A shorter cache time is often better for individual items that might be updated
    await redis.set(cacheKey, JSON.stringify(destination), { ex: 3600 });

    res.status(200).json(destination);
  } catch (error: any) {
    console.log("Error in getDestinationById controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateDestination = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
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
            folder: "destinations",
            resource_type: "auto",
          });
          uploadedImageUrls.push(uploadRes.secure_url);
        } catch (cloudinaryError: any) {
          console.log("Cloudinary upload error:", cloudinaryError.message);
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
      latitude,
      longitude,
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

    // Normalize the state name for a consistent cache key (e.g., "Gujarat" and "gujarat" use the same key)
    const normalizedState = state.toLowerCase().trim();
    const cacheKey = `destinations_by_state:${normalizedState}`;

    // 1. Check the cache first
    const cachedDestinations = await redis.get(cacheKey);
    if (cachedDestinations) {
      console.log(`Cache HIT for ${cacheKey}!`);
      const parsedDestinations =
        typeof cachedDestinations === "string"
          ? JSON.parse(cachedDestinations)
          : cachedDestinations;
      return res.status(200).json(parsedDestinations);
    }

    // 2. If not in cache, query the database
    console.log(`Cache MISS for ${cacheKey}. Fetching from DB.`);
    const destinations = await Destination.find({
      state: { $regex: new RegExp(`^${state}$`, "i") },
    });

    if (destinations.length === 0) {
      return res
        .status(404)
        .json({ message: `No destinations found in ${state}` });
    }

    // 3. Store the result in the cache for 12 hours
    await redis.set(cacheKey, JSON.stringify(destinations), { ex: 43200 });

    res.status(200).json(destinations);
  } catch (error: any) {
    console.error("Error fetching destinations by state:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
