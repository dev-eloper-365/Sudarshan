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

# CORS configuration - be specific about allowed origins
origins = [
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://127.0.0.1:3000",
    "https://sudarshan-ten.vercel.app",
    "https://*.vercel.app",  # Allow all Vercel apps
    "*"  # Fallback for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Add explicit OPTIONS handler for preflight requests
@app.options("/{path:path}")
async def options_handler(path: str):
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
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
            "python_version": os.sys.version,
            "cors_origins": origins
        }
    except Exception as e:
        return {
            "status": "unhealthy", 
            "error": str(e),
            "cors_origins": origins
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
        if not file.content_type or not file.content_type.startswith('image/'):
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
        
        # Create temp directory if it doesn't exist
        temp_dir = "/app/temp"
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save the uploaded file temporarily
        temp_file_path = os.path.join(temp_dir, f"temp_{file.filename}")
        
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

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

# Add a test CORS endpoint
@app.get("/test-cors")
def test_cors():
    """Test endpoint to verify CORS is working"""
    response = JSONResponse(content={"message": "CORS is working!", "timestamp": str(os.times())})
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

# Serverless handler
handler = Mangum(app)