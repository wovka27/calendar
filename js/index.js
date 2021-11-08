let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

let nav = 0;
let clicked = null;
let fill = null;

const popupForm = document.querySelectorAll("form");

class DateModule {
  constructor() {
    this.date = new Date();

    if (nav !== 0) {
      this.date.setMonth(new Date().getMonth() + nav);
    }

    this.weekdays = [
      "понедельник",
      "вторник",
      "среда",
      "четверг",
      "пятница",
      "суббота",
      "воскресение",
    ];

    this.day = this.date.getDay();
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();

    this.firstDayinMonth = new Date(this.year, this.month, 1);
    this.lastDayinMonth = new Date(this.year, this.month + 1, 0).getDate();
    this.prevLastDaysMonth = new Date(this.year, this.month, 0).getDate();

    this.dateString = this.firstDayinMonth.toLocaleDateString("ru-ru", {
      weekday: "long",
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });

    this.paddingDay = this.weekdays.indexOf(this.dateString.split(", ")[0]);

    this.$date = null;
    this.flag = false;
    this.dayS = null;
    this.eventValues = null;
  }
  dateDisplay() {
    this.$date = document.querySelector(".main__month h1");

    this.$date.innerHTML = `${this.date.toLocaleDateString("ru", {
      month: "long",
    })} ${this.year}`;
  }

  getDate() {
    return `${this.day}.${this.month + 1}.${this.year}`;
  }

  renderDays(flag = false) {
    const table = document.querySelector(".table");
    table.innerHTML = "";
    for (let i = 1; i <= this.paddingDay + this.lastDayinMonth; i++) {
      this.dayS = document.createElement("div");

      const dataFill = this.eventValues ? true : false;
      const dataEvent = this.eventValues ? this.eventValues.event : "";
      const dataMembers = this.eventValues ? this.eventValues.members : "";
      const dataDesc = this.eventValues ? this.eventValues.desc : "";

      const dataValue = `${this.year}-${
        this.month + 1 < 10 ? "0" + (this.month + 1) : this.month + 1
      }-${
        i - this.paddingDay < 10
          ? "0" + (i - this.paddingDay)
          : i - this.paddingDay
      }`;

      this.dayS.classList.add("table__cell");

      this.dayS.setAttribute(
        "data-add-form",
        `${i > this.paddingDay ? dataValue : ""}`
      );

      this.dayS.setAttribute("data-filled", `${dataFill}`);
      this.dayS.setAttribute("data-val-event", `${dataEvent}`);
      this.dayS.setAttribute("data-val-members", `${dataMembers}`);
      this.dayS.setAttribute("data-val-desc", `${dataDesc}`);

      this.dayS?.dataset.filled === "true"
        ? this.dayS.classList.add("filled")
        : this.dayS.classList.remove("filled");

      this.eventValues = events.find((e) => e.id === this.dayS.dataset.addForm);

      if (i - this.paddingDay === this.day && nav === 0 && flag === true) {
        this.dayS.classList.add("current");
      }

      if (i > this.paddingDay) {
        this.dayS.innerHTML = `
        <div 
          data-filled="${dataFill}" 
          data-add-form="${dataValue}" 
          class="table__row table__row_header"
        >
          <span 
            data-filled="${dataFill}" 
            data-add-form="${dataValue}" 
            class="weekday"
          >
            ${i <= 7 ? this.weekdays[i - 1] : ""}
          </span>
          <span 
            data-filled="${dataFill}" 
            data-add-form="${dataValue}" 
            class="day"
          >
            ${i - this.paddingDay}
          </span>
        </div>

        <div 
          data-filled="${dataFill}" 
          data-add-form="${dataValue}" 
          data-val-event="${dataEvent}" 
          class="table__row table__row_title"
        >
          ${dataEvent}
        </div>

        <div 
          data-filled="${dataFill}" 
          data-add-form="${dataValue}" 
          class="table__row table__row_events"
        >

          <span 
            data-filled="${dataFill}" 
            data-add-form="${dataValue}" 
            data-val-members="${dataMembers}"
          >
            ${dataMembers.replace(/\s+/g, ", ")}
          </span>

          <br>

          <span 
            data-filled="${dataFill}" 
            data-add-form="${dataValue}" 
            data-val-desc="${dataDesc}"
          >
            ${dataDesc}
          </span>
        </div>
        `;
      }

      table.appendChild(this.dayS);
    }
  }
}

