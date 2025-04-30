import Product from '../models/productModel.js';
import cloudinary from '../config/cloudinary.js';

// Function to add a product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    // Debug: Log received body and files
    console.log('Received body:', req.body);
    console.log('Received files:', req.files);
    console.log('Raw req.files object:', JSON.stringify(req.files, null, 2));

    // Check if multer rejected files
    if (req.fileValidationError) {
      console.error('Multer validation error:', req.fileValidationError);
      return res.status(400).json({ success: false, message: `File validation error: ${req.fileValidationError.message}` });
    }

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    // Debug: Log filtered images and individual file fields
    console.log('Filtered images:', images);
    console.log('image1:', req.files?.image1);
    console.log('image2:', req.files?.image2);
    console.log('image3:', req.files?.image3);
    console.log('image4:', req.files?.image4);

    if (images.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image is required' });
    }

    let imagesUrl = await Promise.all(
      images.map(async (item, index) => {
        try {
          // Convert buffer to base64 for Cloudinary upload
          const base64Image = `data:${item.mimetype};base64,${item.buffer.toString('base64')}`;
          let result = await cloudinary.uploader.upload(base64Image, {
            resource_type: 'image',
            folder: 'products',
          });
          // Debug: Log Cloudinary result
          console.log(`Cloudinary upload result for image ${index + 1}:`, result);
          return result.secure_url;
        } catch (uploadError) {
          console.error(`Cloudinary upload error for image ${index + 1}:`, uploadError.message, uploadError.stack);
          throw new Error(`Failed to upload image ${index + 1}: ${uploadError.message}`);
        }
      })
    );

    // Debug: Log generated image URLs
    console.log('Image URLs:', imagesUrl);

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === 'true',
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    console.log('Adding product:', productData);

    const product = new Product(productData);
    await product.save();

    return res.json({ success: true, message: 'Product Added' });
  } catch (error) {
    console.error('Add product error:', error.message, error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Function to list all products
const listProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json({ success: true, products });
  } catch (error) {
    console.error('List products error:', error.message, error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Function to remove a product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid Product ID format' });
    }

    console.log('Attempting to remove product with ID:', id);
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    console.log('Product removed successfully:', product.name);
    return res.json({ success: true, message: 'Product Removed' });
  } catch (error) {
    console.error('Remove product error:', error.message, error.stack);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid Product ID' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Function to get single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, product });
  } catch (error) {
    console.error('Single product error:', error.message, error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };