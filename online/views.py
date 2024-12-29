import json
from django.views.generic import View

from online.ranking_utils import get_ranking_data, get_user_ranking
from .models import User, MatchResult

from django.shortcuts import render
from django.http import JsonResponse
from online.utils import generate_token, validate_token, split_token

class IndexView(View):

    def __init__(self):
        self.context = {}

    def get(self, request, *args, **kwargs):
        return render(request, 'index.html', self.context)
    
class CreditView(View):

    def __init__(self):
        self.context = {}

    def get(self, request, *args, **kwargs):
        return render(request, 'credit.html', self.context)

class RankingView(View):
    def __init__(self):
        self.context = {}

    def get(self, request, *args, **kwargs):
        # Get the ranking data
        ranking_data = get_ranking_data()
        self.context['ranking'] = ranking_data
        return render(request, 'ranking.html', self.context)

        
class TokenView(View):

    def __init__(self):
        self.context = {}

    def get(self, request, *args, **kwargs):
        token = generate_token()
        user_id = split_token(token)[0]

        # Save the user_id to the database
        user = User(id=user_id)
        user.save()

        return JsonResponse({'token': token})
        
class VerifyTokenView(View):

    def __init__(self):
        self.context = {}

    def get(self, request, *args, **kwargs):
        token = request.GET.get('token')
        if validate_token(token):
            if User.objects.filter(id=split_token(token)[0]).exists():
                return JsonResponse({'valid': True})
            return JsonResponse({'valid': False, 'message': 'User not found'}, status=400)
        else:
            return JsonResponse({'valid': False, 'message': 'Invalid token'}, status=400)
            
class ScoreView(View):

    def __init__(self):
        self.context = {}

    def get(self, request, *args, **kwargs):
        token = request.GET.get('token')
        if validate_token(token):
            # Get the token Player's ranking data
            user_ranking = get_user_ranking(split_token(token)[0])
            return JsonResponse({'user_ranking': user_ranking})
        else:
            return JsonResponse({'error': 'invalid method'}, status=400)

    def post(self, request, *args, **kwargs):
        try:
            body = json.loads(request.body.decode('utf-8'))
            token = body.get('token', None)
            result = body.get('result', None)

            if not token or not result:
                return JsonResponse({'error': 'invalid body'}, status=400)
            
            if not validate_token(token):
                return JsonResponse({'error': 'invalid token'}, status=400)
            
            if result['winner'] not in [0, 1, 2]:
                return JsonResponse({'error': 'invalid result'}, status=400)

            if not result['datetime']:
                return JsonResponse({'error': 'invalid datetime'}, status=400)                
            # Save the result to the database
            user_id = split_token(token)[0]
            winner = result['winner']
            datetime = result['datetime']

            match_result = MatchResult.objects.create(
                user_id=User.objects.get(id=user_id),
                result=winner,
                played_at=datetime
            )
            match_result.save()

            return JsonResponse({'success': True})   
        except:
            return JsonResponse({'error': 'invalid method'}, status=400)