class ElementClassActive {
  constructor(element) {
    this.element = element;
  }
  show() {
    this.element.classList.add("active");
  }
  hidden() {
    this.element.classList.remove("active");
  }
}

class GlobalEvent {
  constructor(target) {
    this.target = target;
    this.classActive = this.elClsActive;
  }
  elClsActive(el) {
    return new ElementClassActive(el);
  }

  open(elBtn, elPopup) {
    this.classActive(elBtn).show();
    this.classActive(elPopup).show();
  }
  close(elBtn, elPopup) {
    this.classActive(elBtn).hidden();
    this.classActive(elPopup).hidden();
  }
}

class Form {
  constructor(target) {
    this.target = target;
    this.form = document.createElement("form");
    this.formDateValue = target?.dataset.addForm;
    this.fill = target?.dataset.filled;
    this.eventVal = target?.dataset.valEvent;
    this.membersVal = target?.dataset.valMembers;
    this.descVal = target?.dataset.valDesc;
    this.eventVal = target?.dataset.valEvent;
    this.formInnerHtml = `
    <div class="close-form"><i data-close-form></i></div>
    <div class="form__row">

    ${
      this.fill === "true"
        ? `
        <h2>${this.eventVal}</h2>
      `
        : `
      <input 
      data-change 
      placeholder="Событие" 
      name="name" 
      type="text" 
      value=""
      >
      `
    }

    ${
      this.fill === "true"
        ? `
        <p>${this.formDateValue.split("-").slice(2, 3)} ${new Date(
            new Date().getFullYear(),
            new Date().getMonth() + nav,
            1
          ).toLocaleDateString("ru-ru", { month: "long" })}</p>
      `
        : `
      <input 
        placeholder="День, Месяц, Год" 
        readonly 
        value="${this.formDateValue}" 
        name="date" 
        type="date"
      >
      `
    }

    ${
      this.fill === "true"
        ? `
        <div>Участники:<p>${this.membersVal.replace(/\s+/g, ", ")}</p></div>
      `
        : `
      <input 
        data-change 
        placeholder="Имена участников" 
        name="member" 
        type="text" 
        value=""
      >
      `
    }

      <textarea 
        data-change 
        placeholder="Описание" 
        name="desc" 
        rows="8" 
      >${this.fill && this.descVal}</textarea>
    </div>
    <div class="form__row">
      <input name="create" type="button" value="Создать">
      <input name="delete" type="button" value="Удалить">
    </div>
    `;
    this.$form = null;
    this.$formItems = null;
  }

  topLeftPos(el) {
    if (el.offsetLeft + (el.offsetWidth + 17) < el.offsetWidth * 4) {
      this.form.className = "form";
      this.form.classList.add("top-left");
      this.form.style.top = `${el.offsetTop / 10}em`;
      this.form.style.left = `${
        (el.offsetLeft + (el.offsetWidth + 17)) / 10
      }em`;
    }
  }

  topRightPos(el) {
    if (el.offsetLeft + (el.offsetWidth + 17) >= el.offsetWidth * 4) {
      this.form.className = "form";
      this.form.classList.add("top-right");
      this.form.style.top = `${el.offsetTop / 10}em`;
      this.form.style.right = `${(window.innerWidth - el.offsetLeft) / 10}em`;
    }
  }

