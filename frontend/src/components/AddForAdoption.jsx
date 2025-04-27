const validateForm = () => {
    const errors = {};
    
    if (!formData.ownerFirstName.trim()) {
        errors.ownerFirstName = "First name is required";
    }
    
    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
        errors.phone = "Phone number is required";
    }
    
    if (!formData.petName.trim()) {
        errors.petName = "Pet name is required";
    }
    
    if (!formData.petAge.trim()) {
        errors.petAge = "Pet age is required";
    }
    
    if (!formData.petGender) {
        errors.petGender = "Pet gender is required";
    }
    
    if (!formData.petBreed.trim()) {
        errors.petBreed = "Pet breed is required";
    }
    
    if (!formData.petSpecies) {
        errors.petSpecies = "Pet species is required";
    }
    
    if (!formData.petDescription.trim()) {
        errors.petDescription = "Pet description is required";
    }
    
    if (!formData.reason.trim()) {
        errors.reason = "Reason for adoption is required";
    }
    
    if (!formData.petImage) {
        errors.petImage = "Pet image is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
}; 