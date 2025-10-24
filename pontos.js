// ==================== Estado Global ====================
let userData = {
  points: 156,
  mealsSaved: 12,
  co2Avoided: 3.2,
  streak: 0,
  lastCheckin: null,
  lastBonus: null,
  history: [
    {
      type: 'eco',
      title: 'Produto Salvo',
      desc: 'Queijo próximo do vencimento',
      points: 15,
      time: '2 horas atrás'
    },
    {
      type: 'rec',
      title: 'Bônus de Recorrência',
      desc: '3 dias seguidos salvando alimentos',
      points: 25,
      time: '1 dia atrás'
    },
    {
      type: 'redeem',
      title: 'Resgate de Recompensa',
      desc: 'Cupom R$ 5 OFF',
      points: -50,
      time: '2 dias atrás'
    }
  ],
  checkins: []
};

const rewards = [
  { emoji: '🎫', name: 'R$ 5 OFF', cost: 50, desc: 'Desconto em qualquer compra' },
  { emoji: '🍕', name: 'R$ 10 OFF', cost: 100, desc: 'Desconto em alimentos' },
  { emoji: '🎁', name: 'R$ 20 OFF', cost: 200, desc: 'Desconto especial' },
  { emoji: '🌟', name: 'Frete Grátis', cost: 75, desc: 'Em compras acima de R$ 30' },
  { emoji: '💚', name: 'Kit Eco', cost: 150, desc: 'Produtos sustentáveis' },
  { emoji: '🏆', name: 'VIP 1 Mês', cost: 300, desc: 'Acesso premium' }
];

// ==================== Inicialização ====================
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderAll();
  setupEventListeners();
});

// ==================== Carregar Dados ====================
function loadData() {
  const saved = localStorage.getItem('ecopontosData');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      userData = { ...userData, ...parsed };
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    }
  }
}

function saveData() {
  try {
    localStorage.setItem('ecopontosData', JSON.stringify(userData));
  } catch (e) {
    console.error('Erro ao salvar dados:', e);
  }
}

// ==================== Renderização ====================
function renderAll() {
  renderPoints();
  renderCheckinGrid();
  renderRewards();
  renderHistory();
  updateStreak();
}

function renderPoints() {
  const pointsDisplay = document.getElementById('pointsDisplay');
  const moneyApprox = document.getElementById('moneyApprox');
  const mealsSaved = document.getElementById('mealsSaved');
  const co2avoided = document.getElementById('co2avoided');

  if (pointsDisplay) pointsDisplay.textContent = userData.points;
  if (moneyApprox) {
    const value = (userData.points * 0.0542).toFixed(2);
    moneyApprox.textContent = `≈ R$ ${value} em descontos`;
  }
  if (mealsSaved) mealsSaved.textContent = userData.mealsSaved;
  if (co2avoided) co2avoided.textContent = `${userData.co2Avoided}kg`;
}

function renderCheckinGrid() {
  const grid = document.getElementById('checkinGrid');
  if (!grid) return;

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  grid.innerHTML = '';
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const isToday = dateStr === today.toISOString().split('T')[0];
    const isDone = userData.checkins.includes(dateStr);
    const isFuture = date > today;

    const dayDiv = document.createElement('div');
    dayDiv.className = `day ${isDone ? 'done' : ''} ${isToday ? 'current' : ''} ${isFuture ? 'future' : ''}`;
    dayDiv.innerHTML = `
      <div style="font-size:10px">${days[i]}</div>
      <div style="font-size:18px">${isDone ? '✓' : date.getDate()}</div>
    `;

    if (isToday && !isDone) {
      dayDiv.addEventListener('click', () => doCheckin(dateStr));
    }

    grid.appendChild(dayDiv);
  }
}

function renderRewards() {
  const grid = document.getElementById('rewardsGrid');
  if (!grid) return;

  grid.innerHTML = rewards.map((r, idx) => `
    <div class="reward">
      <div class="emoji">${r.emoji}</div>
      <div class="name">${r.name}</div>
      <div class="cost">${r.cost} EcoPontos</div>
      <button class="redeem" onclick="redeemReward(${idx})">Resgatar</button>
    </div>
  `).join('');
}

