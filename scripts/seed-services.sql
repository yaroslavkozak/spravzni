DELETE FROM service_options;
DELETE FROM services;

INSERT INTO services (
  id, display_order, heading_uk, heading_en,
  paragraphs_uk, paragraphs_en,
  primary_button_text_uk, primary_button_text_en,
  secondary_button_text_uk, secondary_button_text_en,
  primary_action, secondary_action,
  image_key, overlay_text_uk, overlay_text_en,
  show_primary_button, is_active
) VALUES (
  1,
  1,
  'Активний відпочинок для себе. Тімбілдинг для бізнесу',
  'Active rest for yourself. Team building for business',
  '["35 км від Львова — і ти приїжджаєш спонтанно, не помічаючи, як минула дорога. Це ідеально, щоб провести у нас вихідні або одноденний тімбілдинг.","Тут — піші маршрути для любителів екотуризму. Орендуй велосипеди чи сідай верхи — і вирушай мальовничим Львівським Опіллям. Поблизу — каскад озер та Дністер. Тож можеш порибалити або влаштувати активний день на сапах, байдарках чи каноє.","А після активного дня — крафтова риба на мангалі і вечір біля ватри. І це ми ще не розповіли про гриби та малину, баранців та садівництво!"]',
  '["35 km from Lviv — and you arrive almost without noticing the trip. Perfect for a weekend or a one‑day team building.","There are hiking routes for eco‑tourism lovers. Rent bikes or ride horses and explore the scenic Lviv Opillia. Nearby are a cascade of lakes and the Dnister, so you can fish or spend an active day on SUPs, kayaks, or canoes.","After an active day — craft fish on the grill and an evening by the fire. And we haven''t even told you about mushrooms, raspberries, sheep, and gardening!"]',
  'Варіанти відпочинку',
  'Vacation options',
  'Повідомте коли старт',
  'Notify me when you open',
  'vacationOptions',
  'contact',
  'services.service1',
  'чекаємо з травня',
  'we open in May',
  1,
  1
);

INSERT INTO services (
  id, display_order, heading_uk, heading_en,
  paragraphs_uk, paragraphs_en,
  primary_button_text_uk, primary_button_text_en,
  secondary_button_text_uk, secondary_button_text_en,
  primary_action, secondary_action,
  image_key, overlay_text_uk, overlay_text_en,
  show_primary_button, is_active
) VALUES (
  2,
  2,
  'Хатинка під соснами',
  'Cabin under the pines',
  '["Ти можеш зустрічати світанки з чашкою кави, читати на терасі або просто слухати ліс. А надвечір піти у СПА і повернутись до сну приємно втомленим та наповненим(ою).","Ми створюємо це місце для тих, хто шукає спокій, любить естетику природи, але й цінує комфорт.","Тут буде все для двох-чотирьох гостей: два поверхи, зручні ліжка, кухня, тераса і великі вікна, щоб милуватися лісом 24 на 7. Це місце сили і спокою. Тут ти можеш бути собою, можеш просто БУТИ.","Мінімальне бронювання — дві доби."]',
  '["Watch the sunrise with a cup of coffee, read on the terrace, or simply listen to the forest. In the evening, go to the SPA and return to sleep pleasantly tired and full.","We''re creating this place for those who seek calm, love nature''s aesthetics, and value comfort.","Everything for two to four guests: two floors, comfy beds, a kitchen, a terrace, and large windows to admire the forest 24/7. A place of strength and calm where you can just be yourself.","Minimum booking — two nights."]',
  'Дізнатися більше',
  'Learn more',
  'Повідомте коли старт',
  'Notify me when you open',
  'none',
  'contact',
  'services.service2',
  'чекаємо з червня',
  'we open in June',
  0,
  1
);

