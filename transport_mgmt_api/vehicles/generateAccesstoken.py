import requests
from django.http import JsonResponse

def get_access_token(request):
    consumer_key = "YABkOtfjsA8om8ScU71tIwJGRinAfRXjYD97fpXqkzZGVRlM"  
    consumer_secret = "N1KvniaWsuiy1qFh7yIL0ndNAIPBxb26qbkJrV29PNCN7irFumGZBBE0JiBRjvFf"  
    access_token_url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    headers = {'Content-Type': 'application/json'}
    auth = (consumer_key, consumer_secret)
    try:
        response = requests.get(access_token_url, headers=headers, auth=auth)
        response.raise_for_status() 
        result = response.json()
        access_token = result['access_token']
        return JsonResponse({'access_token': access_token})
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': str(e)})
    