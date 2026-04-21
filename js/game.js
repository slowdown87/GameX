// 游戏状态管理
const gameState = {
    currentPage: 'home',
    players: {
        player1: {
            x: 100,
            y: 250,
            width: 40,
            height: 60,
            health: 100,
            attack: 10,
            defense: 5,
            speed: 5,
            direction: 'right',
            isAttacking: false,
            isDefending: false,
            attackCooldown: 0,
            defenseCooldown: 0
        },
        player2: {
            x: 660,
            y: 250,
            width: 40,
            height: 60,
            health: 100,
            attack: 10,
            defense: 5,
            speed: 5,
            direction: 'left',
            isAttacking: false,
            isDefending: false,
            attackCooldown: 0,
            defenseCooldown: 0
        }
    },
    keys: {
        // 玩家1控制
        w: false,
        a: false,
        s: false,
        d: false,
        j: false,
        k: false,
        // 玩家2控制
        arrowUp: false,
        arrowLeft: false,
        arrowDown: false,
        arrowRight: false,
        num1: false,
        num2: false
    },
    gameLoop: null
};

// 页面元素
const pages = {
    home: document.getElementById('home'),
    game: document.getElementById('game'),
    end: document.getElementById('end')
};

const buttons = {
    start: document.getElementById('start-btn'),
    restart: document.getElementById('restart-btn')
};

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const healthBars = {
    player1: document.getElementById('player1-health'),
    player2: document.getElementById('player2-health')
};

const resultTitle = document.getElementById('result');

// 初始化游戏
function initGame() {
    // 重置游戏状态
    gameState.players.player1 = {
        x: 100,
        y: 250,
        width: 40,
        height: 60,
        health: 100,
        attack: 10,
        defense: 5,
        speed: 5,
        direction: 'right',
        isAttacking: false,
        isDefending: false,
        attackCooldown: 0,
        defenseCooldown: 0
    };
    
    gameState.players.player2 = {
        x: 660,
        y: 250,
        width: 40,
        height: 60,
        health: 100,
        attack: 10,
        defense: 5,
        speed: 5,
        direction: 'left',
        isAttacking: false,
        isDefending: false,
        attackCooldown: 0,
        defenseCooldown: 0
    };
    
    // 更新血量条
    updateHealthBars();
    
    // 开始游戏循环
    if (gameState.gameLoop) {
        clearInterval(gameState.gameLoop);
    }
    
    gameState.gameLoop = setInterval(gameLoop, 16); // 约60fps
}

// 游戏主循环
function gameLoop() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景
    drawBackground();
    
    // 更新玩家状态
    updatePlayers();
    
    // 绘制玩家
    drawPlayers();
    
    // 绘制攻击特效
    drawAttackEffects();
    
    // 检查游戏结束条件
    checkGameEnd();
}

// 绘制背景
function drawBackground() {
    // 绘制天空渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height - 50);
    gradient.addColorStop(0, '#2c3e50');
    gradient.addColorStop(1, '#34495e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height - 50);
    
    // 绘制云朵
    drawClouds();
    
    // 绘制远处山脉
    drawMountains();
    
    // 绘制地面
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // 绘制地面纹理
    ctx.fillStyle = '#95a5a6';
    for (let i = 0; i < canvas.width; i += 20) {
        for (let j = canvas.height - 50; j < canvas.height; j += 20) {
            ctx.fillRect(i, j, 10, 10);
        }
    }
    
    // 绘制地面细节
    drawGroundDetails();
}

// 绘制云朵
function drawClouds() {
    ctx.fillStyle = '#ecf0f1';
    // 云朵1
    ctx.fillRect(50, 50, 40, 20);
    ctx.fillRect(70, 40, 40, 20);
    ctx.fillRect(90, 50, 40, 20);
    // 云朵2
    ctx.fillRect(200, 80, 30, 15);
    ctx.fillRect(215, 70, 30, 15);
    ctx.fillRect(230, 80, 30, 15);
    // 云朵3
    ctx.fillRect(500, 60, 45, 25);
    ctx.fillRect(520, 50, 45, 25);
    ctx.fillRect(540, 60, 45, 25);
    // 云朵4
    ctx.fillRect(650, 90, 35, 18);
    ctx.fillRect(665, 80, 35, 18);
    ctx.fillRect(680, 90, 35, 18);
}

// 绘制山脉
function drawMountains() {
    // 远处山脉
    ctx.fillStyle = '#34495e';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 100);
    ctx.lineTo(150, canvas.height - 200);
    ctx.lineTo(300, canvas.height - 150);
    ctx.lineTo(450, canvas.height - 220);
    ctx.lineTo(600, canvas.height - 180);
    ctx.lineTo(750, canvas.height - 210);
    ctx.lineTo(800, canvas.height - 100);
    ctx.closePath();
    ctx.fill();
    
    // 近处山脉
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 80);
    ctx.lineTo(100, canvas.height - 150);
    ctx.lineTo(250, canvas.height - 120);
    ctx.lineTo(400, canvas.height - 160);
    ctx.lineTo(550, canvas.height - 130);
    ctx.lineTo(700, canvas.height - 170);
    ctx.lineTo(800, canvas.height - 80);
    ctx.closePath();
    ctx.fill();
}

