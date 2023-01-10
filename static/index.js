let UUID = "?api_key=cfaebacb-7240-41af-9d68-b704ddb0f4fd";  
let DATA_API = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes"+UUID; // ССЫЛКА НА API

let data_for_fill = get_data();

// ПОЛУЧЕНИЕ ДАННЫХ С API
function get_data() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", DATA_API, false); 
	xhr.send();
	if (xhr.status != 200) {
		alert(xhr.status + ": " + xhr.statusText);
	} else {
		return JSON.parse(xhr.response);
	}
}

// ДАННЫЕ ДЯЛ ПАГИНАЦИИ
var state = {
	querySet: get_data(),

	page: 1,
	rows: 10,
	window: 5,
};

// ВМЕСТО JSON ФАЙЛА ДЛЯ МЕНЮ
var menu = [{
		name: "Сет 1",
		description: "Паста",
		img_url: "null",
		amount: 0,
	},
	{
		name: "Сет 2",
		description: "Для любителей пиццы",
		img_url: "null",
		amount: 0,
	},
	{
		name: "Сет 3",
		description: "Для любителей роллов и суши",
		img_url: "null",
		amount: 0,
	},
	{
		name: "Сет 4",
		description: "Азиатские бенто тольео для вас",
		img_url: "null",
		amount: 0,
	},
	{
		name: "Сет 5",
		description: "Домашняя еда превыше всего",
		img_url: "null",
		amount: 0,
	},
	{
		name: "Сет 6",
		description: "Комбо из роллов и пиццы",
		img_url: "null",
		amount: 0,
	},
	{
		name: "Сет 7",
		description: "Для любителей бургеров",
		img_url: "null",
		amount: 0,
	},
	{
		name: "Сет 8",
		description: "Вкуснейший завтрак 1",
		img_url: "null",
		amount: 0,
	},
	{
		name: "Сет 9",
		description: "Вкуснейший завтрак 2",
		img_url: "null",
		amount: 0,
	},
	{
		name: "Сет 10",
		description: "Сытные блинчики",
		img_url: "null",
		amount: 0,
	},
];

// ПРИ ЗАГРУЗКЕ СТРАНЦИЫ ПОДГРУЖАЕТСЯ СПИСОК ЗАВЕДЕНИЙ
window.onload = function () {
	get_data_API();
};

// ДЛЯ ПАГИНАЦИИ, ВЫЧИСЛЕНИЕ ПЕРЕКЛЮЧЕНИЯ СТРАНИЦЫ С ПОСЛЕДУЮЩИМ ОТСЕЧЕНИЕМ ДАННЫХ
function pagination(querySet, page, rows) {
	var trimStart = (page - 1) * rows;
	var trimEnd = trimStart + rows;
	var trimmedData = querySet.slice(trimStart, trimEnd);
	var pages = Math.round(querySet.length / rows);
	return {
		querySet: trimmedData,
		pages: pages,
	};
}

// ГЕНЕРАЦИЯ КНОПОК ДЛЯ ПАГИНАЦИИ
function pageButtons(pages) {
	var wrapper = document.getElementById("pge");
	wrapper.innerHTML = ``;
	console.log("Pages:", pages);
	var maxLeft = state.page - Math.floor(state.window / 2);
	var maxRight = state.page + Math.floor(state.window / 2);
	if (maxLeft < 1) {
		maxLeft = 1;
		maxRight = state.window;
	}
	if (maxRight > pages) {
		maxLeft = pages - (state.window - 1);
		if (maxLeft < 1) {
			maxLeft = 1;
		}
		maxRight = pages;
	}
	for (var page = maxLeft; page <= maxRight; page++) {
		wrapper.innerHTML += `<button value=${page} class="page btn btn-sm btn-info">${page}</button>`;
	}
	if (state.page != 1) {
		wrapper.innerHTML =
			`<button value=${1} class="page btn btn-sm btn-info">&#171; First</button>` +
			wrapper.innerHTML;
	}
	if (state.page != pages) {
		wrapper.innerHTML += `<button value=${pages} class="page btn btn-sm btn-info">Last &#187;</button>`;
	}
	// ОЧИСТКА СТРАНИЦЫ ПЕРЕД СЛЕДУЮЩИМ ПЕРЕХОДОМ
	$(".page").on("click", function () {
		$(".eat_choose_fill").empty();
		state.page = Number($(this).val());
		get_data_API();
	});
}

