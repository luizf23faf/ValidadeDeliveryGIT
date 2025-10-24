// ==================== DADOS DOS PEDIDOS ====================
const pedidosData = [
    {
        id: 1248,
        restaurante: { nome: 'Sushi & Co', endereco: 'Rua Japão, 789', logo: '🍱' },
        data: '2025-10-24',
        hora: '12:30',
        status: 'em-andamento',
        itens: [
            { quantidade: 1, nome: 'Combo Sushi Premium', preco: 85.00 }
        ],
        ecopontos: 45,
        total: 85.00
    },
    {
        id: 1247,
        restaurante: { nome: 'Pizzaria Bella Massa', endereco: 'Rua das Flores, 123', logo: '🍕' },
        data: '2025-10-22',
        hora: '18:45',
        status: 'entregue',
        itens: [
            { quantidade: 1, nome: 'Pizza de Calabresa Grande', preco: 45.00 },
            { quantidade: 2, nome: 'Refrigerante 2L', preco: 16.00 }
        ],
        ecopontos: 25,
        total: 61.00
    },
    {
        id: 1246,
        restaurante: { nome: 'Burger House Premium', endereco: 'Av. Central, 456', logo: '🍔' },
        data: '2025-10-20',
        hora: '20:15',
        status: 'entregue',
        itens: [
            { quantidade: 2, nome: 'Hambúrguer Artesanal', preco: 60.00 },
            { quantidade: 1, nome: 'Batata Frita Grande', preco: 18.00 }
        ],
        ecopontos: 40,
        total: 78.00
    },
    {
        id: 1245,
        restaurante: { nome: 'Padaria Pão Quente', endereco: 'Rua do Comércio, 321', logo: '🥖' },
        data: '2025-10-18',
        hora: '19:20',
        status: 'entregue',
        itens: [
            { quantidade: 12, nome: 'Pão de Queijo Especial', preco: 36.00 },
            { quantidade: 1, nome: 'Café Expresso', preco: 8.00 }
        ],
        ecopontos: 20,
        total: 44.00
    },
    {
        id: 1244,
        restaurante: { nome: 'Taco Mexicano', endereco: 'Av. México, 555', logo: '🌮' },
        data: '2025-10-15',
        hora: '21:00',
        status: 'cancelado',
        itens: [
            { quantidade: 3, nome: 'Taco de Carne', preco: 42.00 }
        ],
        ecopontos: 0,
        total: 42.00
    },
    {
        id: 1243,
        restaurante: { nome: 'Restaurante Mineiro', endereco: 'Rua Minas Gerais, 222', logo: '🍲' },
        data: '2025-10-12',
        hora: '13:30',
        status: 'entregue',
        itens: [
            { quantidade: 1, nome: 'Feijoada Completa', preco: 55.00 },
            { quantidade: 2, nome: 'Caipirinha', preco: 24.00 }
        ],
        ecopontos: 35,
        total: 79.00
    },
    {
        id: 1242,
        restaurante: { nome: 'Pizzaria Bella Massa', endereco: 'Rua das Flores, 123', logo: '🍕' },
        data: '2025-10-10',
        hora: '19:45',
        status: 'entregue',
        itens: [
            { quantidade: 1, nome: 'Pizza Margherita', preco: 48.00 }
        ],
        ecopontos: 22,
        total: 48.00
    },
    {
        id: 1241,
        restaurante: { nome: 'Açaí do Norte', endereco: 'Av. Amazônia, 888', logo: '🍧' },
        data: '2025-10-08',
        hora: '15:20',
        status: 'entregue',
        itens: [
            { quantidade: 2, nome: 'Açaí 500ml com Complementos', preco: 36.00 }
        ],
        ecopontos: 18,
        total: 36.00
    },
    {
        id: 1240,
        restaurante: { nome: 'Lanchonete do Bairro', endereco: 'Rua Principal, 100', logo: '🥪' },
        data: '2025-10-05',
        hora: '12:15',
        status: 'entregue',
        itens: [
            { quantidade: 1, nome: 'X-Tudo', preco: 28.00 },
            { quantidade: 1, nome: 'Suco Natural', preco: 10.00 }
        ],
        ecopontos: 15,
        total: 38.00
    },
    {
        id: 1239,
        restaurante: { nome: 'Churrascaria Bom Gosto', endereco: 'Av. Brasil, 777', logo: '🥩' },
        data: '2025-10-03',
        hora: '20:45',
        status: 'entregue',
        itens: [
            { quantidade: 1, nome: 'Picanha na Brasa', preco: 89.00 }
        ],
        ecopontos: 50,
        total: 89.00
    }
];

