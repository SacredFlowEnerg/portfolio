document.addEventListener('DOMContentLoaded', () => {
  // 加载已保存的设置
  chrome.storage.sync.get(null, (settings) => {
    if (settings.targetLang) {
      document.getElementById('targetLang').value = settings.targetLang;
    }
    if (settings.fontSize) {
      document.getElementById('fontSize').value = settings.fontSize;
    }
    if (settings.fontColor) {
      document.getElementById('fontColor').value = settings.fontColor;
    }
    if (settings.bgColor) {
      document.getElementById('bgColor').value = settings.bgColor;
    }
    if (settings.bgOpacity) {
      document.getElementById('bgOpacity').value = settings.bgOpacity * 100;
    }
  });

  // 保存设置
  document.getElementById('saveSettings').addEventListener('click', () => {
    const settings = {
      targetLang: document.getElementById('targetLang').value,
      fontSize: document.getElementById('fontSize').value,
      fontColor: document.getElementById('fontColor').value,
      bgColor: document.getElementById('bgColor').value,
      bgOpacity: document.getElementById('bgOpacity').value / 100
    };

    chrome.storage.sync.set(settings, () => {
      alert('设置已保存！');
    });
  });
}); 