// 绘制地面细节
function drawGroundDetails() {
    // 绘制石头
    ctx.fillStyle = '#5d6d7e';
    ctx.fillRect(50, canvas.height - 45, 15, 15);
    ctx.fillRect(120, canvas.height - 40, 10, 10);
    ctx.fillRect(200, canvas.height - 48, 18, 18);
    ctx.fillRect(280, canvas.height - 42, 12, 12);
    ctx.fillRect(350, canvas.height - 46, 16, 16);
    ctx.fillRect(430, canvas.height - 41, 11, 11);
    ctx.fillRect(500, canvas.height - 47, 17, 17);
    ctx.fillRect(580, canvas.height - 43, 13, 13);
    ctx.fillRect(650, canvas.height - 49, 19, 19);
    ctx.fillRect(720, canvas.height - 44, 14, 14);
    
    // 绘制草丛
    ctx.fillStyle = '#27ae60';
    for (let i = 0; i < canvas.width; i += 30) {
        ctx.fillRect(i, canvas.height - 50, 5, 10);
        ctx.fillRect(i + 10, canvas.height - 50, 5, 10);
        ctx.fillRect(i + 20, canvas.height - 50, 5, 10);
    }
}

// 更新玩家状态
function updatePlayers() {
    const player1 = gameState.players.player1;
    const player2 = gameState.players.player2;
    
    // 更新玩家1
    updatePlayer(player1, 'player1');
    
    // 更新玩家2
    updatePlayer(player2, 'player2');
    
    // 检查攻击碰撞
    checkAttackCollision();
    
    // 减少冷却时间
    if (player1.attackCooldown > 0) player1.attackCooldown--;
    if (player1.defenseCooldown > 0) player1.defenseCooldown--;
    if (player2.attackCooldown > 0) player2.attackCooldown--;
    if (player2.defenseCooldown > 0) player2.defenseCooldown--;
}

// 更新单个玩家
function updatePlayer(player, playerId) {
    // 移动
    if (playerId === 'player1') {
        if (gameState.keys.w) player.y = Math.max(50, player.y - player.speed);
        if (gameState.keys.s) player.y = Math.min(canvas.height - player.height - 50, player.y + player.speed);
        if (gameState.keys.a) {
            player.x = Math.max(0, player.x - player.speed);
            player.direction = 'left';
        }
        if (gameState.keys.d) {
            player.x = Math.min(canvas.width / 2 - player.width, player.x + player.speed);
            player.direction = 'right';
        }
        
        // 攻击
        if (gameState.keys.j && player.attackCooldown === 0) {
            player.isAttacking = true;
            player.attackCooldown = 30; // 攻击冷却
            setTimeout(() => {
                player.isAttacking = false;
            }, 200);
        }
        
        // 防御
        if (gameState.keys.k && player.defenseCooldown === 0) {
            player.isDefending = true;
            player.defenseCooldown = 60; // 防御冷却
            setTimeout(() => {
                player.isDefending = false;
            }, 1000);
        }
    } else if (playerId === 'player2') {
        if (gameState.keys.arrowUp) player.y = Math.max(50, player.y - player.speed);
        if (gameState.keys.arrowDown) player.y = Math.min(canvas.height - player.height - 50, player.y + player.speed);
        if (gameState.keys.arrowLeft) {
            player.x = Math.max(canvas.width / 2, player.x - player.speed);
            player.direction = 'left';
        }
        if (gameState.keys.arrowRight) {
            player.x = Math.min(canvas.width - player.width, player.x + player.speed);
            player.direction = 'right';
        }
        
        // 攻击
        if (gameState.keys.num1 && player.attackCooldown === 0) {
            player.isAttacking = true;
            player.attackCooldown = 30; // 攻击冷却
            setTimeout(() => {
                player.isAttacking = false;
            }, 200);
        }
        
        // 防御
        if (gameState.keys.num2 && player.defenseCooldown === 0) {
            player.isDefending = true;
            player.defenseCooldown = 60; // 防御冷却
            setTimeout(() => {
                player.isDefending = false;
            }, 1000);
        }
    }
}

