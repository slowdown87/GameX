// 游戏核心模块
import config from '../config/config.js';
import PerformanceTest from '../utils/PerformanceTest.js';
import ResourceManager from '../resources/ResourceManager.js';
import gameResources from '../resources/resources.js';

class Game {
    constructor() {
        this.state = {
            currentPage: 'home',
            gameTime: config.game.gameTime,
            gameTimer: null,
            isGameStarted: false,
            isGamePaused: false,
            isLoading: true,
            players: {
                player1: null,
                player2: null
            },
            keys: {
                // 玩家1控制
                w: false,
                a: false,
                s: false,
                d: false,
                j: false, // 轻攻击
                k: false, // 防御
                l: false, // 重攻击
                u: false, // 特殊技能
                i: false, // 必杀技
                // 玩家2控制
                ArrowUp: false,
                ArrowLeft: false,
                ArrowDown: false,
                ArrowRight: false,
                '1': false, // 轻攻击
                '2': false, // 防御
                '3': false, // 重攻击
                '7': false, // 特殊技能
                '8': false // 必杀技
            },
            attackEffects: [],
            damageNumbers: [],
            gameLoop: null,
            currentScene: 'default'
        };
        
        // 工具实例
        this.resourceManager = new ResourceManager();
        this.performanceTest = null;
        
        this.canvas = null;
        this.ctx = null;
        this.pages = {
            home: null,
            game: null,
            end: null
        };
        this.buttons = {
            start: null,
            restart: null
        };
        this.healthBars = {
            player1: null,
            player2: null
        };
        this.energyBars = {
            player1: null,
            player2: null
        };
        this.comboDisplay = {
            player1: null,
            player2: null
        };
        this.timerDisplay = null;
        this.resultTitle = null;
        this.loadingScreen = null;
    }
    
    // 初始化游戏
    init() {
        // 创建加载屏幕
        this.createLoadingScreen();
        
        // 获取DOM元素
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.pages.home = document.getElementById('home');
        this.pages.game = document.getElementById('game');
        this.pages.end = document.getElementById('end');
        
        this.buttons.start = document.getElementById('start-btn');
        this.buttons.restart = document.getElementById('restart-btn');
        
        this.healthBars.player1 = document.getElementById('player1-health');
        this.healthBars.player2 = document.getElementById('player2-health');
        
        this.resultTitle = document.getElementById('result');
        
        // 初始化画布大小
        this.canvas.width = config.game.width;
        this.canvas.height = config.game.height;
        
        // 初始化性能测试工具
        this.performanceTest = new PerformanceTest(this.canvas);
        
        // 加载资源
        this.loadResources();
    }
    
    // 创建加载屏幕
    createLoadingScreen() {
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'loading-screen';
        this.loadingScreen.style.position = 'fixed';
        this.loadingScreen.style.top = '0';
        this.loadingScreen.style.left = '0';
        this.loadingScreen.style.width = '100%';
        this.loadingScreen.style.height = '100%';
        this.loadingScreen.style.backgroundColor = '#1a2b3c';
        this.loadingScreen.style.display = 'flex';
        this.loadingScreen.style.flexDirection = 'column';
        this.loadingScreen.style.justifyContent = 'center';
        this.loadingScreen.style.alignItems = 'center';
        this.loadingScreen.style.zIndex = '9999';
        
        const loadingText = document.createElement('h2');
        loadingText.className = 'loading-text';
        loadingText.style.color = '#ff7f00';
        loadingText.style.fontFamily = 'Press Start 2P';
        loadingText.style.fontSize = '1.5rem';
        loadingText.textContent = '加载中...';
        
        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading-bar';
        loadingBar.style.width = '300px';
        loadingBar.style.height = '20px';
        loadingBar.style.backgroundColor = '#333333';
        loadingBar.style.border = '2px solid #000000';
        loadingBar.style.marginTop = '20px';
        
        const loadingFill = document.createElement('div');
        loadingFill.className = 'loading-fill';
        loadingFill.style.width = '0%';
        loadingFill.style.height = '100%';
        loadingFill.style.backgroundColor = '#ff7f00';
        loadingFill.style.transition = 'width 0.3s ease';
        
        loadingBar.appendChild(loadingFill);
        this.loadingScreen.appendChild(loadingText);
        this.loadingScreen.appendChild(loadingBar);
        
        document.body.appendChild(this.loadingScreen);
    }
    
