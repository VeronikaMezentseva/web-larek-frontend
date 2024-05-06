# Проектная работа "Веб-ларек"

https://github.com/VeronikaMezentseva/web-larek-frontend.git

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

В проекте используется паттерн проектирования Model View Presenter.  

Модели:  
Модель `CardModel` используется для хранения данных карточек, приходящих в ответе от сервера  
`public id: string` - айди карточки  
`public description:` string - описание карточки  
`public image: string` - изображение карточки  
`public title: string` - заголовок карточки  
`public category: CardCategory` - описание категории карточки  
`public price: number | null` - цена карточк   

`CardCategory` - enum список, хранящий строковое описание категорий карточек  

Модель `UserOptions` используется для хранения данных, введенных пользователем  
 `_paymentMethod: 'card' | 'cash' | null` - выбранный способ оплаты, null если не выбран  
 `_addres: string` - введенный адрес  
 `_email: string` - введенная почта  
 `_phone: string` - введенный номре телефона  
 Методы модели:  
`resetFields()` - сбрасывает все поля с данными, введенными пользователем до начальных значений, то есть пустых строк. Метод используется после оформления заказа и успешной оплаты для сброса данных.  
Сеттеры:  
`set paymentMethod(value: 'card' | 'cash' | null)` - устанавливает способ оплаты, выбранный пользователем  
`set address(value: string)` - устанавливает адрес пользователя  
`set email(value: string)` - устанавливает почту пользователя  
`set phone(value: string)` - устанавливает телефон пользователя  

Презентер `Presenter` используется для описания и выполнения основной логики приложения. 
Конструктор:  
В конструкторе презентера создается единственный экземпляр класса `EventEmitter`, с помощью метода эмиттера `on` создаются обработчики на все типы событий. Также в конструкторе презентера находятся querySelector'ом все тимплейты и контейнеры и сохраняются в поля класса.  
Поля `cardList: CardModel[]` и `addedCardList: CardModel[]` инициализируются как пустые массивы в конструкторе, в дальнейшем при получении карточек с сервера их данные сохраняются в cardList, а в addedCardList будут хранится данные тех карточек, которые пользователь добавил в корзину. Также в конструкторе создаются и записываются в поля презентера единственные экземпляры классов View `BasketPage` `Basket`, `Modal`, `FormAddress`, `FormContacts`, `Succsess` и `UserOptions`  
Методы презентера:  
`init()` - отправляет запрос на сервер для получения карточек товаров и выводит их на страницу.  
 `openCard(card: CardModel)` - создает объект отображения превью карточки, заполняя его данными из модели карточки, открывает модальное окно с содержимым.  
 `addCardToBasket(card: CardModel)` - добавляет товар в корзину, размещая объект CardModel в addedCardList.  
 `openBasket()` - отображает содержимое корзины.  
 `deleteItem(basketItem: IBasketItem)` - удаляет товар из корзины, обновляет addedCardList и перерисовывает содержимое корзины.  
 `openForm()` - отображает форму с выбором способа оплаты и адресом.  
 `handlePaymentOption(data: {value: HTMLElement, button: HTMLButtonElement})` - изменяет данные в модели userOptions в зависимости от способа оплаты выбранной пользователем.  
 `handleInputAddress(data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement})` - также изменяет данные адреса в модели userOptions  
 `toggleButtonForm(button: HTMLButtonElement)` - меняет состояние кнопки формы в зависимости от данных в модели userOptions  
 `submitAddressForm()` - отображает форму с адресом и телефоном  
 `handleEmailInput(data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement})` - меняет данные почты в модели userOptions  
 ` handlePhoneInput(data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement})` - меняет данные номера в модели userOptions  
 `toggleButtonFormContacts(button: HTMLButtonElement)` - меняет состояние кнопки сабмита в форме контактов в зависимости от данных в userOptions  
 `openSuccsess()` - отображает окно об успешной оплате  
 `resetBasket()` - очищает содержимое отображения корзины  
 `postOrder()` - отправляет данные из модели userOptions на сервер  

1) Класс Api  
Предоставляет методы для получения данных с сервера и отправки запросов на сервер.  
Конструктор принимает такие аргументы как:  
`baseUrl` - базовоый URL для формирования адреса запроса  
`options` - объект с настройками запроса  
Методы:  
`get` - для отправки get запроса на сервер, аргументом принимает строку с эндпоинтом  
`post` - для отправки put запроса на сервер, аргументом принимает эндпоинт и объект с данными для отправки  

