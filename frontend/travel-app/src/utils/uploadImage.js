import axiosInstance from "./axiosInstance";

const uploadImage = async (image) => {
    try {
        const formData = new FormData();
        formData.append("image", image);

        const response = await axiosInstance.post("/api/travel-story/image-upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error uploading image", error);
        throw error;
    }
};

export default uploadImage;