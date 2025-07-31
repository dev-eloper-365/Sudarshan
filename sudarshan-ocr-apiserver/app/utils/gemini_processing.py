import google.generativeai as genai
import re
from PIL import Image
import os
import logging
from typing import Dict, Optional

# Configure logging
logger = logging.getLogger(__name__)

class AadhaarExtractor:
    def __init__(self, api_key: str):
        """
        Initialize the Aadhaar extractor with Gemini API key
        
        Args:
            api_key (str): Your Google Gemini API key
        """
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    def extract_aadhaar_details(self, image_path: str) -> Dict[str, str]:
        """
        Extract Aadhaar card details from an image
        
        Args:
            image_path (str): Path to the Aadhaar card image
            
        Returns:
            Dict[str, str]: Extracted details in specified format
        """
        try:
            # Load and process the image
            image = Image.open(image_path)
            
            # Create prompt for Gemini
            prompt = """
            Analyze this Aadhaar card image and extract the following information:
            1. Name (full name of the person)
            2. Aadhaar Number (12-digit number, usually in XXXX XXXX XXXX format)
            3. Date of Birth (in DD/MM/YYYY format)
            4. Gender (MALE/FEMALE)
            
            Please provide the information in this exact format:
            Name: [extracted name]
            Aadhaar Number: [extracted number or "Aadhaar Number not found"]
            Date of Birth: [extracted DOB in DD/MM/YYYY format]
            Gender: [MALE/FEMALE]
            
            If any information is not clearly visible or cannot be extracted, use appropriate "not found" messages.
            """
            
            # Generate response using Gemini
            response = self.model.generate_content([prompt, image])
            
            # Parse the response
            return self._parse_response(response.text)
            
        except Exception as e:
            logger.error(f"Error in extract_aadhaar_details: {str(e)}")
            return {
                "error": f"Error processing image: {str(e)}",
                "Name": "Name not found",
                "Aadhaar Number": "Aadhaar Number not found",
                "Date of Birth": "Date of Birth not found",
                "Gender": "Gender not found"
            }
    
    def _parse_response(self, response_text: str) -> Dict[str, str]:
        """
        Parse Gemini API response and extract structured data
        
        Args:
            response_text (str): Raw response from Gemini API
            
        Returns:
            Dict[str, str]: Parsed details
        """
        details = {
            "Name": "Name not found",
            "Aadhaar Number": "Aadhaar Number not found", 
            "Date of Birth": "Date of Birth not found",
            "Gender": "Gender not found"
        }
        
        try:
            # Extract name
            name_match = re.search(r'Name:\s*(.+)', response_text, re.IGNORECASE)
            if name_match:
                details["Name"] = name_match.group(1).strip()
            
            # Extract Aadhaar number
            aadhaar_match = re.search(r'Aadhaar Number:\s*(.+)', response_text, re.IGNORECASE)
            if aadhaar_match:
                aadhaar_text = aadhaar_match.group(1).strip()
                # Validate Aadhaar number format (12 digits)
                aadhaar_digits = re.findall(r'\d', aadhaar_text)
                if len(aadhaar_digits) == 12:
                    details["Aadhaar Number"] = aadhaar_text
            
            # Extract date of birth
            dob_match = re.search(r'Date of Birth:\s*(.+)', response_text, re.IGNORECASE)
            if dob_match:
                dob_text = dob_match.group(1).strip()
                # Validate DOB format (DD/MM/YYYY)
                if re.match(r'\d{2}/\d{2}/\d{4}', dob_text):
                    details["Date of Birth"] = dob_text
            
            # Extract gender
            gender_match = re.search(r'Gender:\s*(.+)', response_text, re.IGNORECASE)
            if gender_match:
                gender_text = gender_match.group(1).strip().upper()
                if gender_text in ['MALE', 'FEMALE']:
                    details["Gender"] = gender_text
        
        except Exception as e:
            logger.error(f"Error parsing response: {str(e)}")
        
        return details

def process_aadhaar_image(image_path: str) -> Dict[str, str]:
    """
    Main function to process Aadhaar image using Gemini AI
    
    Args:
        image_path (str): Path to the Aadhaar card image
        
    Returns:
        Dict[str, str]: Extracted details
    """
    try:
        # Get API key from environment variable
        api_key = os.getenv('GEMINI_API_KEY')
        
        if not api_key:
            logger.error("GEMINI_API_KEY environment variable not set")
            return {
                "error": "Gemini API key not configured",
                "Name": "Name not found",
                "Aadhaar Number": "Aadhaar Number not found",
                "Date of Birth": "Date of Birth not found",
                "Gender": "Gender not found"
            }
        
        # Initialize extractor
        extractor = AadhaarExtractor(api_key)
        
        # Extract details
        logger.info(f"Processing Aadhaar image: {image_path}")
        details = extractor.extract_aadhaar_details(image_path)
        
        # Log successful extraction
        if "error" not in details:
            logger.info("Aadhaar details extracted successfully")
        else:
            logger.warning(f"Error in extraction: {details.get('error', 'Unknown error')}")
        
        return details
        
    except Exception as e:
        logger.error(f"Error in process_aadhaar_image: {str(e)}")
        return {
            "error": f"Processing failed: {str(e)}",
            "Name": "Name not found",
            "Aadhaar Number": "Aadhaar Number not found",
            "Date of Birth": "Date of Birth not found",
            "Gender": "Gender not found"
        }
