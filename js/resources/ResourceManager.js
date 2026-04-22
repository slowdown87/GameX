// 资源管理系统
class ResourceManager {
    constructor() {
        this.resources = {
            images: {},
            audio: {},
            fonts: {}
        };
        this.loadingCount = 0;
        this.loadedCount = 0;
        this.loadingCallback = null;
    }
    
    // 加载图像资源
    loadImage(key, url) {
        this.loadingCount++;
        const image = new Image();
        image.onload = () => {
            this.loadedCount++;
            this.checkLoadingComplete();
        };
        image.onerror = () => {
            console.error(`Failed to load image: ${url}`);
            this.loadedCount++;
            this.checkLoadingComplete();
        };
        image.src = url;
        this.resources.images[key] = image;
    }
    
    // 加载音频资源
    loadAudio(key, url) {
        this.loadingCount++;
        const audio = new Audio();
        audio.oncanplaythrough = () => {
            this.loadedCount++;
            this.checkLoadingComplete();
        };
        audio.onerror = () => {
            console.error(`Failed to load audio: ${url}`);
            this.loadedCount++;
            this.checkLoadingComplete();
        };
        audio.src = url;
        this.resources.audio[key] = audio;
    }
    
    // 加载字体资源
    loadFont(key, fontName, url) {
        this.loadingCount++;
        const fontFace = new FontFace(fontName, `url(${url})`);
        fontFace.load().then(() => {
            document.fonts.add(fontFace);
            this.resources.fonts[key] = fontName;
            this.loadedCount++;
            this.checkLoadingComplete();
        }).catch((error) => {
            console.error(`Failed to load font: ${url}`, error);
            this.loadedCount++;
            this.checkLoadingComplete();
        });
    }
    
    // 加载资源列表
    loadResources(resourcesList, callback) {
        this.loadingCallback = callback;
        
        if (resourcesList.images) {
            Object.entries(resourcesList.images).forEach(([key, url]) => {
                this.loadImage(key, url);
            });
        }
        
        if (resourcesList.audio) {
            Object.entries(resourcesList.audio).forEach(([key, url]) => {
                this.loadAudio(key, url);
            });
        }
        
        if (resourcesList.fonts) {
            Object.entries(resourcesList.fonts).forEach(([key, fontData]) => {
                this.loadFont(key, fontData.name, fontData.url);
            });
        }
        
        // 如果没有资源需要加载，直接调用回调
        if (this.loadingCount === 0) {
            if (this.loadingCallback) {
                this.loadingCallback();
            }
        }
    }
    
    // 检查加载完成
    checkLoadingComplete() {
        if (this.loadedCount >= this.loadingCount && this.loadingCallback) {
            this.loadingCallback();
        }
    }
    
    // 获取图像资源
    getImage(key) {
        return this.resources.images[key];
    }
    
    // 获取音频资源
    getAudio(key) {
        return this.resources.audio[key];
    }
    
    // 获取字体资源
    getFont(key) {
        return this.resources.fonts[key];
    }
    
    // 播放音频
    playAudio(key) {
        const audio = this.getAudio(key);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(error => console.error('Error playing audio:', error));
        }
    }
    
    // 停止音频
    stopAudio(key) {
        const audio = this.getAudio(key);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
    
    // 获取加载进度
    getLoadingProgress() {
        if (this.loadingCount === 0) return 1;
        return this.loadedCount / this.loadingCount;
    }
}

export default ResourceManager;