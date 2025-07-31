from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import shutil
import os
import tempfile
import logging
import traceback
from app.utils.gemini_processing import process_aadhaar_image
from app.utils.pan_processing import process_pan_image

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Aadhaar Card Processing API",
    description="An API to extract details from Aadhaar card images using Gemini AI.",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://127.0.0.1:3000",
    "https://sudarshan-ten.vercel.app",
    "https://*.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get("/")
def read_root():
    return {"message": "Sudarshan AI API", "status": "running"}

@app.get("/health")
def health_check():
    """Health check endpoint"""
    try:
        # Test Gemini availability
        import google.generativeai as genai
        
        # Test temp directory access
        temp_dir = tempfile.gettempdir()
        temp_test_file = os.path.join(temp_dir, "test_write_permissions.txt")
        
        try:
            with open(temp_test_file, "w") as f:
                f.write("test")
            os.remove(temp_test_file)
            temp_writable = True
        except Exception as e:
            temp_writable = False
            
        return {
            "status": "healthy",
            "processing_engine": "Google Gemini AI",
            "python_version": os.sys.version,
            "temp_directory": temp_dir,
            "temp_writable": temp_writable,
            "cors_origins": origins
        }
    except Exception as e:
        return {
            "status": "unhealthy", 
            "error": str(e),
            "temp_directory": tempfile.gettempdir()
        }

@app.post("/extract-details/")
async def extract_details(file: UploadFile = File(...)):
    """
    Endpoint to upload an Aadhaar card image and extract details using Gemini AI.
    """
    temp_file_path = None
    try:
        logger.info(f"Processing file: {file.filename}, content_type: {file.content_type}")
        
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Use system temp directory (always writable)
        temp_dir = tempfile.gettempdir()
        logger.info(f"Using temp directory: {temp_dir}")
        
        # Create unique filename to avoid conflicts
        import uuid
        unique_filename = f"aadhaar_{uuid.uuid4().hex}_{file.filename}"
        temp_file_path = os.path.join(temp_dir, unique_filename)
        
        # Save the uploaded file
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        logger.info(f"File saved to: {temp_file_path}")
        
        # Verify file exists and has content
        if not os.path.exists(temp_file_path):
            raise Exception("Failed to save uploaded file")
        
        file_size = os.path.getsize(temp_file_path)
        logger.info(f"File size: {file_size} bytes")
        
        if file_size == 0:
            raise Exception("Uploaded file is empty")

        # Process the image using Gemini AI
        logger.info("Starting Gemini AI image processing...")
        result = process_aadhaar_image(temp_file_path)
        logger.info(f"Processing completed successfully")

        # Return response with explicit CORS headers
        response = JSONResponse(content=result)
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        
        # Create error response with CORS headers
        error_response = JSONResponse(
            status_code=500,
            content={
                "error": str(e),
                "type": type(e).__name__,
                "detail": "Internal server error during image processing"
            }
        )
        error_response.headers["Access-Control-Allow-Origin"] = "*"
        return error_response
        
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
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Use system temp directory
        temp_dir = tempfile.gettempdir()
        
        # Create unique filename
        import uuid
        unique_filename = f"pan_{uuid.uuid4().hex}_{file.filename}"
        temp_file_path = os.path.join(temp_dir, unique_filename)
        
        # Save the uploaded file
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Process the PAN card image
        result = process_pan_image(temp_file_path)

        # Return response with explicit CORS headers
        response = JSONResponse(content=result)
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing PAN file: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        
        # Create error response with CORS headers
        error_response = JSONResponse(
            status_code=500,
            content={
                "error": str(e),
                "type": type(e).__name__,
                "detail": "Internal server error during PAN processing"
            }
        )
        error_response.headers["Access-Control-Allow-Origin"] = "*"
        return error_response
        
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as cleanup_error:
                logger.warning(f"Failed to cleanup temp file: {cleanup_error}")

@app.get("/test-cors")
def test_cors():
    """Test CORS endpoint"""
    return {
        "message": "CORS is working!",
        "timestamp": "2024-01-01T00:00:00Z",
        "allowed_origins": origins
    }

# Serverless handler
handler = Mangum(app)