2) Класс EventEmitter  
Брокер событий. Предоставляет следующие методы:  
`on<T extends object>(eventName: EventName, callback: (event: T) => void)` - устанавливает обработчик на событие, аргументами принимает название события и колбэк.  
`off(eventName: EventName, callback: Subscriber)` - снимает обработчик с события, принимает название события и колбэк.  
`emit<T extends object>(eventName: string, data?: T)` - инициирует событие, принимает название события и объект с данными.  
`onAll(callback: (event: EmitterEvent) => void)` - подписывается на все события.  
`offAll()` - снимает все обработчики.  
`trigger<T extends object>(eventName: string, context?: Partial<T>)` - вызывает коллбек триггер, генерирующий событие при вызове.  

Классы отображения View 

1) Класс Basket  
Класс для отображения корзины на странице. 
Конструктор принимает тимплейт корзины для создания элемента корзины и инициализирует такие поля как:  
  `eventEmitter: EventEmitter` - хранит ивент эмиттер  
  `basketElement: HTMLElement` - клонированный тимплейт  
  `basketTotalPrice: HTMLElement` - отображает общую стоимость всех товаров, добавленных в корзину.  
  `_basketList: HTMLElement` - контейнер для отображения товаров в корзине.  
  `submitButton: HTMLButtonElement` - кнопка для оформления заказа, при клике генерирует событие submit:order.  
Методы:  
`render()` - возвращает клонированный тимплейт со всеми дочерними элементами.  
`set content(value: HTMLElement)` - сеттер, аппендит HTML элемент итема, добавленного в корзину, в поле _basketList для последующий отрисовки их на странице.  
`set total(value: string)` - сеттер, отображает общую стоимость всех элементов в корзине.  
`disableButton(addedCardList: card[])` - метод, принимающий список добавленных в корзину итемов, меняет состояние кнопки сабмита.  
`resetContent()` - очищает разметку в _basketList  
`disableButton(addedCardList: CardModel[])` - меняет состояние кнопки сабмита  

2) Класс BasketItem  
Класс для отображения добавленного итема в корзину  
Конструктор принимает тимплейт итема для создания элемента и инициализирует такие поля как:  
  `eventEmitter: EventEmitter` - хранит ивент эмиттер
  `basketElement: HTMLElement` - клонированный тимплейт   
  `basketItemIndex: HTMLElement` - элемент отображения порядкового номера элемента в корзине  
  `basketItem: HTMLElement` - контейнер элемента  
  `basketItemTitle: HTMLElement` - элемент для отображения названия итема  
  `basketItemPrice: HTMLElement` - элемент для отображения стоимости итема  
  `basketItemDeleteButton: HTMLButtonElement` - кнопка для удаления итема из корзины, генерирует событие basket:itemDelete  
  `itemId: string` - поле для хранения id создаваемого итема  
Методы:  
`render(card: card, cardsList: card[])` - метод устанавливающий текст для отображения в элементах итема, возвращает нодовый узел. В аргументах принимает модель итема и список добавленных итемов.  

3) Класс BasketPage  
Класс для отображения элемента корзины на странице магазина, поля класса:  
  `eventEmitter: EventEmitter` - хранит ивент эмиттер  
  `basketButton: HTMLElement` - кнопка для открытия корзины, инициирует событие basket:open по клику  
  `basketCounter: HTMLElement` - элемент, отображающих количество товаров, добавленных в корзину  

4) Класс Card  
Класс для отображения каталога карточек на странице и отображения карточки с полным описанием при открытии превью.  
Конструктор принимает тимплейт карточки и EventEmitter.  
Содержит поля:
  `eventEmitter: EventEmitter` - хранит ивент эмиттер  
  `cardElement:` HTMLElement - хранит клонированный тимплейт  
  `cardButton?:` HTMLButtonElement - кнопка-обертка карточки, необязательное поле. При клике инициирует событие card:open для открытия превью карточки  
  `cardCategory:` HTMLElement - элемент для отображения категории карточки  
  `cardTitle:` HTMLElement - элемент отображения названия карточки  
  `cardImage:` HTMLImageElement - отображение картонки карточки  
  `cardPrice:` HTMLElement - элемент отображения цены карточки  
  `cardDescription?:` HTMLElement - отображение полного описания карточки, необязательное поле  
  `cardAddButton?`: HTMLButtonElement - кнопка для добавления карточки в корзину, инициирует событие basket:cardAdded, необязательное поле  