  bottomLeftPos(el) {
    if (
      el.offsetLeft + (el.offsetWidth + 17) < el.offsetWidth * 4 &&
      el.offsetTop + el.offsetHeight >= el.offsetHeight * 5
    ) {
      this.form.className = "form";
      this.form.classList.add("bottom-left");
      this.form.style.top = `${
        (el.offsetTop -
          el.offsetHeight -
          (this.form.scrollHeight + el.offsetHeight)) /
        10
      }em`;
      this.form.style.right = `${(window.innerWidth - el.offsetLeft) / 10}em`;
    }
  }

  bottomRightPos(el) {
    if (
      el.offsetLeft + (el.offsetWidth + 17) >= el.offsetWidth * 4 &&
      el.offsetTop + el.offsetHeight >= el.offsetHeight * 5
    ) {
      this.form.className = "form";
      this.form.classList.add("bottom-right");
      this.form.style.top = `${
        (el.offsetTop -
          el.offsetHeight -
          (this.form.scrollHeight + el.offsetHeight)) /
        10
      }em`;
      this.form.style.right = `${(window.innerWidth - el.offsetLeft) / 10}em`;
    }
  }

  posInit(el) {
    this.topLeftPos(el);
    this.topRightPos(el);
    this.bottomLeftPos(el);
    this.bottomRightPos(el);
  }

  create() {
    this.form.name = "popup_add";
    this.form.className = "form";

    this.form.innerHTML = this.formInnerHtml;

    this.posInit(this.target);

    document.body.appendChild(this.form);

    setTimeout(() => {
      this.form.style.opacity = 1;
      this.form.style.visibility = "visible";
    }, 10);
  }

  remove() {
    this.$form = document.querySelector('form[name="popup_add"]');

    this.$form && this.$form.remove();
  }

  resetValues() {
    const values = document.querySelectorAll("[data-change]");
    values.forEach((item) => (item.value = ""));
  }
  getId(id) {
    const idCell = id;
    return idCell;
  }
  saveValues(el, fill) {
    const form = document.forms.popup_add;

    const obj = {
      id: el,
      event: form.name.value,
      date: form.date.value,
      members: form.member.value,
      desc: form.desc.value,
    };

    if (!form) return;

    if (fill === "false") {
      events.push(obj);
      localStorage.setItem("events", JSON.stringify(events));
    }
  }
}

class QuickEvent extends GlobalEvent {
  constructor(target) {
    super(target);
    this.btnQuick = document.querySelector(".header__column-btn:first-child");
    this.popupQuick = document.querySelector(".quick-add-event");
    this.closeBtnQuick = this.btnQuick.querySelector("i");
    this.createBtn = this.btnQuick.querySelector('input[type="button"]');

    this.closeQuickPopup();
  }
  closeQuickPopup() {
    this.popupQuick.classList.contains("active") &&
      this.close(this.btnQuick, this.popupQuick);
  }

  quickAdd(bool) {
    bool === true
      ? this.open(this.btnQuick, this.popupQuick)
      : this.close(this.btnQuick, this.popupQuick);
  }

  // createQuickEvent() {
  //   const inputQuick = document.getElementById("quick_add");

  //   inputQuick.addEventListener("input", (e) => {
  //     const val = e.target.value.replace(/\s+/g, ", ");
  //     const date = val.split(", ")[0];
  //   });
  // }
}

const search = (n) => {
  const searchInput = document.querySelector('input[name="search"]');
  const searchList = document.querySelector("[data-search] ul");

  const renderHtml = (element = Array.from(events)) => {
    const date = (item) =>
      `${item.date.split("-").slice(2, 3)} ${new Date(
        new Date().getFullYear(),
        new Date().getMonth() + n,
        1
      ).toLocaleDateString("ru-ru", { month: "long" })}`;
    const sCallback = (item) =>
      `<li>
        <span>${item.event}</span>
        <span>${date(item)}</span>
        <span class="hidden">${item.desc}</span>
        <span class="hidden">${item.members}</span>
      </li>`;

    const sVal = element;

    searchList.innerHTML = sVal.map(sCallback).join("");
  };
  renderHtml();

  const searchItems = searchList.querySelectorAll("li");
  searchInput.addEventListener("input", (e) => {
    const self = e.target;
    const searchListContainer = document.querySelector("[data-search]");

    if (self.value.trim() !== "") {
      new ElementClassActive(searchListContainer).show();

      const searchVal = RegExp(self.value.trim(), "gi");
      searchItems &&
        searchItems.forEach((item) => {
          if (item.innerText.search(searchVal) === -1) {
            item.style.display = "none";
          } else {
            item.style.display = "flex";
          }
        });
    } else {
      new ElementClassActive(searchListContainer).hidden();
      searchItems.forEach((item) => (item.style.display = "flex"));
    }
  });
};