// ==================== VARIÁVEIS GLOBAIS ====================
let pedidosFiltrados = [...pedidosData];
let pedidosVisiveis = [...pedidosData];

// ==================== FUNÇÕES DE RENDERIZAÇÃO ====================

// Renderizar um pedido
function renderizarPedido(pedido) {
    const statusClass = pedido.status;
    const statusTexto = {
        'entregue': 'Entregue',
        'em-andamento': 'Em andamento',
        'cancelado': 'Cancelado'
    }[pedido.status];

    const itensHTML = pedido.itens.map(item => `
        <div class="item">
            <span class="item-qty">${item.quantidade}x</span>
            <span class="item-name">${item.nome}</span>
            <span class="item-price">R$ ${item.preco.toFixed(2)}</span>
        </div>
    `).join('');

    const ecoInfoHTML = pedido.status === 'cancelado' 
        ? `<div class="eco-info" style="opacity: 0.5;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#95A5A6">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>Pedido cancelado</span>
        </div>`
        : `<div class="eco-info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#52A194">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>+${pedido.ecopontos} Ecopontos${pedido.status === 'em-andamento' ? ' (pendente)' : ''}</span>
        </div>`;

    const acoesHTML = pedido.status === 'em-andamento'
        ? `<button class="action-btn secondary" onclick="rastrearPedido(${pedido.id})">Rastrear Pedido</button>
           <button class="action-btn danger" onclick="cancelarPedido(${pedido.id})">Cancelar</button>`
        : pedido.status === 'cancelado'
        ? `<button class="action-btn secondary" onclick="verMotivoCancelamento(${pedido.id})">Ver Motivo</button>
           <button class="action-btn primary" onclick="pedirNovamente(${pedido.id})">Pedir Novamente</button>`
        : `<button class="action-btn secondary" onclick="verDetalhes(${pedido.id})">Ver Detalhes</button>
           <button class="action-btn primary" onclick="pedirNovamente(${pedido.id})">Pedir Novamente</button>`;

    return `
        <div class="order-card" data-id="${pedido.id}" data-status="${pedido.status}" data-date="${pedido.data}">
            <div class="order-header">
                <div class="order-number">
                    <span class="order-id">#${pedido.id}</span>
                    <span class="order-date">${formatarData(pedido.data)} - ${pedido.hora}</span>
                </div>
                <span class="status-badge ${statusClass}">${statusTexto}</span>
            </div>
            
            <div class="order-body">
                <div class="restaurant-info">
                    <div class="restaurant-logo">${pedido.restaurante.logo}</div>
                    <div class="restaurant-details">
                        <h3>${pedido.restaurante.nome}</h3>
                        <p>${pedido.restaurante.endereco}</p>
                    </div>
                </div>

                <div class="order-items">
                    ${itensHTML}
                </div>

                <div class="order-footer">
                    ${ecoInfoHTML}
                    <div class="order-total">
                        <span>Total:</span>
                        <strong>R$ ${pedido.total.toFixed(2)}</strong>
                    </div>
                </div>
            </div>

            <div class="order-actions">
                ${acoesHTML}
            </div>
        </div>
    `;
}

// Renderizar todos os pedidos
function renderizarPedidos() {
    const container = document.querySelector('.orders-container');
    const noOrders = document.querySelector('.no-orders');
    
    if (pedidosVisiveis.length === 0) {
        container.style.display = 'none';
        noOrders.style.display = 'block';
    } else {
        container.style.display = 'flex';
        noOrders.style.display = 'none';
        container.innerHTML = pedidosVisiveis.map(pedido => renderizarPedido(pedido)).join('');
        
        // Animação de entrada
        animarCards();
    }
}

