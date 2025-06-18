import os
import requests

def send_bulk_sms_via_mobile_sasa(phone_list, message):
    """
    Send non-personalized bulk SMS using Mobile Sasa API.

    Args:
        phone_list: List of phone numbers as strings (e.g., ["254712345678", ...])
        message: The SMS text to send to all numbers.

    Returns:
        (success: bool, result: dict or error string)
    """
    url = "https://api.mobilesasa.com/v1/send/bulk"

    headers = {
        "Authorization": f"Bearer {os.getenv('MOBILE_SASA_API_TOKEN')}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    payload = {
        "senderID": "MOBILESASA",
        "message": message,
        "phones": ",".join(phone_list)
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return True, response.json()
    except requests.RequestException as e:
        return False, str(e)
