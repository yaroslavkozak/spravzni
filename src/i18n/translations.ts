import type { SupportedLanguage } from '@/src/lib/i18n'

export type TranslationKey =
  | 'common.loading'
  // Header
  | 'header.banner.openingSummer'
  | 'header.nav.us'
  | 'header.nav.services'
  | 'header.nav.socialRole'
  | 'header.nav.contribute'
  | 'header.nav.location'
  | 'header.cta.whenStart'
  // 404
  | '404.title'
  | '404.description'
  | '404.backToHome'
  // Hero
  | 'hero.title.line1'
  | 'hero.title.line2'
  | 'hero.subtitle.main'
  | 'hero.subtitle.donationInfo'
  | 'hero.subtitle.report'
  | 'hero.cta.services'
  | 'hero.scroll'
  // Report page
  | 'report.back'
  | 'report.title'
  | 'report.organization'
  | 'report.updatedLabel'
  | 'report.updatedDate'
  | 'report.incoming.amount'
  | 'report.incoming.label'
  | 'report.outgoing.amount'
  | 'report.outgoing.label'
  | 'report.section.usageTitle'
  | 'report.table.period'
  | 'report.table.amount'
  | 'report.table.category'
  | 'report.rows.1.period'
  | 'report.rows.1.amount'
  | 'report.rows.1.category'
  | 'report.rows.2.period'
  | 'report.rows.2.amount'
  | 'report.rows.2.category'
  | 'report.rows.3.period'
  | 'report.rows.3.amount'
  | 'report.rows.3.category'
  | 'report.rows.4.period'
  | 'report.rows.4.amount'
  | 'report.rows.4.category'
  // Contact popup
  | 'contact.title'
  | 'contact.success.title'
  | 'contact.success.body'
  | 'contact.error.selectInterest'
  | 'contact.error.submitDefault'
  | 'contact.field.name'
  | 'contact.field.namePlaceholder'
  | 'contact.field.phone'
  | 'contact.error.phoneInvalid'
  | 'contact.field.email'
  | 'contact.error.emailRequired'
  | 'contact.error.emailFormatHint'
  | 'contact.field.responseChannel'
  | 'contact.field.interests'
  | 'contact.interest.all'
  | 'contact.interest.active'
  | 'contact.interest.cabin'
  | 'contact.interest.spa'
  | 'contact.interest.events'
  | 'contact.interest.program'
  | 'contact.field.comment'
  | 'contact.field.commentPlaceholder'
  | 'contact.field.wantPrice'
  | 'contact.submit.sending'
  | 'contact.submit.sent'
  | 'contact.submit.send'
  // Contribution
  | 'contribution.title'
  | 'contribution.p1'
  | 'contribution.p2'
  | 'contribution.p3'
  | 'contribution.cta'
  // Directions
  | 'directions.title'
  | 'directions.body'
  | 'directions.address.label'
  | 'directions.address.value'
  | 'directions.byCar.label'
  | 'directions.byCar.p1'
  | 'directions.byCar.p2'
  | 'directions.transfer.label'
  | 'directions.transfer.p1'
  // Instagram
  | 'instagram.title'
  | 'instagram.subtitle'
  | 'instagram.scrollLeft'
  | 'instagram.scrollRight'
  | 'instagram.postAlt'
  | 'instagram.fallback.1.title'
  | 'instagram.fallback.2.title'
  | 'instagram.fallback.3.title'
  | 'instagram.fallback.4.title'
  | 'instagram.fallback.5.title'
  // Text over image
  | 'textOverImage.line1'
  | 'textOverImage.line2'
  // Chat button
  | 'chat.button.aria'
  | 'chat.button.question'
  | 'chat.button.reply'
  // Video partners
  | 'videoPartners.play'
  | 'videoPartners.pause'
  | 'videoPartners.mute'
  | 'videoPartners.unmute'
  | 'videoPartners.thanks'
  // Support caption
  | 'support.caption.line1'
  | 'support.caption.line2'
  | 'support.caption.line3'
  // Stats
  | 'stats.title'
  | 'stats.subtitle'
  | 'stats.card1'
  | 'stats.card2'
  | 'stats.card3'
  | 'stats.currency'
  | 'stats.report'
  // Services
  | 'services.title'
  | 'services.subtitle'
  | 'services.button.vacationOptions'
  | 'services.button.contact'
  | 'services.button.notify'
  | 'services.button.learnMore'
  | 'services.overlay.may'
  | 'services.overlay.june'
  | 'services.service1.title'
  | 'services.service1.p1'
  | 'services.service1.p2'
  | 'services.service1.p3'
  | 'services.service2.title'
  | 'services.service2.p1'
  | 'services.service2.p2'
  | 'services.service2.p3'
  | 'services.service2.p4'
  | 'services.service3.title'
  | 'services.service3.p1'
  | 'services.service3.p2'
  | 'services.service3.p3'
  | 'services.service4.title'
  | 'services.service4.p1'
  | 'services.service4.p2'
  | 'services.service4.p3'
  | 'services.service4.p4'
  | 'services.service5.title'
  | 'services.service5.p1'
  | 'services.service5.p2'
  | 'services.service5.p3'
  // About
  | 'about.p1'
  | 'about.p2'
  | 'about.p3'
  | 'about.p4'
  | 'about.readMore'
  // Imagine section
  | 'imagine.title'
  | 'imagine.line1'
  | 'imagine.line2'
  | 'imagine.p1.line1'
  | 'imagine.p1.line2'
  | 'imagine.p2'
  | 'imagine.p3.line1'
  | 'imagine.p3.line2'
  // Space
  | 'space.title'
  | 'space.subtitle'
  | 'space.feature1'
  | 'space.feature2'
  | 'space.feature3'
  | 'space.feature4'
  | 'space.feature5'
  | 'space.feature6'
  | 'space.feature7'
  | 'space.feature8'
  | 'space.imageAlt'
  | 'space.imageAltEnlarged'
  | 'space.zoom'
  | 'space.prev'
  | 'space.next'
  | 'space.close'
  // Pricing CTA
  | 'pricingCta.title'
  | 'pricingCta.subtitle'
  | 'pricingCta.button'
  // Vacation options popup
  | 'vacationOptions.overlay'
  | 'vacationOptions.close'
  | 'vacationOptions.scrollLeft'
  | 'vacationOptions.scrollRight'
  | 'vacationOptions.option1.title'
  | 'vacationOptions.option1.desc'
  | 'vacationOptions.option2.title'
  | 'vacationOptions.option2.desc'
  | 'vacationOptions.option3.title'
  | 'vacationOptions.option3.desc'
  | 'vacationOptions.option4.title'
  | 'vacationOptions.option4.desc'
  | 'vacationOptions.option5.title'
  | 'vacationOptions.option5.desc'
  | 'vacationOptions.option6.title'
  | 'vacationOptions.option6.desc'
  | 'vacationOptions.option7.title'
  | 'vacationOptions.option7.desc'
  | 'vacationOptions.option8.title'
  | 'vacationOptions.option8.desc'
  | 'vacationOptions.option9.title'
  | 'vacationOptions.option9.desc'
  // Slider
  | 'slider.title'
  | 'slider.subtitle'
  | 'slider.prev'
  | 'slider.next'
  | 'slider.quoteAlt'
  | 'slider.slide2.heading'
  | 'slider.slide2.body'
  | 'slider.slide3.heading'
  | 'slider.slide3.body'
  | 'slider.slide4.heading'
  | 'slider.slide4.body'
  | 'slider.slide5.heading'
  | 'slider.slide5.body'
  | 'slider.slide6.heading'
  | 'slider.slide6.body'
  | 'slider.slide7.heading'
  | 'slider.slide7.body'
  | 'slider.slide8.heading'
  | 'slider.slide8.body'
  | 'slider.slide9.heading'
  | 'slider.slide9.body'
  | 'slider.slide10.heading'
  | 'slider.slide10.body'
  // Footer
  | 'footer.contacts'
  | 'footer.services'
  | 'footer.navigate'
  | 'footer.supportProgram'
  | 'footer.followUs'
  | 'footer.privacy'
  | 'footer.terms'
  | 'footer.rights'
  | 'footer.hours'
  // Chat questionnaire
  | 'chatQuestionnaire.title'
  | 'chatQuestionnaire.subtitle'
  | 'chatQuestionnaire.field.name'
  | 'chatQuestionnaire.field.email'
  | 'chatQuestionnaire.field.phone'
  | 'chatQuestionnaire.placeholder.name'
  | 'chatQuestionnaire.placeholder.email'
  | 'chatQuestionnaire.placeholder.phone'
  | 'chatQuestionnaire.error.nameRequired'
  | 'chatQuestionnaire.error.emailRequired'
  | 'chatQuestionnaire.error.emailInvalid'
  | 'chatQuestionnaire.error.phoneRequired'
  | 'chatQuestionnaire.error.phoneInvalid'
  | 'chatQuestionnaire.submit'
  | 'chatQuestionnaire.sending'
  | 'form.consent.prefix'
  | 'form.consent.terms'
  | 'form.consent.and'
  | 'form.consent.privacy'
  // Chat window
  | 'chatWindow.title'
  | 'chatWindow.description'
  | 'chatWindow.closeChat'
  | 'chatWindow.closePopup'
  | 'chatWindow.greetingTitle'
  | 'chatWindow.greetingBody'
  | 'chatWindow.placeholderMessage'
  | 'chatWindow.responseLabel'
  | 'chatWindow.send'
  | 'chatWindow.sending'
  | 'chatWindow.successTitle'
  | 'chatWindow.successBody'
  | 'chatWindow.error.messageRequired'
  | 'chatWindow.error.phoneRequired'
  | 'chatWindow.error.phoneInvalid'
  | 'chatWindow.error.emailRequired'
  | 'chatWindow.error.emailInvalid'
  | 'chatWindow.error.responseMethodRequired'
  | 'chatWindow.error.submit'
  | 'chatWindow.error.submitGeneric'
  | 'chatWindow.time.justNow'
  | 'chatWindow.time.minutesAgo'
  | 'chatWindow.time.hoursAgo'
  // Donate page
  | 'donate.loading'
  | 'donate.back'
  | 'donate.title'
  | 'donate.subtitle'
  | 'donate.amountLabel'
  | 'donate.amountPlaceholder'
  | 'donate.recipientInfo'
  | 'donate.recurringLabel'
  | 'donate.intervalLabel'
  | 'donate.countLabel'
  | 'donate.countPlaceholder'
  | 'donate.payButton'
  | 'donate.processing'
  | 'donate.info1'
  | 'donate.info2'
  | 'donate.reportLink'
  | 'donate.bankDetailsTitle'
  | 'donate.ibanLabel'
  | 'donate.bankNameLabel'
  | 'donate.recipientLabel'
  | 'donate.edrpouLabel'
  | 'donate.purposeLabel'
  | 'donate.purposeValue'
  | 'donate.currencyLabel'
  | 'donate.bankNameValue'
  | 'donate.recipientValue'
  | 'donate.copied'
  | 'donate.interval.daily'
  | 'donate.interval.biweekly'
  | 'donate.interval.monthly'
  | 'donate.interval.yearly'
  | 'donate.error.maxAmount'
  | 'donate.error.minAmount'
  | 'donate.error.intervalRequired'
  | 'donate.error.countRequired'
  | 'donate.error.fillRequired'
  | 'donate.error.createDonation'
  | 'donate.error.recurringUnavailable'
  | 'donate.error.generic'
  | 'donate.description'
  | 'donate.infoParagraph'
  | 'donate.reportMonthly'
  | 'donate.termsPrefix'
  | 'donate.termsLink'
  | 'donate.termsAnd'
  | 'donate.privacyLink'
  | 'donate.bankDetailsSectionTitle'
  // Terms
  | 'terms.title'
  | 'terms.section1.title'
  | 'terms.section1.body'
  | 'terms.section2.title'
  | 'terms.section2.body'
  | 'terms.section2.item1'
  | 'terms.section2.item2'
  | 'terms.section2.item3'
  | 'terms.section2.item4'
  | 'terms.section3.title'
  | 'terms.section3.body'
  | 'terms.section4.title'
  | 'terms.section4.body'
  | 'terms.section5.title'
  | 'terms.section5.body'
  | 'terms.section6.title'
  | 'terms.section6.body'
  | 'terms.section7.title'
  | 'terms.section7.body'
  | 'terms.section8.title'
  | 'terms.section8.body'
  | 'terms.section8.emailLabel'
  | 'terms.section8.phoneLabel'
  | 'terms.section9.title'
  | 'terms.section9.body'
  | 'terms.lastUpdated'
  // Privacy
  | 'privacy.title'
  | 'privacy.section1.title'
  | 'privacy.section1.body'
  | 'privacy.section2.title'
  | 'privacy.section2.body'
  | 'privacy.section2.item1'
  | 'privacy.section2.item2'
  | 'privacy.section2.item3'
  | 'privacy.section2.item4'
  | 'privacy.section3.title'
  | 'privacy.section3.body'
  | 'privacy.section3.item1'
  | 'privacy.section3.item2'
  | 'privacy.section3.item3'
  | 'privacy.section3.item4'
  | 'privacy.section4.title'
  | 'privacy.section4.body'
  | 'privacy.section5.title'
  | 'privacy.section5.body'
  | 'privacy.section6.title'
  | 'privacy.section6.body'
  | 'privacy.section6.item1'
  | 'privacy.section6.item2'
  | 'privacy.section6.item3'
  | 'privacy.section6.item4'
  | 'privacy.section7.title'
  | 'privacy.section7.body'
  | 'privacy.section7.emailLabel'
  | 'privacy.section7.phoneLabel'
  | 'privacy.section8.title'
  | 'privacy.section8.body'
  | 'privacy.lastUpdated'
  // Admin
  | 'admin.login.title'
  | 'admin.login.subtitle'
  | 'admin.login.emailLabel'
  | 'admin.login.passwordLabel'
  | 'admin.login.emailPlaceholder'
  | 'admin.login.passwordPlaceholder'
  | 'admin.login.submit'
  | 'admin.login.submitting'
  | 'admin.login.errorInvalid'
  | 'admin.login.errorGeneric'
  | 'admin.dashboard.title'
  | 'admin.dashboard.menu'
  | 'admin.dashboard.logout'
  | 'admin.dashboard.filterLabel'
  | 'admin.dashboard.clearFilters'
  | 'admin.dashboard.forms'
  | 'admin.dashboard.loading'
  | 'admin.dashboard.empty'
  | 'admin.dashboard.changeStatus'
  | 'admin.dashboard.updating'
  | 'admin.dashboard.name'
  | 'admin.dashboard.phone'
  | 'admin.dashboard.message'
  | 'admin.dashboard.comment'
  | 'admin.dashboard.contactMethod'
  | 'admin.dashboard.responseMethod'
  | 'admin.dashboard.interests'
  | 'admin.dashboard.priceList'
  | 'admin.dashboard.userId'
  | 'admin.dashboard.priceListYes'
  | 'admin.dashboard.priceListNo'
  | 'admin.dashboard.unnamed'
  | 'admin.dashboard.status.new'
  | 'admin.dashboard.status.viewed'
  | 'admin.dashboard.status.contacted'
  | 'admin.dashboard.status.resolved'
  | 'admin.dashboard.status.archived'
  | 'admin.dashboard.formType.all'
  | 'admin.dashboard.formType.contact'
  | 'admin.dashboard.formType.chat'
  | 'admin.dashboard.loadError'
  | 'admin.dashboard.updateError'
  | 'admin.dashboard.contactPref.phone'
  | 'admin.dashboard.contactPref.whatsapp'
  | 'admin.dashboard.contactPref.email'
  | 'admin.dashboard.interest.all'
  | 'admin.dashboard.interest.active'
  | 'admin.dashboard.interest.cabin'
  | 'admin.dashboard.interest.spa'
  | 'admin.dashboard.interest.program'
  | 'admin.dashboard.interest.events'

