import cloudinary
import cloudinary.uploader
from ..config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

def upload_media(file):
    try:
        upload_result = cloudinary.uploader.upload(file, folder="complain-nepal")
        return upload_result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary upload failed: {e}")
        return None
