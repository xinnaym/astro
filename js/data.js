// ASTRO PRODUCT CATALOG DATA
const INITIAL_PRODUCTS_DATA = [
  {
    id: 'astro-01',
    name: 'Куртка Membrane Orbit Shell',
    category: 'Мужчинам',
    subCategory: 'Верхняя одежда',
    price: '18 990 ₽',
    priceNum: 18990,
    oldPrice: '22 500 ₽',
    badge: 'Новинка',
    desc: 'Городская мембранная куртка из трёхслойного японского нейлона 20k/20k. Защищает от штормового дождя и ветра, сохраняя воздухопроницаемость. Проклеенные швы, водонепроницаемые молнии YKK AquaGuard и анатомический капюшон.',
    details: 'Материал: 100% Recycled Nylon 3-Layer\nМембрана: 20 000 мм / 20 000 г/м²\nФурнитура: YKK AquaGuard\nСезон: Демисезон\nУход: Бережная стирка при 30°C специальным средством',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#111215', '#4a5059', '#c8f000'],
    colorName: 'Onyx Black',
    style: 'Techwear',
    images: [
      'https://images.pexels.com/photos/9645058/pexels-photo-9645058.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600',
      'https://images.pexels.com/photos/19128142/pexels-photo-19128142.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600'
    ],
    reviews: [
      { author: 'Денис Волков', rating: 5, date: '12 марта 2026', text: 'Качество мембраны невероятное! В ливень куртка абсолютно сухая внутри. Карманы удобные.' },
      { author: 'Максим Белов', rating: 5, date: '28 февраля 2026', text: 'Отличный крой, совершенно не стесняет движений.' }
    ]
  },
  {
    id: 'astro-02',
    name: 'Худи Heavyweight Gravity 480g',
    category: 'Мужчинам',
    subCategory: 'Худи и свитшоты',
    price: '8 490 ₽',
    priceNum: 8490,
    oldPrice: '9 900 ₽',
    badge: 'Хит',
    desc: 'Оверсайз худи из ультраплотного французского футера 480 г/м² без начёса. Двойной структурированный капюшон держит форму. Скрытые боковые карманы.',
    details: 'Материал: 100% органический хлопок супрем\nПлотность: 480 г/м²\nПосадка: Свободный оверсайз\nУход: Стирка при 30°C вывернутым наизнанку',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#c8ccd0', '#111215', '#f05c40'],
    colorName: 'Heather Ash',
    style: 'Streetwear',
    images: [
      'https://images.pexels.com/photos/19128142/pexels-photo-19128142.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600',
      'https://images.pexels.com/photos/9645058/pexels-photo-9645058.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600'
    ],
    reviews: [
      { author: 'Артур Ибрагимов', rating: 5, date: '18 марта 2026', text: 'Капюшон держит форму супер, плотность 480 ощущается очень монументально.' }
    ]
  },
  {
    id: 'astro-03',
    name: 'Брюки Tapered Cargo Nomad',
    category: 'Мужчинам',
    subCategory: 'Брюки',
    price: '11 490 ₽',
    priceNum: 11490,
    desc: 'Зауженные брюки карго из хлопкового твила с добавлением эластана. Накладные карманы на магнитных кнопках, регулируемый низ и вытачки на коленях.',
    details: 'Материал: 97% хлопок, 3% эластан\nЗастёжки: Магнитные клапаны\nСезон: Всесезонный\nУход: Машинная стирка при 30-40°C',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#3b3f45', '#111215', '#4b5320'],
    colorName: 'Graphite',
    style: 'Techwear',
    images: [
      'https://images.pexels.com/photos/19128142/pexels-photo-19128142.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600'
    ],
    reviews: [
      { author: 'Кирилл С.', rating: 5, date: '5 марта 2026', text: 'Очень удобные карманы, идеальная посадка по ноге.' }
    ]
  },
  {
    id: 'astro-04',
    name: 'Плащ-тренч Neo Dune',
    category: 'Женщинам',
    subCategory: 'Верхняя одежда',
    price: '16 900 ₽',
    priceNum: 16900,
    oldPrice: '19 500 ₽',
    badge: 'Новинка',
    desc: 'Женский тренч архитектурного кроя со свободным поясом и водоотталкивающей пропиткой. Глубокая шлица сзади и регулируемые паты на рукавах.',
    details: 'Материал: 65% хлопок, 35% полиэстер с DWR\nДлина: Миди\nУход: Деликатная стирка или сухая чистка',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#d2c29d', '#181a1f'],
    colorName: 'Sand Dune',
    style: 'Minimalism',
    images: [
      'https://images.pexels.com/photos/19169496/pexels-photo-19169496.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600'
    ],
    reviews: [
      { author: 'Екатерина Р.', rating: 5, date: '22 марта 2026', text: 'Тренч роскошный! Держит форму, капли воды просто стекают.' }
    ]
  },
  {
    id: 'astro-05',
    name: 'Футболка Heavy Oversize Core',
    category: 'Женщинам',
    subCategory: 'Футболки',
    price: '3 890 ₽',
    priceNum: 3890,
    badge: 'Хит',
    desc: 'Базовая футболка свободного кроя с заниженной линией плеча. Плотный кулирный трикотаж 240 г/м² пенье. Воротник не растягивается после стирок.',
    details: 'Материал: 100% гребенной хлопок пенье\nПлотность: 240 г/м²\nУход: Стирка при 30°C',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#ffffff', '#111215', '#c8f000'],
    colorName: 'Pure White',
    style: 'Streetwear',
    images: [
      'https://images.pexels.com/photos/19169496/pexels-photo-19169496.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600'
    ],
    reviews: [
      { author: 'Алина С.', rating: 5, date: '10 марта 2026', text: 'Плотная белая футболка, не просвечивает вообще.' }
    ]
  },
  {
    id: 'astro-06',
    name: 'Брюки Wide Leg Flow',
    category: 'Женщинам',
    subCategory: 'Брюки',
    price: '9 200 ₽',
    priceNum: 9200,
    desc: 'Широкие струящиеся брюки с защипами на талии. Эластичный мягкий пояс сзади и функциональные боковые карманы.',
    details: 'Материал: 70% вискоза, 26% полиэстер, 4% спандекс\nПосадка: High-waist, широкие брючины\nУход: Деликатная стирка 30°C',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#2e3238', '#ebe7df'],
    colorName: 'Charcoal',
    style: 'Minimalism',
    images: [
      'https://images.pexels.com/photos/19169496/pexels-photo-19169496.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600'
    ],
    reviews: [
      { author: 'Виктория М.', rating: 5, date: '25 февраля 2026', text: 'Очень красиво сидят, удлиняют силуэт.' }
    ]
  },
  {
    id: 'astro-07',
    name: 'Детская ветровка Astro Junior',
    category: 'Детям',
    subCategory: 'Верхняя одежда',
    price: '6 490 ₽',
    priceNum: 6490,
    oldPrice: '7 900 ₽',
    badge: 'Новинка',
    desc: 'Лёгкая непродуваемая детская куртка с грязеотталкивающим покрытием. Светоотражающие элементы по периметру 360° для безопасности в сумерках.',
    details: 'Материал: 100% ветрозащитный рипстоп полиэстер\nСветоотражатели: 3M Scotchlite\nСезон: Весна / Осень\nУход: Бережная машинная стирка 30°C',
    sizes: ['110-116', '122-128', '134-140', '146-152'],
    colors: ['#c8f000', '#1b263b', '#f05c40'],
    colorName: 'Astro Lime',
    style: 'Sport',
    images: [
      'https://images.pexels.com/photos/29271917/pexels-photo-29271917.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600'
    ],
    reviews: [
      { author: 'Ольга Н.', rating: 5, date: '14 марта 2026', text: 'Ребёнку комфортно, не продувает на ветру, легко чистится губкой.' }
    ]
  },
  {
    id: 'astro-08',
    name: 'Детский костюм Astro Play Set',
    category: 'Детям',
    subCategory: 'Комплекты',
    price: '5 200 ₽',
    priceNum: 5200,
    desc: 'Комплект из свободного худи и удобных джоггеров на мягкой резинке. 100% гипоаллергенный органический хлопок качества пенье.',
    details: 'Материал: 100% хлопок, футер 3-нитка\nГипоаллергенный стандарт\nУход: Стирка при 40°C',
    sizes: ['104-110', '116-122', '128-134', '140-146'],
    colors: ['#b8bac0', '#111215'],
    colorName: 'Melange Grey',
    style: 'Sport',
    images: [
      'https://images.pexels.com/photos/29271917/pexels-photo-29271917.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600'
    ],
    reviews: [
      { author: 'Светлана К.', rating: 5, date: '2 марта 2026', text: 'Мягкий и долговечный костюм, после стирок катышек нет.' }
    ]
  },
  {
    id: 'astro-09',
    name: 'Рюкзак Roll-Top Modular 24L',
    category: 'Аксессуары',
    subCategory: 'Сумки и рюкзаки',
    price: '8 900 ₽',
    priceNum: 8900,
    oldPrice: '10 500 ₽',
    badge: 'Новинка',
    desc: 'Городской модульный рюкзак из ткани Cordura 500D. Водонепроницаемый клапан roll-top, противоударный карман для ноутбука 16" и анатомическая спинка.',
    details: 'Материал: Cordura 500D Nylon\nФурнитура: Woojin Plastic, молнии YKK\nОбъём: 24 литра\nУход: Ручная чистка мыльной пеной',
    sizes: ['One Size (24L)'],
    colors: ['#111215', '#4a5059'],
    colorName: 'Matte Black',
    style: 'Techwear',
    images: [
      'https://images.pexels.com/photos/19169251/pexels-photo-19169251.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600'
    ],
    reviews: [
      { author: 'Илья Г.', rating: 5, date: '20 марта 2026', text: 'Очень прочный рюкзак, ноутбук защищен отлично.' }
    ]
  },
  {
    id: 'astro-10',
    name: 'Кепка 5-Panel Tech Cap',
    category: 'Аксессуары',
    subCategory: 'Головные уборы',
    price: '2 690 ₽',
    priceNum: 2690,
    desc: 'Пятипанельная бейсболка из быстросохнущего нейлона. Светоотражающий логотип Astro и надёжный ремешок с клипсой сзади.',
    details: 'Материал: 100% Quick-Dry Nylon\nРазмер: Регулируемый 55-60 см\nУход: Ручная стирка в прохладной воде',
    sizes: ['One Size'],
    colors: ['#111215', '#c8f000', '#8e949e'],
    colorName: 'Black',
    style: 'Streetwear',
    images: [
      'https://images.pexels.com/photos/19169251/pexels-photo-19169251.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600'
    ],
    reviews: [
      { author: 'Павел С.', rating: 5, date: '17 марта 2026', text: 'Легкая, удобная посадка.' }
    ]
  },
  {
    id: 'astro-11',
    name: 'Шапка бини Merino Orbit Knit',
    category: 'Аксессуары',
    subCategory: 'Головные уборы',
    price: '2 990 ₽',
    priceNum: 2990,
    badge: 'Тепло',
    desc: 'Вязаная шапка-бини из 100% тонкорунной мериносовой шерсти Extrafine. Не колется, отлично сохраняет тепло и дышит.',
    details: 'Материал: 100% мериносовая шерсть Extrafine (Италия)\nРазмер: Универсальный\nУход: Ручная стирка при 30°C',
    sizes: ['One Size'],
    colors: ['#111215', '#f05c40', '#f5f5f0'],
    colorName: 'Jet Black',
    style: 'Minimalism',
    images: [
      'https://images.pexels.com/photos/19169251/pexels-photo-19169251.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600'
    ],
    reviews: [
      { author: 'Наталья В.', rating: 5, date: '8 марта 2026', text: 'Очень мягкая, лоб не чешется.' }
    ]
  },
  {
    id: 'astro-12',
    name: 'Сумка Crossbody Sling Compact',
    category: 'Аксессуары',
    subCategory: 'Сумки и рюкзаки',
    price: '4 490 ₽',
    priceNum: 4490,
    badge: 'Хит',
    desc: 'Компактная городская сумка через плечо из водостойкого рипстопа. Внутренний органайзер, карабин для ключей и быстроразъёмная пряжка.',
    details: 'Материал: Рипстоп нейлон 420D\nОбъём: 2.5 л\nУход: Влажная чистка',
    sizes: ['One Size'],
    colors: ['#111215', '#c8f000'],
    colorName: 'Black',
    style: 'Streetwear',
    images: [
      'https://images.pexels.com/photos/19169251/pexels-photo-19169251.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600'
    ],
    reviews: [
      { author: 'Глеб Д.', rating: 5, date: '11 марта 2026', text: 'Вмещаются телефон, паспорт, ключи. Удобная магнитная застёжка.' }
    ]
  }
];
