import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ur');
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState([]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'sd', name: 'Sindhi', flag: '🇵🇰' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  ];

  // Sample translation phrases for each language
  const samplePhrases = {
    en: [
      "Hello, how are you?",
      "What is your name?",
      "Where are you from?",
      "I love learning languages",
      "Pakistan is a beautiful country"
    ],
    ur: [
      "ہیلو، آپ کیسے ہیں؟",
      "آپ کا نام کیا ہے؟",
      "آپ کہاں سے ہیں؟",
      "مجھے زبانیں سیکھنا پسند ہے",
      "پاکستان ایک خوبصورت ملک ہے"
    ],
    ru: [
      "Привет, как дела?",
      "Как тебя зовут?",
      "Откуда ты?",
      "Я люблю изучать языки",
      "Пакистан - прекрасная страна"
    ],
    sd: [
      "هيلو، تون ڪيئن آهين؟",
      "توهان جو نالو ڇا آهي؟",
      "توهان ڪٿان آهيو؟",
      "مون کي زبان سکڻ پسند آهي",
      "پاڪستان هڪ خوبصورت ملڪ آهي"
    ],
    es: [
      "Hola, ¿cómo estás?",
      "¿Cuál es tu nombre?",
      "¿De dónde eres?",
      "Me encanta aprender idiomas",
      "Pakistán es un hermoso país"
    ],
    de: [
      "Hallo, wie geht es dir?",
      "Wie heißt du?",
      "Woher kommst du?",
      "Ich liebe es, Sprachen zu lernen",
      "Pakistan ist ein schönes Land"
    ],
    it: [
      "Ciao, come stai?",
      "Come ti chiami?",
      "Di dove sei?",
      "Adoro imparare le lingue",
      "Il Pakistan è un bellissimo paese"
    ],
    fr: [
      "Bonjour, comment vas-tu ?",
      "Comment vous appelez-vous ?",
      "D'où viens-tu ?",
      "J'aime apprendre des langues",
      "Le Pakistan est un beau pays"
    ],
    ar: [
      "مرحبا، كيف حالك؟",
      "ما اسمك؟",
      "من أين أنت؟",
      "أحب تعلم اللغات",
      "باكستان بلد جميل"
    ],
    zh: [
      "你好，你好吗？",
      "你叫什么名字？",
      "你来自哪里？",
      "我爱学习语言",
      "巴基斯坦是一个美丽的国家"
    ],
    ja: [
      "こんにちは、お元気ですか？",
      "お名前は何ですか？",
      "どこから来たの？",
      "言語を学ぶのが大好きです",
      "パキスタンは美しい国です"
    ],
    ko: [
      "안녕하세요, 잘 지내세요?",
      "이름이 뭐예요?",
      "어디에서 왔나요?",
      "언어를 배우는 걸 좋아해요",
      "파키스탄은 아름다운 나라예요"
    ]
  };

  const translateText = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);

    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(inputText)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let result = data[0] && data[0][0] && data[0][0][0] 
        ? data[0][0][0] 
        : 'Translation failed. Please try again.';

      setTranslatedText(result);

      // Add to history
      const newEntry = {
        id: Date.now(),
        sourceText: inputText,
        translatedText: result,
        sourceLang,
        targetLang,
        timestamp: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi' })
      };

      setHistory(prev => [newEntry, ...prev.slice(0, 9)]);
      setIsTranslating(false);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed. Please try again.');
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const clearText = () => {
    setInputText('');
    setTranslatedText('');
  };

  const handleSampleClick = (phrase) => {
    setInputText(phrase);
  };

  // Auto-translate when languages change if text exists
  useEffect(() => {
    if (inputText) {
      translateText();
    }
  }, [sourceLang, targetLang]);

  return (
    <div className="app">
      <header>
        <h1>🌍 Polyglot Translator</h1>
        <p>Translate text between multiple languages instantly</p>
      </header>
      
      <main>
        <div className="language-selectors">
          <div className="language-selector">
            <label>From:</label>
            <select 
              value={sourceLang} 
              onChange={(e) => setSourceLang(e.target.value)}
            >
              {languages.map(lang => (
                <option key={`source-${lang.code}`} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <button className="swap-btn" onClick={swapLanguages}>
            🔄
          </button>
          
          <div className="language-selector">
            <label>To:</label>
            <select 
              value={targetLang} 
              onChange={(e) => setTargetLang(e.target.value)}
            >
              {languages.map(lang => (
                <option key={`target-${lang.code}`} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="translation-container">
          <div className="input-section">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              rows="5"
            ></textarea>
            
            <div className="sample-phrases">
              <h4>Sample Phrases:</h4>
              <div className="phrase-list">
                {samplePhrases[sourceLang]?.map((phrase, index) => (
                  <button 
                    key={index} 
                    className="phrase-btn"
                    onClick={() => handleSampleClick(phrase)}
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="output-section">
            <textarea
              value={translatedText}
              readOnly
              placeholder="Translation will appear here..."
              rows="5"
              className={targetLang === 'ur' || targetLang === 'ar' ? 'rtl-text' : ''}
            ></textarea>
            
            {isTranslating && (
              <div className="loading">
                <div className="spinner"></div>
                Translating...
              </div>
            )}
          </div>
        </div>
        
        <div className="action-buttons">
          <button 
            className="translate-btn" 
            onClick={translateText}
            disabled={isTranslating || !inputText.trim()}
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
          
          <button 
            className="clear-btn" 
            onClick={clearText}
            disabled={!inputText && !translatedText}
          >
            Clear
          </button>
        </div>
        
        {history.length > 0 && (
          <div className="translation-history">
            <h3>Recent Translations</h3>
            <ul>
              {history.map(entry => (
                <li key={entry.id}>
                  <div className="history-entry">
                    <div className="history-text">
                      <strong>{entry.sourceText}</strong> 
                      <span className="lang-label">
                        ({languages.find(l => l.code === entry.sourceLang)?.name})
                      </span>
                    </div>
                    <div className="history-arrow">→</div>
                    <div className="history-text">
                      {entry.translatedText} 
                      <span className="lang-label">
                        ({languages.find(l => l.code === entry.targetLang)?.name})
                      </span>
                    </div>
                    <div className="history-time">{entry.timestamp}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      
      <footer>
        <p>© 2025 Polyglot Translator | Designed for Vercel Deployment</p>
        <p>Supports English, Urdu, Russian, Sindhi, Spanish, German, Italian and more</p>
      </footer>
    </div>
  );
}

export default App;