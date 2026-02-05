/**
 * Seed Services and Service Options
 * Run with: npx wrangler d1 execute spravzni-db --remote --file=scripts/seed-services.sql
 * Or use: bun run scripts/seed-services.ts
 */

// Services data from translations
const services = [
  {
    display_order: 1,
    heading_uk: 'Активний відпочинок для себе. Тімбілдинг для бізнесу',
    heading_en: 'Active rest for yourself. Team building for business',
    paragraphs_uk: [
      '35 км від Львова — і ти приїжджаєш спонтанно, не помічаючи, як минула дорога. Це ідеально, щоб провести у нас вихідні або одноденний тімбілдинг.',
      'Тут — піші маршрути для любителів екотуризму. Орендуй велосипеди чи сідай верхи — і вирушай мальовничим Львівським Опіллям. Поблизу — каскад озер та Дністер. Тож можеш порибалити або влаштувати активний день на сапах, байдарках чи каноє.',
      'А після активного дня — крафтова риба на мангалі і вечір біля ватри. І це ми ще не розповіли про гриби та малину, баранців та садівництво!',
    ],
    paragraphs_en: [
      '35 km from Lviv — and you arrive almost without noticing the trip. Perfect for a weekend or a one‑day team building.',
      'There are hiking routes for eco‑tourism lovers. Rent bikes or ride horses and explore the scenic Lviv Opillia. Nearby are a cascade of lakes and the Dnister, so you can fish or spend an active day on SUPs, kayaks, or canoes.',
      "After an active day — craft fish on the grill and an evening by the fire. And we haven't even told you about mushrooms, raspberries, sheep, and gardening!",
    ],
    primary_button_text_uk: 'Варіанти відпочинку',
    primary_button_text_en: 'Vacation options',
    secondary_button_text_uk: 'Повідомте коли старт',
    secondary_button_text_en: 'Notify me when you open',
    primary_action: 'vacationOptions',
    secondary_action: 'contact',
    image_key: 'services.service1',
    overlay_text_uk: 'чекаємо з травня',
    overlay_text_en: 'we open in May',
    show_primary_button: true,
    is_active: true,
  },
  {
    display_order: 2,
    heading_uk: 'Хатинка під соснами',
    heading_en: 'Cabin under the pines',
    paragraphs_uk: [
      'Ти можеш зустрічати світанки з чашкою кави, читати на терасі або просто слухати ліс. А надвечір піти у СПА і повернутись до сну приємно втомленим та наповненим(ою).',
      'Ми створюємо це місце для тих, хто шукає спокій, любить естетику природи, але й цінує комфорт.',
      'Тут буде все для двох-чотирьох гостей: два поверхи, зручні ліжка, кухня, тераса і великі вікна, щоб милуватися лісом 24 на 7. Це місце сили і спокою. Тут ти можеш бути собою, можеш просто БУТИ.',
      'Мінімальне бронювання — дві доби.',
    ],
    paragraphs_en: [
      'Watch the sunrise with a cup of coffee, read on the terrace, or simply listen to the forest. In the evening, go to the SPA and return to sleep pleasantly tired and full.',
      "We're creating this place for those who seek calm, love nature's aesthetics, and value comfort.",
      'Everything for two to four guests: two floors, comfy beds, a kitchen, a terrace, and large windows to admire the forest 24/7. A place of strength and calm where you can just be yourself.',
      'Minimum booking — two nights.',
    ],
    primary_button_text_uk: 'Дізнатися більше',
    primary_button_text_en: 'Learn more',
    secondary_button_text_uk: 'Повідомте коли старт',
    secondary_button_text_en: 'Notify me when you open',
    primary_action: 'none',
    secondary_action: 'contact',
    image_key: 'services.service2',
    overlay_text_uk: 'чекаємо з червня',
    overlay_text_en: 'we open in June',
    show_primary_button: false,
    is_active: true,
  },
  {
    display_order: 3,
    heading_uk: "Безбар'єрний СПА",
    heading_en: 'Barrier‑free SPA',
    paragraphs_uk: [
      'Наш СПА-центр буде обладнаний лазнею з контрастним басейном, інфрачервоною сауною та сінною кімнатою.',
      'Два чани розслаблятимуть усіма ароматами лісу. А окремі приміщення дозволятимуть одночасно відпочивати кільком групам — у цілковитій приватності.',
      'І, що вкрай важливо, наш СПА-центр буде повністю безбарʼєрним: ми дбаємо про найменші деталі для зручності усіх наших гостей.',
    ],
    paragraphs_en: [
      'Our SPA center will feature a bathhouse with a contrast pool, an infrared sauna, and a hay room.',
      'Two hot tubs will relax you with forest aromas. Separate rooms allow multiple groups to relax in complete privacy.',
      "And importantly, our SPA center will be fully barrier‑free: we care about the smallest details for all guests' comfort.",
    ],
    primary_button_text_uk: 'Дізнатися більше',
    primary_button_text_en: 'Learn more',
    secondary_button_text_uk: 'Повідомте коли старт',
    secondary_button_text_en: 'Notify me when you open',
    primary_action: 'none',
    secondary_action: 'contact',
    image_key: 'services.service3',
    overlay_text_uk: 'чекаємо з травня',
    overlay_text_en: 'we open in May',
    show_primary_button: false,
    is_active: true,
  },
  {
    display_order: 4,
    heading_uk: 'Події під ключ',
    heading_en: 'Turn‑key events',
    paragraphs_uk: [
      'Для бізнесу пропонуємо інфраструктуру для стратегічних сесій, тренінгів, ретритів та інших бізнес-подій до 30 осіб. Маємо необхідну техніку, резервне живлення та безперебійний WiFi.',
      'Для ваших колег ми проведемо авторську програму командотворення, яка поверне їм злагодженість та контакт.',
      'Для індивідуальних клієнтів організуємо під ключ ваші особисті події: атмосферну вечірку серед сосен, затишний день народження або невеличке весілля.',
      'Твій персональний координатор подбає про деталі, які є для тебе важливими.',
    ],
    paragraphs_en: [
      'For business we offer infrastructure for strategy sessions, trainings, retreats, and other events up to 30 people. We have the necessary equipment, backup power, and reliable Wi‑Fi.',
      'For your colleagues we provide a custom team‑building program that restores cohesion and connection.',
      'For individual clients we organize personal events end‑to‑end: an atmospheric party among pines, a cozy birthday, or a small wedding.',
      'Your personal coordinator will take care of the details that matter to you.',
    ],
    primary_button_text_uk: 'Дізнатися більше',
    primary_button_text_en: 'Learn more',
    secondary_button_text_uk: 'Повідомте коли старт',
    secondary_button_text_en: 'Notify me when you open',
    primary_action: 'none',
    secondary_action: 'contact',
    image_key: 'services.service4',
    overlay_text_uk: 'чекаємо з червня',
    overlay_text_en: 'we open in June',
    show_primary_button: false,
    is_active: true,
  },
  {
    display_order: 5,
    heading_uk: 'Групова програма «Шлях сили»',
    heading_en: 'Group program "Path of Strength"',
    paragraphs_uk: [
      'Ми переконані: турбота про внутрішній стан — не слабкість, а основа стійкості. Тому створили програму, що поєднує менторську підтримку і роботу з тілом. А відтак — допомагає сповільнитись і знову відчути опору всередині себе. Формати: 1, 3 та 7 днів. Групи від 10 і до 20 людей.',
      'Під час проведення програми центр доступний лише для її учасників.',
      'Безкоштовно для: ветеранів, членів їхніх родин, а також родин полеглих, полонених та зниклих безвісти.',
    ],
    paragraphs_en: [
      "We believe caring for your inner state is not weakness but the foundation of resilience. That's why we created a program combining mentoring support and bodywork — helping you slow down and feel inner support again. Formats: 1, 3, and 7 days. Groups from 10 to 20 people.",
      'During the program, the center is available only to participants.',
      'Free for veterans, their families, and families of the fallen, captured, and missing.',
    ],
    primary_button_text_uk: 'Дізнатися більше',
    primary_button_text_en: 'Learn more',
    secondary_button_text_uk: 'Повідомте коли старт',
    secondary_button_text_en: 'Notify me when you open',
    primary_action: 'none',
    secondary_action: 'contact',
    image_key: 'services.service5',
    overlay_text_uk: 'чекаємо з червня',
    overlay_text_en: 'we open in June',
    show_primary_button: false,
    is_active: true,
  },
]