    // 加载资源
    loadResources() {
        // 开始加载资源
        this.resourceManager.loadResources(gameResources, () => {
            // 资源加载完成
            this.state.isLoading = false;
            
            // 隐藏加载屏幕
            if (this.loadingScreen) {
                this.loadingScreen.style.display = 'none';
            }
            
            // 运行性能测试
            this.performanceTest.startTest();
            
            // 添加事件监听
            this.addEventListeners();
            
            // 初始显示主页
            this.switchPage('home');
        });
    }
    
    // 添加事件监听
    addEventListeners() {
        // 键盘事件
        window.addEventListener('keydown', (e) => {
            if (this.state.keys.hasOwnProperty(e.key)) {
                this.state.keys[e.key] = true;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (this.state.keys.hasOwnProperty(e.key)) {
                this.state.keys[e.key] = false;
            }
        });
        
        // 按钮事件
        this.buttons.start.addEventListener('click', () => {
            this.switchPage('game');
        });
        
        this.buttons.restart.addEventListener('click', () => {
            this.switchPage('game');
        });
    }
    
    // 切换页面
    switchPage(page) {
        // 隐藏所有页面
        Object.values(this.pages).forEach(p => p.classList.add('hidden'));
        
        // 显示目标页面
        this.pages[page].classList.remove('hidden');
        
        // 更新当前页面
        this.state.currentPage = page;
        
        // 如果切换到游戏页面，初始化游戏
        if (page === 'game') {
            this.startGame();
        }
    }
    
    // 开始游戏
    startGame() {
        // 初始化玩家
        this.initPlayers();
        
        // 清空特效
        this.state.attackEffects = [];
        this.state.damageNumbers = [];
        
        // 更新UI
        this.updateHealthBars();
        this.updateEnergyBars();
        this.updateComboDisplay();
        this.updateTimerDisplay();
        
        // 开始游戏时间
        this.startGameTimer();
        
        // 开始游戏循环
        if (this.state.gameLoop) {
            clearInterval(this.state.gameLoop);
        }
        
        this.state.gameLoop = setInterval(() => this.gameLoop(), 1000 / config.game.fps);
    }
    
    // 初始化玩家
    initPlayers() {
        const defaultPlayer = config.player.default;
        
        this.state.players.player1 = {
            id: 'player1',
            name: config.player.characters.redMech.name,
            x: 100,
            y: 250,
            width: defaultPlayer.width,
            height: defaultPlayer.height,
            health: defaultPlayer.health,
            maxHealth: defaultPlayer.health,
            energy: defaultPlayer.energy,
            maxEnergy: defaultPlayer.maxEnergy,
            attack: config.player.characters.redMech.attack,
            defense: config.player.characters.redMech.defense,
            speed: config.player.characters.redMech.speed,
            direction: 'right',
            state: 'idle', // idle, moving, attacking, defending, hit, dead
            attackType: null, // light, heavy, special, ultimate
            isAttacking: false,
            isDefending: false,
            isHit: false,
            attackCooldown: 0,
            defenseCooldown: 0,
            comboCount: 0,
            comboTimer: 0,
            comboDamageBonus: 1.0,
            animationFrame: 0,
            hitEffect: null
        };
        
        this.state.players.player2 = {
            id: 'player2',
            name: config.player.characters.blueMech.name,
            x: 660,
            y: 250,
            width: defaultPlayer.width,
            height: defaultPlayer.height,
            health: defaultPlayer.health,
            maxHealth: defaultPlayer.health,
            energy: defaultPlayer.energy,
            maxEnergy: defaultPlayer.maxEnergy,
            attack: config.player.characters.blueMech.attack,
            defense: config.player.characters.blueMech.defense,
            speed: config.player.characters.blueMech.speed,
            direction: 'left',
            state: 'idle',
            attackType: null,
            isAttacking: false,
            isDefending: false,
            isHit: false,
            attackCooldown: 0,
            defenseCooldown: 0,
            comboCount: 0,
            comboTimer: 0,
            comboDamageBonus: 1.0,
            animationFrame: 0,
            hitEffect: null
        };
    }
    
    // 游戏主循环
    gameLoop() {
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景
        this.drawBackground();
        
        // 更新游戏状态
        this.updateGame();
        
        // 绘制玩家
        this.drawPlayers();
        
        // 绘制攻击特效
        this.drawAttackEffects();
        
        // 绘制伤害数字
        this.drawDamageNumbers();
        
        // 绘制战斗UI
        this.drawBattleUI();
        
        // 检查游戏结束条件
        this.checkGameEnd();
    }
    
    // 更新游戏状态
    updateGame() {
        if (!this.state.isGameStarted || this.state.isGamePaused) {
            return;
        }
        
        // 更新玩家状态
        this.updatePlayers();
        
        // 更新连击系统
        this.updateComboSystem();
        
        // 更新攻击特效
        this.updateAttackEffects();
        
        // 更新伤害数字
        this.updateDamageNumbers();
    }
    
    // 更新玩家状态
    updatePlayers() {
        const player1 = this.state.players.player1;
        const player2 = this.state.players.player2;
        
        // 更新玩家1
        this.updatePlayer(player1, 'player1');
        
        // 更新玩家2
        this.updatePlayer(player2, 'player2');
        
        // 检查攻击碰撞
        this.checkAttackCollision();
        
        // 减少冷却时间
        if (player1.attackCooldown > 0) player1.attackCooldown--;
        if (player1.defenseCooldown > 0) player1.defenseCooldown--;
        if (player2.attackCooldown > 0) player2.attackCooldown--;
        if (player2.defenseCooldown > 0) player2.defenseCooldown--;
        
        // 更新动画帧
        player1.animationFrame++;
        player2.animationFrame++;
    }
    
    // 更新单个玩家
    updatePlayer(player, playerId) {
        // 移动
        if (playerId === 'player1') {
            if (this.state.keys.w) player.y = Math.max(50, player.y - player.speed);
            if (this.state.keys.s) player.y = Math.min(this.canvas.height - player.height - 50, player.y + player.speed);
            if (this.state.keys.a) {
                player.x = Math.max(0, player.x - player.speed);
                player.direction = 'left';
            }
            if (this.state.keys.d) {
                player.x = Math.min(this.canvas.width / 2 - player.width, player.x + player.speed);
                player.direction = 'right';
            }
            
            // 轻攻击
            if (this.state.keys.j && player.attackCooldown === 0) {
                this.performAttack(player, 'light');
            }
            
            // 重攻击
            if (this.state.keys.l && player.attackCooldown === 0) {
                this.performAttack(player, 'heavy');
            }
            
            // 防御
            if (this.state.keys.k && player.defenseCooldown === 0) {
                player.isDefending = true;
                player.defenseCooldown = 60; // 防御冷却
                setTimeout(() => {
                    player.isDefending = false;
                }, 1000);
            }
            
            // 特殊技能
            if (this.state.keys.u && player.attackCooldown === 0 && player.energy >= config.skills.specialSkill.energyCost) {
                this.performAttack(player, 'special');
            }
            
            // 必杀技
            if (this.state.keys.i && player.attackCooldown === 0 && player.energy >= config.skills.ultimateSkill.energyCost) {
                this.performAttack(player, 'ultimate');
            }
        } else if (playerId === 'player2') {
            if (this.state.keys.ArrowUp) player.y = Math.max(50, player.y - player.speed);
            if (this.state.keys.ArrowDown) player.y = Math.min(this.canvas.height - player.height - 50, player.y + player.speed);
            if (this.state.keys.ArrowLeft) {
                player.x = Math.max(this.canvas.width / 2, player.x - player.speed);
                player.direction = 'left';
            }
            if (this.state.keys.ArrowRight) {
                player.x = Math.min(this.canvas.width - player.width, player.x + player.speed);
                player.direction = 'right';
            }
            
            // 轻攻击
            if (this.state.keys['1'] && player.attackCooldown === 0) {
                this.performAttack(player, 'light');
            }
            
            // 重攻击
            if (this.state.keys['3'] && player.attackCooldown === 0) {
                this.performAttack(player, 'heavy');
            }
            
            // 防御
            if (this.state.keys['2'] && player.defenseCooldown === 0) {
                player.isDefending = true;
                player.defenseCooldown = 60; // 防御冷却
                setTimeout(() => {
                    player.isDefending = false;
                }, 1000);
            }
            
            // 特殊技能
            if (this.state.keys['7'] && player.attackCooldown === 0 && player.energy >= config.skills.specialSkill.energyCost) {
                this.performAttack(player, 'special');
            }
            
            // 必杀技
            if (this.state.keys['8'] && player.attackCooldown === 0 && player.energy >= config.skills.ultimateSkill.energyCost) {
                this.performAttack(player, 'ultimate');
            }
        }
    }
    
    // 执行攻击
    performAttack(player, attackType) {
        player.isAttacking = true;
        player.attackType = attackType;
        
        // 根据攻击类型设置冷却时间
        switch (attackType) {
            case 'light':
                player.attackCooldown = config.skills.lightAttack.cooldown;
                break;
            case 'heavy':
                player.attackCooldown = config.skills.heavyAttack.cooldown;
                break;
            case 'special':
                player.attackCooldown = config.skills.specialSkill.cooldown;
                player.energy -= config.skills.specialSkill.energyCost;
                break;
            case 'ultimate':
                player.attackCooldown = config.skills.ultimateSkill.cooldown;
                player.energy -= config.skills.ultimateSkill.energyCost;
                break;
        }
        
        // 攻击动画结束
        setTimeout(() => {
            player.isAttacking = false;
            player.attackType = null;
        }, 200);
    }
    
    // 检查攻击碰撞
    checkAttackCollision() {
        const player1 = this.state.players.player1;
        const player2 = this.state.players.player2;
        
        // 玩家1攻击玩家2
        if (player1.isAttacking) {
            const attackRange = player1.direction === 'right' ? 
                { x: player1.x + player1.width, y: player1.y, width: 30, height: player1.height } :
                { x: player1.x - 30, y: player1.y, width: 30, height: player1.height };
            
            if (this.isColliding(attackRange, player2)) {
                if (!player2.isDefending) {
                    // 计算伤害
                    let damage = 0;
                    switch (player1.attackType) {
                        case 'light':
                            damage = config.skills.lightAttack.damage * player1.attack / 10 * player1.comboDamageBonus;
                            player1.energy += config.skills.lightAttack.energyGain;
                            break;
                        case 'heavy':
                            damage = config.skills.heavyAttack.damage * player1.attack / 10 * player1.comboDamageBonus;
                            player1.energy += config.skills.heavyAttack.energyGain;
                            break;
                        case 'special':
                            damage = config.skills.specialSkill.damage * player1.attack / 10 * player1.comboDamageBonus;
                            break;
                        case 'ultimate':
                            damage = config.skills.ultimateSkill.damage * player1.attack / 10 * player1.comboDamageBonus;
                            break;
                    }
                    
                    // 应用伤害
                    player2.health = Math.max(0, player2.health - damage);
                    this.updateHealthBars();
                    
                    // 添加伤害数字
                    this.addDamageNumber(player2.x, player2.y, Math.floor(damage), '#ff0000');
                    
                    // 添加击中特效
                    this.addHitEffect(player2.x, player2.y, '#ff0000');
                    
                    // 更新连击
                    this.updateCombo(player1);
                } else {
                    // 添加防御特效
                    this.addDefenseEffect(player2.x, player2.y);
                }
            }
        }
        
        // 玩家2攻击玩家1
        if (player2.isAttacking) {
            const attackRange = player2.direction === 'right' ? 
                { x: player2.x + player2.width, y: player2.y, width: 30, height: player2.height } :
                { x: player2.x - 30, y: player2.y, width: 30, height: player2.height };
            
            if (this.isColliding(attackRange, player1)) {
                if (!player1.isDefending) {
                    // 计算伤害
                    let damage = 0;
                    switch (player2.attackType) {
                        case 'light':
                            damage = config.skills.lightAttack.damage * player2.attack / 10 * player2.comboDamageBonus;
                            player2.energy += config.skills.lightAttack.energyGain;
                            break;
                        case 'heavy':
                            damage = config.skills.heavyAttack.damage * player2.attack / 10 * player2.comboDamageBonus;
                            player2.energy += config.skills.heavyAttack.energyGain;
                            break;
                        case 'special':
                            damage = config.skills.specialSkill.damage * player2.attack / 10 * player2.comboDamageBonus;
                            break;
                        case 'ultimate':
                            damage = config.skills.ultimateSkill.damage * player2.attack / 10 * player2.comboDamageBonus;
                            break;
                    }
                    
                    // 应用伤害
                    player1.health = Math.max(0, player1.health - damage);
                    this.updateHealthBars();
                    
                    // 添加伤害数字
                    this.addDamageNumber(player1.x, player1.y, Math.floor(damage), '#0000ff');
                    
                    // 添加击中特效
                    this.addHitEffect(player1.x, player1.y, '#0000ff');
                    
                    // 更新连击
                    this.updateCombo(player2);
                } else {
                    // 添加防御特效
                    this.addDefenseEffect(player1.x, player1.y);
                }
            }
        }
    }
    
    // 碰撞检测
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    // 更新连击系统
    updateComboSystem() {
        const player1 = this.state.players.player1;
        const player2 = this.state.players.player2;
        
        // 更新玩家1连击
        if (player1.comboTimer > 0) {
            player1.comboTimer--;
            if (player1.comboTimer === 0) {
                player1.comboCount = 0;
                player1.comboDamageBonus = 1.0;
                this.updateComboDisplay();
            }
        }
        
        // 更新玩家2连击
        if (player2.comboTimer > 0) {
            player2.comboTimer--;
            if (player2.comboTimer === 0) {
                player2.comboCount = 0;
                player2.comboDamageBonus = 1.0;
                this.updateComboDisplay();
            }
        }
    }
    
    // 更新连击
    updateCombo(player) {
        player.comboCount++;
        player.comboTimer = config.combo.timeWindow / (1000 / config.game.fps); // 转换为游戏帧数
        player.comboDamageBonus = Math.min(1 + (player.comboCount - 1) * config.combo.damageBonus, 1 + config.combo.maxComboBonus);
        this.updateComboDisplay();
    }
    
    // 添加击中特效
    addHitEffect(x, y, color) {
        for (let i = 0; i < config.effects.hit.particleCount; i++) {
            this.state.attackEffects.push({
                x: x + 20 + (Math.random() - 0.5) * 40,
                y: y + 30 + (Math.random() - 0.5) * 40,
                dx: (Math.random() - 0.5) * 4,
                dy: (Math.random() - 0.5) * 4,
                life: config.effects.hit.duration,
                color: color
            });
        }
    }
    
    // 添加防御特效
    addDefenseEffect(x, y) {
        for (let i = 0; i < config.effects.defense.particleCount; i++) {
            this.state.attackEffects.push({
                x: x + 20 + Math.cos((Math.PI * 2 / config.effects.defense.particleCount) * i) * 30,
                y: y + 30 + Math.sin((Math.PI * 2 / config.effects.defense.particleCount) * i) * 30,
                dx: Math.cos((Math.PI * 2 / config.effects.defense.particleCount) * i) * 3,
                dy: Math.sin((Math.PI * 2 / config.effects.defense.particleCount) * i) * 3,
                life: config.effects.defense.duration,
                color: '#ffffff'
            });
        }
    }
    
    // 添加伤害数字
    addDamageNumber(x, y, damage, color) {
        this.state.damageNumbers.push({
            x: x + 20,
            y: y - 10,
            damage: damage,
            color: color,
            life: 30,
            vy: -2
        });
    }
    
    // 更新攻击特效
    updateAttackEffects() {
        this.state.attackEffects = this.state.attackEffects.filter(effect => {
            effect.x += effect.dx;
            effect.y += effect.dy;
            effect.life--;
            return effect.life > 0;
        });
    }
    
    // 更新伤害数字
    updateDamageNumbers() {
        this.state.damageNumbers = this.state.damageNumbers.filter(number => {
            number.y += number.vy;
            number.vy += 0.1; // 重力效果
            number.life--;
            return number.life > 0;
        });
    }
    
    // 开始游戏时间
    startGameTimer() {
        if (this.state.gameTimer) {
            clearInterval(this.state.gameTimer);
        }
        
        this.state.gameTime = config.game.gameTime;
        this.updateTimerDisplay();
        
        this.state.gameTimer = setInterval(() => {
            this.state.gameTime--;
            this.updateTimerDisplay();
            
            if (this.state.gameTime <= 0) {
                clearInterval(this.state.gameTimer);
                this.endGameByTime();
            }
        }, 1000);
    }
    
    // 绘制背景
    drawBackground() {
        const scene = config.scenes[this.state.currentScene];
        
        // 绘制天空渐变
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height - 50);
        gradient.addColorStop(0, scene.background.sky);
        gradient.addColorStop(1, scene.background.sky + '80');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height - 50);
        