// ФУНКЦИЯ ГЕНЕРАЦИЯ ДАННЫХ НА СТРАНИЦЫ
function get_data_API() {
	var data = pagination(state.querySet, state.page, state.rows);
	var myList = data.querySet;
	console.log(myList);
	let list = document.querySelector(".eat_choose_fill");
	var key = 1;
	for (key in myList) {
		list.innerHTML += `<tr>
                        <th scope="row">${myList[key].name}</th>
                        <td>${myList[key].typeObject}</td>
                        <td>${myList[key].address}</td>
                        <td>
                          <button type="button" class="btn btn-primary" onclick = "select_draw(${myList[key].id})">Выбрать</button>
                        </td>
                      </tr>`;
	}
	pageButtons(data.pages);
}

// ФУНКЦИЯ ПОЭТАПНОЙ ФИЛЬТРАЦИИ
function filter() {
	let data = $("#filter_form").serializeArray();
	console.log(data);
	let new_meta = data_for_fill;
	let arr1 = [];
	let arr2 = [];
	let arr3 = [];
	let arr4 = [];

	for (var i = 0; i < new_meta.length; i++) {
		if (data[0]["value"] != "" && new_meta[i]["admArea"] == data[0]["value"]) {
			arr1.push(new_meta[i]);
		} else if (data[0]["value"] == "") {
			arr1.push(new_meta[i]);
		}
	}

	for (var i = 0; i < arr1.length; i++) {
		if (data[1]["value"] != "" && arr1[i]["district"] == data[1]["value"]) {
			arr2.push(arr1[i]);
		} else if (data[1]["value"] == "") {
			arr2.push(arr1[i]);
		}
	}
	for (var i = 0; i < arr2.length; i++) {
		if (
			data[3]["value"] != "" &&
			arr2[i]["socialPrivileges"] == data[3]["value"]
		) {
			arr3.push(arr2[i]);
		} else if (data[3]["value"] == "") {
			arr3.push(arr2[i]);
		}
	}
	for (var i = 0; i < arr3.length; i++) {
		if (data[2]["value"] != "" && arr3[i]["typeObject"] == data[2]["value"]) {
			arr4.push(arr3[i]);
		} else if (data[2]["value"] == "") {
			arr4.push(arr3[i]);
		}
	}
	state.querySet = arr4;
	state.page = 1;
	state.rows = 10;
	state.window = 5;
	let list = document.querySelector(".eat_choose_fill");
	list.innerHTML = ``;
	get_data_API();

	event.preventDefault();
}

// генерация пунктов в select Дроп

fill_adm();
fill_ra();
fill_type();

// заполнение адмистративный округ
function fill_adm() {
	let data = data_for_fill;
	let adm = document.querySelector("#adm04");
	var array = [];

	for (var i = 0; i < data.length; i++) {
		if (!array.includes(data[i]["admArea"])) {
			array.push(data[i]["admArea"]);
			adm.innerHTML += `<option selected value = "${data[i]["admArea"]}">${data[i]["admArea"]}</option>`;
		}
	}
}

function fill_ra() {
	let data = data_for_fill;
	let adm = document.querySelector("#adm05");
	var array = [];

	for (var i = 0; i < data.length; i++) {
		if (!array.includes(data[i]["district"])) {
			array.push(data[i]["district"]);
			adm.innerHTML += `<option selected value = "${data[i]["district"]}">${data[i]["district"]}</option>`;
		}
	}
}

function fill_type() {
	let data = data_for_fill;
	let adm = document.querySelector("#adm06");
	var array = [];

	for (var i = 0; i < data.length; i++) {
		if (!array.includes(data[i]["typeObject"])) {
			array.push(data[i]["typeObject"]);
			adm.innerHTML += `<option selected value = "${data[i]["typeObject"]}">${data[i]["typeObject"]}</option>`;
		}
	}
}