// 攻击特效数组
let attackEffects = [];

// 检查攻击碰撞
function checkAttackCollision() {
    const player1 = gameState.players.player1;
    const player2 = gameState.players.player2;
    
    // 玩家1攻击玩家2
    if (player1.isAttacking) {
        const attackRange = player1.direction === 'right' ? 
            { x: player1.x + player1.width, y: player1.y, width: 30, height: player1.height } :
            { x: player1.x - 30, y: player1.y, width: 30, height: player1.height };
        
        if (isColliding(attackRange, player2)) {
            if (!player2.isDefending) {
                player2.health = Math.max(0, player2.health - player1.attack);
                updateHealthBars();
                // 添加击中特效
                addHitEffect(player2.x, player2.y, '#ff0000');
            } else {
                // 添加防御特效
                addDefenseEffect(player2.x, player2.y);
            }
        }
    }
    
    // 玩家2攻击玩家1
    if (player2.isAttacking) {
        const attackRange = player2.direction === 'right' ? 
            { x: player2.x + player2.width, y: player2.y, width: 30, height: player2.height } :
            { x: player2.x - 30, y: player2.y, width: 30, height: player2.height };
        
        if (isColliding(attackRange, player1)) {
            if (!player1.isDefending) {
                player1.health = Math.max(0, player1.health - player2.attack);
                updateHealthBars();
                // 添加击中特效
                addHitEffect(player1.x, player1.y, '#0000ff');
            } else {
                // 添加防御特效
                addDefenseEffect(player1.x, player1.y);
            }
        }
    }
    
    // 更新攻击特效
    updateAttackEffects();
}

// 添加击中特效
function addHitEffect(x, y, color) {
    for (let i = 0; i < 8; i++) {
        attackEffects.push({
            x: x + 20 + (Math.random() - 0.5) * 40,
            y: y + 30 + (Math.random() - 0.5) * 40,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4,
            life: 10,
            color: color
        });
    }
}

// 添加防御特效
function addDefenseEffect(x, y) {
    for (let i = 0; i < 12; i++) {
        attackEffects.push({
            x: x + 20 + Math.cos((Math.PI * 2 / 12) * i) * 30,
            y: y + 30 + Math.sin((Math.PI * 2 / 12) * i) * 30,
            dx: Math.cos((Math.PI * 2 / 12) * i) * 3,
            dy: Math.sin((Math.PI * 2 / 12) * i) * 3,
            life: 8,
            color: '#ffffff'
        });
    }
}

// 更新攻击特效
function updateAttackEffects() {
    attackEffects = attackEffects.filter(effect => {
        effect.x += effect.dx;
        effect.y += effect.dy;
        effect.life--;
        return effect.life > 0;
    });
}

// 绘制攻击特效
function drawAttackEffects() {
    attackEffects.forEach(effect => {
        ctx.fillStyle = effect.color;
        ctx.fillRect(effect.x, effect.y, 3, 3);
    });
}

// 碰撞检测
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 绘制玩家
function drawPlayers() {
    drawPlayer(gameState.players.player1, '#ff0000');
    drawPlayer(gameState.players.player2, '#0000ff');
}