        // 绘制云朵
        this.drawClouds();
        
        // 绘制远处山脉
        this.drawMountains();
        
        // 绘制地面
        this.ctx.fillStyle = scene.background.ground;
        this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
        
        // 绘制地面纹理
        this.ctx.fillStyle = scene.background.ground + '80';
        for (let i = 0; i < this.canvas.width; i += 20) {
            for (let j = this.canvas.height - 50; j < this.canvas.height; j += 20) {
                this.ctx.fillRect(i, j, 10, 10);
            }
        }
        
        // 绘制地面细节
        this.drawGroundDetails();
        
        // 绘制场景元素
        this.drawSceneElements();
    }
    
    // 绘制云朵
    drawClouds() {
        this.ctx.fillStyle = '#ecf0f1';
        // 云朵1
        this.ctx.fillRect(50, 50, 40, 20);
        this.ctx.fillRect(70, 40, 40, 20);
        this.ctx.fillRect(90, 50, 40, 20);
        // 云朵2
        this.ctx.fillRect(200, 80, 30, 15);
        this.ctx.fillRect(215, 70, 30, 15);
        this.ctx.fillRect(230, 80, 30, 15);
        // 云朵3
        this.ctx.fillRect(500, 60, 45, 25);
        this.ctx.fillRect(520, 50, 45, 25);
        this.ctx.fillRect(540, 60, 45, 25);
        // 云朵4
        this.ctx.fillRect(650, 90, 35, 18);
        this.ctx.fillRect(665, 80, 35, 18);
        this.ctx.fillRect(680, 90, 35, 18);
    }
    
    // 绘制山脉
    drawMountains() {
        // 远处山脉
        this.ctx.fillStyle = '#34495e';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - 100);
        this.ctx.lineTo(150, this.canvas.height - 200);
        this.ctx.lineTo(300, this.canvas.height - 150);
        this.ctx.lineTo(450, this.canvas.height - 220);
        this.ctx.lineTo(600, this.canvas.height - 180);
        this.ctx.lineTo(750, this.canvas.height - 210);
        this.ctx.lineTo(800, this.canvas.height - 100);
        this.ctx.closePath();
        this.ctx.fill();
        
        // 近处山脉
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - 80);
        this.ctx.lineTo(100, this.canvas.height - 150);
        this.ctx.lineTo(250, this.canvas.height - 120);
        this.ctx.lineTo(400, this.canvas.height - 160);
        this.ctx.lineTo(550, this.canvas.height - 130);
        this.ctx.lineTo(700, this.canvas.height - 170);
        this.ctx.lineTo(800, this.canvas.height - 80);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    // 绘制地面细节
    drawGroundDetails() {
        // 绘制石头
        this.ctx.fillStyle = '#5d6d7e';
        this.ctx.fillRect(50, this.canvas.height - 45, 15, 15);
        this.ctx.fillRect(120, this.canvas.height - 40, 10, 10);
        this.ctx.fillRect(200, this.canvas.height - 48, 18, 18);
        this.ctx.fillRect(280, this.canvas.height - 42, 12, 12);
        this.ctx.fillRect(350, this.canvas.height - 46, 16, 16);
        this.ctx.fillRect(430, this.canvas.height - 41, 11, 11);
        this.ctx.fillRect(500, this.canvas.height - 47, 17, 17);
        this.ctx.fillRect(580, this.canvas.height - 43, 13, 13);
        this.ctx.fillRect(650, this.canvas.height - 49, 19, 19);
        this.ctx.fillRect(720, this.canvas.height - 44, 14, 14);
        
        // 绘制草丛
        this.ctx.fillStyle = '#27ae60';
        for (let i = 0; i < this.canvas.width; i += 30) {
            this.ctx.fillRect(i, this.canvas.height - 50, 5, 10);
            this.ctx.fillRect(i + 10, this.canvas.height - 50, 5, 10);
            this.ctx.fillRect(i + 20, this.canvas.height - 50, 5, 10);
        }
    }
    
    // 绘制场景元素
    drawSceneElements() {
        const elements = config.scenes[this.state.currentScene].elements;
        
        elements.forEach(element => {
            switch (element.type) {
                case 'building':
                    this.ctx.fillStyle = '#7f8c8d';
                    this.ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
                case 'machine':
                    this.ctx.fillStyle = '#95a5a6';
                    this.ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
                case 'pipe':
                    this.ctx.fillStyle = '#7f8c8d';
                    this.ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
                case 'container':
                    this.ctx.fillStyle = '#e74c3c';
                    this.ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
                case 'rock':
                    this.ctx.fillStyle = '#7f8c8d';
                    this.ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
                case 'cactus':
                    this.ctx.fillStyle = '#27ae60';
                    this.ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
                case 'debris':
                    this.ctx.fillStyle = '#7f8c8d';
                    this.ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
            }
        });
    }
    
    // 绘制玩家
    drawPlayers() {
        this.drawPlayer(this.state.players.player1, config.player.characters.redMech.color);
        this.drawPlayer(this.state.players.player2, config.player.characters.blueMech.color);
    }
    
    // 绘制单个玩家
    drawPlayer(player, color) {
        // 保存当前状态
        this.ctx.save();
        
        // 绘制机甲主体
        this.ctx.fillStyle = color;
        this.ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // 绘制机甲细节 - 主体纹理
        this.ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
        this.ctx.fillRect(player.x + 5, player.y + 5, 30, 10);
        this.ctx.fillRect(player.x + 5, player.y + 25, 30, 10);
        this.ctx.fillRect(player.x + 5, player.y + 45, 30, 10);
        
        // 绘制机甲头部
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(player.x + 10, player.y - 15, 20, 15);
        
        // 绘制机甲眼睛
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(player.x + 12, player.y - 12, 6, 6);
        this.ctx.fillRect(player.x + 22, player.y - 12, 6, 6);
        
        // 绘制机甲天线
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(player.x + 20, player.y - 15);
        this.ctx.lineTo(player.x + 20, player.y - 25);
        this.ctx.stroke();
        
        // 绘制机甲手臂
        if (player.direction === 'right') {
            // 右臂
            if (player.isAttacking) {
                // 攻击动画
                this.ctx.fillStyle = color;
                this.ctx.fillRect(player.x + player.width, player.y + 10, 20, 10);
                // 手臂细节
                this.ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
                this.ctx.fillRect(player.x + player.width + 5, player.y + 12, 10, 6);
                // 攻击特效
                this.ctx.fillStyle = '#ffcc00';
                this.ctx.fillRect(player.x + player.width + 20, player.y + 10, 5, 10);
            } else {
                this.ctx.fillStyle = color;
                this.ctx.fillRect(player.x + player.width, player.y + 15, 15, 10);
                // 手臂细节
                this.ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
                this.ctx.fillRect(player.x + player.width + 2, player.y + 17, 11, 6);
            }
            // 左臂
            this.ctx.fillStyle = color;
            this.ctx.fillRect(player.x - 15, player.y + 15, 15, 10);
            // 手臂细节
            this.ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
            this.ctx.fillRect(player.x - 13, player.y + 17, 11, 6);
        } else {
            // 左臂
            if (player.isAttacking) {
                // 攻击动画
                this.ctx.fillStyle = color;
                this.ctx.fillRect(player.x - 20, player.y + 10, 20, 10);
                // 手臂细节
                this.ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
                this.ctx.fillRect(player.x - 15, player.y + 12, 10, 6);
                // 攻击特效
                this.ctx.fillStyle = '#ffcc00';
                this.ctx.fillRect(player.x - 25, player.y + 10, 5, 10);
            } else {
                this.ctx.fillStyle = color;
                this.ctx.fillRect(player.x - 15, player.y + 15, 15, 10);
                // 手臂细节
                this.ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
                this.ctx.fillRect(player.x - 13, player.y + 17, 11, 6);
            }
            // 右臂
            this.ctx.fillStyle = color;
            this.ctx.fillRect(player.x + player.width, player.y + 15, 15, 10);
            // 手臂细节
            this.ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
            this.ctx.fillRect(player.x + player.width + 2, player.y + 17, 11, 6);
        }
        
        // 绘制机甲腿部
        this.ctx.fillStyle = color;
        this.ctx.fillRect(player.x + 10, player.y + player.height, 10, 15);
        this.ctx.fillRect(player.x + 20, player.y + player.height, 10, 15);
        
        // 腿部细节
        this.ctx.fillStyle = color === '#ff0000' ? '#cc0000' : '#0000cc';
        this.ctx.fillRect(player.x + 12, player.y + player.height + 2, 6, 11);
        this.ctx.fillRect(player.x + 22, player.y + player.height + 2, 6, 11);
        
        // 绘制机甲 feet
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(player.x + 8, player.y + player.height + 15, 14, 5);
        this.ctx.fillRect(player.x + 18, player.y + player.height + 15, 14, 5);
        
        // 绘制防御盾
        if (player.isDefending) {
            // 防御盾动画
            const shieldSize = 10 + Math.sin(Date.now() / 100) * 2;
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(player.x - shieldSize/2, player.y - shieldSize/2, player.width + shieldSize, player.height + shieldSize);
            
            // 防御动画效果
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.fillRect(player.x - shieldSize/2, player.y - shieldSize/2, player.width + shieldSize, player.height + shieldSize);
            
            // 防御粒子效果
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                const x = player.x + player.width/2 + Math.cos(angle) * (player.width/2 + shieldSize);
                const y = player.y + player.height/2 + Math.sin(angle) * (player.height/2 + shieldSize);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(x, y, 2, 2);
            }
        }
        
        // 恢复状态
        this.ctx.restore();
    }
    
    // 绘制攻击特效
    drawAttackEffects() {
        this.state.attackEffects.forEach(effect => {
            this.ctx.fillStyle = effect.color;
            this.ctx.fillRect(effect.x, effect.y, 3, 3);
        });
    }
    
    // 绘制伤害数字
    drawDamageNumbers() {
        this.state.damageNumbers.forEach(number => {
            this.ctx.fillStyle = number.color;
            this.ctx.font = '16px Press Start 2P';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(number.damage, number.x, number.y);
        });
    }
    
    // 绘制战斗UI
    drawBattleUI() {
        // 绘制能量条
        this.drawEnergyBars();
        
        // 绘制连击数
        this.drawComboDisplay();
        
        // 绘制计时器
        this.drawTimerDisplay();
    }
    
    // 绘制能量条
    drawEnergyBars() {
        // 玩家1能量条
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(50, 10, 300, 10);
        this.ctx.fillStyle = '#ffcc00';
        const player1EnergyPercent = this.state.players.player1.energy / this.state.players.player1.maxEnergy;
        this.ctx.fillRect(50, 10, 300 * player1EnergyPercent, 10);
        
        // 玩家2能量条
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(450, 10, 300, 10);
        this.ctx.fillStyle = '#ffcc00';
        const player2EnergyPercent = this.state.players.player2.energy / this.state.players.player2.maxEnergy;
        this.ctx.fillRect(450, 10, 300 * player2EnergyPercent, 10);
    }
    
    // 绘制连击数
    drawComboDisplay() {
        // 玩家1连击数
        if (this.state.players.player1.comboCount > 1) {
            this.ctx.fillStyle = '#ffcc00';
            this.ctx.font = '16px Press Start 2P';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`COMBO: ${this.state.players.player1.comboCount}`, 50, 40);
        }
        
        // 玩家2连击数
        if (this.state.players.player2.comboCount > 1) {
            this.ctx.fillStyle = '#ffcc00';
            this.ctx.font = '16px Press Start 2P';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(`COMBO: ${this.state.players.player2.comboCount}`, 750, 40);
        }
    }
    
    // 绘制计时器
    drawTimerDisplay() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Press Start 2P';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.state.gameTime, this.canvas.width / 2, 40);
    }
    
    // 更新血量条
    updateHealthBars() {
        if (this.healthBars.player1) {
            this.healthBars.player1.style.width = `${this.state.players.player1.health}%`;
        }
        if (this.healthBars.player2) {
            this.healthBars.player2.style.width = `${this.state.players.player2.health}%`;
        }
    }
    
    // 更新能量条
    updateEnergyBars() {
        // 这里可以更新DOM中的能量条
    }
    
    // 更新连击显示
    updateComboDisplay() {
        // 这里可以更新DOM中的连击显示
    }
    
    // 更新计时器显示
    updateTimerDisplay() {
        // 这里可以更新DOM中的计时器显示
    }
    
    // 检查游戏结束条件
    checkGameEnd() {
        const player1 = this.state.players.player1;
        const player2 = this.state.players.player2;
        
        if (player1.health <= 0) {
            this.endGame('玩家2 获胜！');
        } else if (player2.health <= 0) {
            this.endGame('玩家1 获胜！');
        }
    }
    
    // 时间结束结束游戏
    endGameByTime() {
        const player1 = this.state.players.player1;
        const player2 = this.state.players.player2;
        
        if (player1.health > player2.health) {
            this.endGame('玩家1 获胜！');
        } else if (player2.health > player1.health) {
            this.endGame('玩家2 获胜！');
        } else {
            this.endGame('平局！');
        }
    }
    
    // 结束游戏
    endGame(result) {
        clearInterval(this.state.gameLoop);
        this.state.gameLoop = null;
        
        if (this.state.gameTimer) {
            clearInterval(this.state.gameTimer);
            this.state.gameTimer = null;
        }
        
        // 显示结果
        this.resultTitle.textContent = result;
        
        // 切换到结束页面
        this.switchPage('end');
    }
}

export default Game;