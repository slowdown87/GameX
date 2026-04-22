// 游戏配置文件
const config = {
    // 游戏基本设置
    game: {
        width: 800,
        height: 400,
        fps: 60,
        gameTime: 99, // 游戏时间（秒）
        gravity: 0.5
    },
    
    // 玩家设置
    player: {
        default: {
            width: 40,
            height: 60,
            health: 100,
            energy: 0,
            maxEnergy: 100,
            attack: 10,
            defense: 5,
            speed: 5,
            jumpSpeed: 15
        },
        // 不同角色的属性
        characters: {
            redMech: {
                name: '红色机甲',
                color: '#ff0000',
                attack: 12,
                defense: 4,
                speed: 6
            },
            blueMech: {
                name: '蓝色机甲',
                color: '#0000ff',
                attack: 10,
                defense: 6,
                speed: 5
            },
            greenMech: {
                name: '绿色机甲',
                color: '#00ff00',
                attack: 8,
                defense: 8,
                speed: 4
            },
            yellowMech: {
                name: '黄色机甲',
                color: '#ffff00',
                attack: 15,
                defense: 3,
                speed: 7
            }
        }
    },
    
    // 技能设置
    skills: {
        lightAttack: {
            damage: 10,
            cooldown: 15,
            energyGain: 5
        },
        heavyAttack: {
            damage: 20,
            cooldown: 30,
            energyGain: 10
        },
        specialSkill: {
            damage: 30,
            cooldown: 60,
            energyCost: 50
        },
        ultimateSkill: {
            damage: 50,
            cooldown: 120,
            energyCost: 100
        }
    },
    
    // 连击系统
    combo: {
        timeWindow: 1000, // 连击时间窗口（毫秒）
        damageBonus: 0.1, // 每连击增加10%伤害
        maxComboBonus: 1.0 // 最大伤害加成
    },
    
    // 特效设置
    effects: {
        hit: {
            duration: 10,
            particleCount: 8
        },
        defense: {
            duration: 8,
            particleCount: 12
        },
        skill: {
            duration: 15,
            particleCount: 20
        }
    },
    
    // 控制设置
    controls: {
        player1: {
            up: 'w',
            left: 'a',
            down: 's',
            right: 'd',
            lightAttack: 'j',
            heavyAttack: 'l',
            defense: 'k',
            specialSkill: 'u',
            ultimateSkill: 'i'
        },
        player2: {
            up: 'ArrowUp',
            left: 'ArrowLeft',
            down: 'ArrowDown',
            right: 'ArrowRight',
            lightAttack: '1',
            heavyAttack: '3',
            defense: '2',
            specialSkill: '7',
            ultimateSkill: '8'
        }
    },
    
    // 场景设置
    scenes: {
        default: {
            name: '城市废墟',
            background: {
                sky: '#2c3e50',
                ground: '#7f8c8d'
            },
            elements: [
                { type: 'building', x: 100, y: 200, width: 80, height: 150 },
                { type: 'building', x: 600, y: 220, width: 60, height: 130 },
                { type: 'debris', x: 300, y: 320, width: 20, height: 10 },
                { type: 'debris', x: 450, y: 330, width: 15, height: 15 }
            ]
        },
        factory: {
            name: '工厂',
            background: {
                sky: '#1a1a1a',
                ground: '#5d5d5d'
            },
            elements: [
                { type: 'machine', x: 150, y: 250, width: 100, height: 100 },
                { type: 'pipe', x: 400, y: 300, width: 50, height: 20 },
                { type: 'container', x: 600, y: 320, width: 40, height: 30 }
            ]
        },
        desert: {
            name: '沙漠',
            background: {
                sky: '#87ceeb',
                ground: '#d2b48c'
            },
            elements: [
                { type: 'rock', x: 200, y: 330, width: 30, height: 20 },
                { type: 'cactus', x: 400, y: 310, width: 10, height: 40 },
                { type: 'rock', x: 650, y: 320, width: 25, height: 25 }
            ]
        }
    }
};

export default config;