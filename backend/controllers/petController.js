import Pet from '../models/Pet.js';

export const registerPet = async (req, res) => {
  try {
    const { name, gender, breed, petBYear, vaccinations, specialNotes, petimage } = req.body;
    const userId = req.user.userId; // Extracted from JWT token in middleware

    const pet = new Pet({
      userId,
      name,
      gender,
      breed,
      petBYear,
      vaccinations,
      specialNotes,
      petimage
    });

    await pet.save();
    res.status(201).json({ message: 'Pet registered successfully', pet });
  } catch (error) {
    res.status(500).json({ message: 'Error registering pet', error: error.message });
  }
};

export const getUserPets = async (req, res) => {
  try {
    const userId = req.user.userId;
    const pets = await Pet.find({ userId });
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pets', error: error.message });
  }
};