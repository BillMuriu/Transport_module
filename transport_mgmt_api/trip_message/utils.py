import os
import requests
from datetime import datetime


def send_sms_via_gateway(phone, message):
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


def generate_trip_message_content(student_name, trip_action):
    current_time = datetime.now().strftime("%I:%M %p")  # Format current time (e.g., '07:30 AM')

    if trip_action == 'pickup':
        return f"{student_name}, boarded the school bus at {current_time}."
    elif trip_action == 'dropoff':
        return f"{student_name}, alighted from the school bus at {current_time}."
    else:
        return f"Message for {student_name} at {current_time}."
