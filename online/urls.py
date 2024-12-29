from django.urls import path
from . import views

app_name = 'online'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('credit/', views.CreditView.as_view(), name='credit'),
    path('ranking/', views.RankingView.as_view(), name='ranking'),
    path('get_token/', views.TokenView.as_view(), name='get_token'),
    path('verify_token/', views.VerifyTokenView.as_view(), name='verify_token'),
    path('score/', views.ScoreView.as_view(), name='score'),
]