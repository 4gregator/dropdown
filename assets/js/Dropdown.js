class Dropdown {
  constructor(params) {
    // дефолтные значения
    const byDefault = {
      // имя класса дропдауна
      dropClass:      'dropdown__input',
      // имя класса контейнера с опциями
      containerClass: 'dropdown__container',
      // имя класса опции дропдауна
      itemClass:      'dropdown__item',
      // имя класса видимого контейнера с опциями
      visibleClass:   'dropdown__container_visible',
      // имя класса контейнера со скроллом
      scrollClass:    'dropdown__container_scrollable',
      // имя класса дропдауна, открывающегося вниз
      bottomClass:    'dropdown__container_bottom',
      //имя класса дропдауна, открывающегося вверх
      topClass:       'dropdown__container_top',
      // url ресурса
      url:            'https://jsonplaceholder.typicode.com/users'
    };

    params = Object.assign(byDefault, params);

    this.drop = document.querySelector('.' + params.dropClass);
    this.field = document.querySelector('.' + params.containerClass);
    this.option = params.itemClass;
    this.visible = params.visibleClass;
    this.scroll = params.scrollClass;
    this.dropBottom = params.bottomClass;
    this.dropTop = params.topClass;
    this.url = params.url;
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

    await fetch(this.url)
      .then(response => response.json())
      .then(json => {
        data = json;
      });
    
    return data;
  }

  renderDropdown() {
    // очистить поле ввода
    this.clearHtml(this.drop);
    // наполнить
    this.filterOptions();
    this.field.classList.add(this.visible);
    // проверить влазит или нет
    const direction = this.checkExpanse() ? this.dropBottom : this.dropTop;
    // рендерить 
    this.field.classList.add(direction);
  }

  closeDropdown() {
    this.field.classList.remove(this.visible, this.dropBottom, this.dropTop);
  }

  fillOptions() {
    this.clearHtml(this.field);

    this.filterLabels.forEach(el => {
      let option = this.createOption(el.label, el.id);
      this.field.appendChild(option);
    });

    this.checkScroll();
  }

  checkExpanse() {
    let offset = this.drop.getClientRects()[0].y + this.drop.offsetHeight;

    return window.innerHeight - offset >= this.field.offsetHeight;
  }

  checkScroll() {
    if (this.filterLabels.length > 5 && !this.field.classList.contains(this.scroll)) this.field.classList.add(this.scroll);
    else if (this.filterLabels.length <= 5 && this.field.classList.contains(this.scroll)) this.field.classList.remove(this.scroll);
  }

  createOption(label, id) {
    const self = this;
    let span = document.createElement('span');

    span.className = this.option;
    span.textContent = label;
    span.setAttribute('data-id', id);

    span.addEventListener('click', function () {
      self.drop.textContent = label;
      self.optionVal = label;
      self.optionID = id;
      self.closeDropdown();
    });

    return span;
  }

  filterOptions() {
    const self = this;
    const input = this.drop.textContent.toLowerCase();
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
    this.drop.blur();
    this.drop.textContent = this.optionVal;
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

    this.drop.addEventListener('focus', this.renderDropdown.bind(this));
    this.drop.addEventListener('keydown', function (e) {
      if (e.keyCode == 13) {
        //enter
        e.preventDefault();
      }
    });
    this.drop.addEventListener('keyup', function (e) {
      if (e.keyCode == 27) {
        // esc
        self.loseFocus();
      }
    });
    this.drop.addEventListener('input', this.filterOptions.bind(this));
    window.addEventListener('resize', function () {
      if ( self.field.classList.contains(self.visible) ) self.loseFocus();
    });
    document.addEventListener('scroll', function (e) {
      if ( self.field.classList.contains(self.visible) ) self.loseFocus();
    });
    document.addEventListener('click', function (e) {
      if (e.target != self.drop) self.loseFocus();
    });

  }
}