const listenerClick = (e) => {
  const target = (t, s) => t.closest(s);
  const quickEvent = (el) => new QuickEvent(el);
  const form = (el) => new Form(el);

  const self = e.target;
  const btnNow = document.querySelector("[data-current-day]");
  const quick = target(self, "[data-add-quick]");
  const tCell = document.querySelectorAll(".table__cell");

  if (quick) {
    quickEvent(quick).quickAdd(true);
  } else {
    quickEvent(quick).quickAdd(false);
  }

  if (target(self, "[data-close-popup]")) {
    quickEvent(quick).closeQuickPopup();
  }

  if (target(self, "[data-create-quickevent]")) {
    quickEvent(quick).closeQuickPopup();
  }

  if (target(self, "[data-add-form]") && self.dataset.addForm !== "") {
    if (document.forms.popup_add) {
      document.querySelector('form[name="popup_add"]').remove();
    }
    tCell.forEach((item) => new ElementClassActive(item).hidden());
    clicked = self.dataset.addForm;
    fill = self.dataset.filled;
    form().getId(clicked);
    new ElementClassActive(self).show();
    form(self).create();
  }

  if (target(self, 'input[name="create"]')) {
    form(self).saveValues(form().getId(clicked), fill);
    form(self).resetValues();
    form(self).remove();
    tCell.forEach((item) => new ElementClassActive(item).hidden());
    clicked = null;
    fill = null;
    new DateModule().renderDays();
  }

  if (target(self, 'input[name="delete"]')) {
    form(self).resetValues();
  }

  if (target(self, "[data-btn-prev]")) {
    nav--;
    if (btnNow.classList.contains("current")) {
      new DateModule().renderDays(true);
      new DateModule().dateDisplay();
      form(self).remove();
    } else {
      new DateModule().renderDays();
      new DateModule().dateDisplay();
      form(self).remove();
    }
  } else if (target(self, "[data-btn-next]")) {
    nav++;
    if (btnNow.classList.contains("current")) {
      new DateModule().renderDays(true);
      new DateModule().dateDisplay();
      form(self).remove();
    } else {
      new DateModule().renderDays();
      new DateModule().dateDisplay();
      form(self).remove();
    }
  }

  if (target(self, "[data-current-day]")) {
    nav = 0;
    new DateModule().renderDays(true);
    new DateModule().dateDisplay();
    form(self).remove();
  }

  if (target(self, "[data-update]")) {
    nav = 0;

    if (btnNow.classList.contains("current")) {
      new DateModule().renderDays(true);
      new DateModule().dateDisplay();
      form(self).remove();
    } else {
      new DateModule().renderDays();
      new DateModule().dateDisplay();
      form(self).remove();
    }
  }

  if (target(self, "[data-close-form]")) {
    form(self).remove();
    tCell.forEach((item) => new ElementClassActive(item).hidden());
    clicked = null;
    filled = null;
  }
};

const listenerDOMContentLoaded = () => {
  new DateModule().renderDays();
  new DateModule().dateDisplay();
  // new QuickEvent().createQuickEvent();
  search(nav);
};

document.addEventListener("click", listenerClick);
document.addEventListener("DOMContentLoaded", listenerDOMContentLoaded);
