from django.db.models import Count, Sum, Case, When, IntegerField
from .models import MatchResult
from uuid import UUID

# 全ユーザーの統計を集計
# 総試合数、勝利数(p1, p2)、引き分け数を集計
# 集計結果を総試合数順に並べ替えて返す
# 1位から10位まで、20位、30位のデータを取得
def get_ranking_data():
	users_data = (
		MatchResult.objects
		.values('user_id')
		.annotate(
			total_matches=Count('id'),
			wins1=Sum(Case(When(result=1, then=1), default=0, output_field=IntegerField())),
            draws=Sum(Case(When(result=0, then=1), default=0, output_field=IntegerField())),
            wins2=Sum(Case(When(result=2, then=1), default=0, output_field=IntegerField())),
		)
		.order_by('-total_matches')  # 総試合数で降順に並べ替え
    )
	# ランキングを計算
	for i, user in enumerate(users_data):
		user['rank'] = i + 1
		user['user_id_first4'] = str(user['user_id'])[:4]
	# ランキングデータを返す
	return users_data

# プレイヤーのランキングデータを取得
def get_user_ranking(user_id):
    ranking_data = get_ranking_data()
    for user in ranking_data:
        user_id_str = str(user['user_id'])
        if user_id_str == user_id:
            return user
    return None