Методы:  
`render(card: cardModel)` - метод, устанавливающий текст для отображения элементов карточки, принимает аргументом модель карточки.  

5) Класс FormAddress  
Класс для отображения элементов формы адреса  
Конструктор принимает тимплейт формы и EventEmitter.  
Содержит поля:
  `eventEmitter: EventEmitter` - хранит ивент эмиттер  
  `formElement: HTMLFormElement` - хранит клонированный тимплейт со всеми дочерними элементами.  
  `form: HTMLFormElement` - контейнер формы  
  `onlineButton: HTMLButtonElement` - кнопка выбора оплаты, при клике вызывает метод класса activateOnlineButton() и инициирует событие user:onlineSelected  
  `offlineButton: HTMLButtonElement` - кнопка выбора оплаты, при клике вызывает метод класса activateOOfflineButton() и инициирует событие user:offlineSelected  
  `inputAddres: HTMLInputElement` - элемент инпута адреса формы, при вводе данных пользователем инициирует событие user:inputAddres  
  `submitButton: HTMLButtonElement` - кнопка сабмита формы, инициирует событие user:submitForm  
  `error: HTMLElement` - элемент для отображения кастомных ошибок при валидации формы  
Методы:  
`activateOnlineButton()` - метод, вызывающийся при нажатии на кнопку onlineButton, изменяет классы кнопки для отображения выбранного пользователем метода оплаты  
`activateOfflineButton()` - метод, вызывающийся при нажатии на кнопку offlineButton, изменяет классы кнопки для отображения выбранного пользователем метода оплаты  
`render()` - возвращает элемент формы со всеми дочерними элементами.
`resetFields()` - очищает поля формы  

6) Класс FormContacts  
Класс для отображения элементов формы контактов  
Конструктор принимает тимплейт формы контактов и EventEmitter.  
Содержит поля:
  `eventEmitter: EventEmitter` - хранит ивент эмиттер  
  `templateForm: HTMLFormElement` -  хранит клонированный тимплейт со всеми дочерними элементами  
  `form: HTMLFormElement` - контейнер формы контактов  
  `emailInput: HTMLInputElement` - элемент инпута почты формы, при вводе данных пользователем инициирует событие user:emailInput  
  `phoneInput: HTMLInputElement` - элемент инпута телефона формы, при вводе данных пользователем инициирует событие user:phoneInput  
  `submitButton: HTMLButtonElement` - кнопка сабмита формы, инициирует событие user:contactsFormSubmit  
  `error: HTMLElement` - элемент для отображения кастомных ошибок привалидации формы  
Методы:  
`render()` - возвращает элемент формы со всеми дочерними элементами.
`resetFields()` - очищает поля формы  

7) Класс Succsess  
Класс для отображения сообщения об успешной оплате товаров  
Конструктор принимает тимплейт окна и EventEmitter.  
Содержит поля:
  `eventEmitter: EventEmitter` - хранит ивент эмиттер  
  `element: HTMLElement` - хранит клонированный тимплейт со всеми дочерними элементами  
  `orderDescription: HTMLElement` - элемент для отображения информации об оплате товаров  
  `button: HTMLButtonElement` - кнопка закрытия окна, инициирует событие succsess:close  
Методы:  
`setDescription(value: string)` - заполняет текст в элементе orderDescription  
`render ()` - возвращает элемент окна с дочерними элементами  

8) Класс Modal  
Класс для отображения модального окна, предоставляет методы его открытия, закрытия и наполнения контентом.  
Конструктор принимает контейнер модального окна.  
Содержит поля:  
  `closeBtnElement: HTMLButtonElement` - кнопка закрытия модального окна, при клике вызывает метод класса closeModal()  
  `_content: HTMLElement` - поле, хранящее разметку для отображения в модальном окне.  
  `modalContainer: HTMLElement` - контейнер модального окна для реализации закрытия модального окна при клике по оверлею, при клике вызывает метод класса closeModal()  
  `pageWrapper: HTMLElement` - хранит элемент обертки всей страницы, для возможности ее заблокировать при открытии модального окна  
Методы:  
`closeModal()` - закрытие модального окна и разблокировка прокрутки страницы  
`openModal()` - открытие модального окна и блокировка прокрутки страницы  
`set content(value: HTMLElement)` - сеттер для вставки разметки в модальное окно  