// генерация меню
async function select_draw(id) {
	var check = document.getElementById("nocont");
	all_summ(id); // пересчитывание всей суммы
	var content = 0;
	for (var i = 0; i < data_for_fill.length; i++) {
		if (data_for_fill[i]["id"] == id) {
			content = data_for_fill[i]; // получение данных по определенному id
			break;
		}
	}

	let btni = document.querySelector(".bitin"); // получение поля с кнопкой для получения информации о заказе
	btni.innerHTML = `<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"
                      id="make-button" onclick = "create_window(${id})">
                      Информация о заказе
                    </button>`; // генерация кнопки с функцией для генерации полей в модальном окне

	let s1 = document.querySelector(".simple-first"); // получение div элемента для вставки чек-боксов с определенным значением и последующим созданием функции в чек-боксов
	let s2 = document.querySelector(".simple-second"); // получение div элемента для вставки чек-боксов с определенным значением и последующим созданием функции в чек-боксов

	s1.innerHTML = `<input type="checkbox" class="form-check-input" id="nocont" onclick="for_nocont(${id})" value = "0" />
                  <label class="form-check-label" for="exampleCheck1">Бесконтактная доставка</label>`;
	s2.innerHTML = `<input type="checkbox" class="form-check-input" id="hot" onclick="only_hot(${id})" value = "0" />
                  <label class="form-check-label" for="exampleCheck1">Только горячим</label>`;

	console.log(content);
	let adm = document.querySelector(".eat_menuu"); // получение div'a с меню
	adm.innerHTML = ``;
	for (var i = 0; i < 10; i++) { // вставка элементов меню
		adm.innerHTML += `<div class="card mt-5" style="width: 18rem;"> 
  <img src="menu/${Number(i + 1)}.jpg" class="card-img-top" alt="..." />
  <div class="card-body">
    <h5 class="card-title text-center">${menu[i]["name"]}</h5>
    <p class="card-text text-center">
    ${menu[i]["description"]}
    </p>
    <p class="card-text text-center">
    Цена за один: ${content["set_" + Number(i + 1)]}
  </p>
    <nav aria-label="...">
      <ul
        class="pagination pagination-sm d-flex justify-content-center"
      >
        <li class="page-item"><a class="page-link" onclick = "minus(${i}, ${
			content["id"]
		})">-</a></li>
        <input type="number" value="${
					menu[i]["amount"]
				}" id = "elem${i}" class="w-25" />
        <li class="page-item">
          <a class="page-link" onclick = "plus(${i}, ${content["id"]})">+</a>
        </li>
      </ul>
    </nav>
  </div>
</div>`;
	}
}

// функция отнимания числа в поле
function minus(id, total) {
	console.log(menu);
	if (menu[id]["amount"] != 0) {
		menu[id]["amount"]--;
		document.getElementById("elem" + id).value = menu[id]["amount"];
		all_summ(total);
	}
	console.log(menu);
	event.preventDefault();
}

// функция прибавления числа в поле
function plus(id, total) {
	menu[id]["amount"]++;
	document.getElementById("elem" + id).value = menu[id]["amount"];
	all_summ(total);
	console.log(menu);
	event.preventDefault();
}


// пересчет общей суммы
function all_summ(id) {
	var total_summ = 0;
	var check = document.getElementById("nocont");
	var summ_html = document.querySelector(".amount");
	var content = 0;
	for (var i = 0; i < data_for_fill.length; i++) {
		if (data_for_fill[i]["id"] == id) {
			content = data_for_fill[i];
			break;
		}
	}
	if (check.value == 1) {
		for (var i = 0; i < 10; i++) {
			total_summ +=
				Number(content["set_" + Number(i + 1)]) * Number(menu[i]["amount"]);
		}
		summ_html.innerHTML = total_summ * 2.5;
	} else {
		for (var i = 0; i < 10; i++) {
			total_summ +=
				Number(content["set_" + Number(i + 1)]) * Number(menu[i]["amount"]);
		}
		summ_html.innerHTML = total_summ;
	}
	console.log(total_summ);
}

