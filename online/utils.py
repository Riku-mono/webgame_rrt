import uuid
import hmac

from django.conf import settings

SECRET_KEY = settings.SECRET_KEY

def generate_token():
    # UUID と 署名付きのトークンを生成
    session_id = str(uuid.uuid4())
    signature = create_signature(session_id)
    return f'{session_id}.{signature}'

def create_signature(session_id):
    # HMAC で session_id に署名を付与
    return hmac.new(
        SECRET_KEY.encode('utf-8'),
        session_id.encode('utf-8'),
        'sha256',
    ).hexdigest()

def split_token(token):
    # トークンを session_id と signature に分割
    if '.' not in token:
        raise ValueError("Invalid token format: missing '.' separator")
    return token.rsplit('.', 1)

def validate_token(token):
    # トークンを検証
    try:
        session_id, signature = split_token(token)
        expected_signature = create_signature(session_id)
        return hmac.compare_digest(signature, expected_signature)
    except Exception:
        return False