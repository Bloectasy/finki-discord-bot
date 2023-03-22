/* eslint-disable id-length */
export const commands = {
  about: 'Информации за ботот',
  anto: 'Анто факт',
  calendar: 'Академски календар',
  classroom: 'Информации за простории',
  'course info': 'Информации за предмети',
  'course participants': 'Број на слушатели на предмети',
  'course prerequisite': 'Предуслови за предмети',
  'course professors': 'Наставен кадар на предмети',
  'course role': 'Број на корисници во канали на предмети',
  'course summary': 'Сите информации за предмети',
  'courses prerequisite': 'Сите предмети според предуслов',
  'courses programs': 'Сите предмети според смер',
  crosspost: 'Вклучи или исклучи crossposting',
  embed: 'Креирај ембед',
  faq: 'Најчесто поставувани прашања',
  help: 'Помош за командите',
  home: 'Изворен код на ботот',
  invite: 'Пристапен линк до серверот',
  link: 'Најчесто барани линкови',
  'list links': 'Листа од сите линкови',
  'list questions': 'Листа од сите прашања',
  members: 'Број на членови на серверот',
  ping: 'Пинг на ботот',
  'poll add': 'Додади опции на анкети',
  'poll anonymous': 'Измени анонимност на анкети',
  'poll create': 'Креирај анкети',
  'poll delete': 'Избриши анкети',
  'poll edit': 'Измени наслов и опис на анкети',
  'poll open': 'Измени пристап на анкети',
  'poll remove': 'Избриши опции на анкети',
  'poll show': 'Прикажи анкети',
  'poll stats': 'Статистика за анкети',
  profile: 'Информации за студенти',
  purge: 'Бриши пораки',
  quiz: 'Започни го квизот Кој Сака Да Биде Морален Победник',
  reminder: 'Потсетник',
  session: 'Распоред за испитни сесии и колоквиуми',
  staff: 'Информации за професори',
  'statistics activity': 'Статистика за улогите за активности',
  'statistics color': 'Статистика за улогите за бои',
  'statistics course': 'Статистика за улогите за предмети',
  'statistics notification': 'Статистика за улогите за нотификации',
  'statistics program': 'Статистика за улогите за програми',
  'statistics year': 'Статистика за улогите за години',
  timetable: 'Распоред на часови',
};

export const programMapping: { [index in ProgramKeys]: ProgramValues } = {
  ИМБ: 'imb',
  КЕ: 'ke',
  КИ: 'ki',
  КН: 'kn',
  ПИТ: 'pit',
  СИИС: 'siis',
};

export const emojis = {
  '!': '❗',
  '#': '#️⃣',
  '*': '*️⃣',
  '?': '❓',
  '0': '0️⃣',
  '1': '1️⃣',
  '2': '2️⃣',
  '3': '3️⃣',
  '4': '4️⃣',
  '5': '5️⃣',
  '6': '6️⃣',
  '7': '7️⃣',
  '8': '8️⃣',
  '9': '9️⃣',
  '10': '🔟',
  a: '🇦',
  b: '🇧',
  c: '🇨',
  d: '🇩',
  e: '🇪',
  f: '🇫',
  g: '🇬',
  h: '🇭',
  i: '🇮',
  j: '🇯',
  k: '🇰',
  l: '🇱',
  m: '🇲',
  n: '🇳',
  o: '🇴',
  p: '🇵',
  q: '🇶',
  r: '🇷',
  s: '🇸',
  t: '🇹',
  u: '🇺',
  v: '🇻',
  w: '🇼',
  x: '🇽',
  y: '🇾',
  z: '🇿',
};

export const errors = {
  adminOnlyCommand: 'Оваа команда е само за администратори.',
  courseNotFound: 'Не постои таков предмет.',
  invalidChannel: 'Невалиден канал.',
  pollNoPermission: 'Ова не е ваша анкета.',
  pollNotFound: 'Анкетата не постои.',
  quizNoPermission: 'Ова не е ваш квиз.',
  serverOnlyCommand: 'Оваа команда се повикува само во сервер.',
};

export const quizHelp =
  'Добредојдовте во помош делот на квизот!\n\nКако се игра?\nВо текот на квизот ќе ви бидат поставени 15 прашања поврзани со темата и областа на ФИНКИ и серверот.\nОдговорете на сите 15 прашања и ќе добиете две награди.\nЕдна од наградите е сопствена боја на серверот, а другата за сега е тајна. :face_with_hand_over_mouth:\n\nВо текот на квизот ќе имате 3 алатки за помош:\n- 50 - 50\n- друго прашање\n- помош од компјутер\n\nОвие алатки ќе може да ги искористите само до 12-тото прашање, после тоа НЕ СЕ ДОЗВОЛЕНИ!\n\nКвизот нема бесконечен број на обиди, смеете да го играте само 3 пати!\n\nДоколку се случи да изгубите еден обид и мислите дека неправедно сте го изгубиле, контактирајте нè за да решиме овој проблем.\nВи посакуваме среќна и забавна игра!';