INSERT INTO services (
  id, display_order, heading_uk, heading_en,
  paragraphs_uk, paragraphs_en,
  primary_button_text_uk, primary_button_text_en,
  secondary_button_text_uk, secondary_button_text_en,
  primary_action, secondary_action,
  image_key, overlay_text_uk, overlay_text_en,
  show_primary_button, is_active
) VALUES (
  3,
  3,
  'Безбар''єрний СПА',
  'Barrier‑free SPA',
  '["Наш СПА-центр буде обладнаний лазнею з контрастним басейном, інфрачервоною сауною та сінною кімнатою.","Два чани розслаблятимуть усіма ароматами лісу. А окремі приміщення дозволятимуть одночасно відпочивати кільком групам — у цілковитій приватності.","І, що вкрай важливо, наш СПА-центр буде повністю безбарʼєрним: ми дбаємо про найменші деталі для зручності усіх наших гостей."]',
  '["Our SPA center will feature a bathhouse with a contrast pool, an infrared sauna, and a hay room.","Two hot tubs will relax you with forest aromas. Separate rooms allow multiple groups to relax in complete privacy.","And importantly, our SPA center will be fully barrier‑free: we care about the smallest details for all guests'' comfort."]',
  'Дізнатися більше',
  'Learn more',
  'Повідомте коли старт',
  'Notify me when you open',
  'none',
  'contact',
  'services.service3',
  'чекаємо з травня',
  'we open in May',
  0,
  1
);

INSERT INTO services (
  id, display_order, heading_uk, heading_en,
  paragraphs_uk, paragraphs_en,
  primary_button_text_uk, primary_button_text_en,
  secondary_button_text_uk, secondary_button_text_en,
  primary_action, secondary_action,
  image_key, overlay_text_uk, overlay_text_en,
  show_primary_button, is_active
) VALUES (
  4,
  4,
  'Події під ключ',
  'Turn‑key events',
  '["Для бізнесу пропонуємо інфраструктуру для стратегічних сесій, тренінгів, ретритів та інших бізнес-подій до 30 осіб. Маємо необхідну техніку, резервне живлення та безперебійний WiFi.","Для ваших колег ми проведемо авторську програму командотворення, яка поверне їм злагодженість та контакт.","Для індивідуальних клієнтів організуємо під ключ ваші особисті події: атмосферну вечірку серед сосен, затишний день народження або невеличке весілля.","Твій персональний координатор подбає про деталі, які є для тебе важливими."]',
  '["For business we offer infrastructure for strategy sessions, trainings, retreats, and other events up to 30 people. We have the necessary equipment, backup power, and reliable Wi‑Fi.","For your colleagues we provide a custom team‑building program that restores cohesion and connection.","For individual clients we organize personal events end‑to‑end: an atmospheric party among pines, a cozy birthday, or a small wedding.","Your personal coordinator will take care of the details that matter to you."]',
  'Дізнатися більше',
  'Learn more',
  'Повідомте коли старт',
  'Notify me when you open',
  'none',
  'contact',
  'services.service4',
  'чекаємо з червня',
  'we open in June',
  0,
  1
);

INSERT INTO services (
  id, display_order, heading_uk, heading_en,
  paragraphs_uk, paragraphs_en,
  primary_button_text_uk, primary_button_text_en,
  secondary_button_text_uk, secondary_button_text_en,
  primary_action, secondary_action,
  image_key, overlay_text_uk, overlay_text_en,
  show_primary_button, is_active
) VALUES (
  5,
  5,
  'Групова програма «Шлях сили»',
  'Group program "Path of Strength"',
  '["Ми переконані: турбота про внутрішній стан — не слабкість, а основа стійкості. Тому створили програму, що поєднує менторську підтримку і роботу з тілом. А відтак — допомагає сповільнитись і знову відчути опору всередині себе. Формати: 1, 3 та 7 днів. Групи від 10 і до 20 людей.","Під час проведення програми центр доступний лише для її учасників.","Безкоштовно для: ветеранів, членів їхніх родин, а також родин полеглих, полонених та зниклих безвісти."]',
  '["We believe caring for your inner state is not weakness but the foundation of resilience. That''s why we created a program combining mentoring support and bodywork — helping you slow down and feel inner support again. Formats: 1, 3, and 7 days. Groups from 10 to 20 people.","During the program, the center is available only to participants.","Free for veterans, their families, and families of the fallen, captured, and missing."]',
  'Дізнатися більше',
  'Learn more',
  'Повідомте коли старт',
  'Notify me when you open',
  'none',
  'contact',
  'services.service5',
  'чекаємо з червня',
  'we open in June',
  0,
  1
);

