document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const yourElm = document.getElementById('your-score');
  const yourRankingData = await requestPlayerData(token);
  if (!token) {
    yourElm.innerHTML = await createNoPlayingElement();
    return;
  }
  if (!yourRankingData) {
    yourElm.innerHTML = 'データの取得に失敗しました';
    return;
  }

  const yourRankingElement = await createYourRankingElement(yourRankingData);
  yourElm.innerHTML = yourRankingElement;
});

/**
 * session token の player data を取得
 * @param {*} token 
 * @returns 
 */
async function requestPlayerData(token) {
  const response = await fetch(`/score/?token=${token}`);
  if (!response.ok) return null;

  const data = await response.json();
  return data.user_ranking;
}

// テンプレートリテラルで要素を作成
async function createYourRankingElement(data) {
  const template = `
  <li class="game-card">
    <div class="game-user">
      <div class="game-user-ranking">${data.rank}</div>
      <div class="game-user-id">
        ユーザー<span id="user-token-elm">${data.user_id_first4}...</span>
      </div>
    </div>
    <div class="game-play">
      <div class="game-play-count">${data.total_matches}</div>
      <div class="game-play-label">/</div>
      <div class="game-play-detail">
        <span>(</span>
        <span class="game-wins player1">${data.wins1}</span>
        <span class="game-vs">:</span>
        <span class="game-vs">${data.draws}</span>
        <span class="game-vs">:</span>
        <span class="game-wins player2">${data.wins2}</span>
        <span>)</span>
      </div>
    </div>
  </li>
  `;
  return template;
}

// プレイヤーがゲームをプレイしていない場合の要素
async function createNoPlayingElement() {
  const template = `
  <li class="game-card">
    <div class="game-user">
      <div class="game-user-id">
        Not Found
      </div>
    </div>
    <div>
      ゲームをプレイしてランキングに参加しましょう
    </div>
    <div class="game-play">
      <div class="game-play-count">-</div>
      <div class="game-play-label">/</div>
      <div class="game-play-detail">
        <span>(-</span>
        <span class="game-vs">:</span>
        <span class="game-vs">-</span>
        <span class="game-vs">:</span>
        <span class="game-vs">-</span>
        <span>)</span>
      </div>
  </li>
  `;
  return template;
}