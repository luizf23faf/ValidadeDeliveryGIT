// ==================== Variáveis Globais ====================
let carrinho = [];
const TAXA_ENTREGA = 5.00;

// ==================== Elementos do DOM ====================
const carrinhoFloat = document.getElementById('carrinhoFloat');
const carrinhoCount = document.getElementById('carrinhoCount');
const modalCarrinho = document.getElementById('modalCarrinho');
const closeModal = document.getElementById('closeModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartSubtotal = document.getElementById('cartSubtotal');
const finalizarPedido = document.getElementById('finalizarPedido');
const notification = document.getElementById('notification');
const botoesAdicionar = document.querySelectorAll('.btn-add');
const categoriasBtns = document.querySelectorAll('.categoria-btn');

// ==================== Inicialização ====================
document.addEventListener('DOMContentLoaded', () => {
    inicializarEventos();
    carregarCarrinho();
    atualizarContadorCarrinho();
    console.log('✅ Sistema carregado com sucesso!');
    console.log(`📊 Total de cards: ${document.querySelectorAll('.card').length}`);
    console.log(`🎯 Categorias disponíveis: ${categoriasBtns.length}`);
});

// ==================== Event Listeners ====================
function inicializarEventos() {
    // Botões de adicionar ao carrinho
    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = botao.closest('.card');
            adicionarAoCarrinho(card);
        });
    });

    // Abrir modal do carrinho
    carrinhoFloat.addEventListener('click', abrirCarrinho);

    // Fechar modal
    closeModal.addEventListener('click', fecharCarrinho);
    modalCarrinho.addEventListener('click', (e) => {
        if (e.target === modalCarrinho) {
            fecharCarrinho();
        }
    });

    // Finalizar pedido
    finalizarPedido.addEventListener('click', finalizarPedidoHandler);

    // Filtros de categoria (Sistema melhorado)
    categoriasBtns.forEach(btn => {
        btn.addEventListener('click', () => filtrarPorCategoria(btn));
    });

    // Ver detalhes (quick view)
    const quickViewBtns = document.querySelectorAll('.quick-view');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.card');
            mostrarDetalhes(card);
        });
    });

    // Sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const texto = item.querySelector('.sidebar-text').textContent;
            mostrarNotificacao(`Abrindo ${texto}... 🚀`);
        });
    });

    // Tecla ESC para fechar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalCarrinho.classList.contains('show')) {
            fecharCarrinho();
        }
    });
}

// ==================== Adicionar ao Carrinho ====================
function adicionarAoCarrinho(card) {
    const nome = card.dataset.nome;
    const preco = parseFloat(card.dataset.preco);
    
    // Verifica se o item já existe no carrinho
    const itemExistente = carrinho.find(item => item.nome === nome);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }
    
    salvarCarrinho();
    atualizarContadorCarrinho();
    mostrarNotificacao(`${nome} adicionado ao carrinho! 🛒`);
    
    // Animação no botão
    const botao = card.querySelector('.btn-add');
    botao.style.transform = 'scale(0.9)';
    setTimeout(() => {
        botao.style.transform = '';
    }, 200);
}

// ==================== Remover do Carrinho ====================
function removerDoCarrinho(index) {
    const item = carrinho[index];
    carrinho.splice(index, 1);
    
    salvarCarrinho();
    atualizarCarrinho();
    atualizarContadorCarrinho();
    mostrarNotificacao(`${item.nome} removido do carrinho! 🗑️`);
}

// ==================== Atualizar Quantidade ====================
function atualizarQuantidade(index, novaQuantidade) {
    if (novaQuantidade <= 0) {
        removerDoCarrinho(index);
        return;
    }
    
    carrinho[index].quantidade = novaQuantidade;
    salvarCarrinho();
    atualizarCarrinho();
}

// ==================== Abrir/Fechar Carrinho ====================
function abrirCarrinho() {
    modalCarrinho.classList.add('show');
    document.body.style.overflow = 'hidden';
    atualizarCarrinho();
}

function fecharCarrinho() {
    modalCarrinho.classList.add('hide');
    
    setTimeout(() => {
        modalCarrinho.classList.remove('show', 'hide');
        document.body.style.overflow = '';
    }, 300);
}