INSERT INTO service_options (
  service_id, display_order,
  title_uk, title_en,
  description_uk, description_en,
  image_path, is_active
) VALUES (
  1,
  1,
  'Сапи, каяки та байдарки',
  'SUPs, kayaks, and canoes',
  'Вода задає ритм: спокійний, але живий. Тіло працює, але вже немає напруги. Дихання вирівнюється. І усе стає легшим.',
  'Water sets the rhythm: calm yet alive. Your body works without tension. Breath evens out, and everything feels lighter.',
  '/images/services/s1/1.webp',
  1
);

INSERT INTO service_options (
  service_id, display_order,
  title_uk, title_en,
  description_uk, description_en,
  image_path, is_active
) VALUES (
  1,
  2,
  'Екскурсія Стільським Городищем',
  'Tour of the Stilske hillfort',
  'Вирушай на професійну екскурсію місцем, де колись була столиця білих хорватів. Це місце тебе вразить. А ми подбаємо про обід на вогні опісля.',
  'Go on a guided tour of the place where the White Croats once had their capital. It will impress you, and we''ll take care of lunch by the fire afterward.',
  '/images/services/s1/2.webp',
  1
);

INSERT INTO service_options (
  service_id, display_order,
  title_uk, title_en,
  description_uk, description_en,
  image_path, is_active
) VALUES (
  1,
  3,
  'Приготування їжі на мангалі',
  'Grilling on the barbecue',
  'Усе, що потрібно — жар, свіжа їжа та хороша компанія. Готуйте свої продукти чи замовляйте у нас. Усе необхідне приладдя входить до вартості.',
  'All you need is heat, fresh food, and good company. Bring your own products or order from us. All necessary equipment is included.',
  '/images/services/s1/3.webp',
  1
);

INSERT INTO service_options (
  service_id, display_order,
  title_uk, title_en,
  description_uk, description_en,
  image_path, is_active
) VALUES (
  1,
  4,
  'Затиш',
  'Coziness',
  'Може, прочи захоче ватри.',
  'Maybe the fire will want to burn.',
  '/images/services/s1/4.webp',
  1
);

INSERT INTO service_options (
  service_id, display_order,
  title_uk, title_en,
  description_uk, description_en,
  image_path, is_active
) VALUES (
  1,
  5,
  'Піші прогулянки',
  'Hiking',
  'Досліджуй мальовничі стежки Львівського Опілля. Прогулянки різної складності для всіх рівнів підготовки.',
  'Explore scenic trails of Lviv Opillia. Walks of varying difficulty for all levels.',
  '/images/services/s1/5.webp',
  1
);

INSERT INTO service_options (
  service_id, display_order,
  title_uk, title_en,
  description_uk, description_en,
  image_path, is_active
) VALUES (
  1,
  6,
  'Велосипедні маршрути',
  'Cycling routes',
  'Активний відпочинок на велосипеді по живописній місцевості. Маршрути для початківців та досвідчених велосипедистів.',
  'Active cycling through picturesque landscapes. Routes for beginners and experienced riders.',
  '/images/services/s1/6.webp',
  1
);

INSERT INTO service_options (
  service_id, display_order,
  title_uk, title_en,
  description_uk, description_en,
  image_path, is_active
) VALUES (
  1,
  7,
  'Кінні прогулянки',
  'Horseback rides',
  'Відчуй свободу та єдність з природою під час кінної прогулянки по лісових стежках.',
  'Feel freedom and unity with nature during a horseback ride along forest paths.',
  '/images/services/s1/7.webp',
  1
);

INSERT INTO service_options (
  service_id, display_order,
  title_uk, title_en,
  description_uk, description_en,
  image_path, is_active
) VALUES (
  1,
  8,
  'Риболовля',
  'Fishing',
  'Розслабляюча риболовля на каскаді озер та річці Дністер. Все необхідне обладнання надається.',
  'Relaxing fishing on a cascade of lakes and the Dnister River. All necessary equipment is provided.',
  '/images/services/s1/8.webp',
  1
);

INSERT INTO service_options (
  service_id, display_order,
  title_uk, title_en,
  description_uk, description_en,
  image_path, is_active
) VALUES (
  1,
  9,
  'Вечір біля багаття',
  'Evening by the fire',
  'Затишний вечір біля вогню з гарячими напоями, розмовами та атмосферою спокою.',
  'A cozy evening by the fire with hot drinks, conversation, and a calm atmosphere.',
  '/images/services/s1/9.webp',
  1
);