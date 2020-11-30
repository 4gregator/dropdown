class Dropdown {
  constructor(params) {
    // дефолтные значения
    const byDefault = {
      // имя класса видимого контейнера с опциями
      visibleClass: 'dropdown__container_visible',
      // имя класса контейнера со скроллом
      scrollClass:  'dropdown__container_scrollable',
      // имя класса дропдауна, открывающегося вниз
      bottomClass:  'dropdown__container_bottom',
      // имя класса опции дропдауна
      itemClass:    'dropdown__item',
      // количество видимых элементов в контейнере опций
      // в style.scss $fieldSize
      filedSize:    5,
      //имя класса дропдауна, открывающегося вверх
      topClass:     'dropdown__container_top',
      // объект контейнера с опциями
      field:        document.querySelector('.dropdown__container'),
      // объект дропдауна
      drop:         document.querySelector('.dropdown__input'),
      // url ресурса
      url:          'https://jsonplaceholder.typicode.com/users'
    };

    this.params = Object.assign(byDefault, params);

    // список данных для дропдауна
    this.labels = [];
    // отфильтрованные данные для дропдауна
    this.filterLabels = [];
    // выбранная опция
    this.optionVal = '';
    this.optionID = 0;

    this.initialize();
  }
  
  async getData() {
    let data;

    await fetch(this.params.url)
      .then(response => response.json())
      .then(json => {
        data = json;
      });
    
    return data;
  }

  renderDropdown() {
    // очистить поле ввода
    this.clearHtml(this.params.drop);
    // наполнить
    this.filterOptions();
    this.params.field.classList.add(this.params.visibleClass);
    // проверить влазит или нет
    const direction = this.checkExpanse() ? this.params.bottomClass : this.params.topClass;
    // рендерить 
    this.params.field.classList.add(direction);
  }

  closeDropdown() {
    this.params.field.classList.remove(this.params.visibleClass, this.params.bottomClass, this.params.topClass);
  }

  fillOptions() {
    this.clearHtml(this.params.field);

    this.filterLabels.forEach(el => {
      let option = this.createOption(el.label, el.id);
      this.params.field.appendChild(option);
    });

    this.checkScroll();
  }

  checkExpanse() {
    let offset = this.params.drop.getClientRects()[0].y + this.params.drop.offsetHeight;

    return window.innerHeight - offset >= this.params.field.offsetHeight;
  }

  checkScroll() {
    if (
      this.filterLabels.length > this.params.filedSize
      && !this.params.field.classList.contains(this.params.scrollClass)
    ) this.params.field.classList.add(this.params.scrollClass);
    else if (
      this.filterLabels.length <= this.params.filedSize
      && this.params.field.classList.contains(this.params.scrollClass)
    ) this.params.field.classList.remove(this.params.scrollClass);
  }

  createOption(label, id) {
    const self = this;
    let span = document.createElement('span');

    span.className = this.params.itemClass;
    span.textContent = label;
    span.setAttribute('data-id', id);

    span.addEventListener('click', function () {
      self.params.drop.textContent = label;
      self.optionVal = label;
      self.optionID = id;
      self.closeDropdown();
    });

    return span;
  }

  filterOptions() {
    const self = this;
    const input = this.params.drop.textContent.toLowerCase();
    const matches = [];

    this.labels.forEach(function (el) {
      if ( el['label'].toLowerCase().startsWith(input) ) matches.push(el);
    });

    this.filterLabels.length = 0;

    matches.forEach(function (el) {
      self.filterLabels.push(el);
    });
    
    this.fillOptions();
  }

  loseFocus() {
    this.params.drop.blur();
    this.params.drop.textContent = this.optionVal;
    this.closeDropdown();
  }

  clearHtml(target) {
    while (target.firstChild) {
      target.removeChild(target.firstChild);
    }
  }

  async initialize() {
    const self = this;
    const data = await this.getData();
    
    data.forEach(el => {
      this.labels.push({
        'label': el.address.city,
        'id': el.id
      });
    });

    this.params.drop.addEventListener('focus', this.renderDropdown.bind(this));
    this.params.drop.addEventListener('keydown', function (e) {
      if (e.keyCode == 13) {
        //enter
        e.preventDefault();
      } else if (e.keyCode == 27) {
        // esc
        self.loseFocus();
      }
    });
    // this.params.drop.addEventListener('keyup', function (e) {
    //   if (e.keyCode == 27) {
    //     // esc
    //     self.loseFocus();
    //   }
    // });
    this.params.drop.addEventListener('input', this.filterOptions.bind(this));
    window.addEventListener('resize', function () {
      if ( self.params.field.classList.contains(self.params.visibleClass) ) self.loseFocus();
    });
    document.addEventListener('scroll', function (e) {
      if ( self.params.field.classList.contains(self.params.visibleClass) ) self.loseFocus();
    });
    document.addEventListener('click', function (e) {
      if (e.target != self.params.drop) self.loseFocus();
    });
  }
}