// Service options for service 1 (vacation options)
const serviceOptions = [
  {
    service_id: 1,
    display_order: 1,
    title_uk: 'Сапи, каяки та байдарки',
    title_en: 'SUPs, kayaks, and canoes',
    description_uk:
      'Вода задає ритм: спокійний, але живий. Тіло працює, але вже немає напруги. Дихання вирівнюється. І усе стає легшим.',
    description_en:
      'Water sets the rhythm: calm yet alive. Your body works without tension. Breath evens out, and everything feels lighter.',
    image_path: '/images/services/s1/1.webp',
    is_active: true,
  },
  {
    service_id: 1,
    display_order: 2,
    title_uk: 'Екскурсія Стільським Городищем',
    title_en: 'Tour of the Stilske hillfort',
    description_uk:
      'Вирушай на професійну екскурсію місцем, де колись була столиця білих хорватів. Це місце тебе вразить. А ми подбаємо про обід на вогні опісля.',
    description_en:
      "Go on a guided tour of the place where the White Croats once had their capital. It will impress you, and we'll take care of lunch by the fire afterward.",
    image_path: '/images/services/s1/2.webp',
    is_active: true,
  },
  {
    service_id: 1,
    display_order: 3,
    title_uk: 'Приготування їжі на мангалі',
    title_en: 'Grilling on the barbecue',
    description_uk:
      'Усе, що потрібно — жар, свіжа їжа та хороша компанія. Готуйте свої продукти чи замовляйте у нас. Усе необхідне приладдя входить до вартості.',
    description_en:
      'All you need is heat, fresh food, and good company. Bring your own products or order from us. All necessary equipment is included.',
    image_path: '/images/services/s1/3.webp',
    is_active: true,
  },
  {
    service_id: 1,
    display_order: 4,
    title_uk: 'Затиш',
    title_en: 'Coziness',
    description_uk: 'Може, прочи захоче ватри.',
    description_en: 'Maybe the fire will want to burn.',
    image_path: '/images/services/s1/4.webp',
    is_active: true,
  },
  {
    service_id: 1,
    display_order: 5,
    title_uk: 'Піші прогулянки',
    title_en: 'Hiking',
    description_uk: 'Досліджуй мальовничі стежки Львівського Опілля. Прогулянки різної складності для всіх рівнів підготовки.',
    description_en: 'Explore scenic trails of Lviv Opillia. Walks of varying difficulty for all levels.',
    image_path: '/images/services/s1/5.webp',
    is_active: true,
  },
  {
    service_id: 1,
    display_order: 6,
    title_uk: 'Велосипедні маршрути',
    title_en: 'Cycling routes',
    description_uk: 'Активний відпочинок на велосипеді по живописній місцевості. Маршрути для початківців та досвідчених велосипедистів.',
    description_en: 'Active cycling through picturesque landscapes. Routes for beginners and experienced riders.',
    image_path: '/images/services/s1/6.webp',
    is_active: true,
  },
  {
    service_id: 1,
    display_order: 7,
    title_uk: 'Кінні прогулянки',
    title_en: 'Horseback rides',
    description_uk: 'Відчуй свободу та єдність з природою під час кінної прогулянки по лісових стежках.',
    description_en: 'Feel freedom and unity with nature during a horseback ride along forest paths.',
    image_path: '/images/services/s1/7.webp',
    is_active: true,
  },
  {
    service_id: 1,
    display_order: 8,
    title_uk: 'Риболовля',
    title_en: 'Fishing',
    description_uk: 'Розслабляюча риболовля на каскаді озер та річці Дністер. Все необхідне обладнання надається.',
    description_en: 'Relaxing fishing on a cascade of lakes and the Dnister River. All necessary equipment is provided.',
    image_path: '/images/services/s1/8.webp',
    is_active: true,
  },
  {
    service_id: 1,
    display_order: 9,
    title_uk: 'Вечір біля багаття',
    title_en: 'Evening by the fire',
    description_uk: 'Затишний вечір біля вогню з гарячими напоями, розмовами та атмосферою спокою.',
    description_en: 'A cozy evening by the fire with hot drinks, conversation, and a calm atmosphere.',
    image_path: '/images/services/s1/9.webp',
    is_active: true,
  },
]

