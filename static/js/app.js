let token = localStorage.getItem('token'); // global variable: for Unity, !IMPORTANT 

document.addEventListener('DOMContentLoaded', async () => {
  await initializeGame();
  await updatePlayerData();
});

async function initializeGame() {
  try {
    await validateOrRequestToken();
    setUserElement();
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

/**
 * Session token の有効性を検証
 * 無効な場合は新しい token をリクエスト
 */
async function validateOrRequestToken() {
  if (token) {
    try {
      const isValid = await verifyToken(token);
      if (!isValid) throw new Error('Invalid token');
    } catch (error) {
      console.warn('Token validation failed, requesting new token...', error);
      await requestNewToken();
      alertTokenExpired();
    }
  } else {
    console.warn('No token found, requesting new token...');
    alertFirstTimeUser();
    await requestNewToken();
  }
}

/**
 * Session token の有効性を検証
 * @param token 
 * @returns Boolean
 */
async function verifyToken(token) {
  const response = await fetch(`/verify_token/?token=${token}`);
  if (!response.ok){
    error = await response.json();
    console.error('Failed to verify token:', error.message);
    return false;
  };

  const data = await response.json();
  return true;
}

/**
 * 新しい token をリクエスト
 */
async function requestNewToken() {
  try {
    const response = await fetch('get_token/');
    if (!response.ok) throw new Error('Failed to get token');

    const data = await response.json();
    console.log('New token received:', data);
    token = data.token;
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Error requesting new token:', error);
  }
}

/**
 * ユーザー情報を表示
 */
function setUserElement() {
  const userTokenElm = document.getElementById('user-token-elm');

  if (token) {
    const idFirst4 = token.split('.')[0].slice(0, 4);
    userTokenElm.innerText = `${idFirst4}...`;
  }
}

function alertTokenExpired() {
  alert('セッションの有効期限が切れました。\nランキングはリセットされますが、引き続きゲームをお楽しみください！');
}
function alertFirstTimeUser() {
  alert(`
初めまして！
ゲームを始める前に、以下の注意事項をお読みください。
1. このゲームは、2人でプレイすることを前提としています。
2. ゲームをプレイされる場合、利用規約に同意された事とします。

以上の点をご理解の上、ゲームをお楽しみください！
  `);
}

function openGameFullscreen(iframeElm) {
  iframeElm.contentWindow.postMessage('openFullscreen', '*');
}

window.addEventListener('message', (event) => {
  if (event.data.type === 'game_result') {
    const { winner } = event.data.data;
    console.log('Game winner:', winner);
    submitGameResult({ winner, datetime: new Date().toISOString() });
  }
});

/**
 * ゲーム結果を送信
 * @param {*} result 
 */
async function submitGameResult(result) {
  const data = { token, result };

  try {
    const response = await fetch('score/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to submit game result: ${errorData.error}`);
    }

    const responseData = await response.json();
    await updatePlayerData();
    console.log('Game result submitted successfully:', responseData);
  } catch (error) {
    console.error('Error submitting game result:', error.message);
  }
}

async function updatePlayerData() {
  const playerData = await requestPlayerData(token);
  if (!playerData) {
    console.error('Failed to update player data');
    return;
  }
  console.log('Player data:', playerData);
  console.log('Player 1 wins:', playerData.wins1);
  console.log('Player 2 wins:', playerData.wins2);

  let wins1Elm = document.getElementById('player1-wins');
  let wins2Elm = document.getElementById('player2-wins');
  wins1Elm.innerHTML = playerData.wins1;
  wins2Elm.innerHTML = playerData.wins2;
}

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