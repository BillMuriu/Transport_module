# users/utils.py
from django.core.signing import TimestampSigner

signer = TimestampSigner()

def generate_invite_link(user_type, expiry_seconds=3600):
    value = signer.sign(user_type)
    return f"/users/invite/?token={value}"

##/users/invite/?token=TRIP_TEACHER:1uA4BW:aoJk5d8POz-34fqzl-ngh7EYIo4hRFhz8c6Hz3s2Wq4