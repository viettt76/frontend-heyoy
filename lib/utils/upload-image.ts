import axios from 'axios';

export const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);

    const isImage = file.type.startsWith('image/');

    const uploadUrl = isImage
        ? `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/image/upload`
        : `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/raw/upload`;

    try {
        const res = await axios.post(uploadUrl, formData);
        return {
            fileUrl: res.data?.secure_url,
            fileName: res.data?.original_filename,
        };
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
    }
};