// Animação dos cards
function animarCards() {
    const cards = document.querySelectorAll('.order-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Formatar data
function formatarData(dataStr) {
    const data = new Date(dataStr + 'T00:00:00');
    return data.toLocaleDateString('pt-BR');
}

// ==================== FUNÇÕES DE FILTRO ====================

// Filtrar por período
function filtrarPorPeriodo(periodo) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    switch(periodo) {
        case 'hoje':
            return pedidosFiltrados.filter(p => {
                const dataPedido = new Date(p.data + 'T00:00:00');
                return dataPedido.getTime() === hoje.getTime();
            });
        case 'semana':
            const semanaAtras = new Date(hoje);
            semanaAtras.setDate(hoje.getDate() - 7);
            return pedidosFiltrados.filter(p => {
                const dataPedido = new Date(p.data + 'T00:00:00');
                return dataPedido >= semanaAtras;
            });
        case 'mes':
            const mesAtras = new Date(hoje);
            mesAtras.setMonth(hoje.getMonth() - 1);
            return pedidosFiltrados.filter(p => {
                const dataPedido = new Date(p.data + 'T00:00:00');
                return dataPedido >= mesAtras;
            });
        case 'ano':
            const anoAtras = new Date(hoje);
            anoAtras.setFullYear(hoje.getFullYear() - 1);
            return pedidosFiltrados.filter(p => {
                const dataPedido = new Date(p.data + 'T00:00:00');
                return dataPedido >= anoAtras;
            });
        default:
            return pedidosFiltrados;
    }
}

// Filtrar por status
function filtrarPorStatus(status) {
    if (status === 'todos') {
        return pedidosFiltrados;
    }
    return pedidosFiltrados.filter(p => p.status === status);
}

// Buscar pedidos
function buscarPedidos(termo) {
    if (!termo) return pedidosVisiveis;
    
    const termoLower = termo.toLowerCase();
    return pedidosVisiveis.filter(p => {
        return p.restaurante.nome.toLowerCase().includes(termoLower) ||
               p.itens.some(item => item.nome.toLowerCase().includes(termoLower)) ||
               p.id.toString().includes(termo);
    });
}

// Aplicar todos os filtros
function aplicarFiltros() {
    const periodoSelect = document.getElementById('periodo-filter');
    const statusSelect = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-input');
    
    const periodo = periodoSelect.value;
    const status = statusSelect.value;
    const termoBusca = searchInput.value.trim();
    
    // Primeiro filtra por status
    pedidosFiltrados = status === 'todos' 
        ? [...pedidosData]
        : pedidosData.filter(p => p.status === status);
    
    // Depois filtra por período
    pedidosVisiveis = filtrarPorPeriodo(periodo);
    
    // Por último aplica a busca
    if (termoBusca) {
        pedidosVisiveis = buscarPedidos(termoBusca);
    }
    
    // Atualiza estatísticas
    atualizarEstatisticas();
    
    // Renderiza os pedidos
    renderizarPedidos();
}

// Atualizar estatísticas
function atualizarEstatisticas() {
    const totalPedidos = pedidosVisiveis.length;
    const valorTotal = pedidosVisiveis.reduce((acc, p) => acc + p.total, 0);
    const ecopontosTotal = pedidosVisiveis
        .filter(p => p.status !== 'cancelado')
        .reduce((acc, p) => acc + p.ecopontos, 0);
    
    // Atualizar no DOM
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = totalPedidos;
        statNumbers[1].textContent = `R$ ${valorTotal.toFixed(2)}`;
        statNumbers[2].textContent = ecopontosTotal >= 1000 
            ? `${(ecopontosTotal / 1000).toFixed(1)}k` 
            : ecopontosTotal;
    }
}

// ==================== AÇÕES DOS PEDIDOS ====================

// Ver detalhes do pedido
function verDetalhes(idPedido) {
    const pedido = pedidosData.find(p => p.id === idPedido);
    if (!pedido) return;
    
    const itensTexto = pedido.itens
        .map(i => `${i.quantidade}x ${i.nome} - R$ ${i.preco.toFixed(2)}`)
        .join('\n');
    
    alert(`📦 DETALHES DO PEDIDO #${pedido.id}\n\n` +
          `🏪 ${pedido.restaurante.nome}\n` +
          `📍 ${pedido.restaurante.endereco}\n\n` +
          `📅 Data: ${formatarData(pedido.data)} às ${pedido.hora}\n` +
          `📊 Status: ${pedido.status}\n\n` +
          `🛒 ITENS:\n${itensTexto}\n\n` +
          `💰 Total: R$ ${pedido.total.toFixed(2)}\n` +
          `🌱 Ecopontos: +${pedido.ecopontos}`);
}

// Pedir novamente
function pedirNovamente(idPedido) {
    const pedido = pedidosData.find(p => p.id === idPedido);
    if (!pedido) return;
    
    const confirma = confirm(`🔄 REPETIR PEDIDO\n\n` +
                           `Deseja fazer o mesmo pedido de ${pedido.restaurante.nome}?\n\n` +
                           `Total: R$ ${pedido.total.toFixed(2)}`);
    
    if (confirma) {
        // Animação de feedback
        const card = document.querySelector(`[data-id="${idPedido}"]`);
        if (card) {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        }
        
        setTimeout(() => {
            alert('✅ Pedido adicionado ao carrinho!\n\nRedirecionando para finalizar...');
            // Aqui você redirecionaria para a página do restaurante
            console.log('Redirecionar para:', pedido.restaurante.nome);
        }, 500);
    }
}

