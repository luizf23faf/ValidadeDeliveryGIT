const userLevel = 12;
    const userXP = 2450;
    const xpPerLevel = 3000;
    
    const rewards = [
      { level: 1, icon: '🎯', name: 'Ponto Bônus', desc: '+100 pontos extras', type: 'free', unlocked: true },
      { level: 2, icon: '⭐', name: 'Badge Bronze', desc: 'Distintivo de entregador', type: 'premium', unlocked: true },
      { level: 3, icon: '🚀', name: 'XP Boost', desc: '+10% XP por 3 dias', type: 'free', unlocked: true },
      { level: 4, icon: '💎', name: 'Desconto Premium', desc: '15% em taxas', type: 'premium', unlocked: true },
      { level: 5, icon: '🏆', name: 'Troféu Bronze', desc: 'Conquista especial', type: 'free', unlocked: true },
      { level: 6, icon: '🎨', name: 'Tema Personalizado', desc: 'Interface exclusiva', type: 'premium', unlocked: true },
      { level: 7, icon: '🔥', name: 'Streak Protetor', desc: 'Protege sua sequência', type: 'free', unlocked: true },
      { level: 8, icon: '💰', name: 'Vale R$ 10', desc: 'Crédito na carteira', type: 'premium', unlocked: true },
      { level: 9, icon: '🎁', name: 'Caixa Mistério', desc: 'Recompensa aleatória', type: 'free', unlocked: true },
      { level: 10, icon: '🌟', name: 'Badge Prata', desc: 'Distintivo aprimorado', type: 'premium', unlocked: true },
      { level: 11, icon: '📦', name: 'Kit Entregador', desc: 'Itens exclusivos', type: 'free', unlocked: true },
      { level: 12, icon: '💫', name: 'XP Dobrado', desc: '24h de XP x2', type: 'premium', unlocked: true },
      { level: 13, icon: '🎯', name: 'Bônus Elite', desc: '+500 pontos extras', type: 'free', unlocked: false },
      { level: 14, icon: '🏅', name: 'Troféu Prata', desc: 'Conquista rara', type: 'premium', unlocked: false },
      { level: 15, icon: '🚀', name: 'Mega Boost', desc: '+25% XP por 7 dias', type: 'free', unlocked: false },
      { level: 16, icon: '👑', name: 'Coroa Dourada', desc: 'Distintivo lendário', type: 'premium', unlocked: false },
      { level: 17, icon: '🎪', name: 'Pack Exclusivo', desc: 'Bundle completo', type: 'free', unlocked: false },
      { level: 18, icon: '💸', name: 'Vale R$ 25', desc: 'Crédito especial', type: 'premium', unlocked: false },
      { level: 19, icon: '🔮', name: 'Caixa Épica', desc: 'Recompensas raras', type: 'free', unlocked: false },
      { level: 20, icon: '🏆', name: 'Badge Ouro', desc: 'Máximo prestígio', type: 'premium', unlocked: false }
    ];

    let currentTier = 'free';

    function renderRewards() {
      const container = document.getElementById('rewardsContainer');
      container.innerHTML = '';
      
      const filteredRewards = rewards.filter(r => r.type === currentTier);
      
      filteredRewards.forEach(reward => {
        const card = document.createElement('div');
        card.className = `reward-card ${reward.unlocked ? 'unlocked' : 'locked'} ${reward.type === 'premium' ? 'premium-reward' : ''}`;
        
        card.innerHTML = `
          <div class="reward-level">Nv. ${reward.level}</div>
          <div class="reward-icon">${reward.icon}</div>
          <div class="reward-name">${reward.name}</div>
          <div class="reward-desc">${reward.desc}</div>
          <div class="reward-status ${reward.unlocked ? 'unlocked' : 'locked'}">
            ${reward.unlocked ? '✓ Desbloqueado' : '🔒 Bloqueado'}
          </div>
        `;
        
        container.appendChild(card);
      });
    }

    function showTier(tier) {
      currentTier = tier;
      
      document.querySelectorAll('.tier-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      event.target.closest('.tier-btn').classList.add('active');
      
      renderRewards();
    }

    function upgradeToPremium() {
      alert('🎉 Redirecionando para pagamento do Passe Premium!\n\nBenefícios inclusos:\n• Todas as recompensas premium\n• XP dobrado em todas as entregas\n• Acesso a eventos exclusivos\n• Descontos especiais');
    }

    function updateProgress() {
      const progress = ((userXP % xpPerLevel) / xpPerLevel) * 100;
      document.getElementById('progressBar').style.width = progress + '%';
      document.querySelector('.progress-percentage').textContent = Math.round(progress) + '%';
    }

    renderRewards();
    updateProgress();