// 绘制单个玩家
function drawPlayer(player, color) {
    // 保存当前状态
    ctx.save();
    
    // 绘制机甲主体
    ctx.fillStyle = color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // 绘制机甲细节 - 主体纹理
    ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
    ctx.fillRect(player.x + 5, player.y + 5, 30, 10);
    ctx.fillRect(player.x + 5, player.y + 25, 30, 10);
    ctx.fillRect(player.x + 5, player.y + 45, 30, 10);
    
    // 绘制机甲头部
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + 10, player.y - 15, 20, 15);
    
    // 绘制机甲眼睛
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(player.x + 12, player.y - 12, 6, 6);
    ctx.fillRect(player.x + 22, player.y - 12, 6, 6);
    
    // 绘制机甲天线
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(player.x + 20, player.y - 15);
    ctx.lineTo(player.x + 20, player.y - 25);
    ctx.stroke();
    
    // 绘制机甲手臂
    if (player.direction === 'right') {
        // 右臂
        if (player.isAttacking) {
            // 攻击动画
            ctx.fillStyle = color;
            ctx.fillRect(player.x + player.width, player.y + 10, 20, 10);
            // 手臂细节
            ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
            ctx.fillRect(player.x + player.width + 5, player.y + 12, 10, 6);
            // 攻击特效
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(player.x + player.width + 20, player.y + 10, 5, 10);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(player.x + player.width, player.y + 15, 15, 10);
            // 手臂细节
            ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
            ctx.fillRect(player.x + player.width + 2, player.y + 17, 11, 6);
        }
        // 左臂
        ctx.fillStyle = color;
        ctx.fillRect(player.x - 15, player.y + 15, 15, 10);
        // 手臂细节
        ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
        ctx.fillRect(player.x - 13, player.y + 17, 11, 6);
    } else {
        // 左臂
        if (player.isAttacking) {
            // 攻击动画
            ctx.fillStyle = color;
            ctx.fillRect(player.x - 20, player.y + 10, 20, 10);
            // 手臂细节
            ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
            ctx.fillRect(player.x - 15, player.y + 12, 10, 6);
            // 攻击特效
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(player.x - 25, player.y + 10, 5, 10);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(player.x - 15, player.y + 15, 15, 10);
            // 手臂细节
            ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
            ctx.fillRect(player.x - 13, player.y + 17, 11, 6);
        }
        // 右臂
        ctx.fillStyle = color;
        ctx.fillRect(player.x + player.width, player.y + 15, 15, 10);
        // 手臂细节
        ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
        ctx.fillRect(player.x + player.width + 2, player.y + 17, 11, 6);
    }
    
    // 绘制机甲腿部
    ctx.fillStyle = color;
    ctx.fillRect(player.x + 10, player.y + player.height, 10, 15);
    ctx.fillRect(player.x + 20, player.y + player.height, 10, 15);
    
    // 腿部细节
    ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
    ctx.fillRect(player.x + 12, player.y + player.height + 2, 6, 11);
    ctx.fillRect(player.x + 22, player.y + player.height + 2, 6, 11);
    
    // 绘制机甲 feet
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + 8, player.y + player.height + 15, 14, 5);
    ctx.fillRect(player.x + 18, player.y + player.height + 15, 14, 5);
    
    // 绘制防御盾
    if (player.isDefending) {
        // 防御盾动画
        const shieldSize = 10 + Math.sin(Date.now() / 100) * 2;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x - shieldSize/2, player.y - shieldSize/2, player.width + shieldSize, player.height + shieldSize);
        
        // 防御动画效果
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(player.x - shieldSize/2, player.y - shieldSize/2, player.width + shieldSize, player.height + shieldSize);
        
        // 防御粒子效果
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const x = player.x + player.width/2 + Math.cos(angle) * (player.width/2 + shieldSize);
            const y = player.y + player.height/2 + Math.sin(angle) * (player.height/2 + shieldSize);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, y, 2, 2);
        }
    }
    
    // 恢复状态
    ctx.restore();
}

// 更新血量条
function updateHealthBars() {
    healthBars.player1.style.width = `${gameState.players.player1.health}%`;
    healthBars.player2.style.width = `${gameState.players.player2.health}%`;
}

// 检查游戏结束条件
function checkGameEnd() {
    const player1 = gameState.players.player1;
    const player2 = gameState.players.player2;
    
    if (player1.health <= 0) {
        endGame('玩家2 获胜！');
    } else if (player2.health <= 0) {
        endGame('玩家1 获胜！');
    }
}

// 结束游戏
function endGame(result) {
    clearInterval(gameState.gameLoop);
    gameState.gameLoop = null;
    
    // 显示结果
    resultTitle.textContent = result;
    
    // 切换到结束页面
    switchPage('end');
}

// 切换页面
function switchPage(page) {
    // 隐藏所有页面
    Object.values(pages).forEach(p => p.classList.add('hidden'));
    
    // 显示目标页面
    pages[page].classList.remove('hidden');
    
    // 更新当前页面
    gameState.currentPage = page;
    
    // 如果切换到游戏页面，初始化游戏
    if (page === 'game') {
        initGame();
    }
}

