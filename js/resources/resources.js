// 游戏资源配置
const gameResources = {
    images: {
        // 角色图像
        redMech: 'assets/images/red_mech.png',
        blueMech: 'assets/images/blue_mech.png',
        greenMech: 'assets/images/green_mech.png',
        yellowMech: 'assets/images/yellow_mech.png',
        
        // 场景图像
        backgroundCity: 'assets/images/background_city.png',
        backgroundFactory: 'assets/images/background_factory.png',
        backgroundDesert: 'assets/images/background_desert.png',
        
        // 特效图像
        explosion: 'assets/images/explosion.png',
        hitEffect: 'assets/images/hit_effect.png',
        defenseEffect: 'assets/images/defense_effect.png',
        skillEffect: 'assets/images/skill_effect.png',
        
        // UI图像
        healthBar: 'assets/images/health_bar.png',
        energyBar: 'assets/images/energy_bar.png',
        comboIcon: 'assets/images/combo_icon.png'
    },
    audio: {
        // 背景音乐
        bgmMenu: 'assets/audio/bgm_menu.mp3',
        bgmBattle: 'assets/audio/bgm_battle.mp3',
        
        // 音效
        attackLight: 'assets/audio/attack_light.mp3',
        attackHeavy: 'assets/audio/attack_heavy.mp3',
        defense: 'assets/audio/defense.mp3',
        hit: 'assets/audio/hit.mp3',
        skill: 'assets/audio/skill.mp3',
        ultimate: 'assets/audio/ultimate.mp3',
        victory: 'assets/audio/victory.mp3',
        defeat: 'assets/audio/defeat.mp3'
    },
    fonts: {
        pixelFont: {
            name: 'Press Start 2P',
            url: 'https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2'
        }
    }
};

export default gameResources;