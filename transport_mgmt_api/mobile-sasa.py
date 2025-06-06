import requests

api_token = "IEawmzQ6xrOOvJpYlC75Ljqw93itaEAu0Gbp91ronlPfj7ZxO3JcEof3iGY3"

url = "https://api.mobilesasa.com/v1/send/bulk-personalized"


# Headers
headers = {
    "Authorization": f"Bearer {api_token}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

# JSON body for personalized messages
payload = {
    "senderID": "MOBILESASA",
    "messageBody": [
        {
            "phone": "0742675176",
            "message": "Bill, this is message 1 for bulk personalized messages"
        },
        {
            "phone": "0742675176",
            "message": "Morio, this is message 2 for bulk personalized messages"
        }
    ]
}

# Send the POST request
response = requests.post(url, json=payload, headers=headers)

# Output the response
print("Status Code:", response.status_code)
try:
    print("Response Body:", response.json())
except Exception:
    print("Response Text:", response.text)
