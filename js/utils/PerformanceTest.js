// Canvas性能测试工具
class PerformanceTest {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.fpsHistory = [];
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.testResults = {};
    }
    
    // 开始性能测试
    startTest() {
        console.log('开始性能测试...');
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fpsHistory = [];
        this.testResults = {};
        
        // 测试1: 帧率测试
        this.testFPS();
        
        // 测试2: 绘制性能测试
        this.testDrawingPerformance();
        
        // 测试3: 内存使用测试
        this.testMemoryUsage();
        
        // 测试4: 兼容性测试
        this.testCompatibility();
        
        // 输出测试结果
        this.printResults();
    }
    
    // 测试帧率
    testFPS() {
        console.log('测试帧率...');
        let frameCount = 0;
        const startTime = performance.now();
        
        const testLoop = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - startTime < 5000) { // 测试5秒
                // 绘制一些内容
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(100, 100, 50, 50);
                requestAnimationFrame(testLoop);
            } else {
                const fps = Math.round((frameCount * 1000) / (currentTime - startTime));
                this.testResults.fps = fps;
                console.log(`帧率测试结果: ${fps} FPS`);
            }
        };
        
        requestAnimationFrame(testLoop);
    }
    
    // 测试绘制性能
    testDrawingPerformance() {
        console.log('测试绘制性能...');
        const startTime = performance.now();
        
        // 绘制1000个矩形
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const width = Math.random() * 50;
            const height = Math.random() * 50;
            this.ctx.fillStyle = `hsl(${i % 360}, 100%, 50%)`;
            this.ctx.fillRect(x, y, width, height);
        }
        
        const endTime = performance.now();
        const drawTime = endTime - startTime;
        this.testResults.drawTime = drawTime;
        console.log(`绘制1000个矩形耗时: ${drawTime.toFixed(2)}ms`);
    }
    
    // 测试内存使用
    testMemoryUsage() {
        console.log('测试内存使用...');
        if (performance.memory) {
            const memory = performance.memory;
            this.testResults.memory = {
                used: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
                total: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
                limit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + ' MB'
            };
            console.log('内存使用情况:', this.testResults.memory);
        } else {
            console.log('内存使用测试不可用');
            this.testResults.memory = '不可用';
        }
    }
    
    // 测试兼容性
    testCompatibility() {
        console.log('测试兼容性...');
        const features = {
            canvas: !!this.canvas,
            getContext: !!this.ctx,
            requestAnimationFrame: !!window.requestAnimationFrame,
            performance: !!window.performance,
            localStorage: !!window.localStorage,
            audio: !!window.Audio
        };
        
        this.testResults.compatibility = features;
        console.log('兼容性测试结果:', features);
    }
    
    // 输出测试结果
    printResults() {
        console.log('\n=== 性能测试结果 ===');
        console.log('帧率:', this.testResults.fps ? `${this.testResults.fps} FPS` : '测试中...');
        console.log('绘制性能:', this.testResults.drawTime ? `${this.testResults.drawTime.toFixed(2)}ms` : '测试中...');
        console.log('内存使用:', this.testResults.memory || '测试中...');
        console.log('兼容性:', this.testResults.compatibility || '测试中...');
        console.log('==================');
    }
    
    // 实时帧率监测
    startFPSMonitor() {
        const monitor = () => {
            this.frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - this.lastTime >= 1000) {
                const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.fpsHistory.push(fps);
                if (this.fpsHistory.length > 10) {
                    this.fpsHistory.shift();
                }
                
                const avgFPS = Math.round(this.fpsHistory.reduce((sum, val) => sum + val, 0) / this.fpsHistory.length);
                console.log(`当前帧率: ${fps} FPS, 平均帧率: ${avgFPS} FPS`);
                
                this.frameCount = 0;
                this.lastTime = currentTime;
            }
            
            requestAnimationFrame(monitor);
        };
        
        requestAnimationFrame(monitor);
    }
}

export default PerformanceTest;