function renderHistory() {
  const list = document.getElementById('historyList');
  if (!list) return;

  if (userData.history.length === 0) {
    list.innerHTML = '<div style="text-align:center; color:rgba(255,255,255,0.7); padding:20px">Nenhuma atividade ainda</div>';
    return;
  }

  list.innerHTML = userData.history.map(h => `
    <div class="history-item">
      <div class="hist-icon hist-${h.type}">
        ${h.type === 'eco' ? '🌱' : h.type === 'rec' ? '🔥' : '🎁'}
      </div>
      <div class="hist-info">
        <div class="hist-title">${h.title}</div>
        <div class="hist-desc">${h.desc}</div>
        <div class="hist-time">${h.time}</div>
      </div>
      <div class="hist-value ${h.points > 0 ? 'plus' : 'minus'}">
        ${h.points > 0 ? '+' : ''}${h.points}
      </div>
    </div>
  `).join('');
}

function updateStreak() {
  const streakInfo = document.getElementById('streakInfo');
  if (!streakInfo) return;

  const streak = calculateStreak();
  userData.streak = streak;

  streakInfo.innerHTML = `
    <div class="streak-title">🔥 ${streak} ${streak === 1 ? 'Dia' : 'Dias'} Salvando o Planeta</div>
    <div class="streak-desc">${streak === 0 ? 'Faça check-in diariamente para ganhar bônus' : 'Continue assim! Cada dia conta!'}</div>
  `;
}

function calculateStreak() {
  if (userData.checkins.length === 0) return 0;

  const sorted = [...userData.checkins].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  
  let streak = 0;
  let currentDate = new Date(today);

  for (const checkin of sorted) {
    const checkinDate = new Date(checkin);
    const daysDiff = Math.floor((currentDate - checkinDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ==================== Ações ====================
function doCheckin(dateStr) {
  if (userData.checkins.includes(dateStr)) {
    showToast('Você já fez check-in hoje! 🎉');
    return;
  }

  userData.checkins.push(dateStr);
  userData.lastCheckin = dateStr;
  
  const bonusPoints = 10;
  const streak = calculateStreak();
  const streakBonus = streak > 0 && streak % 3 === 0 ? 25 : 0;
  const totalPoints = bonusPoints + streakBonus;

  userData.points += totalPoints;
  
  userData.history.unshift({
    type: 'rec',
    title: 'Check-in Diário',
    desc: streakBonus > 0 ? `+${bonusPoints} base + ${streakBonus} bônus de sequência` : 'Parabéns por salvar o planeta hoje!',
    points: totalPoints,
    time: 'Agora'
  });

  saveData();
  renderAll();
  showToast(`🎉 +${totalPoints} EcoPontos! ${streakBonus > 0 ? 'Bônus de sequência!' : ''}`);
}

function redeemReward(idx) {
  const reward = rewards[idx];
  
  if (userData.points < reward.cost) {
    showToast(`Você precisa de ${reward.cost - userData.points} EcoPontos a mais! 🌱`);
    return;
  }

  showModal(
    '🎁 Resgatar Recompensa',
    `
      <div style="text-align:center">
        <div style="font-size:48px; margin:12px 0">${reward.emoji}</div>
        <div style="font-size:18px; font-weight:700; margin-bottom:8px">${reward.name}</div>
        <div style="color:#666; margin-bottom:12px">${reward.desc}</div>
        <div style="font-size:14px; color:#999">Custo: ${reward.cost} EcoPontos</div>
      </div>
    `,
    () => {
      userData.points -= reward.cost;
      
      userData.history.unshift({
        type: 'redeem',
        title: 'Recompensa Resgatada',
        desc: reward.name,
        points: -reward.cost,
        time: 'Agora'
      });

      saveData();
      renderAll();
      showToast(`🎉 ${reward.name} resgatado com sucesso!`);
    }
  );
}

// ==================== Event Listeners ====================
function setupEventListeners() {
  const openEarn = document.getElementById('openEarn');
  if (openEarn) {
    openEarn.addEventListener('click', () => {
      showModal(
        '🌟 Ganhe Mais EcoPontos',
        `
          <div class="row">
            <div class="opt" onclick="earnPoints('product')">
              <div style="font-size:32px">🛒</div>
              <div style="font-weight:700; margin-top:8px">Salvar Produto</div>
              <div style="font-size:13px; color:#666">+15 EcoPontos</div>
            </div>
            <div class="opt" onclick="earnPoints('daily')">
              <div style="font-size:32px">📅</div>
              <div style="font-weight:700; margin-top:8px">Check-in Diário</div>
              <div style="font-size:13px; color:#666">+10 EcoPontos</div>
            </div>
            <div class="opt" onclick="earnPoints('share')">
              <div style="font-size:32px">📢</div>
              <div style="font-weight:700; margin-top:8px">Compartilhar</div>
              <div style="font-size:13px; color:#666">+20 EcoPontos</div>
            </div>
            <div class="opt" onclick="earnPoints('review')">
              <div style="font-size:32px">⭐</div>
              <div style="font-weight:700; margin-top:8px">Avaliar Produto</div>
              <div style="font-size:13px; color:#666">+5 EcoPontos</div>
            </div>
          </div>
        `
      );
    });
  }

  // Botão de bônus +50 pontos
  const bonusBtn = document.getElementById('bonusBtn');
  if (bonusBtn) {
    bonusBtn.addEventListener('click', claimBonus);
  }

  // Botão de check-in sustentável
  const checkinBtn = document.getElementById('checkinBtn');
  if (checkinBtn) {
    checkinBtn.addEventListener('click', doSustainableCheckin);
  }

  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCancel = document.getElementById('modalCancel');
  
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) hideModal();
    });
  }
  
  if (modalCancel) {
    modalCancel.addEventListener('click', hideModal);
  }
}