// Rastrear pedido
function rastrearPedido(idPedido) {
    const pedido = pedidosData.find(p => p.id === idPedido);
    if (!pedido) return;
    
    alert(`🚚 RASTREAMENTO DO PEDIDO #${pedido.id}\n\n` +
          `Status: Pedido confirmado\n` +
          `🏪 Restaurante preparando seu pedido\n` +
          `⏱️ Tempo estimado: 35-45 minutos\n\n` +
          `📍 ${pedido.restaurante.nome}\n` +
          `${pedido.restaurante.endereco}`);
}

// Cancelar pedido
function cancelarPedido(idPedido) {
    const pedido = pedidosData.find(p => p.id === idPedido);
    if (!pedido) return;
    
    const confirma = confirm(`❌ CANCELAR PEDIDO #${pedido.id}\n\n` +
                           `Tem certeza que deseja cancelar?\n\n` +
                           `⚠️ Esta ação não pode ser desfeita.`);
    
    if (confirma) {
        // Atualiza o status no array
        const index = pedidosData.findIndex(p => p.id === idPedido);
        if (index !== -1) {
            pedidosData[index].status = 'cancelado';
            pedidosData[index].ecopontos = 0;
            
            // Reaplica os filtros e renderiza
            aplicarFiltros();
            
            alert('✅ Pedido cancelado com sucesso!\n\n' +
                  'O valor será estornado em até 48 horas.');
        }
    }
}

// Ver motivo do cancelamento
function verMotivoCancelamento(idPedido) {
    alert(`❌ PEDIDO CANCELADO #${idPedido}\n\n` +
          `Motivo: Cancelado pelo usuário\n` +
          `Data: ${formatarData('2025-10-15')} às 21:15\n\n` +
          `O valor de R$ 42,00 foi estornado.`);
}

// ==================== EVENT LISTENERS ====================

// Filtros
document.getElementById('periodo-filter').addEventListener('change', aplicarFiltros);
document.getElementById('status-filter').addEventListener('change', aplicarFiltros);

// Busca com debounce
let timeoutBusca;
document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(timeoutBusca);
    timeoutBusca = setTimeout(() => {
        aplicarFiltros();
    }, 300);
});

// Limpar busca ao pressionar ESC
document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        e.target.value = '';
        aplicarFiltros();
    }
});

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + F para focar na busca
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('search-input').focus();
    }
});

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Sistema de Pedidos Carregado!');
    console.log(`📦 ${pedidosData.length} pedidos no histórico`);
    
    // Renderiza os pedidos iniciais
    renderizarPedidos();
    
    // Atualiza estatísticas
    atualizarEstatisticas();
    
    // Mensagem de boas-vindas
    setTimeout(() => {
        console.log('💡 Dica: Use Ctrl+F para buscar pedidos rapidamente!');
    }, 2000);
});

// ==================== FUNÇÕES AUXILIARES ====================

// Exportar histórico (futuro)
function exportarHistorico() {
    const dados = JSON.stringify(pedidosVisiveis, null, 2);
    console.log('Histórico exportado:', dados);
    alert('📊 Funcionalidade de exportação em desenvolvimento!');
}

// Calcular estatísticas detalhadas
function calcularEstatisticas() {
    const stats = {
        totalPedidos: pedidosData.length,
        pedidosEntregues: pedidosData.filter(p => p.status === 'entregue').length,
        pedidosCancelados: pedidosData.filter(p => p.status === 'cancelado').length,
        valorTotal: pedidosData.reduce((acc, p) => acc + p.total, 0),
        ecopontosTotal: pedidosData.filter(p => p.status === 'entregue')
                                     .reduce((acc, p) => acc + p.ecopontos, 0),
        ticketMedio: pedidosData.reduce((acc, p) => acc + p.total, 0) / pedidosData.length,
        restauranteFavorito: encontrarRestauranteFavorito()
    };
    
    return stats;
}

// Encontrar restaurante favorito
function encontrarRestauranteFavorito() {
    const contagem = {};
    pedidosData.forEach(p => {
        const nome = p.restaurante.nome;
        contagem[nome] = (contagem[nome] || 0) + 1;
    });
    
    let maxPedidos = 0;
    let favorito = '';
    
    for (const [nome, count] of Object.entries(contagem)) {
        if (count > maxPedidos) {
            maxPedidos = count;
            favorito = nome;
        }
    }
    
    return { nome: favorito, pedidos: maxPedidos };
}

// Log de estatísticas no console
console.log('📊 Estatísticas:', calcularEstatisticas());