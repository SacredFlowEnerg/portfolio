class SubtitleManager {
  constructor() {
    this.container = null;
    this.originalSubtitle = null;
    this.translatedSubtitle = null;
    this.settings = {
      targetLang: 'zh-CN',
      fontSize: '20px',
      fontColor: '#ffffff',
      bgColor: '#000000',
      bgOpacity: 0.5
    };
    
    this.init();
  }

  async init() {
    // 创建字幕容器
    this.createSubtitleContainer();
    // 加载设置
    await this.loadSettings();
    // 监听字幕变化
    this.observeSubtitles();
    // 添加拖动功能
    this.enableDragging();
  }

  createSubtitleContainer() {
    this.container = document.createElement('div');
    this.container.className = 'disney-subtitle-container';
    
    this.originalSubtitle = document.createElement('div');
    this.originalSubtitle.className = 'disney-subtitle disney-subtitle-original';
    
    this.translatedSubtitle = document.createElement('div');
    this.translatedSubtitle.className = 'disney-subtitle disney-subtitle-translated';
    
    this.container.appendChild(this.originalSubtitle);
    this.container.appendChild(this.translatedSubtitle);
    document.body.appendChild(this.container);
  }

  async loadSettings() {
    const settings = await chrome.storage.sync.get(null);
    this.settings = { ...this.settings, ...settings };
    this.applySettings();
  }

  applySettings() {
    const { fontSize, fontColor, bgColor, bgOpacity } = this.settings;
    this.container.style.fontSize = fontSize + 'px';
    this.container.style.backgroundColor = `${bgColor}${Math.round(bgOpacity * 255).toString(16)}`;
    this.originalSubtitle.style.color = fontColor;
  }

  async translateText(text) {
    const API_KEY = 'YOUR_AZURE_API_KEY';
    const REGION = 'YOUR_AZURE_REGION';
    
    const response = await fetch(
        'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=ko&to=en',
        {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': API_KEY,
                'Ocp-Apim-Subscription-Region': REGION,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{ text }])
        }
    );
    const result = await response.json();
    return result[0].translations[0].text;
  }

  observeSubtitles() {
    const observer = new MutationObserver(async (mutations) => {
      for (const mutation of mutations) {
        if (mutation.target.matches('.subtitle-container')) {
          const originalText = mutation.target.textContent;
          this.originalSubtitle.textContent = originalText;
          
          const translatedText = await this.translateText(originalText);
          this.translatedSubtitle.textContent = translatedText;
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true
    });
  }

  enableDragging() {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    this.container.addEventListener('mousedown', (e) => {
      isDragging = true;
      initialX = e.clientX - this.container.offsetLeft;
      initialY = e.clientY - this.container.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        this.container.style.left = currentX + 'px';
        this.container.style.top = currentY + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }
}

// 初始化字幕管理器
new SubtitleManager(); 