function escapeSQL(str: string | null | undefined): string {
  if (!str) return 'NULL'
  return `'${str.replace(/'/g, "''")}'`
}

function generateSQL() {
  const sql: string[] = []

  // Insert services
  for (const service of services) {
    const paragraphsUkJson = JSON.stringify(service.paragraphs_uk)
    const paragraphsEnJson = service.paragraphs_en.length > 0 ? JSON.stringify(service.paragraphs_en) : 'NULL'

    sql.push(`
INSERT INTO services (
  display_order, heading_uk, heading_en,
  paragraphs_uk, paragraphs_en,
  primary_button_text_uk, primary_button_text_en,
  secondary_button_text_uk, secondary_button_text_en,
  primary_action, secondary_action,
  image_key, overlay_text_uk, overlay_text_en,
  show_primary_button, is_active
) VALUES (
  ${service.display_order},
  ${escapeSQL(service.heading_uk)},
  ${escapeSQL(service.heading_en)},
  ${escapeSQL(paragraphsUkJson)},
  ${paragraphsEnJson === 'NULL' ? 'NULL' : escapeSQL(paragraphsEnJson)},
  ${escapeSQL(service.primary_button_text_uk)},
  ${escapeSQL(service.primary_button_text_en)},
  ${escapeSQL(service.secondary_button_text_uk)},
  ${escapeSQL(service.secondary_button_text_en)},
  ${escapeSQL(service.primary_action)},
  ${escapeSQL(service.secondary_action)},
  ${escapeSQL(service.image_key)},
  ${escapeSQL(service.overlay_text_uk)},
  ${escapeSQL(service.overlay_text_en)},
  ${service.show_primary_button ? 1 : 0},
  ${service.is_active ? 1 : 0}
);`)
  }

  // Insert service options (assuming service_id 1 is the first service)
  for (const option of serviceOptions) {
    sql.push(`
INSERT INTO service_options (
  service_id, display_order,
  title_uk, title_en,
  description_uk, description_en,
  image_path, is_active
) VALUES (
  ${option.service_id},
  ${option.display_order},
  ${escapeSQL(option.title_uk)},
  ${escapeSQL(option.title_en)},
  ${escapeSQL(option.description_uk)},
  ${escapeSQL(option.description_en)},
  ${escapeSQL(option.image_path)},
  ${option.is_active ? 1 : 0}
);`)
  }

  return sql.join('\n')
}

// Generate SQL file
const sqlContent = generateSQL()
console.log('Generated SQL:')
console.log(sqlContent)

// Write to file
import { writeFileSync } from 'fs'
import { join } from 'path'

const outputPath = join(process.cwd(), 'scripts', 'seed-services.sql')
writeFileSync(outputPath, sqlContent, 'utf-8')
console.log(`\n✅ SQL file written to: ${outputPath}`)
console.log('\nTo execute, run:')
console.log('npx wrangler d1 execute spravzni-db --remote --file=scripts/seed-services.sql')