// ==================== Ganhar Pontos ====================
window.earnPoints = function(type) {
  const actions = {
    product: { points: 15, title: 'Produto Salvo', desc: 'Você ajudou a reduzir desperdício!', meals: 1, co2: 0.3 },
    daily: { points: 10, title: 'Check-in Diário', desc: 'Continue assim!' },
    share: { points: 20, title: 'Compartilhamento', desc: 'Obrigado por espalhar a palavra!' },
    review: { points: 5, title: 'Avaliação', desc: 'Sua opinião é importante!' }
  };

  const action = actions[type];
  if (!action) return;

  userData.points += action.points;
  
  if (action.meals) {
    userData.mealsSaved += action.meals;
    userData.co2Avoided += action.co2;
  }

  userData.history.unshift({
    type: 'eco',
    title: action.title,
    desc: action.desc,
    points: action.points,
    time: 'Agora'
  });

  saveData();
  renderAll();
  hideModal();
  showToast(`🎉 +${action.points} EcoPontos!`);
};

// ==================== Bônus de 50 Pontos ====================
function claimBonus() {
  const lastBonus = userData.lastBonus || null;
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Verifica se já resgatou hoje
  if (lastBonus === today) {
    showToast('Você já resgatou o bônus hoje! Volte amanhã 🌟');
    return;
  }

  showModal(
    '🎁 Bônus Especial',
    `
      <div style="text-align:center">
        <div style="font-size:64px; margin:20px 0">🎁</div>
        <div style="font-size:20px; font-weight:700; margin-bottom:12px">Parabéns!</div>
        <div style="color:#666; margin-bottom:20px">Você ganhou 50 EcoPontos de bônus!</div>
        <div style="font-size:14px; color:#999">Disponível uma vez por dia</div>
      </div>
    `,
    () => {
      userData.points += 50;
      userData.lastBonus = today;
      
      userData.history.unshift({
        type: 'rec',
        title: 'Bônus Especial',
        desc: 'Recompensa diária resgatada!',
        points: 50,
        time: 'Agora'
      });

      saveData();
      renderAll();
      showToast('🎉 +50 EcoPontos! Volte amanhã para mais!');
    }
  );
}

// ==================== Check-in Sustentável ====================
function doSustainableCheckin() {
  const today = new Date().toISOString().split('T')[0];
  
  if (userData.checkins.includes(today)) {
    showToast('Você já fez check-in hoje! 🎉');
    return;
  }

  showModal(
    '🌱 Check-in Sustentável',
    `
      <div style="text-align:center">
        <div style="font-size:64px; margin:20px 0">🌱</div>
        <div style="font-size:20px; font-weight:700; margin-bottom:12px">Marcar Presença</div>
        <div style="color:#666; margin-bottom:20px">Faça check-in diário para ganhar pontos e construir sua sequência!</div>
        <div style="font-size:14px; color:#10b981; font-weight:600">+10 EcoPontos</div>
      </div>
    `,
    () => {
      doCheckin(today);
    }
  );
}

// ==================== Modal ====================
function showModal(title, body, onConfirm = null) {
  const backdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const confirmBtn = document.getElementById('modalConfirm');

  if (modalTitle) modalTitle.textContent = title;
  if (modalBody) modalBody.innerHTML = body;
  
  if (onConfirm) {
    confirmBtn.style.display = 'block';
    confirmBtn.onclick = () => {
      onConfirm();
      hideModal();
    };
  } else {
    confirmBtn.style.display = 'none';
  }

  if (backdrop) {
    backdrop.style.display = 'flex';
    backdrop.setAttribute('aria-hidden', 'false');
  }
}

function hideModal() {
  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) {
    backdrop.style.display = 'none';
    backdrop.setAttribute('aria-hidden', 'true');
  }
}

// ==================== Toast ====================
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}