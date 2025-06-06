import os
import requests
from datetime import datetime


def send_sms_via_ums(phone, message):
    url = "https://comms.umeskiasoftwares.com/api/v1/sms/send"
    payload = {
        "api_key": os.getenv("API_KEY"),
        "app_id": os.getenv("APP_ID"),
        "sender_id": "UMS_SMS",
        "message": message,
        "phone": phone,
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return True, response.json()
    except requests.RequestException as e:
        return False, str(e)


def send_sms_via_mobile_sasa(phone, message):
    url = "https://api.mobilesasa.com/v1/send/message"

    headers = {
        "Authorization": f"Bearer {os.getenv('MOBILE_SASA_API_TOKEN')}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    payload = {
        "senderID": "MOBILESASA",
        "message": message,
        "phone": phone
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return True, response.json()
    except requests.RequestException as e:
        return False, str(e)
    
def send_bulk_personalized_sms_via_mobile_sasa(message_body_list):
    """
    Send bulk personalized SMS using Mobile Sasa API
    
    Args:
        message_body_list: List of dicts with 'phone' and 'message' keys
        
    Returns:
        tuple: (success: bool, result: dict/str)
    """
    url = "https://api.mobilesasa.com/v1/send/bulk-personalized"
    
    headers = {
        "Authorization": f"Bearer {os.getenv('MOBILE_SASA_API_TOKEN')}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    
    payload = {
        "senderID": "MOBILESASA",
        "messageBody": message_body_list
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return True, response.json()
    except requests.RequestException as e:
        return False, str(e)



def generate_trip_message_content(student_name, trip_action):
    current_time = datetime.now().strftime("%I:%M %p")  # Format current time (e.g., '07:30 AM')

    if trip_action == 'pickup':
        return f"{student_name}, boarded the school bus at {current_time}."
    elif trip_action == 'dropoff':
        return f"{student_name}, alighted from the school bus at {current_time}."
    else:
        return f"Message for {student_name} at {current_time}."


def generate_arrive_start_message_content(student_name, trip_action):
    """
    Generate personalized arrive/start message content with opposite logic
    - Pickup trip -> Student has arrived to school
    - Dropoff trip -> Student has started journey (boarded bus)
    """
    current_time = datetime.now().strftime("%I:%M %p")
    
    if trip_action == 'pickup':
        return f"{student_name} has arrived safely to school at {current_time}."
    elif trip_action == 'dropoff':
        return f"{student_name} has boarded the bus at {current_time}."
    else:
        return f"Trip update for {student_name} at {current_time}."