type LanguageTranslations = Record<TranslationKey, string>

type TranslationsByLanguage = Record<SupportedLanguage, Partial<LanguageTranslations>>

export const translationsByLanguage: TranslationsByLanguage = {
  uk: {
    'common.loading': 'Завантаження...',
    'header.banner.openingSummer': 'Відкриваємось влітку 2026',
    'header.nav.us': 'Ми',
    'header.nav.services': 'Послуги',
    'header.nav.socialRole': 'Соціальна роль',
    'header.nav.contribute': 'Зроби внесок',
    'header.nav.location': 'Локація',
    'header.cta.whenStart': 'Коли старт?',
    'hero.title.line1': 'Вдихни тишу',
    'hero.title.line2': 'Видихни війну',
    'hero.subtitle.main': 'Центр для подій і відпочинку за 35 км від Львова',
    'hero.subtitle.donationInfo': '80% прибутку — на відновлення та реінтеграцію ветеранів.',
    'hero.subtitle.report': 'Звіт',
    'hero.cta.services': 'Послуги',
    'hero.scroll': 'Прокрутити',
    'report.back': 'На головну',
    'report.title': 'Фінансовий звіт',
    'report.organization': 'ГО «Справжні. Цивільні. Ветерани»',
    'report.updatedLabel': 'Оновлено:',
    'report.updatedDate': '30.01.2026',
    'report.incoming.amount': '229 850, 00',
    'report.incoming.label': 'Вхідний залишок',
    'report.outgoing.amount': '160 036, 00',
    'report.outgoing.label': 'Вихідний залишок',
    'report.section.usageTitle': 'Використання коштів',
    'report.table.period': 'Період',
    'report.table.amount': 'Кошти(UAH)',
    'report.table.category': 'Стаття витрат',
    'report.rows.1.period': 'лист 2025',
    'report.rows.1.amount': '138 240',
    'report.rows.1.category': 'Річні абонементи для групи з адаптивного плавання для ветеранів.',
    'report.rows.2.period': 'серп 2025',
    'report.rows.2.amount': '26 643',
    'report.rows.2.category': 'MOVE ON SPORT: «Заплив на заході сонця». Облаштування безбар’єрного доступу для учасників.',
    'report.rows.3.period': 'серп 2025',
    'report.rows.3.amount': '32 500',
    'report.rows.3.category': 'MOVE ON SPORT. Організаційні витрати.',
    'report.rows.4.period': 'квіт—лип 2025',
    'report.rows.4.amount': '9 900',
    'report.rows.4.category': 'Група з адаптивного плавання для ветеранів. Організаційні витрати.',
    '404.title': '404',
    '404.description': 'Сторінку не знайдено',
    '404.backToHome': 'Повернутися на головну',
    'contact.title': 'Ви дізнаєтеся першими, коли послуги центру стануть доступними. Просто заповніть форму.',
    'contact.success.title': 'Дякуємо!',
    'contact.success.body': 'Ми отримали вашу заявку і дамо знати, коли послуги стануть доступними.',
    'contact.error.selectInterest': 'Будь ласка, оберіть хоча б один пункт з "Вас цікавить"',
    'contact.error.submitDefault': 'Помилка при відправці форми. Спробуйте ще раз.',
    'contact.field.name': "Ім'я",
    'contact.field.namePlaceholder': "Ваше ім'я",
    'contact.field.phone': 'Телефон',
    'contact.error.phoneInvalid': 'Будь ласка, перевірте введений номер.',
    'contact.field.email': 'Електронна пошта',
    'contact.error.emailRequired': 'Будь ласка, введіть ваш імейл',
    'contact.error.emailFormatHint': 'Коректний формат: example@gmail.com',
    'contact.field.responseChannel': 'Ви чекатимете відповіді у',
    'contact.field.interests': 'Вас цікавить',
    'contact.interest.all': 'Усі послуги',
    'contact.interest.active': 'Активний відпочинок та тімбілдинг',
    'contact.interest.cabin': 'Хатинка під соснами',
    'contact.interest.spa': "Безбар'єрний СПА",
    'contact.interest.events': 'Події під ключ',
    'contact.interest.program': 'Групова програма «Шлях сили»',
    'contact.field.comment': 'Ваш коментар',
    'contact.field.commentPlaceholder': 'Вкажіть, якщо маєте якісь побажання',
    'contact.field.wantPrice': 'Хочу отримати прайс',
    'contact.submit.sending': 'Відправка...',
    'contact.submit.sent': 'Відправлено!',
    'contact.submit.send': 'Надіслати',
    'contribution.title': 'Зроби внесок',
    'contribution.p1': 'Ти можеш збільшити цифру накопичення ще до відкриття центру.',
    'contribution.p2': 'Кожен внесок йтиме на відновлення та інтеграцію ветеранів, а також покриватиме проведення програми «Шлях сили». Для ветеранів, військовослужбовців, їхніх родин, а також родин загиблих і зниклих безвісти участь у програмі безкоштовна.',
    'contribution.p3': 'Твій внесок додається до загальної суми, що відображається на сайті.',
    'contribution.cta': 'Підтримати фінансово',
    'directions.title': 'Локація',
    'directions.body': 'Центр «Справжні» розташований неподалік Стільського Городища — унікальній локації між Львовом і Стриєм. Це історичне місце, в якому ще до появи Київської Русі жили білі хорвати, котрі, як стверджують науковці, залишили по собі печери та ціле підземне місто.',
    'directions.address.label': 'Адреса',
    'directions.address.value': 'Львівська область, с. Дуброва',
    'directions.byCar.label': 'Автівкою',
    'directions.byCar.p1': 'Дорога зі Львова займає приблизно 35 км, зі Стрия — 40 км. Це близько 40–55 хвилин у дорозі.',
    'directions.byCar.p2': 'На під’їзді до центру є коротка ділянка, де варто їхати обачніше. Але перед повним запуском центру вона буде комфортна для проїзду.',
    'directions.transfer.label': 'Трансфером',
    'directions.transfer.p1': 'До твоїх послуг трансфер по Львівській області для будь-якої кількості людей.',
    'instagram.title': 'Справжні в інстаграм',
    'instagram.subtitle': 'Показуємо та розповідаємо про свій шлях щиро',
    'instagram.scrollLeft': 'Прокрутити ліворуч',
    'instagram.scrollRight': 'Прокрутити праворуч',
    'instagram.postAlt': 'Пост в Instagram',
    'instagram.fallback.1.title': 'Це ми',
    'instagram.fallback.2.title': 'Місце сили',
    'instagram.fallback.3.title': 'Наші діти',
    'instagram.fallback.4.title': 'Прогулянка',
    'instagram.fallback.5.title': 'Розповідь',
    'textOverImage.line1': 'Дозволь. Собі. Зупинитися.',
    'textOverImage.line2': 'Це повертає сили',
    'chat.button.aria': 'Чат підтримки',
    'chat.button.question': 'Питання?',
    'chat.button.reply': 'Ми відповімо',
    'videoPartners.play': 'Відтворити відео',
    'videoPartners.pause': 'Пауза відео',
    'videoPartners.mute': 'Вимкнути звук',
    'videoPartners.unmute': 'Увімкнути звук',
    'videoPartners.thanks': 'Дякуємо, що з нами!',
    'support.caption.line1': 'Обираючи «Справжніх»,',
    'support.caption.line2': 'ви підтримуєте ветеранів та їхні родини,',
    'support.caption.line3': 'котрі весь цей час були їхнім тилом',
    'stats.title': '«Справжні» вже закумулювали',
    'stats.subtitle': 'на відновлення та реінтеграцію ветеранів',
    'stats.card1': 'Це — тренування з адаптивного плавання та програма відновлення «Шлях сили», яка відбуватиметься у нашому центрі.',
    'stats.card2': '80% прибутку центру також йтиме на проекти відновлення ветеранів та членів їхніх родин.',
    'stats.card3': 'Ми публікуємо оновлену суму зібраних та витрачених коштів наприкінці кожного місяця, після всіх підрахунків.',
    'stats.currency': 'грн',
    'stats.report': 'Звіт',
    'services.title': 'Послуги',
    'services.subtitle': 'будуть доступні навіть без проживання',
    'services.button.vacationOptions': 'Варіанти відпочинку',
    'services.button.contact': "Зв'язатися з нами",
    'services.button.notify': 'Повідомте коли старт',
    'services.button.learnMore': 'Дізнатися більше',
    'services.overlay.may': 'чекаємо з травня',
    'services.overlay.june': 'чекаємо з червня',
    'services.service1.title': 'Активний відпочинок для себе. Тімбілдинг для бізнесу',
    'services.service1.p1': '35 км від Львова — і ти приїжджаєш спонтанно, не помічаючи, як минула дорога. Це ідеально, щоб провести у нас вихідні або одноденний тімбілдинг.',
    'services.service1.p2': 'Тут — піші маршрути для любителів екотуризму. Орендуй велосипеди чи сідай верхи — і вирушай мальовничим Львівським Опіллям. Поблизу — каскад озер та Дністер. Тож можеш порибалити або влаштувати активний день на сапах, байдарках чи каноє.',
    'services.service1.p3': 'А після активного дня — крафтова риба на мангалі і вечір біля ватри. І це ми ще не розповіли про гриби та малину, баранців та садівництво!',
    'services.service2.title': 'Хатинка під соснами',
    'services.service2.p1': 'Ти можеш зустрічати світанки з чашкою кави, читати на терасі або просто слухати ліс. А надвечір піти у СПА і повернутись до сну приємно втомленим та наповненим(ою).',
    'services.service2.p2': 'Ми створюємо це місце для тих, хто шукає спокій, любить естетику природи, але й цінує комфорт.',
    'services.service2.p3': 'Тут буде все для двох-чотирьох гостей: два поверхи, зручні ліжка, кухня, тераса і великі вікна, щоб милуватися лісом 24 на 7. Це місце сили і спокою. Тут ти можеш бути собою, можеш просто БУТИ.',
    'services.service2.p4': 'Мінімальне бронювання — дві доби.',
    'services.service3.title': "Безбар'єрний СПА",
    'services.service3.p1': 'Наш СПА-центр буде обладнаний лазнею з контрастним басейном, інфрачервоною сауною та сінною кімнатою.',
    'services.service3.p2': 'Два чани розслаблятимуть усіма ароматами лісу. А окремі приміщення дозволятимуть одночасно відпочивати кільком групам — у цілковитій приватності.',
    'services.service3.p3': 'І, що вкрай важливо, наш СПА-центр буде повністю безбарʼєрним: ми дбаємо про найменші деталі для зручності усіх наших гостей.',
    'services.service4.title': 'Події під ключ',
    'services.service4.p1': 'Для бізнесу пропонуємо інфраструктуру для стратегічних сесій, тренінгів, ретритів та інших бізнес-подій до 30 осіб. Маємо необхідну техніку, резервне живлення та безперебійний WiFi.',
    'services.service4.p2': 'Для ваших колег ми проведемо авторську програму командотворення, яка поверне їм злагодженість та контакт.',
    'services.service4.p3': 'Для індивідуальних клієнтів організуємо під ключ ваші особисті події: атмосферну вечірку серед сосен, затишний день народження або невеличке весілля.',
    'services.service4.p4': 'Твій персональний координатор подбає про деталі, які є для тебе важливими.',
    'services.service5.title': 'Групова програма «Шлях сили»',
    'services.service5.p1': 'Ми переконані: турбота про внутрішній стан — не слабкість, а основа стійкості. Тому створили програму, що поєднує менторську підтримку і роботу з тілом. А відтак — допомагає сповільнитись і знову відчути опору всередині себе. Формати: 1, 3 та 7 днів. Групи від 10 і до 20 людей.',
    'services.service5.p2': 'Під час проведення програми центр доступний лише для її учасників.',
    'services.service5.p3': 'Безкоштовно для: ветеранів, членів їхніх родин, а також родин полеглих, полонених та зниклих безвісти.',
    'about.p1': 'Привіт. Ми — Руслан та Наталя, подружжя та засновники центру «Справжні». А ще — родина, яка добре знає: інколи дві галочки в Signal під прочитаним повідомленням можуть бути цілющими.',
    'about.p2': 'У 2022 році, з початком повномасштабного вторгнення, Руслан пішов на фронт добровольцем. За його плечима — важкі бої, втрати та досвід, який назавжди змінює людину. Повернення додому й тривала реінтеграція стали новим викликом: як знайти себе знову, як жити, коли все змінилось?',
    'about.p3': 'Ще до повномасштабного вторгнення ми мріяли про місце сили, де можна уповільнитись і відновитись. І після повернення Руслана зрозуміли: час втілити задум. Дуже випадково ми знайшли ділянку у с. Стільське — і відчули, що вона чекала на нас. І тепер, тут, ми творимо простір Справжніх.',
    'about.p4': 'Це не лише центр відпочинку. Це місце, де ми будемо ділитись досвідом, єднатися та підтримувати одне одного під час війни й після перемоги.',
    'about.readMore': 'Читати продовження',
    'imagine.title': 'Уяви.',
    'imagine.line1': 'Ти в місці, котре',
    'imagine.line2': 'сповільнює дихання',
    'imagine.p1.line1': 'Природа там чиста і тиха.',
    'imagine.p1.line2': 'Лишень листя м’яко пошіптує:',
    'imagine.p2': 'Зупинись... Чуєш?',
    'imagine.p3.line1': 'Це ж ти. Справжня.',
    'imagine.p3.line2': 'Це ж ти. Справжній.',
    'space.title': 'Простір',
    'space.subtitle': 'де будемо видихати разом',
    'space.feature1': 'природа, історична спадщина та архітектурні інновації поєднані в одній локації',
    'space.feature2': '4 із 5 гривень прибутку ідуть на відновлення ветеранів, а ми звітуємо публічно',
    'space.feature3': "є сучасний безбар'єрний спа-центр, а ціль — доступність усієї інфраструктури",
    'space.feature4': 'про найменші деталі вашого комфорту дбає ваш персональний координатор',
    'space.feature5': 'кейтеринг забезпечує смачне і поживне харчування',
    'space.feature6': '35 км від Львова, можливий трансфер',
    'space.feature7': 'є резервне живлення і надійний WiFi',
    'space.feature8': 'лояльні умови, якщо у вас змінились плани',
    'space.imageAlt': 'Фото простору {{index}}',
    'space.imageAltEnlarged': 'Фото простору {{index}} — збільшене',
    'space.zoom': 'Збільшити зображення',
    'space.prev': 'Попереднє зображення',
    'space.next': 'Наступне зображення',
    'space.close': 'Закрити',
    'pricingCta.title': 'Вартість послуг з’явиться ближче до запуску центру.',
    'pricingCta.subtitle': 'Ми подбаємо, щоб вона була чесною та прозорою.',
    'pricingCta.button': 'Надішліть прайс, коли будуть ціни',
    'vacationOptions.overlay': 'Чекаємо влітку',
    'vacationOptions.close': 'Закрити',
    'vacationOptions.scrollLeft': 'Прокрутити ліворуч',
    'vacationOptions.scrollRight': 'Прокрутити праворуч',
    'vacationOptions.option1.title': 'Сапи, каяки та байдарки',
    'vacationOptions.option1.desc': 'Вода задає ритм: спокійний, але живий. Тіло працює, але вже немає напруги. Дихання вирівнюється. І усе стає легшим.',
    'vacationOptions.option2.title': 'Екскурсія Стільським Городищем',
    'vacationOptions.option2.desc': 'Вирушай на професійну екскурсію місцем, де колись була столиця білих хорватів. Це місце тебе вразить. А ми подбаємо про обід на вогні опісля.',
    'vacationOptions.option3.title': 'Приготування їжі на мангалі',
    'vacationOptions.option3.desc': 'Усе, що потрібно — жар, свіжа їжа та хороша компанія. Готуйте свої продукти чи замовляйте у нас. Усе необхідне приладдя входить до вартості.',
    'vacationOptions.option4.title': 'Затиш',
    'vacationOptions.option4.desc': 'Може, прочи захоче ватри.',
    'vacationOptions.option5.title': 'Піші прогулянки',
    'vacationOptions.option5.desc': 'Досліджуй мальовничі стежки Львівського Опілля. Прогулянки різної складності для всіх рівнів підготовки.',
    'vacationOptions.option6.title': 'Велосипедні маршрути',
    'vacationOptions.option6.desc': 'Активний відпочинок на велосипеді по живописній місцевості. Маршрути для початківців та досвідчених велосипедистів.',
    'vacationOptions.option7.title': 'Кінні прогулянки',
    'vacationOptions.option7.desc': 'Відчуй свободу та єдність з природою під час кінної прогулянки по лісових стежках.',
    'vacationOptions.option8.title': 'Риболовля',
    'vacationOptions.option8.desc': 'Розслабляюча риболовля на каскаді озер та річці Дністер. Все необхідне обладнання надається.',
    'vacationOptions.option9.title': 'Вечір біля багаття',
    'vacationOptions.option9.desc': 'Затишний вечір біля вогню з гарячими напоями, розмовами та атмосферою спокою.',
    'slider.title': 'Ми. Такі, як є',
    'slider.subtitle': 'справжні',
    'slider.prev': 'Попередній слайд',
    'slider.next': 'Наступний слайд',
    'slider.quoteAlt': 'Лапки',
    'slider.slide2.heading': 'Ми віримо: все починається з довіри.',
    'slider.slide2.body': 'До себе, до світу, до тих, кого зустрічаєш на своєму шляху. У цьому світі легко загубити себе справжнього і так непросто знову віднайти',
    'slider.slide3.heading': 'Тому ми йдемо шляхом, де шукаємо себе справжніх.',
    'slider.slide3.body': 'І ця дорога привела нас у Стільсько.',
    'slider.slide4.heading': 'Ми прагнемо, аби тут, на перетині досвідів ветеранів і цивільних, народжувалася нова довіра.',
    'slider.slide4.body': 'І щоб спільні розмови, подорожі, проєкти, інколи сльози й сміх — повертали кожного з нас до життя.',
    'slider.slide5.heading': "Ми віримо, шо в цьому просторі будуть народжуватися нові зв'язки, спільні ідеї та справи.",
    'slider.slide5.body': 'І що ми разом творитимемо нову Україну, про яку мріємо — і в якій хотітимуть жити наші діти.',
    'slider.slide6.heading': 'Це покоління, у чиї руки ми передамо Україну.',
    'slider.slide6.body': 'І це велика відповідальність, яку ми приймаємо свідомо.',
    'slider.slide7.heading': 'Сьогодні ви бачите перші кроки центру.',
    'slider.slide7.body': 'Ми продовжуємо розвивати територію, шукаємо партнерів, подаємося на гранти — і вже відкриті до перших гостей.',
    'slider.slide8.heading': 'Наші плани масштабні та передбачають поетапне зростання.',
    'slider.slide8.body': 'Наш проєкт не має інвесторів та великих бюджетів. Тож ми будуємо центр поступово, але з душею та щирими намірами.',
    'slider.slide9.heading': 'Наш пагорб — це місце сили і спокою.',
    'slider.slide9.body': 'Тут ти можеш бути справжнім, можеш бути собою, можеш просто бути....',
    'slider.slide10.heading': 'А за нами — турбота, професіоналізм і сервіс, продуманий до деталей.',
    'slider.slide10.body': 'Видихай. Довіряй. Живи.',
    'footer.contacts': 'Контакти',
    'footer.services': 'Послуги',
    'footer.navigate': 'Перейти на сторінку',
    'footer.supportProgram': 'Підтримати ветеранські програми',
    'footer.followUs': 'Підписатись на нас:',
    'footer.privacy': 'Конфіденційність',
    'footer.terms': 'Умови використання',
    'footer.rights': '© 2026 Справжні. Усі права захищені.',
    'footer.hours': 'Щоденно з 10:00 до 19:00',
    'chatQuestionnaire.title': 'Перед початком чату',
    'chatQuestionnaire.subtitle': "Будь ласка, заповніть форму, щоб ми могли з вами зв'язатися",
    'chatQuestionnaire.field.name': "Ім'я",
    'chatQuestionnaire.field.email': 'Електронна пошта',
    'chatQuestionnaire.field.phone': 'Телефон',
    'chatQuestionnaire.placeholder.name': "Введіть ваше ім'я",
    'chatQuestionnaire.placeholder.email': 'example@email.com',
    'chatQuestionnaire.placeholder.phone': '+380 XX XXX XX XX',
    'chatQuestionnaire.error.nameRequired': "Ім'я обов'язкове",
    'chatQuestionnaire.error.emailRequired': "Електронна пошта обов'язкова",
    'chatQuestionnaire.error.emailInvalid': 'Невірний формат електронної пошти',
    'chatQuestionnaire.error.phoneRequired': "Телефон обов'язковий",
    'chatQuestionnaire.error.phoneInvalid': 'Невірний формат телефону',
    'chatQuestionnaire.submit': 'Почати чат',
    'chatQuestionnaire.sending': 'Відправка...',
    'form.consent.prefix': 'Натискаючи, ви приймаєте',
    'form.consent.terms': 'Умови',
    'form.consent.and': 'та',
    'form.consent.privacy': 'Політику конфіденційності',
    'chatWindow.title': 'Чат',
    'chatWindow.description': 'Що тебе цікавить? Ми скоренько відповімо!',
    'chatWindow.closeChat': 'Закрити чат',
    'chatWindow.closePopup': 'Закрити',
    'chatWindow.greetingTitle': 'Привіт!',
    'chatWindow.greetingBody': 'Що саме вас цікавить?',
    'chatWindow.placeholderMessage': 'Введіть своє повідомлення',
    'chatWindow.responseLabel': 'Ви чекатимете відповіді у',
    'chatWindow.send': 'Надіслати',
    'chatWindow.sending': 'Відправка...',
    'chatWindow.successTitle': 'Дякуємо за повідомлення!',
    'chatWindow.successBody': "Ми зв'яжемося з вами найближчим часом.",
    'chatWindow.error.messageRequired': 'Будь ласка, введіть повідомлення',
    'chatWindow.error.phoneRequired': 'Будь ласка, введіть свій номер',
    'chatWindow.error.phoneInvalid': 'Будь ласка, перевірте введений номер',
    'chatWindow.error.emailRequired': 'Будь ласка, введіть свій email',
    'chatWindow.error.emailInvalid': 'Коректний формат: example@mail.com',
    'chatWindow.error.responseMethodRequired': 'Будь ласка, оберіть спосіб відповіді',
    'chatWindow.error.submit': 'Помилка відправки повідомлення',
    'chatWindow.error.submitGeneric': 'Помилка відправки повідомлення. Спробуйте ще раз.',
    'chatWindow.time.justNow': 'щойно',
    'chatWindow.time.minutesAgo': '{{count}} хв тому',
    'chatWindow.time.hoursAgo': '{{count}} год тому',
    'donate.loading': 'Завантаження...',
    'donate.back': 'На головну',
    'donate.title': 'Підтримай',
    'donate.subtitle': 'допоможи ветеранам повертатись до життя',
    'donate.amountLabel': 'Вкажіть суму у гривні',
    'donate.amountPlaceholder': 'Введіть суму',
    'donate.recipientInfo': 'Отримувач — благодійний рахунок ГО «Справжні. Цивільні. Ветерани»',
    'donate.recurringLabel': 'Зробити регулярний платіж',
    'donate.intervalLabel': 'Періодичність платежу',
    'donate.countLabel': 'Кількість платежів',
    'donate.countPlaceholder': 'Наприклад: 12',
    'donate.payButton': 'Зробити переказ',
    'donate.processing': 'Обробка...',
    'donate.info1': 'Кожна пожертва буде використана на відновлення та інтеграцію ветеранів, а також покриватиме безоплатне проведення програми «Шлях сили» для ветеранів, військовослужбовців, їхніх родин і родин загиблих та зниклих безвісти.',
    'donate.info2': 'Ми звітуємо за надходження та витрати з цього рахунку наприкінці кожного місяця.',
    'donate.reportLink': 'Звіт за {{date}}.',
    'donate.bankDetailsTitle': 'Монобанка',
    'donate.ibanLabel': 'Рахунок IBAN:',
    'donate.bankNameLabel': 'Назва банку:',
    'donate.recipientLabel': 'Отримувач:',
    'donate.edrpouLabel': 'ЄДРПОУ:',
    'donate.purposeLabel': 'Призначення платежу:',
    'donate.purposeValue': 'благодійна допомога',
    'donate.currencyLabel': 'Валюта:',
    'donate.copied': 'Скопійовано!',
    'donate.bankNameValue': 'АТ «Райффайзен Банк»',
    'donate.recipientValue': 'ГО "СПРАВЖНІ.ЦИВІЛЬНІ.ВЕТЕРАНИ"',
    'donate.interval.daily': 'Щодня',
    'donate.interval.biweekly': 'Кожні 2 тижні',
    'donate.interval.monthly': 'Щомісяця',
    'donate.interval.yearly': 'Щорічно',
    'donate.error.maxAmount': 'Максимальна сума для одноразового платежу - 499 999 грн',
    'donate.error.minAmount': 'Мінімальна сума - 1 грн',
    'donate.error.intervalRequired': 'Будь ласка, вкажіть періодичність платежу',
    'donate.error.countRequired': 'Будь ласка, вкажіть бажану кількість платежів',
    'donate.error.fillRequired': "Будь ласка, заповніть всі обов'язкові поля",
    'donate.error.createDonation': 'Не вдалося створити донат',
    'donate.error.recurringUnavailable': 'Регулярні платежі наразі недоступні. Будь ласка, зверніться до підтримки Monobank для активації функції регулярних платежів у вашому обліковому записі.',
    'donate.error.generic': 'Щось пішло не так. Спробуйте пізніше.',
    'donate.description': 'Донат {{amount}} грн',
    'donate.infoParagraph': 'Кожна пожертва підтримує відновлення та інтеграцію ветеранів: групи адаптивного плавання; програму «Шлях сили» для військових, їхніх родин, родин загиблих та зниклих безвісти; тощо.',
    'donate.reportMonthly': 'Звітуємо щомісяця.',
    'donate.termsPrefix': 'Натискаючи, ви приймаєте',
    'donate.termsLink': 'Умови',
    'donate.termsAnd': 'та',
    'donate.privacyLink': 'Політику конфіденційності',
    'donate.bankDetailsSectionTitle': 'Реквізити для переказу',
    'terms.title': 'Умови використання',
    'terms.section1.title': '1. Прийняття умов',
    'terms.section1.body': 'Використовуючи наш веб-сайт та послуги, ви погоджуєтеся дотримуватися цих Умов використання. Якщо ви не згодні з будь-якою частиною цих умов, будь ласка, не використовуйте наш веб-сайт.',
    'terms.section2.title': '2. Використання веб-сайту',
    'terms.section2.body': 'Ви зобов\'язуєтеся використовувати наш веб-сайт лише в законних цілях та відповідно до всіх застосовних законів та правил. Заборонено:',
    'terms.section2.item1': 'Використовувати веб-сайт будь-яким способом, що може пошкодити, вимкнути, перевантажити або зіпсувати веб-сайт',
    'terms.section2.item2': 'Спроби отримати несанкціонований доступ до будь-якої частини веб-сайту',
    'terms.section2.item3': 'Використовувати автоматизовані системи для збору даних з веб-сайту',
    'terms.section2.item4': 'Розповсюджувати віруси або інші шкідливі програми',
    'terms.section3.title': '3. Інтелектуальна власність',
    'terms.section3.body': 'Весь контент на цьому веб-сайті, включаючи текст, графіку, логотипи, зображення та програмне забезпечення, є власністю Справжні або її ліцензіарів і захищений законами про авторське право та інтелектуальну власність.',
    'terms.section4.title': '4. Послуги',
    'terms.section4.body': 'Ми намагаємося забезпечити точність інформації про наші послуги, але не гарантуємо, що вся інформація на веб-сайті є повною, точною або актуальною. Ми залишаємо за собою право змінювати або припиняти будь-які послуги в будь-який час без попереднього повідомлення.',
    'terms.section5.title': '5. Обмеження відповідальності',
    'terms.section5.body': 'Справжні не несе відповідальності за будь-які прямі, непрямі, випадкові, спеціальні або наслідкові збитки, що виникають в результаті використання або неможливості використання нашого веб-сайту або послуг.',
    'terms.section6.title': '6. Посилання на сторонні сайти',
    'terms.section6.body': 'Наш веб-сайт може містити посилання на сторонні веб-сайти. Ми не контролюємо та не несемо відповідальності за зміст, політику конфіденційності або практики будь-яких сторонніх веб-сайтів.',
    'terms.section7.title': '7. Зміни умов',
    'terms.section7.body': 'Ми залишаємо за собою право змінювати ці Умови використання в будь-який час. Ваше продовження використання веб-сайту після внесення змін означає вашу згоду з новими умовами.',
    'terms.section8.title': '8. Контакти',
    'terms.section8.body': 'Якщо у вас є питання щодо цих Умов використання, будь ласка, зв\'яжіться з нами:',
    'terms.section8.emailLabel': 'Email:',
    'terms.section8.phoneLabel': 'Телефон:',
    'terms.section9.title': '9. Застосовне право',
    'terms.section9.body': 'Ці Умови використання регулюються та тлумачаться відповідно до законодавства України. Будь-які спори, що виникають з цих умов, підлягають виключній юрисдикції судів України.',
    'terms.lastUpdated': 'Останнє оновлення:',
    'privacy.title': 'Політика конфіденційності',
    'privacy.section1.title': '1. Загальні положення',
    'privacy.section1.body': 'Ця Політика конфіденційності описує, як ми збираємо, використовуємо та захищаємо вашу персональну інформацію при використанні нашого веб-сайту та послуг.',
    'privacy.section2.title': '2. Збір інформації',
    'privacy.section2.body': 'Ми можемо збирати наступну інформацію:',
    'privacy.section2.item1': "Ім'я та контактна інформація",
    'privacy.section2.item2': 'Електронна пошта',
    'privacy.section2.item3': 'Номер телефону',
    'privacy.section2.item4': 'Інформація про використання веб-сайту',
    'privacy.section3.title': '3. Використання інформації',
    'privacy.section3.body': 'Ми використовуємо зібрану інформацію для:',
    'privacy.section3.item1': 'Надання та покращення наших послуг',
    'privacy.section3.item2': "Зв'язку з вами щодо ваших запитів",
    'privacy.section3.item3': 'Відправки важливих повідомлень',
    'privacy.section3.item4': 'Підвищення якості обслуговування',
    'privacy.section4.title': '4. Захист інформації',
    'privacy.section4.body': 'Ми вживаємо відповідних заходів безпеки для захисту вашої персональної інформації від несанкціонованого доступу, зміни, розкриття або знищення.',
    'privacy.section5.title': '5. Розкриття інформації третім особам',
    'privacy.section5.body': 'Ми не продаємо, не обмінюємо та не передаємо вашу персональну інформацію третім особам без вашої згоди, за винятком випадків, передбачених законом.',
    'privacy.section6.title': '6. Ваші права',
    'privacy.section6.body': 'Ви маєте право:',
    'privacy.section6.item1': 'Отримувати доступ до вашої персональної інформації',
    'privacy.section6.item2': 'Вимагати виправлення неточної інформації',
    'privacy.section6.item3': 'Вимагати видалення вашої інформації',
    'privacy.section6.item4': 'Відкликати згоду на обробку даних',
    'privacy.section7.title': '7. Контакти',
    'privacy.section7.body': "Якщо у вас є питання щодо цієї Політики конфіденційності, будь ласка, зв'яжіться з нами:",
    'privacy.section7.emailLabel': 'Email:',
    'privacy.section7.phoneLabel': 'Телефон:',
    'privacy.section8.title': '8. Зміни до Політики конфіденційності',
    'privacy.section8.body': 'Ми залишаємо за собою право оновлювати цю Політику конфіденційності в будь-який час. Ми повідомимо вас про будь-які зміни, розмістивши нову Політику конфіденційності на цій сторінці.',
    'privacy.lastUpdated': 'Останнє оновлення:',
    'admin.login.title': 'Адмін панель',
    'admin.login.subtitle': 'Увійдіть для доступу до панелі управління',
    'admin.login.emailLabel': 'Email',
    'admin.login.passwordLabel': 'Пароль',
    'admin.login.emailPlaceholder': 'admin@example.com',
    'admin.login.passwordPlaceholder': 'Введіть пароль',
    'admin.login.submit': 'Увійти',
    'admin.login.submitting': 'Вхід...',
    'admin.login.errorInvalid': 'Невірний email або пароль',
    'admin.login.errorGeneric': 'Сталася помилка. Спробуйте ще раз.',
    'admin.dashboard.title': 'Адмін панель',
    'admin.dashboard.menu': 'Меню',
    'admin.dashboard.logout': 'Вийти',
    'admin.dashboard.filterLabel': 'Фільтр:',
    'admin.dashboard.clearFilters': 'Очистити',
    'admin.dashboard.forms': 'Форми',
    'admin.dashboard.loading': 'Завантаження...',
    'admin.dashboard.empty': 'Форми не знайдено',
    'admin.dashboard.changeStatus': 'Змінити статус:',
    'admin.dashboard.updating': 'Оновлення...',
    'admin.dashboard.name': "Ім'я",
    'admin.dashboard.phone': 'Телефон',
    'admin.dashboard.message': 'Повідомлення:',
    'admin.dashboard.comment': 'Коментар:',
    'admin.dashboard.contactMethod': "Спосіб зв'язку:",
    'admin.dashboard.responseMethod': 'Спосіб відповіді:',
    'admin.dashboard.interests': 'Інтереси:',
    'admin.dashboard.priceList': 'Прайс-лист:',
    'admin.dashboard.userId': 'ID користувача:',
    'admin.dashboard.priceListYes': 'Так',
    'admin.dashboard.priceListNo': 'Ні',
    'admin.dashboard.unnamed': 'Без імені',
    'admin.dashboard.status.new': 'Нове',
    'admin.dashboard.status.viewed': 'Переглянуто',
    'admin.dashboard.status.contacted': 'Сконтактувались',
    'admin.dashboard.status.resolved': 'Вирішено',
    'admin.dashboard.status.archived': 'Архівовано',
    'admin.dashboard.formType.all': 'Всі',
    'admin.dashboard.formType.contact': 'З форми',
    'admin.dashboard.formType.chat': 'З чату',
    'admin.dashboard.loadError': 'Не вдалося завантажити форми',
    'admin.dashboard.updateError': 'Не вдалося оновити статус. Спробуйте ще раз.',
    'admin.dashboard.contactPref.phone': 'Телефон',
    'admin.dashboard.contactPref.whatsapp': 'WhatsApp',
    'admin.dashboard.contactPref.email': 'Електронна пошта',
    'admin.dashboard.interest.all': 'Усі послуги',
    'admin.dashboard.interest.active': 'Активний відпочинок та тімбілдинг',
    'admin.dashboard.interest.cabin': 'Хатинка під соснами',
    'admin.dashboard.interest.spa': "Безбар'єрний СПА",
    'admin.dashboard.interest.program': 'Групова програма «Шлях сили»',
    'admin.dashboard.interest.events': 'Події під ключ',
  },
  en: {
    'common.loading': 'Loading...',
    'header.banner.openingSummer': 'Opening in summer 2026',
    'header.nav.us': 'About us',
    'header.nav.services': 'Services',
    'header.nav.socialRole': 'Social role',
    'header.nav.contribute': 'Make a contribution',
    'header.nav.location': 'Location',
    'header.cta.whenStart': 'When do you open?',
    'hero.title.line1': 'Breathe in the silence',
    'hero.title.line2': 'Breathe out the war',
    'hero.subtitle.main': 'A venue and retreat center 35 km from Lviv',
    'hero.subtitle.donationInfo': '80% of profits go to veterans’ recovery and reintegration.',
    'hero.subtitle.report': 'Report',
    'hero.cta.services': 'Services',
    'hero.scroll': 'Scroll',
    'report.back': 'Back to home',
    'report.title': 'Financial activity report',
    'report.organization': 'NGO “Spravzni. Civilians. Veterans”',
    'report.updatedLabel': 'Updated:',
    'report.updatedDate': 'Jan 30, 2026',
    'report.incoming.amount': '229,850.00',
    'report.incoming.label': 'Opening balance',
    'report.outgoing.amount': '160,036.00',
    'report.outgoing.label': 'Closing balance',
    'report.section.usageTitle': 'Use of funds',
    'report.table.period': 'Period',
    'report.table.amount': 'Amount',
    'report.table.category': 'Expense category',
    'report.rows.1.period': 'Nov 2025',
    'report.rows.1.amount': '138,240',
    'report.rows.1.category': 'Annual subscriptions for an adaptive swimming group for veterans.',
    'report.rows.2.period': 'Aug 2025',
    'report.rows.2.amount': '26,643',
    'report.rows.2.category': 'MOVE ON SPORT: “Sunset swim”. Barrier-free access setup for participants.',
    'report.rows.3.period': 'Aug 2025',
    'report.rows.3.amount': '32,500',
    'report.rows.3.category': 'MOVE ON SPORT. Organizational expenses.',
    'report.rows.4.period': 'Apr–Jul 2025',
    'report.rows.4.amount': '9,900',
    'report.rows.4.category': 'Adaptive swimming group for veterans. Organizational expenses.',
    '404.title': '404',
    '404.description': 'Page not found',
    '404.backToHome': 'Back to homepage',
    'contact.title': 'You’ll be the first to know when our services become available. Just fill out the form.',
    'contact.success.title': 'Thank you!',
    'contact.success.body': 'We’ve received your request and will let you know when services are available.',
    'contact.error.selectInterest': 'Please choose at least one option in “You’re interested in”.',
    'contact.error.submitDefault': 'There was an error submitting the form. Please try again.',
    'contact.field.name': 'Name',
    'contact.field.namePlaceholder': 'Your name',
    'contact.field.phone': 'Phone',
    'contact.error.phoneInvalid': 'Please check the phone number.',
    'contact.field.email': 'Email',
    'contact.error.emailRequired': 'Please enter your email',
    'contact.error.emailFormatHint': 'Correct format: example@gmail.com',
    'contact.field.responseChannel': 'You’d like to receive a reply in',
    'contact.field.interests': 'You’re interested in',
    'contact.interest.all': 'All services',
    'contact.interest.active': 'Active rest & teambuilding',
    'contact.interest.cabin': 'Cabin under the pines',
    'contact.interest.spa': 'Barrier‑free SPA',
    'contact.interest.events': 'Turn‑key events',
    'contact.interest.program': 'Group program “Path of Strength”',
    'contact.field.comment': 'Your comment',
    'contact.field.commentPlaceholder': 'Add any wishes or additional details',
    'contact.field.wantPrice': 'I’d like to receive the price list',
    'contact.submit.sending': 'Sending...',
    'contact.submit.sent': 'Sent!',
    'contact.submit.send': 'Send',
    'contribution.title': 'Make a contribution',
    'contribution.p1': 'You can increase the fundraising total even before the center opens.',
    'contribution.p2': 'Each contribution supports veterans’ recovery and integration and helps fund the “Path of Strength” program. Participation is free for veterans, service members, their families, and families of the fallen and missing.',
    'contribution.p3': 'Your contribution adds to the total shown on the site. We publish monthly reports.',
    'contribution.cta': 'Support financially',
    'directions.title': 'Location',
    'directions.body': 'The “Spravzni” center is located near the Stilske hillfort — a unique place between Lviv and Stryi. It is a historic site where, even before Kyivan Rus, the White Croats lived and left behind caves and an entire underground city.',
    'directions.address.label': 'Address',
    'directions.address.value': 'Lviv region, Dubrova village',
    'directions.byCar.label': 'By car',
    'directions.byCar.p1': 'From Lviv it is about 35 km; from Stryi — 40 km. That is roughly 40–55 minutes.',
    'directions.byCar.p2': 'Near the entrance to the center there is a short section where you should drive carefully. Before full launch, it will be comfortable for driving.',
    'directions.transfer.label': 'By transfer',
    'directions.transfer.p1': 'We provide transfers within the Lviv region for any group size.',
    'instagram.title': 'Spravzhni on Instagram',
    'instagram.subtitle': 'We show and share our journey honestly',
    'instagram.scrollLeft': 'Scroll left',
    'instagram.scrollRight': 'Scroll right',
    'instagram.postAlt': 'Instagram post',
    'instagram.fallback.1.title': 'That’s us',
    'instagram.fallback.2.title': 'Place of strength',
    'instagram.fallback.3.title': 'Our kids',
    'instagram.fallback.4.title': 'Walk',
    'instagram.fallback.5.title': 'Story',
    'textOverImage.line1': 'Allow yourself to pause.',
    'textOverImage.line2': 'It restores strength',
    'chat.button.aria': 'Support chat',
    'chat.button.question': 'Questions?',
    'chat.button.reply': 'We reply',
    'videoPartners.play': 'Play video',
    'videoPartners.pause': 'Pause video',
    'videoPartners.mute': 'Mute',
    'videoPartners.unmute': 'Unmute',
    'videoPartners.thanks': 'Thanks for being with us!',
    'support.caption.line1': 'By choosing “Spravzni”,',
    'support.caption.line2': 'you support veterans and their families,',
    'support.caption.line3': 'who were their support all this time',
    'stats.title': '“Spravzni” has already raised',
    'stats.subtitle': 'for veterans’ recovery and reintegration',
    'stats.card1': 'These are adaptive swimming trainings and the “Path of Strength” recovery program held at our center.',
    'stats.card2': '80% of the center’s profits also go to veterans’ recovery projects and their families.',
    'stats.card3': 'We publish the updated totals of collected and spent funds at the end of each month, after all calculations.',
    'stats.currency': 'UAH',
    'stats.report': 'Report',
    'services.title': 'Services',
    'services.subtitle': 'are available even without accommodation',
    'services.button.vacationOptions': 'Vacation options',
    'services.button.contact': 'Contact us',
    'services.button.notify': 'Notify me when you open',
    'services.button.learnMore': 'Learn more',
    'services.overlay.may': 'we open in May',
    'services.overlay.june': 'we open in June',
    'services.service1.title': 'Active rest for yourself. Team building for business',
    'services.service1.p1': '35 km from Lviv — and you arrive almost without noticing the trip. Perfect for a weekend or a one‑day team building.',
    'services.service1.p2': 'There are hiking routes for eco‑tourism lovers. Rent bikes or ride horses and explore the scenic Lviv Opillia. Nearby are a cascade of lakes and the Dnister, so you can fish or spend an active day on SUPs, kayaks, or canoes.',
    'services.service1.p3': 'After an active day — craft fish on the grill and an evening by the fire. And we haven’t even told you about mushrooms, raspberries, sheep, and gardening!',
    'services.service2.title': 'Cabin under the pines',
    'services.service2.p1': 'Watch the sunrise with a cup of coffee, read on the terrace, or simply listen to the forest. In the evening, go to the SPA and return to sleep pleasantly tired and full.',
    'services.service2.p2': 'We’re creating this place for those who seek calm, love nature’s aesthetics, and value comfort.',
    'services.service2.p3': 'Everything for two to four guests: two floors, comfy beds, a kitchen, a terrace, and large windows to admire the forest 24/7. A place of strength and calm where you can just be yourself.',
    'services.service2.p4': 'Minimum booking — two nights.',
    'services.service3.title': 'Barrier‑free SPA',
    'services.service3.p1': 'Our SPA center will feature a bathhouse with a contrast pool, an infrared sauna, and a hay room.',
    'services.service3.p2': 'Two hot tubs will relax you with forest aromas. Separate rooms allow multiple groups to relax in complete privacy.',
    'services.service3.p3': 'And importantly, our SPA center will be fully barrier‑free: we care about the smallest details for all guests’ comfort.',
    'services.service4.title': 'Turn‑key events',
    'services.service4.p1': 'For business we offer infrastructure for strategy sessions, trainings, retreats, and other events up to 30 people. We have the necessary equipment, backup power, and reliable Wi‑Fi.',
    'services.service4.p2': 'For your colleagues we provide a custom team‑building program that restores cohesion and connection.',
    'services.service4.p3': 'For individual clients we organize personal events end‑to‑end: an atmospheric party among pines, a cozy birthday, or a small wedding.',
    'services.service4.p4': 'Your personal coordinator will take care of the details that matter to you.',
    'services.service5.title': 'Group program “Path of Strength”',
    'services.service5.p1': 'We believe caring for your inner state is not weakness but the foundation of resilience. That’s why we created a program combining mentoring support and bodywork — helping you slow down and feel inner support again. Formats: 1, 3, and 7 days. Groups from 10 to 20 people.',
    'services.service5.p2': 'During the program, the center is available only to participants.',
    'services.service5.p3': 'Free for veterans, their families, and families of the fallen, captured, and missing.',
    'about.p1': 'Hi. We are Ruslan and Natalia, a couple and founders of the “Spravzni” center. We’re also a family that knows how two check marks in Signal under a read message can sometimes be healing.',
    'about.p2': 'In 2022, when the full‑scale invasion began, Ruslan volunteered for the front. Behind him are heavy battles, losses, and experiences that change a person forever. Returning home and a long reintegration became a new challenge: how to find yourself again, how to live when everything has changed?',
    'about.p3': 'Even before the full‑scale invasion we dreamed of a place of strength where you can slow down and recover. After Ruslan’s return we realized it was time to bring the idea to life. By chance we found a plot in Stilske village — and felt it had been waiting for us. Now we are creating the Spravzni space here.',
    'about.p4': 'This is not only a recreation center. It is a place where we will share experience, unite, and support each other during the war and after victory.',
    'about.readMore': 'Read more',
    'imagine.title': 'Imagine.',
    'imagine.line1': 'You are in a place that',
    'imagine.line2': 'slows your breath',
    'imagine.p1.line1': 'Nature there is pure and quiet.',
    'imagine.p1.line2': 'Only the leaves softly whisper:',
    'imagine.p2': 'Stop... Do you hear?',
    'imagine.p3.line1': 'It’s you. The real you.',
    'imagine.p3.line2': 'It’s you. The real you.',
    'space.title': 'Space',
    'space.subtitle': 'where we will exhale together',
    'space.feature1': 'nature, heritage, and architectural innovation combined in one location',
    'space.feature2': '4 out of 5 hryvnias of profit go to veterans’ recovery, and we report publicly',
    'space.feature3': 'a modern barrier‑free spa center, with a goal of full accessibility across the infrastructure',
    'space.feature4': 'your personal coordinator takes care of the smallest details of your comfort',
    'space.feature5': 'catering provides tasty and nourishing food',
    'space.feature6': '35 km from Lviv, transfer available',
    'space.feature7': 'backup power and reliable Wi‑Fi available',
    'space.feature8': 'flexible terms if your plans change',
    'space.imageAlt': 'Space photo {{index}}',
    'space.imageAltEnlarged': 'Space photo {{index}} — enlarged',
    'space.zoom': 'Zoom image',
    'space.prev': 'Previous image',
    'space.next': 'Next image',
    'space.close': 'Close',
    'pricingCta.title': 'Service pricing will appear closer to the center’s opening.',
    'pricingCta.subtitle': 'We’ll make sure it is fair and transparent.',
    'pricingCta.button': 'Send the price list when prices are ready',
    'vacationOptions.overlay': 'See you in summer',
    'vacationOptions.close': 'Close',
    'vacationOptions.scrollLeft': 'Scroll left',
    'vacationOptions.scrollRight': 'Scroll right',
    'vacationOptions.option1.title': 'SUPs, kayaks, and canoes',
    'vacationOptions.option1.desc': 'Water sets the rhythm: calm yet alive. Your body works without tension. Breath evens out, and everything feels lighter.',
    'vacationOptions.option2.title': 'Tour of the Stilske hillfort',
    'vacationOptions.option2.desc': 'Go on a guided tour of the place where the White Croats once had their capital. It will impress you, and we’ll take care of lunch by the fire afterward.',
    'vacationOptions.option3.title': 'Grilling on the barbecue',
    'vacationOptions.option3.desc': 'All you need is heat, fresh food, and good company. Bring your own products or order from us. All necessary equipment is included.',
    'vacationOptions.option4.title': 'Coziness',
    'vacationOptions.option4.desc': 'Maybe the fire will want to burn.',
    'vacationOptions.option5.title': 'Hiking',
    'vacationOptions.option5.desc': 'Explore scenic trails of Lviv Opillia. Walks of varying difficulty for all levels.',
    'vacationOptions.option6.title': 'Cycling routes',
    'vacationOptions.option6.desc': 'Active cycling through picturesque landscapes. Routes for beginners and experienced riders.',
    'vacationOptions.option7.title': 'Horseback rides',
    'vacationOptions.option7.desc': 'Feel freedom and unity with nature during a horseback ride along forest paths.',
    'vacationOptions.option8.title': 'Fishing',
    'vacationOptions.option8.desc': 'Relaxing fishing on a cascade of lakes and the Dnister River. All necessary equipment is provided.',
    'vacationOptions.option9.title': 'Evening by the fire',
    'vacationOptions.option9.desc': 'A cozy evening by the fire with hot drinks, conversation, and a calm atmosphere.',
    'slider.title': 'We are. As we are',
    'slider.subtitle': 'real',
    'slider.prev': 'Previous slide',
    'slider.next': 'Next slide',
    'slider.quoteAlt': 'Quote mark',
    'slider.slide2.heading': 'We believe everything starts with trust.',
    'slider.slide2.body': 'In yourself, in the world, and in those you meet along your path. It is easy to lose your true self and so hard to find it again.',
    'slider.slide3.heading': 'That’s why we walk a path of seeking our true selves.',
    'slider.slide3.body': 'And that road brought us to Stilske.',
    'slider.slide4.heading': 'We strive for a new trust to be born here, at the intersection of veterans’ and civilians’ experiences.',
    'slider.slide4.body': 'So that shared conversations, journeys, projects, and sometimes tears and laughter bring each of us back to life.',
    'slider.slide5.heading': 'We believe that in this space new connections, shared ideas, and deeds will be born.',
    'slider.slide5.body': 'And that together we will build the new Ukraine we dream of — and where our children will want to live.',
    'slider.slide6.heading': 'This is the generation in whose hands we will pass Ukraine.',
    'slider.slide6.body': 'And it is a great responsibility we accept consciously.',
    'slider.slide7.heading': 'Today you see the first steps of the center.',
    'slider.slide7.body': 'We continue to develop the territory, seek partners, apply for grants — and are already open to our first guests.',
    'slider.slide8.heading': 'Our plans are ambitious and involve phased growth.',
    'slider.slide8.body': 'Our project has no investors or big budgets. So we build the center gradually, but with soul and sincere intentions.',
    'slider.slide9.heading': 'Our hill is a place of strength and calm.',
    'slider.slide9.body': 'Here you can be real, be yourself, simply be....',
    'slider.slide10.heading': 'And behind us are care, professionalism, and service thought through to the details.',
    'slider.slide10.body': 'Breathe out. Trust. Live.',
    'footer.contacts': 'Contacts',
    'footer.services': 'Services',
    'footer.navigate': 'Navigate to',
    'footer.supportProgram': 'Support the recovery program',
    'footer.followUs': 'Follow us:',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms of use',
    'footer.rights': '© 2025 Spravzni. All rights reserved.',
    'footer.hours': 'Daily from 10:00 to 19:00',
    'chatQuestionnaire.title': 'Before starting the chat',
    'chatQuestionnaire.subtitle': 'Please fill out the form so we can contact you',
    'chatQuestionnaire.field.name': 'Name',
    'chatQuestionnaire.field.email': 'Email',
    'chatQuestionnaire.field.phone': 'Phone',
    'chatQuestionnaire.placeholder.name': 'Enter your name',
    'chatQuestionnaire.placeholder.email': 'example@email.com',
    'chatQuestionnaire.placeholder.phone': '+380 XX XXX XX XX',
    'chatQuestionnaire.error.nameRequired': 'Name is required',
    'chatQuestionnaire.error.emailRequired': 'Email is required',
    'chatQuestionnaire.error.emailInvalid': 'Invalid email format',
    'chatQuestionnaire.error.phoneRequired': 'Phone is required',
    'chatQuestionnaire.error.phoneInvalid': 'Invalid phone format',
    'chatQuestionnaire.submit': 'Start chat',
    'chatQuestionnaire.sending': 'Sending...',
    'form.consent.prefix': 'By clicking the button, you agree to the website\'s',
    'form.consent.terms': 'terms and conditions',
    'form.consent.and': 'and',
    'form.consent.privacy': 'privacy policy',
    'chatWindow.title': 'Chat',
    'chatWindow.description': 'What are you interested in? We will reply shortly!',
    'chatWindow.closeChat': 'Close chat',
    'chatWindow.closePopup': 'Close',
    'chatWindow.greetingTitle': 'Hi!',
    'chatWindow.greetingBody': 'What can we help you with?',
    'chatWindow.placeholderMessage': 'Type your message',
    'chatWindow.responseLabel': 'You’d like to receive a reply via',
    'chatWindow.send': 'Send',
    'chatWindow.sending': 'Sending...',
    'chatWindow.successTitle': 'Thanks for your message!',
    'chatWindow.successBody': 'We will get back to you shortly.',
    'chatWindow.error.messageRequired': 'Please enter a message',
    'chatWindow.error.phoneRequired': 'Please enter your phone number',
    'chatWindow.error.phoneInvalid': 'Please check the phone number',
    'chatWindow.error.emailRequired': 'Please enter your email',
    'chatWindow.error.emailInvalid': 'Correct format: example@mail.com',
    'chatWindow.error.responseMethodRequired': 'Please choose a response method',
    'chatWindow.error.submit': 'Failed to send message',
    'chatWindow.error.submitGeneric': 'Failed to send message. Please try again.',
    'chatWindow.time.justNow': 'just now',
    'chatWindow.time.minutesAgo': '{{count}} min ago',
    'chatWindow.time.hoursAgo': '{{count}} hr ago',
    'donate.loading': 'Loading...',
    'donate.back': 'Back',
    'donate.title': 'Make a contribution',
    'donate.subtitle': 'for veterans’ recovery and integration from the “Spravzni” center',
    'donate.amountLabel': 'Enter amount in hryvnias',
    'donate.amountPlaceholder': 'Enter amount',
    'donate.recipientInfo': 'Recipient — charitable account of NGO “Spravzhni. Civilians. Veterans”',
    'donate.recurringLabel': 'Make a recurring payment',
    'donate.intervalLabel': 'Payment frequency',
    'donate.countLabel': 'Number of payments',
    'donate.countPlaceholder': 'For example: 12',
    'donate.payButton': 'Make a transfer',
    'donate.processing': 'Processing...',
    'donate.info1': 'Each donation will support veterans’ recovery and integration and cover the free “Path of Strength” program for veterans, service members, their families, and families of the fallen and missing.',
    'donate.info2': 'We report incoming funds and expenses at the end of each month.',
    'donate.reportLink': 'Report as of {{date}}.',
    'donate.bankDetailsTitle': 'Bank details for transfer',
    'donate.ibanLabel': 'IBAN account:',
    'donate.bankNameLabel': 'Bank name:',
    'donate.recipientLabel': 'Recipient:',
    'donate.edrpouLabel': 'EDRPOU:',
    'donate.purposeLabel': 'Payment purpose:',
    'donate.purposeValue': 'charitable assistance',
    'donate.currencyLabel': 'Currency:',
    'donate.copied': 'Copied!',
    'donate.bankNameValue': 'Raiffeisen Bank',
    'donate.recipientValue': 'NGO "SPRAVZHNI. CIVILIANS. VETERANS"',
    'donate.interval.daily': 'Daily',
    'donate.interval.biweekly': 'Every 2 weeks',
    'donate.interval.monthly': 'Monthly',
    'donate.interval.yearly': 'Yearly',
    'donate.error.maxAmount': 'Maximum one-time amount is 499,999 UAH',
    'donate.error.minAmount': 'Minimum amount is 1 UAH',
    'donate.error.intervalRequired': 'Please select payment frequency',
    'donate.error.countRequired': 'Please enter desired number of payments',
    'donate.error.fillRequired': 'Please fill in all required fields',
    'donate.error.createDonation': 'Failed to create donation',
    'donate.error.recurringUnavailable': 'Recurring payments are currently unavailable. Please contact Monobank support to enable recurring payments for your account.',
    'donate.error.generic': 'Something went wrong. Please try later.',
    'donate.description': 'Donation {{amount}} UAH',
    'donate.infoParagraph': 'Each donation supports veterans’ recovery and integration: adaptive swimming groups; the “Path of Strength” program for veterans, military personnel, their families, and families of the fallen and missing; and more.',
    'donate.reportMonthly': 'We report monthly.',
    'donate.termsPrefix': 'By clicking, you accept the',
    'donate.termsLink': 'Terms',
    'donate.termsAnd': 'and',
    'donate.privacyLink': 'Privacy Policy',
    'donate.bankDetailsSectionTitle': 'Bank details for transfer',
    'terms.title': 'Terms of Use',
    'terms.section1.title': '1. Acceptance of terms',
    'terms.section1.body': 'By using our website and services, you agree to comply with these Terms of Use. If you do not agree with any part of these terms, please do not use our website.',
    'terms.section2.title': '2. Website use',
    'terms.section2.body': 'You agree to use our website only for lawful purposes and in accordance with all applicable laws and regulations. It is prohibited to:',
    'terms.section2.item1': 'Use the website in any way that could damage, disable, overload, or impair the website',
    'terms.section2.item2': 'Attempt to gain unauthorized access to any part of the website',
    'terms.section2.item3': 'Use automated systems to collect data from the website',
    'terms.section2.item4': 'Distribute viruses or other malicious software',
    'terms.section3.title': '3. Intellectual property',
    'terms.section3.body': 'All content on this website, including text, graphics, logos, images, and software, is the property of Spravzni or its licensors and is protected by copyright and intellectual property laws.',
    'terms.section4.title': '4. Services',
    'terms.section4.body': 'We strive to ensure the accuracy of information about our services, but do not guarantee that all information on the website is complete, accurate, or current. We reserve the right to change or discontinue any services at any time without notice.',
    'terms.section5.title': '5. Limitation of liability',
    'terms.section5.body': 'Spravzni is not liable for any direct, indirect, incidental, special, or consequential damages arising from the use or inability to use our website or services.',
    'terms.section6.title': '6. Links to third‑party sites',
    'terms.section6.body': 'Our website may contain links to third‑party websites. We do not control and are not responsible for the content, privacy policies, or practices of any third‑party websites.',
    'terms.section7.title': '7. Changes to terms',
    'terms.section7.body': 'We reserve the right to change these Terms of Use at any time. Your continued use of the website after changes are made constitutes your acceptance of the new terms.',
    'terms.section8.title': '8. Contact',
    'terms.section8.body': 'If you have any questions about these Terms of Use, please contact us:',
    'terms.section8.emailLabel': 'Email:',
    'terms.section8.phoneLabel': 'Phone:',
    'terms.section9.title': '9. Governing law',
    'terms.section9.body': 'These Terms of Use are governed by and construed in accordance with the laws of Ukraine. Any disputes arising from these terms are subject to the exclusive jurisdiction of the courts of Ukraine.',
    'terms.lastUpdated': 'Last updated:',
    'privacy.title': 'Privacy Policy',
    'privacy.section1.title': '1. General provisions',
    'privacy.section1.body': 'This Privacy Policy describes how we collect, use, and protect your personal information when you use our website and services.',
    'privacy.section2.title': '2. Information collection',
    'privacy.section2.body': 'We may collect the following information:',
    'privacy.section2.item1': 'Name and contact information',
    'privacy.section2.item2': 'Email',
    'privacy.section2.item3': 'Phone number',
    'privacy.section2.item4': 'Information about website usage',
    'privacy.section3.title': '3. Use of information',
    'privacy.section3.body': 'We use the collected information to:',
    'privacy.section3.item1': 'Provide and improve our services',
    'privacy.section3.item2': 'Communicate with you regarding your inquiries',
    'privacy.section3.item3': 'Send important notifications',
    'privacy.section3.item4': 'Improve service quality',
    'privacy.section4.title': '4. Information security',
    'privacy.section4.body': 'We take appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.',
    'privacy.section5.title': '5. Disclosure to third parties',
    'privacy.section5.body': 'We do not sell, trade, or transfer your personal information to third parties without your consent, except as required by law.',
    'privacy.section6.title': '6. Your rights',
    'privacy.section6.body': 'You have the right to:',
    'privacy.section6.item1': 'Access your personal information',
    'privacy.section6.item2': 'Request correction of inaccurate information',
    'privacy.section6.item3': 'Request deletion of your information',
    'privacy.section6.item4': 'Withdraw consent to data processing',
    'privacy.section7.title': '7. Contact',
    'privacy.section7.body': 'If you have questions about this Privacy Policy, please contact us:',
    'privacy.section7.emailLabel': 'Email:',
    'privacy.section7.phoneLabel': 'Phone:',
    'privacy.section8.title': '8. Changes to this Privacy Policy',
    'privacy.section8.body': 'We reserve the right to update this Privacy Policy at any time. We will notify you of changes by posting the new Privacy Policy on this page.',
    'privacy.lastUpdated': 'Last updated:',
    'admin.login.title': 'Admin panel',
    'admin.login.subtitle': 'Sign in to access the admin dashboard',
    'admin.login.emailLabel': 'Email',
    'admin.login.passwordLabel': 'Password',
    'admin.login.emailPlaceholder': 'admin@example.com',
    'admin.login.passwordPlaceholder': 'Enter password',
    'admin.login.submit': 'Sign in',
    'admin.login.submitting': 'Signing in...',
    'admin.login.errorInvalid': 'Invalid email or password',
    'admin.login.errorGeneric': 'Something went wrong. Please try again.',
    'admin.dashboard.title': 'Admin panel',
    'admin.dashboard.menu': 'Menu',
    'admin.dashboard.logout': 'Log out',
    'admin.dashboard.filterLabel': 'Filter:',
    'admin.dashboard.clearFilters': 'Clear',
    'admin.dashboard.forms': 'Forms',
    'admin.dashboard.loading': 'Loading...',
    'admin.dashboard.empty': 'No forms found',
    'admin.dashboard.changeStatus': 'Change status:',
    'admin.dashboard.updating': 'Updating...',
    'admin.dashboard.name': 'Name',
    'admin.dashboard.phone': 'Phone',
    'admin.dashboard.message': 'Message:',
    'admin.dashboard.comment': 'Comment:',
    'admin.dashboard.contactMethod': 'Contact method:',
    'admin.dashboard.responseMethod': 'Response method:',
    'admin.dashboard.interests': 'Interests:',
    'admin.dashboard.priceList': 'Price list:',
    'admin.dashboard.userId': 'User ID:',
    'admin.dashboard.priceListYes': 'Yes',
    'admin.dashboard.priceListNo': 'No',
    'admin.dashboard.unnamed': 'Unnamed',
    'admin.dashboard.status.new': 'New',
    'admin.dashboard.status.viewed': 'Viewed',
    'admin.dashboard.status.contacted': 'Contacted',
    'admin.dashboard.status.resolved': 'Resolved',
    'admin.dashboard.status.archived': 'Archived',
    'admin.dashboard.formType.all': 'All',
    'admin.dashboard.formType.contact': 'From form',
    'admin.dashboard.formType.chat': 'From chat',
    'admin.dashboard.loadError': 'Failed to load forms',
    'admin.dashboard.updateError': 'Failed to update status. Please try again.',
    'admin.dashboard.contactPref.phone': 'Phone',
    'admin.dashboard.contactPref.whatsapp': 'WhatsApp',
    'admin.dashboard.contactPref.email': 'Email',
    'admin.dashboard.interest.all': 'All services',
    'admin.dashboard.interest.active': 'Active rest & teambuilding',
    'admin.dashboard.interest.cabin': 'Cabin under the pines',
    'admin.dashboard.interest.spa': 'Barrier‑free SPA',
    'admin.dashboard.interest.program': 'Group program “Path of Strength”',
    'admin.dashboard.interest.events': 'Turn‑key events',
  },
  pl: {
    // Polish can be filled later; fall back to keys/other languages for now
  },
}

