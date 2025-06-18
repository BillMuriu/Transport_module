import os
import requests

def send_bulk_sms_via_mobile_sasa(message_list):
    """
    Send bulk (non-personalized) SMS using Mobile Sasa API.

    Args:
        message_list: List of dicts with 'phone' and 'message' keys.
                      All messages are assumed to have the same content.

    Returns:
        tuple: (success: bool, result: dict/str)
    """
    url = "https://api.mobilesasa.com/v1/send/bulk"

    headers = {
        "Authorization": f"Bearer {os.getenv('MOBILE_SASA_API_TOKEN')}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    payload = {
        "senderID": "MOBILESASA",
        "messageBody": message_list
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return True, response.json()
    except requests.RequestException as e:
        return False, str(e)
