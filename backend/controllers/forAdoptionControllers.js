import ForAdoption from "../models/ForAdoption.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
export const upload = multer({ storage }); // Export the upload instance

// Add a pet for adoption (with image)
export const addPet = async (req, res) => {
    try {
        const {
            ownerFirstName,
            ownerLastName,
            email,
            phone,
            petName,
            petAge,
            petGender,
            petBreed,
            petSpecies,
            petDescription,
            reason,
            specialNeeds,
            vaccinated,
            neutered
        } = req.body;

        const newPet = new ForAdoption({
            ownerFirstName,
            ownerLastName,
            email,
            phone,
            petName,
            petAge,
            petGender,
            petBreed,
            petSpecies,
            petDescription,
            reason,
            specialNeeds,
            vaccinated,
            neutered,
            petImage: req.file ? `/uploads/${req.file.filename}` : null,
        });

        await newPet.save();
        res.status(201).json({ message: "Pet added for adoption successfully", newPet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all adoption listings
export const getAllAdoptionListings = async (req, res) => {
    try {
        const listings = await ForAdoption.find();
        res.status(200).json(listings);
    } catch (error) {
        console.error('Error fetching adoption listings:', error);
        res.status(500).json({ message: 'Failed to fetch adoption listings', error: error.message });
    }
};

// Get a single adoption listing by ID
export const getAdoptionListingById = async (req, res) => {
    try {
        const listing = await ForAdoption.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: 'Adoption listing not found' });
        }
        res.status(200).json(listing);
    } catch (error) {
        console.error('Error fetching adoption listing:', error);
        res.status(500).json({ message: 'Failed to fetch adoption listing', error: error.message });
    }
};

// Get adoption listings by owner
export const getAdoptionListingsByOwner = async (req, res) => {
    try {
        const listings = await ForAdoption.find({ ownerId: req.params.ownerId });
        res.status(200).json(listings);
    } catch (error) {
        console.error('Error fetching owner adoption listings:', error);
        res.status(500).json({ message: 'Failed to fetch owner adoption listings', error: error.message });
    }
};

// Update adoption listing
export const updateAdoptionListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await ForAdoption.findById(listingId);
        
        if (!listing) {
            return res.status(404).json({ message: 'Adoption listing not found' });
        }
        
        // Convert string boolean values to actual booleans
        const updatedData = { ...req.body };
        ['specialNeeds', 'vaccinated', 'neutered'].forEach(field => {
            if (field in updatedData) {
                updatedData[field] = updatedData[field] === 'true';
            }
        });
        
        // Handle image upload if a new image is provided
        if (req.file) {
            // Delete old image if it exists
            if (listing.petImage) {
                const oldImagePath = path.join(__dirname, '..', listing.petImage);
                try {
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            // Update with new image path
            updatedData.petImage = `/uploads/${req.file.filename}`;
        }
        
        const updatedListing = await ForAdoption.findByIdAndUpdate(
            listingId,
            { $set: updatedData },
            { new: true }
        );
        
        res.status(200).json(updatedListing);
    } catch (error) {
        console.error('Error updating adoption listing:', error);
        res.status(500).json({ message: 'Failed to update adoption listing', error: error.message });
    }
};

// Delete adoption listing
export const deleteAdoptionListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await ForAdoption.findById(listingId);
        
        if (!listing) {
            return res.status(404).json({ message: 'Adoption listing not found' });
        }
        
        // Delete associated image if it exists
        if (listing.petImage) {
            const imagePath = path.join(__dirname, '..', listing.petImage);
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (err) {
                console.error('Error deleting image file:', err);
                // Continue with deletion even if image deletion fails
            }
        }
        
        await ForAdoption.findByIdAndDelete(listingId);
        res.status(200).json({ message: 'Adoption listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting adoption listing:', error);
        res.status(500).json({ message: 'Failed to delete adoption listing', error: error.message });
    }
};