// ==================== Atualizar Display do Carrinho ====================
function atualizarCarrinho() {
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Seu carrinho está vazio 😢<br>Adicione alguns produtos deliciosos!</div>';
        cartSubtotal.textContent = 'R$ 0,00';
        cartTotal.querySelector('span:last-child').textContent = `R$ ${TAXA_ENTREGA.toFixed(2).replace('.', ',')}`;
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    carrinho.forEach((item, index) => {
        const totalItem = item.preco * item.quantidade;
        subtotal += totalItem;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <p>R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                        <button class="qty-btn" onclick="atualizarQuantidade(${index}, ${item.quantidade - 1})" style="background: #f28c00; color: white; border: none; width: 30px; height: 30px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 1.2rem;">−</button>
                        <span style="font-weight: bold; min-width: 30px; text-align: center;">${item.quantidade}</span>
                        <button class="qty-btn" onclick="atualizarQuantidade(${index}, ${item.quantidade + 1})" style="background: #6ea56f; color: white; border: none; width: 30px; height: 30px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 1.2rem;">+</button>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
                    <div style="font-size: 1.3rem; font-weight: bold; color: #6ea56f;">
                        R$ ${totalItem.toFixed(2).replace('.', ',')}
                    </div>
                    <button class="remove-item" onclick="removerDoCarrinho(${index})">
                        🗑️ Remover
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    
    const total = subtotal + TAXA_ENTREGA;
    cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    cartTotal.querySelector('span:last-child').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ==================== Contador do Carrinho ====================
function atualizarContadorCarrinho() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    carrinhoCount.textContent = totalItens;
    
    if (totalItens > 0) {
        carrinhoCount.style.display = 'flex';
    } else {
        carrinhoCount.style.display = 'none';
    }
}

// ==================== Finalizar Pedido ====================
function finalizarPedidoHandler() {
    if (carrinho.length === 0) {
        mostrarNotificacao('Adicione itens ao carrinho primeiro! 🛒', 'erro');
        return;
    }
    
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0) + TAXA_ENTREGA;
    
    // Animação no botão
    finalizarPedido.style.transform = 'scale(0.95)';
    setTimeout(() => {
        finalizarPedido.style.transform = '';
    }, 200);
    
    // Simular processamento
    finalizarPedido.textContent = 'Processando...';
    finalizarPedido.disabled = true;
    
    setTimeout(() => {
        mostrarNotificacao(`Pedido realizado com sucesso! Total: R$ ${total.toFixed(2).replace('.', ',')} 🎉`, 'sucesso');
        
        // Limpar carrinho
        carrinho = [];
        salvarCarrinho();
        atualizarCarrinho();
        atualizarContadorCarrinho();
        
        finalizarPedido.textContent = '✨ Finalizar Pedido ✨';
        finalizarPedido.disabled = false;
        
        setTimeout(() => {
            fecharCarrinho();
        }, 1500);
    }, 2000);
}

// ==================== Notificações ====================
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    notification.textContent = mensagem;
    notification.className = 'notification show';
    
    if (tipo === 'erro') {
        notification.style.background = 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #6ea56f 0%, #5a8f5b 100%)';
    }
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ==================== Salvar/Carregar Carrinho ====================
function salvarCarrinho() {
    // Usar variável em memória ao invés de localStorage
    // pois localStorage não funciona em artifacts do Claude
}

function carregarCarrinho() {
    // Carregar de variável em memória
    // Em produção, você usaria localStorage aqui
}

// ==================== SISTEMA DE FILTRO MELHORADO ====================
function filtrarPorCategoria(botaoClicado) {
    // Remove active de todos os botões
    categoriasBtns.forEach(btn => btn.classList.remove('active'));
    
    // Adiciona active no botão clicado
    botaoClicado.classList.add('active');
    
    // Pega o texto do botão e determina a categoria
    const btnText = botaoClicado.textContent.trim().toLowerCase();
    let categoria = 'todos';
    
    // Mapeamento inteligente de categorias
    if (btnText.includes('lanches') || btnText.includes('🍔')) {
        categoria = 'lanches';
    } else if (btnText.includes('saudável') || btnText.includes('🥗')) {
        categoria = 'saudavel';
    } else if (btnText.includes('doces') || btnText.includes('🍰')) {
        categoria = 'doces';
    } else if (btnText.includes('todos') || btnText.includes('🍕')) {
        categoria = 'todos';
    }
    
    // Filtra os cards
    filtrarCards(categoria);
    
    // Feedback visual
    mostrarNotificacao(`Mostrando: ${botaoClicado.textContent.trim()} 🔍`);
    
    // Log para debug
    console.log(`🎯 Filtro aplicado: ${categoria}`);
}

// Função auxiliar de filtro
function filtrarCards(categoria) {
    const todosCards = document.querySelectorAll('.card');
    let cardsVisiveis = 0;
    
    todosCards.forEach(card => {
        const cardCategoria = card.getAttribute('data-categoria');
        
        if (categoria === 'todos' || cardCategoria === categoria) {
            // Mostra o card com animação
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 10);
            cardsVisiveis++;
        } else {
            // Esconde o card com animação
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Log de cards filtrados
    console.log(`📊 Cards visíveis: ${cardsVisiveis}/${todosCards.length}`);
    
    // Mostra mensagem se não encontrou nenhum card
    if (cardsVisiveis === 0) {
        mostrarNotificacao('Nenhum produto encontrado nesta categoria 😕', 'erro');
    }
}

// ==================== Ver Detalhes do Produto ====================
function mostrarDetalhes(card) {
    const nome = card.dataset.nome;
    const preco = card.dataset.preco;
    const descricao = card.querySelector('p').textContent;
    const rating = card.querySelector('.rating-number').textContent;
    
    const detalhesHTML = `
        <div style="text-align: center; padding: 20px;">
            <h3 style="color: #f28c00; margin-bottom: 15px; font-size: 1.8rem;">${nome}</h3>
            <div style="margin-bottom: 15px;">
                <span style="color: #ffd700; font-size: 1.2rem;">⭐⭐⭐⭐⭐</span>
                <span style="font-weight: bold; margin-left: 10px;">${rating}</span>
            </div>
            <p style="color: #666; margin-bottom: 20px; line-height: 1.8;">${descricao}</p>
            <div style="font-size: 2rem; color: #6ea56f; font-weight: bold; margin: 20px 0;">
                R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}
            </div>
            <button onclick="fecharDetalhes(); adicionarAoCarrinho(document.querySelector('[data-nome=\\'${nome}\\']'))" 
                    style="background: linear-gradient(135deg, #6ea56f 0%, #5a8f5b 100%); color: white; border: none; padding: 15px 30px; border-radius: 12px; font-size: 1.1rem; font-weight: bold; cursor: pointer; width: 100%; margin-top: 10px;">
                🛒 Adicionar ao Carrinho
            </button>
        </div>
    `;
    
    // Criar modal temporário para detalhes
    const modalDetalhes = document.createElement('div');
    modalDetalhes.id = 'modalDetalhes';
    modalDetalhes.className = 'modal show';
    modalDetalhes.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>📋 Detalhes do Produto</h2>
                <button class="close-modal" onclick="fecharDetalhes()">✕</button>
            </div>
            ${detalhesHTML}
        </div>
    `;
    
    document.body.appendChild(modalDetalhes);
    document.body.style.overflow = 'hidden';
}

function fecharDetalhes() {
    const modalDetalhes = document.getElementById('modalDetalhes');
    if (modalDetalhes) {
        modalDetalhes.classList.add('hide');
        setTimeout(() => {
            modalDetalhes.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// ==================== Animações de Entrada ====================
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// ==================== Efeito Parallax no Scroll ====================
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Efeito no carrinho flutuante
    if (currentScroll > lastScroll) {
        carrinhoFloat.style.transform = 'translateY(10px) scale(0.9)';
    } else {
        carrinhoFloat.style.transform = 'translateY(0) scale(1)';
    }
    
    lastScroll = currentScroll;
});

// ==================== CSS Dinâmico para Transições ====================
const style = document.createElement('style');
style.textContent = `
    /* Transições suaves para os cards */
    .card {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    /* Efeito hover nos botões de categoria */
    .categoria-btn {
        transition: all 0.3s ease;
    }

    .categoria-btn:hover {
        transform: translateY(-2px);
    }
    
    /* Animação do contador do carrinho */
    .carrinho-count {
        animation: bounce 0.5s ease;
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(style);

// ==================== Console Easter Egg ====================
console.log('%c🌱 ValidaDelivery - Desenvolvido com 💚', 'color: #6ea56f; font-size: 20px; font-weight: bold;');
console.log('%cSe você está vendo isso, você é curioso(a)! 🔍', 'color: #f28c00; font-size: 14px;');
console.log('%c💡 Dica: Experimente os filtros de categoria!', 'color: #667eea; font-size: 12px;');