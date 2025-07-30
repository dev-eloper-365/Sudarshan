from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import shutil
import os
import logging
import traceback
from app.utils.image_processing import process_aadhaar_image
from app.utils.pan_processing import process_pan_image

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Aadhaar Card Processing API",
    description="An API to extract details from Aadhaar card images.",
    version="1.0.0"
)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Sudarshan AI API", "status": "running"}

@app.get("/health")
def health_check():
    """Health check endpoint"""
    try:
        # Test Tesseract availability
        import pytesseract
        version = pytesseract.get_tesseract_version()
        return {
            "status": "healthy",
            "tesseract_version": str(version),
            "python_version": os.sys.version
        }
    except Exception as e:
        return {
            "status": "unhealthy", 
            "error": str(e)
        }

@app.post("/extract-details/")
async def extract_details(file: UploadFile = File(...)):
    """
    Endpoint to upload an Aadhaar card image and extract details.
    """
    temp_file_path = None
    try:
        logger.info(f"Processing file: {file.filename}, content_type: {file.content_type}")
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Create temp directory if it doesn't exist
        temp_dir = "/app/temp"
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save the uploaded file temporarily
        temp_file_path = os.path.join(temp_dir, f"temp_{file.filename}")
        
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"File saved to: {temp_file_path}")
        
        # Verify file exists and has content
        if not os.path.exists(temp_file_path):
            raise Exception("Failed to save uploaded file")
        
        file_size = os.path.getsize(temp_file_path)
        logger.info(f"File size: {file_size} bytes")
        
        if file_size == 0:
            raise Exception("Uploaded file is empty")

        # Process the image
        logger.info("Starting image processing...")
        result = process_aadhaar_image(temp_file_path)
        logger.info(f"Processing result: {result}")

        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail={
                "error": str(e),
                "type": type(e).__name__,
                "traceback": traceback.format_exc()
            }
        )
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
                logger.info(f"Cleaned up temp file: {temp_file_path}")
            except Exception as cleanup_error:
                logger.warning(f"Failed to cleanup temp file: {cleanup_error}")

@app.post("/extract-pan-details/")
async def extract_pan_details(file: UploadFile = File(...)):
    """
    Endpoint to upload a PAN card image and extract details.
    """
    temp_file_path = None
    try:
        logger.info(f"Processing PAN file: {file.filename}")
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Create temp directory if it doesn't exist
        temp_dir = "/app/temp"
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save the uploaded file temporarily
        temp_file_path = os.path.join(temp_dir, f"temp_{file.filename}")
        
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process the PAN card image
        result = process_pan_image(temp_file_path)

        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing PAN file: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail={
                "error": str(e),
                "type": type(e).__name__
            }
        )
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as cleanup_error:
                logger.warning(f"Failed to cleanup temp file: {cleanup_error}")

# Serverless handler
handler = Mangum(app)