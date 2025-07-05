import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { servicesAPI } from '../services/api';
import toast from 'react-hot-toast';

const EditService = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [benefits, setBenefits] = useState(['']);
  const [service, setService] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm();

  const watchedImage = watch('image');

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setFetchLoading(true);
      const response = await servicesAPI.getById(id);
      const serviceData = response.data;
      
      setService(serviceData);
      
      // Populate form with existing data
      reset({
        serviceName: serviceData.serviceName,
        description: serviceData.description,
        beneficiary: serviceData.beneficiary
      });
      
      setBenefits(serviceData.detailBenefits || ['']);
      setImagePreview(serviceData.image);
      
    } catch (error) {
      toast.error('Failed to fetch service details');
      console.error('Error fetching service:', error);
      navigate('/services');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addBenefit = () => {
    setBenefits([...benefits, '']);
  };

  const removeBenefit = (index) => {
    if (benefits.length > 1) {
      setBenefits(benefits.filter((_, i) => i !== index));
    }
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Filter out empty benefits
      const filteredBenefits = benefits.filter(benefit => benefit.trim() !== '');
      
      if (filteredBenefits.length === 0) {
        toast.error('Please add at least one benefit');
        return;
      }

      const formData = new FormData();
      formData.append('serviceName', data.serviceName);
      formData.append('description', data.description);
      formData.append('beneficiary', data.beneficiary);
      formData.append('detailBenefits', JSON.stringify(filteredBenefits));
      
      // Only append image if a new one was selected
      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      await servicesAPI.update(id, formData);
      toast.success('Service updated successfully');
      navigate('/services');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update service');
      console.error('Error updating service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Service not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/services')}
          className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
          <p className="text-gray-600 mt-1">Update service details</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Name *
            </label>
            <input
              type="text"
              {...register('serviceName', {
                required: 'Service name is required',
                maxLength: { value: 100, message: 'Service name cannot exceed 100 characters' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter service name"
            />
            {errors.serviceName && (
              <p className="text-red-500 text-sm mt-1">{errors.serviceName.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description', {
                required: 'Description is required',
                maxLength: { value: 5000, message: 'Description cannot exceed 500 characters' }
              })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter service description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Beneficiary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beneficiary *
            </label>
            <input
              type="text"
              {...register('beneficiary', {
                required: 'Beneficiary is required',
                maxLength: { value: 2000, message: 'Beneficiary cannot exceed 200 characters' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Who benefits from this service?"
            />
            {errors.beneficiary && (
              <p className="text-red-500 text-sm mt-1">{errors.beneficiary.message}</p>
            )}
          </div>

          {/* Detail Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detail Benefits *
            </label>
            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Benefit ${index + 1}`}
                  />
                  {benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addBenefit}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add another benefit
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => {
  setImagePreview(null); // Remove preview completely
  setValue('image', null); // Clear form value
}}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to keep current image
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {loading ? 'Updating...' : 'Update Service'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditService;