# import requests

# api_token = "IEawmzQ6xrOOvJpYlC75Ljqw93itaEAu0Gbp91ronlPfj7ZxO3JcEof3iGY3"

# url = "https://api.mobilesasa.com/v1/dlr"
# headers = {
#     "Authorization": f"Bearer {api_token}",
#     "Accept": "application/json",
#     "Content-Type": "application/json"
# }
# data = {
#     "messageId": "9f1775c6-5e38-4090-bb15-29c9d3aa9dcc"
# }

# response = requests.post(url, json=data, headers=headers)

# # Print the response
# print(response.status_code)
# print(response.json())


import requests

api_token = "IEawmzQ6xrOOvJpYlC75Ljqw93itaEAu0Gbp91ronlPfj7ZxO3JcEof3iGY3"
bulk_id = "9f178fb3-68d8-49b5-948e-a8c91e6cdce4"

url = f"https://api.mobilesasa.com/v1/send/bulk-personalized/{bulk_id}/"

headers = {
    "Authorization": f"Bearer {api_token}",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)

print("Status Code:", response.status_code)
try:
    print("Response JSON:", response.json())
except Exception:
    print("Response Text:", response.text)
