import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = 'http://localhost:5000';

const StoreAdminAdd = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('Dog');
  const [subCategory, setSubCategory] = useState('Food');
  const [bestseller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const handleSizeToggle = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name || !description || !price || !image1 || !quantity) {
      toast.error('Please fill in all required fields and upload at least one image');
      return;
    }

    const formData = new FormData();
    if (image1) formData.append('image1', image1);
    if (image2) formData.append('image2', image2);
    if (image3) formData.append('image3', image3);
    if (image4) formData.append('image4', image4);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('bestseller', bestseller.toString());
    formData.append('sizes', JSON.stringify(sizes));

    try {
      console.log("Adding product with token:", token);
      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("Add product response:", response.data);
      if (response.data.success) {
        toast.success('Product added successfully!');
        // Reset form
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setName('');
        setDescription('');
        setPrice('');
        setQuantity('');
        setCategory('Dog');
        setSubCategory('Food');
        setBestSeller(false);
        setSizes([]);
      } else {
        toast.error(response.data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <form className="flex flex-col w-full items-start gap-3" onSubmit={handleSubmit}>
      <div>
        <p className="mb-2">Upload Image (First image is required)</p>
        <div className="flex gap-2">
          <label htmlFor="image1" className="cursor-pointer">
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {image1 ? (
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={URL.createObjectURL(image1)}
                  alt="Preview"
                />
              ) : (
                <span className="text-gray-500">+</span>
              )}
            </div>
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              accept="image/*"
              hidden
              required
            />
          </label>
          <label htmlFor="image2" className="cursor-pointer">
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {image2 ? (
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={URL.createObjectURL(image2)}
                  alt="Preview"
                />
              ) : (
                <span className="text-gray-500">+</span>
              )}
            </div>
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              accept="image/*"
              hidden
            />
          </label>
          <label htmlFor="image3" className="cursor-pointer">
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {image3 ? (
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={URL.createObjectURL(image3)}
                  alt="Preview"
                />
              ) : (
                <span className="text-gray-500">+</span>
              )}
            </div>
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              accept="image/*"
              hidden
            />
          </label>
          <label htmlFor="image4" className="cursor-pointer">
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {image4 ? (
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={URL.createObjectURL(image4)}
                  alt="Preview"
                />
              ) : (
                <span className="text-gray-500">+</span>
              )}
            </div>
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              accept="image/*"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md"
          type="text"
          placeholder="Type here"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Write Content Here"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="w-full max-w-[500px] flex flex-row gap-3">
        <div className="flex-1">
          <p className="mb-2">Category</p>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex-1">
          <p className="mb-2">Sub Category</p>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="Food">Food</option>
            <option value="Vitamin">Vitamin</option>
            <option value="Medicine">Medicine</option>
            <option value="Other">Other Accessories</option>
          </select>
        </div>

        <div className="flex-1">
          <p className="mb-2">Product Price</p>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            type="number"
            placeholder="25"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="flex-1">
          <p className="mb-2">Quantity</p>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            type="number"
            placeholder="0"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          <div>
            <p
              className={`bg-slate-200 px-3 py-1 cursor-pointer ${sizes.includes('S') ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => handleSizeToggle('S')}
            >
              S
            </p>
          </div>
          <div>
            <p
              className={`bg-slate-200 px-3 py-1 cursor-pointer ${sizes.includes('M') ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => handleSizeToggle('M')}
            >
              M
            </p>
          </div>
          <div>
            <p
              className={`bg-slate-200 px-3 py-1 cursor-pointer ${sizes.includes('L') ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => handleSizeToggle('L')}
            >
              L
            </p>
          </div>
          <div>
            <p
              className={`bg-slate-200 px-3 py-1 cursor-pointer ${sizes.includes('XL') ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => handleSizeToggle('XL')}
            >
              XL
            </p>
          </div>
          <div>
            <p
              className={`bg-slate-200 px-3 py-1 cursor-pointer ${sizes.includes('XXL') ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => handleSizeToggle('XXL')}
            >
              XXL
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={(e) => setBestSeller(e.target.checked)}
        />
        <label htmlFor="bestseller">Mark as Bestseller</label>
      </div>

      <button
        type="submit"
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Add Product
      </button>
    </form>
  );
};

export default StoreAdminAdd;