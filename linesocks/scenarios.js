const SCENARIOS = {
  "actionCatalog": {
    "walk": {
      "label": "散步",
      "lucideIcon": "park"
    },
    "short_walk": {
      "label": "短暫散步",
      "lucideIcon": "park"
    },
    "outing": {
      "label": "踏青",
      "lucideIcon": "mountain-snow"
    },
    "bike": {
      "label": "腳踏車",
      "lucideIcon": "bike"
    },
    "zoo": {
      "label": "動物園",
      "lucideIcon": "panda"
    },
    "seaside": {
      "label": "海邊",
      "lucideIcon": "waves-horizontal"
    },
    "camera": {
      "label": "拍照",
      "lucideIcon": "camera"
    },
    "dessert": {
      "label": "點心",
      "lucideIcon": "cake-slice"
    },
    "stargazing": {
      "label": "看星星",
      "lucideIcon": "star"
    },
    "movie": {
      "label": "電影",
      "lucideIcon": "popcorn"
    },
    "camping": {
      "label": "露營",
      "lucideIcon": "flame-kindling"
    },
    "cafe": {
      "label": "咖啡館",
      "lucideIcon": "coffee"
    },
    "coffee": {
      "label": "咖啡",
      "lucideIcon": "coffee"
    },
    "tea": {
      "label": "熱茶",
      "lucideIcon": "leaf"
    },
    "music": {
      "label": "音樂",
      "lucideIcon": "music-4"
    },
    "snack": {
      "label": "零食",
      "lucideIcon": "cookie"
    },
    "dinner": {
      "label": "晚餐",
      "lucideIcon": "utensils"
    },
    "ramen": {
      "label": "拉麵",
      "lucideIcon": "utensils"
    },
    "hotpot": {
      "label": "火鍋",
      "lucideIcon": "soup"
    },
    "brunch": {
      "label": "早午餐",
      "lucideIcon": "utensils"
    },
    "hamburger": {
      "label": "漢堡",
      "lucideIcon": "hamburger"
    },
    "icecream": {
      "label": "冰淇淋",
      "lucideIcon": "ice-cream-cone"
    },
    "book": {
      "label": "書本",
      "lucideIcon": "book-open"
    },
    "journal": {
      "label": "寫日記",
      "lucideIcon": "notebook-pen"
    },
    "sleep": {
      "label": "睡覺",
      "lucideIcon": "bed"
    },
    "sofa": {
      "label": "沙發休息",
      "lucideIcon": "armchair"
    },
    "bath": {
      "label": "洗澡",
      "lucideIcon": "bath"
    },
    "blanket": {
      "label": "毛毯",
      "lucideIcon": "bed"
    },
    "aroma": {
      "label": "香氛",
      "lucideIcon": "flame"
    },
    "headphones": {
      "label": "耳機",
      "lucideIcon": "headphones"
    },
    "game": {
      "label": "遊戲",
      "lucideIcon": "gamepad-2"
    },
    "rest": {
      "label": "休息",
      "lucideIcon": "rocking-chair"
    },
    "charge": {
      "label": "充電",
      "lucideIcon": "battery-charging"
    },
    "home": {
      "label": "回家",
      "lucideIcon": "house"
    },
    "checklist": {
      "label": "整理清單",
      "lucideIcon": "layout-list"
    },
    "note": {
      "label": "筆記",
      "lucideIcon": "notebook-pen"
    },
    "breathing": {
      "label": "呼吸",
      "lucideIcon": "wind"
    },
    "shutdown": {
      "label": "關機休息",
      "lucideIcon": "power"
    },
    "run": {
      "label": "跑步",
      "lucideIcon": "sport-shoe"
    },
    "cold_drink": {
      "label": "喝冷飲",
      "lucideIcon": "cup-soda"
    },
    "bench": {
      "label": "坐一會兒",
      "lucideIcon": "armchair"
    },
    "tissue": {
      "label": "擦擦眼淚",
      "lucideIcon": "droplets"
    },
    "board_game": {
      "label": "桌遊",
      "lucideIcon": "playing-cards-fan"
    },
    "puzzle": {
      "label": "拼圖",
      "lucideIcon": "puzzle"
    },
    "cleaning": {
      "label": "打掃",
      "lucideIcon": "broom-sparkles"
    },
    "drawing": {
      "label": "畫畫",
      "lucideIcon": "palette"
    },
    "exhibition": {
      "label": "展覽",
      "lucideIcon": "landmark"
    }
  },
  "scenarios": [
    {
      "mood": "happy",
      "weather": "sunny",
      "timeOfDay": "day",
      "thought": "陽光剛好，今天也剛好很開心。",
      "activityOptions": [
        "walk",
        "outing",
        "bike",
        "zoo",
        "cleaning",
        "exhibition"
      ]
    },
    {
      "mood": "happy",
      "weather": "sunny",
      "timeOfDay": "evening",
      "thought": "好心情很適合往外走一走。",
      "activityOptions": [
        "seaside",
        "camera",
        "bike",
        "dessert"
      ]
    },
    {
      "mood": "happy",
      "weather": "sunny",
      "timeOfDay": "night",
      "thought": "今天的光，好像也照進心裡。",
      "activityOptions": [
        "stargazing",
        "dessert",
        "movie",
        "camping",
        "board_game"
      ]
    },
    {
      "mood": "happy",
      "weather": "cloudy",
      "timeOfDay": "day",
      "thought": "沒有大太陽，也不妨礙今天心情很好。",
      "activityOptions": [
        "zoo",
        "outing",
        "cafe",
        "hamburger",
        "cleaning",
        "exhibition"
      ]
    },
    {
      "mood": "happy",
      "weather": "cloudy",
      "timeOfDay": "evening",
      "thought": "灰灰的天空，反而讓好心情更明顯。",
      "activityOptions": [
        "walk",
        "dessert",
        "cafe",
        "dinner"
      ]
    },
    {
      "mood": "happy",
      "weather": "cloudy",
      "timeOfDay": "night",
      "thought": "今天不需要大晴天，也一樣很好。",
      "activityOptions": [
        "music",
        "movie",
        "dessert",
        "dinner",
        "board_game"
      ]
    },
    {
      "mood": "happy",
      "weather": "rainy",
      "timeOfDay": "day",
      "thought": "下雨也沒關係，今天還是有值得開心的小事。",
      "activityOptions": [
        "cafe",
        "dessert",
        "ramen",
        "book",
        "board_game",
        "cleaning",
        "exhibition"
      ]
    },
    {
      "mood": "happy",
      "weather": "rainy",
      "timeOfDay": "evening",
      "thought": "雨聲替今天的好心情加了一點背景音。",
      "activityOptions": [
        "music",
        "hotpot",
        "dessert",
        "movie",
        "board_game"
      ]
    },
    {
      "mood": "happy",
      "weather": "rainy",
      "timeOfDay": "night",
      "thought": "窗外下著雨，心裡卻還亮亮的。",
      "activityOptions": [
        "movie",
        "snack",
        "hotpot",
        "music",
        "board_game"
      ]
    },
    {
      "mood": "happy",
      "weather": "windy",
      "timeOfDay": "day",
      "thought": "風一吹，好像連心情也變得更輕。",
      "activityOptions": [
        "bike",
        "outing",
        "walk",
        "seaside",
        "cleaning",
        "exhibition"
      ]
    },
    {
      "mood": "happy",
      "weather": "windy",
      "timeOfDay": "evening",
      "thought": "今天的風很適合把快樂帶遠一點。",
      "activityOptions": [
        "seaside",
        "bike",
        "walk",
        "icecream"
      ]
    },
    {
      "mood": "happy",
      "weather": "windy",
      "timeOfDay": "night",
      "thought": "有風的日子，心情也跟著流動起來。",
      "activityOptions": [
        "music",
        "walk",
        "dessert",
        "stargazing",
        "board_game"
      ]
    },
    {
      "mood": "happy",
      "weather": "stormy",
      "timeOfDay": "day",
      "thought": "外面很吵，今天的好心情倒是很安穩。",
      "activityOptions": [
        "game",
        "movie",
        "dessert",
        "book",
        "board_game",
        "cleaning"
      ]
    },
    {
      "mood": "happy",
      "weather": "stormy",
      "timeOfDay": "evening",
      "thought": "風雨再大，也不妨礙留住一點快樂。",
      "activityOptions": [
        "movie",
        "hotpot",
        "snack",
        "game",
        "board_game"
      ]
    },
    {
      "mood": "happy",
      "weather": "stormy",
      "timeOfDay": "night",
      "thought": "今天的快樂，剛好躲在自己的小世界裡。",
      "activityOptions": [
        "snack",
        "movie",
        "music",
        "sleep",
        "board_game"
      ]
    },
    {
      "mood": "calm",
      "weather": "sunny",
      "timeOfDay": "day",
      "thought": "陽光很安靜，今天不用急著去哪裡。",
      "activityOptions": [
        "book",
        "outing",
        "walk",
        "zoo",
        "cleaning",
        "drawing",
        "exhibition"
      ]
    },
    {
      "mood": "calm",
      "weather": "sunny",
      "timeOfDay": "evening",
      "thought": "看著光慢慢變柔，心也跟著慢下來。",
      "activityOptions": [
        "tea",
        "seaside",
        "walk",
        "camera",
        "drawing"
      ]
    },
    {
      "mood": "calm",
      "weather": "sunny",
      "timeOfDay": "night",
      "thought": "今天適合把步調放慢一點。",
      "activityOptions": [
        "stargazing",
        "book",
        "tea",
        "camping",
        "puzzle"
      ]
    },
    {
      "mood": "calm",
      "weather": "cloudy",
      "timeOfDay": "day",
      "thought": "天空沒有太多表情，今天也適合簡單一點。",
      "activityOptions": [
        "book",
        "cafe",
        "outing",
        "hamburger",
        "puzzle",
        "cleaning",
        "drawing",
        "exhibition"
      ]
    },
    {
      "mood": "calm",
      "weather": "cloudy",
      "timeOfDay": "evening",
      "thought": "灰藍色的天，很適合什麼都不趕。",
      "activityOptions": [
        "tea",
        "walk",
        "dessert",
        "journal",
        "puzzle",
        "drawing"
      ]
    },
    {
      "mood": "calm",
      "weather": "cloudy",
      "timeOfDay": "night",
      "thought": "今天不用安排太滿，留點空白就好。",
      "activityOptions": [
        "aroma",
        "book",
        "music",
        "sleep",
        "puzzle"
      ]
    },
    {
      "mood": "calm",
      "weather": "rainy",
      "timeOfDay": "day",
      "thought": "雨把步調放慢了，你也可以。",
      "activityOptions": [
        "coffee",
        "book",
        "hamburger",
        "journal",
        "puzzle",
        "cleaning",
        "drawing",
        "exhibition"
      ]
    },
    {
      "mood": "calm",
      "weather": "rainy",
      "timeOfDay": "evening",
      "thought": "雨聲一直在，剛好替今天按下慢速鍵。",
      "activityOptions": [
        "music",
        "tea",
        "dessert",
        "journal",
        "puzzle",
        "drawing"
      ]
    },
    {
      "mood": "calm",
      "weather": "rainy",
      "timeOfDay": "night",
      "thought": "聽著雨聲，讓今天慢慢流過。",
      "activityOptions": [
        "sleep",
        "music",
        "book",
        "aroma",
        "puzzle"
      ]
    },
    {
      "mood": "calm",
      "weather": "windy",
      "timeOfDay": "day",
      "thought": "風來了又走，很多事其實也一樣。",
      "activityOptions": [
        "walk",
        "bike",
        "outing",
        "seaside",
        "cleaning",
        "drawing",
        "exhibition"
      ]
    },
    {
      "mood": "calm",
      "weather": "windy",
      "timeOfDay": "evening",
      "thought": "讓風吹一吹，腦袋也能空一點。",
      "activityOptions": [
        "walk",
        "seaside",
        "camera",
        "tea",
        "drawing"
      ]
    },
    {
      "mood": "calm",
      "weather": "windy",
      "timeOfDay": "night",
      "thought": "今天適合把心放輕一點。",
      "activityOptions": [
        "music",
        "walk",
        "stargazing",
        "book",
        "puzzle"
      ]
    },
    {
      "mood": "calm",
      "weather": "stormy",
      "timeOfDay": "day",
      "thought": "外面越吵，越適合留一小塊安靜給自己。",
      "activityOptions": [
        "headphones",
        "book",
        "tea",
        "journal",
        "puzzle",
        "cleaning",
        "drawing"
      ]
    },
    {
      "mood": "calm",
      "weather": "stormy",
      "timeOfDay": "evening",
      "thought": "風雨很急，你不用跟著急。",
      "activityOptions": [
        "tea",
        "book",
        "dessert",
        "aroma",
        "puzzle",
        "drawing"
      ]
    },
    {
      "mood": "calm",
      "weather": "stormy",
      "timeOfDay": "night",
      "thought": "今天先待在安全的地方，慢慢來就好。",
      "activityOptions": [
        "blanket",
        "book",
        "sleep",
        "music",
        "puzzle"
      ]
    },
    {
      "mood": "tired",
      "weather": "sunny",
      "timeOfDay": "day",
      "thought": "太陽很有精神，但你今天不用勉強跟上。",
      "activityOptions": [
        "coffee",
        "brunch",
        "cafe",
        "dessert"
      ]
    },
    {
      "mood": "tired",
      "weather": "sunny",
      "timeOfDay": "evening",
      "thought": "今天已經走了很久，可以慢一點了。",
      "activityOptions": [
        "sofa",
        "dinner",
        "bath",
        "dessert"
      ]
    },
    {
      "mood": "tired",
      "weather": "sunny",
      "timeOfDay": "night",
      "thought": "有點沒電，也是一種提醒。",
      "activityOptions": [
        "sleep",
        "bath",
        "snack",
        "book"
      ]
    },
    {
      "mood": "tired",
      "weather": "cloudy",
      "timeOfDay": "day",
      "thought": "今天有點沒電，先把重要的事做完就好。",
      "activityOptions": [
        "coffee",
        "brunch",
        "hamburger",
        "cafe"
      ]
    },
    {
      "mood": "tired",
      "weather": "cloudy",
      "timeOfDay": "evening",
      "thought": "天色灰灰的，你也可以進入省電模式。",
      "activityOptions": [
        "sofa",
        "dinner",
        "dessert",
        "bath"
      ]
    },
    {
      "mood": "tired",
      "weather": "cloudy",
      "timeOfDay": "night",
      "thought": "今天不用撐滿格，夠用就好。",
      "activityOptions": [
        "sleep",
        "bath",
        "music",
        "blanket"
      ]
    },
    {
      "mood": "tired",
      "weather": "rainy",
      "timeOfDay": "day",
      "thought": "雨天本來就適合慢一點，今天別對自己太嚴格。",
      "activityOptions": [
        "tea",
        "ramen",
        "cafe",
        "dessert"
      ]
    },
    {
      "mood": "tired",
      "weather": "rainy",
      "timeOfDay": "evening",
      "thought": "雨聲很適合把忙了一天的腦袋關小聲一點。",
      "activityOptions": [
        "music",
        "hotpot",
        "bath",
        "dessert"
      ]
    },
    {
      "mood": "tired",
      "weather": "rainy",
      "timeOfDay": "night",
      "thought": "今天先休息，剩下的明天再說。",
      "activityOptions": [
        "sleep",
        "hotpot",
        "blanket",
        "music"
      ]
    },
    {
      "mood": "tired",
      "weather": "windy",
      "timeOfDay": "day",
      "thought": "風很有力，你的力氣今天可以省著用。",
      "activityOptions": [
        "coffee",
        "brunch",
        "cafe",
        "short_walk"
      ]
    },
    {
      "mood": "tired",
      "weather": "windy",
      "timeOfDay": "evening",
      "thought": "今天就走到這裡吧，剩下的交給明天。",
      "activityOptions": [
        "home",
        "dinner",
        "bath",
        "sofa"
      ]
    },
    {
      "mood": "tired",
      "weather": "windy",
      "timeOfDay": "night",
      "thought": "讓風吹走一點疲憊，再慢慢回去。",
      "activityOptions": [
        "bath",
        "sleep",
        "tea",
        "blanket"
      ]
    },
    {
      "mood": "tired",
      "weather": "stormy",
      "timeOfDay": "day",
      "thought": "外面的天氣已經夠忙了，你不用也這麼忙。",
      "activityOptions": [
        "rest",
        "hotpot",
        "book",
        "coffee"
      ]
    },
    {
      "mood": "tired",
      "weather": "stormy",
      "timeOfDay": "evening",
      "thought": "今天的電量見底，就別再硬撐。",
      "activityOptions": [
        "charge",
        "dinner",
        "bath",
        "sofa"
      ]
    },
    {
      "mood": "tired",
      "weather": "stormy",
      "timeOfDay": "night",
      "thought": "風雨交給窗外，你只要負責好好休息。",
      "activityOptions": [
        "blanket",
        "sleep",
        "hotpot",
        "music"
      ]
    },
    {
      "mood": "sad",
      "weather": "sunny",
      "timeOfDay": "day",
      "thought": "天氣很好，也不代表你一定要開心。",
      "activityOptions": [
        "walk",
        "outing",
        "zoo",
        "dessert",
        "drawing"
      ]
    },
    {
      "mood": "sad",
      "weather": "sunny",
      "timeOfDay": "evening",
      "thought": "今天有點難過，就讓光陪你待一下。",
      "activityOptions": [
        "bench",
        "seaside",
        "journal",
        "dessert",
        "drawing"
      ]
    },
    {
      "mood": "sad",
      "weather": "sunny",
      "timeOfDay": "night",
      "thought": "心情不好也可以出現在晴天裡。",
      "activityOptions": [
        "sleep",
        "book",
        "tea",
        "journal"
      ]
    },
    {
      "mood": "sad",
      "weather": "cloudy",
      "timeOfDay": "day",
      "thought": "天空灰灰的，今天的心情也是。",
      "activityOptions": [
        "coffee",
        "book",
        "journal",
        "hamburger",
        "drawing"
      ]
    },
    {
      "mood": "sad",
      "weather": "cloudy",
      "timeOfDay": "evening",
      "thought": "有些低落不需要解釋，安靜待著也可以。",
      "activityOptions": [
        "music",
        "dessert",
        "journal",
        "walk",
        "drawing"
      ]
    },
    {
      "mood": "sad",
      "weather": "cloudy",
      "timeOfDay": "night",
      "thought": "今天不需要勉強自己振作得太快。",
      "activityOptions": [
        "blanket",
        "book",
        "sleep",
        "music"
      ]
    },
    {
      "mood": "sad",
      "weather": "rainy",
      "timeOfDay": "day",
      "thought": "雨天很適合讓難過有地方待一下。",
      "activityOptions": [
        "coffee",
        "dessert",
        "journal",
        "book",
        "drawing"
      ]
    },
    {
      "mood": "sad",
      "weather": "rainy",
      "timeOfDay": "evening",
      "thought": "雨聲很適合把心事慢慢放下。",
      "activityOptions": [
        "music",
        "hotpot",
        "journal",
        "tea",
        "drawing"
      ]
    },
    {
      "mood": "sad",
      "weather": "rainy",
      "timeOfDay": "night",
      "thought": "如果今天想哭，就讓雨聲幫你保密。",
      "activityOptions": [
        "tissue",
        "journal",
        "music",
        "sleep"
      ]
    },
    {
      "mood": "sad",
      "weather": "windy",
      "timeOfDay": "day",
      "thought": "讓風吹一吹，也許心裡會空出一點位置。",
      "activityOptions": [
        "walk",
        "seaside",
        "outing",
        "bike",
        "drawing"
      ]
    },
    {
      "mood": "sad",
      "weather": "windy",
      "timeOfDay": "evening",
      "thought": "有些難過不會立刻消失，但會慢慢變輕。",
      "activityOptions": [
        "seaside",
        "walk",
        "journal",
        "tea",
        "drawing"
      ]
    },
    {
      "mood": "sad",
      "weather": "windy",
      "timeOfDay": "night",
      "thought": "晚風很冷，今天記得對自己暖一點。",
      "activityOptions": [
        "tea",
        "music",
        "book",
        "sleep"
      ]
    },
    {
      "mood": "sad",
      "weather": "stormy",
      "timeOfDay": "day",
      "thought": "今天的心裡也像天氣一樣亂，先不用急著整理。",
      "activityOptions": [
        "headphones",
        "book",
        "journal",
        "dessert",
        "drawing"
      ]
    },
    {
      "mood": "sad",
      "weather": "stormy",
      "timeOfDay": "evening",
      "thought": "外面風雨很大，今天就先躲回自己的安全區。",
      "activityOptions": [
        "home",
        "hotpot",
        "book",
        "blanket",
        "drawing"
      ]
    },
    {
      "mood": "sad",
      "weather": "stormy",
      "timeOfDay": "night",
      "thought": "今晚什麼都不用解決，先平安度過這一天。",
      "activityOptions": [
        "sleep",
        "blanket",
        "journal",
        "music"
      ]
    },
    {
      "mood": "anxious",
      "weather": "sunny",
      "timeOfDay": "day",
      "thought": "事情很多，但今天只需要先做眼前這一件。",
      "activityOptions": [
        "checklist",
        "walk",
        "bike",
        "cafe",
        "drawing"
      ]
    },
    {
      "mood": "anxious",
      "weather": "sunny",
      "timeOfDay": "evening",
      "thought": "今天不用一次想完全部，只做下一步。",
      "activityOptions": [
        "note",
        "walk",
        "seaside",
        "dessert",
        "drawing"
      ]
    },
    {
      "mood": "anxious",
      "weather": "sunny",
      "timeOfDay": "night",
      "thought": "光很亮，先把注意力放回眼前。",
      "activityOptions": [
        "journal",
        "book",
        "tea",
        "sleep",
        "puzzle"
      ]
    },
    {
      "mood": "anxious",
      "weather": "cloudy",
      "timeOfDay": "day",
      "thought": "看不清後面的事沒關係，先處理現在就好。",
      "activityOptions": [
        "checklist",
        "coffee",
        "short_walk",
        "book",
        "puzzle",
        "drawing"
      ]
    },
    {
      "mood": "anxious",
      "weather": "cloudy",
      "timeOfDay": "evening",
      "thought": "今天想太多了，先讓腦袋停一下。",
      "activityOptions": [
        "walk",
        "journal",
        "dessert",
        "tea",
        "puzzle",
        "drawing"
      ]
    },
    {
      "mood": "anxious",
      "weather": "cloudy",
      "timeOfDay": "night",
      "thought": "不確定也沒關係，先做能控制的部分。",
      "activityOptions": [
        "breathing",
        "book",
        "music",
        "sleep",
        "puzzle"
      ]
    },
    {
      "mood": "anxious",
      "weather": "rainy",
      "timeOfDay": "day",
      "thought": "雨已經夠忙了，你先專心做好一件事。",
      "activityOptions": [
        "checklist",
        "coffee",
        "journal",
        "ramen",
        "puzzle",
        "drawing"
      ]
    },
    {
      "mood": "anxious",
      "weather": "rainy",
      "timeOfDay": "evening",
      "thought": "聽一會兒雨聲，把腦袋裡的聲音調小一點。",
      "activityOptions": [
        "music",
        "journal",
        "tea",
        "dessert",
        "puzzle",
        "drawing"
      ]
    },
    {
      "mood": "anxious",
      "weather": "rainy",
      "timeOfDay": "night",
      "thought": "有些答案今天不會出現，先休息也沒關係。",
      "activityOptions": [
        "sleep",
        "book",
        "music",
        "breathing",
        "puzzle"
      ]
    },
    {
      "mood": "anxious",
      "weather": "windy",
      "timeOfDay": "day",
      "thought": "心裡很亂的時候，就先出去走五分鐘。",
      "activityOptions": [
        "walk",
        "bike",
        "breathing",
        "cafe",
        "drawing"
      ]
    },
    {
      "mood": "anxious",
      "weather": "windy",
      "timeOfDay": "evening",
      "thought": "風吹得很快，你不用跟著它一起趕。",
      "activityOptions": [
        "breathing",
        "walk",
        "seaside",
        "journal",
        "drawing"
      ]
    },
    {
      "mood": "anxious",
      "weather": "windy",
      "timeOfDay": "night",
      "thought": "先把呼吸放慢，事情再一件一件來。",
      "activityOptions": [
        "shutdown",
        "book",
        "sleep",
        "music",
        "puzzle"
      ]
    },
    {
      "mood": "anxious",
      "weather": "stormy",
      "timeOfDay": "day",
      "thought": "外面很亂，先把注意力拉回你能控制的事情。",
      "activityOptions": [
        "checklist",
        "headphones",
        "journal",
        "book",
        "puzzle",
        "drawing"
      ]
    },
    {
      "mood": "anxious",
      "weather": "stormy",
      "timeOfDay": "evening",
      "thought": "今天資訊太多了，先讓自己離線一下。",
      "activityOptions": [
        "shutdown",
        "hotpot",
        "book",
        "tea",
        "puzzle",
        "drawing"
      ]
    },
    {
      "mood": "anxious",
      "weather": "stormy",
      "timeOfDay": "night",
      "thought": "雷聲很大，但你現在只需要照顧好自己。",
      "activityOptions": [
        "breathing",
        "sleep",
        "blanket",
        "music",
        "puzzle"
      ]
    },
    {
      "mood": "angry",
      "weather": "sunny",
      "timeOfDay": "day",
      "thought": "天氣很好，但不代表你今天不能不爽。",
      "activityOptions": [
        "walk",
        "bike",
        "outing",
        "cold_drink"
      ]
    },
    {
      "mood": "angry",
      "weather": "sunny",
      "timeOfDay": "evening",
      "thought": "先離開一下，再決定這件事值不值得繼續氣。",
      "activityOptions": [
        "walk",
        "bike",
        "seaside",
        "journal"
      ]
    },
    {
      "mood": "angry",
      "weather": "sunny",
      "timeOfDay": "night",
      "thought": "今天的火氣先別急著說出口。",
      "activityOptions": [
        "bath",
        "journal",
        "music",
        "sleep"
      ]
    },
    {
      "mood": "angry",
      "weather": "cloudy",
      "timeOfDay": "day",
      "thought": "心裡有點悶，先離開讓你煩躁的地方。",
      "activityOptions": [
        "headphones",
        "walk",
        "coffee",
        "journal"
      ]
    },
    {
      "mood": "angry",
      "weather": "cloudy",
      "timeOfDay": "evening",
      "thought": "有些話晚一點再說，會更接近你真正想說的。",
      "activityOptions": [
        "journal",
        "walk",
        "dessert",
        "tea"
      ]
    },
    {
      "mood": "angry",
      "weather": "cloudy",
      "timeOfDay": "night",
      "thought": "今天先不要急著回應。",
      "activityOptions": [
        "shutdown",
        "bath",
        "music",
        "sleep"
      ]
    },
    {
      "mood": "angry",
      "weather": "rainy",
      "timeOfDay": "day",
      "thought": "雨一直下，今天的火氣也先沖淡一點。",
      "activityOptions": [
        "coffee",
        "journal",
        "ramen",
        "book"
      ]
    },
    {
      "mood": "angry",
      "weather": "rainy",
      "timeOfDay": "evening",
      "thought": "聽著雨聲，先讓情緒走在話語前面。",
      "activityOptions": [
        "music",
        "hotpot",
        "journal",
        "tea"
      ]
    },
    {
      "mood": "angry",
      "weather": "rainy",
      "timeOfDay": "night",
      "thought": "今天很氣沒關係，但先讓自己緩一下。",
      "activityOptions": [
        "sleep",
        "bath",
        "music",
        "blanket"
      ]
    },
    {
      "mood": "angry",
      "weather": "windy",
      "timeOfDay": "day",
      "thought": "讓風吹掉一點火氣，再回來處理。",
      "activityOptions": [
        "walk",
        "bike",
        "run",
        "seaside"
      ]
    },
    {
      "mood": "angry",
      "weather": "windy",
      "timeOfDay": "evening",
      "thought": "出去走快一點，先把情緒放在腳步裡。",
      "activityOptions": [
        "run",
        "bike",
        "walk",
        "seaside"
      ]
    },
    {
      "mood": "angry",
      "weather": "windy",
      "timeOfDay": "night",
      "thought": "晚風很適合冷卻那些讓你火大的事。",
      "activityOptions": [
        "walk",
        "music",
        "bath",
        "sleep"
      ]
    },
    {
      "mood": "angry",
      "weather": "stormy",
      "timeOfDay": "day",
      "thought": "天氣已經夠爆了，今天先不要再跟誰硬碰硬。",
      "activityOptions": [
        "headphones",
        "book",
        "journal",
        "game"
      ]
    },
    {
      "mood": "angry",
      "weather": "stormy",
      "timeOfDay": "evening",
      "thought": "先離開現場，比現在說出所有話更有用。",
      "activityOptions": [
        "home",
        "hotpot",
        "bath",
        "shutdown"
      ]
    },
    {
      "mood": "angry",
      "weather": "stormy",
      "timeOfDay": "night",
      "thought": "今晚先關機，明天再決定什麼值得生氣。",
      "activityOptions": [
        "shutdown",
        "sleep",
        "bath",
        "music"
      ]
    },
    {
      "mood": "lonely",
      "weather": "sunny",
      "timeOfDay": "day",
      "thought": "一個人的今天，也可以出去看看世界。",
      "activityOptions": [
        "walk",
        "outing",
        "zoo",
        "bike",
        "exhibition"
      ]
    },
    {
      "mood": "lonely",
      "weather": "sunny",
      "timeOfDay": "evening",
      "thought": "夕陽很適合把今天的心情慢慢寫下來。",
      "activityOptions": [
        "journal",
        "seaside",
        "camera",
        "dessert"
      ]
    },
    {
      "mood": "lonely",
      "weather": "sunny",
      "timeOfDay": "night",
      "thought": "今晚如果有點孤單，就留一點時間陪自己。",
      "activityOptions": [
        "book",
        "stargazing",
        "journal",
        "camping",
        "board_game"
      ]
    },
    {
      "mood": "lonely",
      "weather": "cloudy",
      "timeOfDay": "day",
      "thought": "今天安靜了一點，也許適合找個角落坐坐。",
      "activityOptions": [
        "coffee",
        "book",
        "zoo",
        "hamburger",
        "exhibition"
      ]
    },
    {
      "mood": "lonely",
      "weather": "cloudy",
      "timeOfDay": "evening",
      "thought": "傍晚特別容易想起一些事，就寫下來吧。",
      "activityOptions": [
        "journal",
        "dessert",
        "walk",
        "tea"
      ]
    },
    {
      "mood": "lonely",
      "weather": "cloudy",
      "timeOfDay": "night",
      "thought": "今晚不用急著把孤單趕走，安靜待著也可以。",
      "activityOptions": [
        "music",
        "book",
        "journal",
        "sleep",
        "board_game"
      ]
    },
    {
      "mood": "lonely",
      "weather": "rainy",
      "timeOfDay": "day",
      "thought": "雨天讓世界變小了，泡杯熱的陪自己一下。",
      "activityOptions": [
        "coffee",
        "book",
        "dessert",
        "hamburger",
        "board_game",
        "exhibition"
      ]
    },
    {
      "mood": "lonely",
      "weather": "rainy",
      "timeOfDay": "evening",
      "thought": "雨聲陪著你，放一首熟悉的歌就好。",
      "activityOptions": [
        "music",
        "journal",
        "tea",
        "dessert",
        "board_game"
      ]
    },
    {
      "mood": "lonely",
      "weather": "rainy",
      "timeOfDay": "night",
      "thought": "今晚如果有點空，就把心裡的話寫下來。",
      "activityOptions": [
        "journal",
        "music",
        "book",
        "sleep",
        "board_game"
      ]
    },
    {
      "mood": "lonely",
      "weather": "windy",
      "timeOfDay": "day",
      "thought": "一個人走走，也能讓心裡多一點空間。",
      "activityOptions": [
        "walk",
        "bike",
        "outing",
        "seaside",
        "exhibition"
      ]
    },
    {
      "mood": "lonely",
      "weather": "windy",
      "timeOfDay": "evening",
      "thought": "晚風吹來的時候，適合慢慢走一段路。",
      "activityOptions": [
        "walk",
        "seaside",
        "journal",
        "camera"
      ]
    },
    {
      "mood": "lonely",
      "weather": "windy",
      "timeOfDay": "night",
      "thought": "世界安靜下來時，放點音樂陪自己。",
      "activityOptions": [
        "music",
        "book",
        "stargazing",
        "journal",
        "board_game"
      ]
    },
    {
      "mood": "lonely",
      "weather": "stormy",
      "timeOfDay": "day",
      "thought": "外面很吵，今天就待在自己的小世界裡。",
      "activityOptions": [
        "book",
        "journal",
        "dessert",
        "game",
        "board_game"
      ]
    },
    {
      "mood": "lonely",
      "weather": "stormy",
      "timeOfDay": "evening",
      "thought": "風雨很大，泡杯熱茶讓自己慢下來。",
      "activityOptions": [
        "tea",
        "book",
        "hotpot",
        "journal",
        "board_game"
      ]
    },
    {
      "mood": "lonely",
      "weather": "stormy",
      "timeOfDay": "night",
      "thought": "今晚不要急著填滿孤單，先好好休息。",
      "activityOptions": [
        "sleep",
        "book",
        "journal",
        "blanket",
        "board_game"
      ]
    }
  ]
}
;
