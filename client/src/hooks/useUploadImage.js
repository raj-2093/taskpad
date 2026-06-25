import { useApi } from "../context/ApiProvider";
import { API_PATHS } from "../utils/apiPaths";

export function useUploadImage() {
    const { api } = useApi();

    async function uploadImage(imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const response = await api.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data.data.imageUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    }

    return { uploadImage };
}