// 键盘事件监听
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        // 玩家1控制
        case 'w':
            gameState.keys.w = true;
            break;
        case 'a':
            gameState.keys.a = true;
            break;
        case 's':
            gameState.keys.s = true;
            break;
        case 'd':
            gameState.keys.d = true;
            break;
        case 'j':
            gameState.keys.j = true;
            break;
        case 'k':
            gameState.keys.k = true;
            break;
        // 玩家2控制
        case 'ArrowUp':
            gameState.keys.arrowUp = true;
            break;
        case 'ArrowLeft':
            gameState.keys.arrowLeft = true;
            break;
        case 'ArrowDown':
            gameState.keys.arrowDown = true;
            break;
        case 'ArrowRight':
            gameState.keys.arrowRight = true;
            break;
        case '1':
            gameState.keys.num1 = true;
            break;
        case '2':
            gameState.keys.num2 = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        // 玩家1控制
        case 'w':
            gameState.keys.w = false;
            break;
        case 'a':
            gameState.keys.a = false;
            break;
        case 's':
            gameState.keys.s = false;
            break;
        case 'd':
            gameState.keys.d = false;
            break;
        case 'j':
            gameState.keys.j = false;
            break;
        case 'k':
            gameState.keys.k = false;
            break;
        // 玩家2控制
        case 'ArrowUp':
            gameState.keys.arrowUp = false;
            break;
        case 'ArrowLeft':
            gameState.keys.arrowLeft = false;
            break;
        case 'ArrowDown':
            gameState.keys.arrowDown = false;
            break;
        case 'ArrowRight':
            gameState.keys.arrowRight = false;
            break;
        case '1':
            gameState.keys.num1 = false;
            break;
        case '2':
            gameState.keys.num2 = false;
            break;
    }
});

// 移动设备触摸控制
// 玩家1控制
const p1Dpad = document.querySelectorAll('.dpad.player1 .dpad-btn');
const p1ActionBtns = document.querySelectorAll('.action-buttons.player1 .action-btn');

p1Dpad.forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        switch (btn.textContent) {
            case 'W':
                gameState.keys.w = true;
                break;
            case 'A':
                gameState.keys.a = true;
                break;
            case 'S':
                gameState.keys.s = true;
                break;
            case 'D':
                gameState.keys.d = true;
                break;
        }
    });
    
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        switch (btn.textContent) {
            case 'W':
                gameState.keys.w = false;
                break;
            case 'A':
                gameState.keys.a = false;
                break;
            case 'S':
                gameState.keys.s = false;
                break;
            case 'D':
                gameState.keys.d = false;
                break;
        }
    });
});

p1ActionBtns.forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (btn.textContent === 'J') {
            gameState.keys.j = true;
        } else if (btn.textContent === 'K') {
            gameState.keys.k = true;
        }
    });
    
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (btn.textContent === 'J') {
            gameState.keys.j = false;
        } else if (btn.textContent === 'K') {
            gameState.keys.k = false;
        }
    });
});

// 玩家2控制
const p2Dpad = document.querySelectorAll('.dpad.player2 .dpad-btn');
const p2ActionBtns = document.querySelectorAll('.action-buttons.player2 .action-btn');

p2Dpad.forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        switch (btn.textContent) {
            case '↑':
                gameState.keys.arrowUp = true;
                break;
            case '←':
                gameState.keys.arrowLeft = true;
                break;
            case '↓':
                gameState.keys.arrowDown = true;
                break;
            case '→':
                gameState.keys.arrowRight = true;
                break;
        }
    });
    
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        switch (btn.textContent) {
            case '↑':
                gameState.keys.arrowUp = false;
                break;
            case '←':
                gameState.keys.arrowLeft = false;
                break;
            case '↓':
                gameState.keys.arrowDown = false;
                break;
            case '→':
                gameState.keys.arrowRight = false;
                break;
        }
    });
});

p2ActionBtns.forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (btn.textContent === '1') {
            gameState.keys.num1 = true;
        } else if (btn.textContent === '2') {
            gameState.keys.num2 = true;
        }
    });
    
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (btn.textContent === '1') {
            gameState.keys.num1 = false;
        } else if (btn.textContent === '2') {
            gameState.keys.num2 = false;
        }
    });
});

// 按钮事件监听
buttons.start.addEventListener('click', () => {
    switchPage('game');
});

buttons.restart.addEventListener('click', () => {
    switchPage('game');
});

// 初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    // 初始显示主页
    switchPage('home');
});