// установка значения checkbox при выборе "бесконтактная доставка"
function for_nocont(id) {
	var check = document.getElementById("nocont");
	if (check.checked) {
		check.value = 1;
	} else {
		check.value = 0;
	}
}

// установка значения checkbox при выборе "только горячее"
function only_hot(id) {
	var check = document.getElementById("hot");
	if (check.checked) {
		check.value = 1;
	} else {
		check.value = 0;
	}
}


// генерация итогового окна информация о заказе
function create_window(id) {
	var content = 0;
	for (var i = 0; i < data_for_fill.length; i++) {
		if (data_for_fill[i]["id"] == id) {
			content = data_for_fill[i]; // получение элемента по id из json
			break;
		}
	}
	var info_zakaz = document.querySelector(".data-zakaz"); // получение поля с изображениями количеством и ценой
	var hot_check = document.getElementById("hot"); // получение информации о checkbox для дальнейшей проверки при заполнении
	var nocont_check = document.getElementById("nocont"); // получение информации о checkbox для дальнейшей проверки при заполнении

	info_zakaz.innerHTML = ``; // сброс всех значений в поле с товарами
	for (var i = 0; i < 10; i++) { // вставка значение заказа в блок
		if (menu[i]["amount"] != 0) {
			info_zakaz.innerHTML += `<div class="row justify-content-around align-items-center mt-2">
                                <img src="menu/${Number(
																	i + 1
																)}.jpg" width = "50" alt="" />
                                <p class="font-weight-bold m-0 p-0">${
																	menu[i]["name"]
																}</p>
                                <p class="m-0 p-0">${menu[i]["amount"]}х${
				content["set_" + Number(i + 1)]
			}руб</p>
                                <p class="font-weight-bold m-0 p-0">${
																	menu[i]["amount"] *
																	content["set_" + Number(i + 1)]
																}руб</p></div>`;
		}
	}

	var dop_f = document.querySelector(".info_about_dop_first");
	var dop_s = document.querySelector(".info_about_dop_second");
	dop_f.innerHTML = ``; // очистка данных в поле с доп. услугами
	dop_s.innerHTML = ``; // очистка данных в поле с доп. услугами
	var amount = document.querySelector(".amount").innerHTML;
	if (nocont_check.value == 1) {
		dop_f.innerHTML = `
                        <p>Бесконтактная доставка:</p>
                        <p>+</p>
                      `;
	}
	if (hot_check.value == 1) {
		dop_s.innerHTML = `
                        <p>Только горячим:</p>
                        <p>Если заказ приедет холодным то он будет Вам
                        стоить ${(
													Number(amount) -
													Number(amount) * 0.3
												).toFixed(1)}.</p>
                      `;
	}
	var main_info = document.querySelector(".main_info"); // получение и заполнение информации о поставщике
	main_info.innerHTML = ``;
	for (var i = 0; i < 5; i++) {
		if (i == 0) {
			main_info.innerHTML += `<div class="row justify-content-between align-items-center">
                                <p>Название:</p>
                                <p>${content["name"]}</p>
                              </div>`;
		} else if (i == 1) {
			main_info.innerHTML += `<div class="row justify-content-between align-items-center">
                                <p>Административный округ:</p>
                                <p>${content["admArea"]}</p>
                              </div>`;
		} else if (i == 2) {
			main_info.innerHTML += `<div class="row justify-content-between align-items-center">
                                <p>Район:</p>
                                <p>${content["district"]}</p>
                              </div>`;
		} else if (i == 3) {
			main_info.innerHTML += `<div class="row justify-content-between align-items-center">
                                <p>Адрес:</p>
                                <p class="text-muted">${content["address"]}</p>
                              </div>`;
		} else if (i == 4) {
			main_info.innerHTML += `<div class="row justify-content-between align-items-center">
                                <p>Рейтинг:</p>
                                <p>${content["rate"]}</p>
                              </div>`;
		}
	}

	var total_chena = document.querySelector(".total_chen");
	total_chena.innerHTML = amount + " руб.";
}