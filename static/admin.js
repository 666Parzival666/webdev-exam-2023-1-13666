let DATA_API = "http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1";
let DATA_API_ID =
	"http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1/";
let UUID = "340b5db7-f13d-4c8f-bdd3-1fa5fb82f40a";
let data_for_fill = get_data();

//проверяет загрузку данных из JSON
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

var state = {
	querySet: data_for_fill,

	page: 1,
	rows: 10,
	window: 5,
};

window.onload = function () {
	get_data_API();
};

//пагинация
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

//Работа кнопок на странице(нумерация стр. и т.д.)
function pageButtons(pages) {
	var wrapper = document.getElementById("pg");
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
	$(".page").on("click", function () {
		$(".info").empty();
		state.page = Number($(this).val());
		get_data_API();
	});
}

function get_data_API() {
	var data = pagination(state.querySet, state.page, state.rows);
	var myList = data.querySet;
	console.log(myList);
	let list = document.querySelector(".info");
	for (var key = 1 in myList) {
		list.innerHTML += `<tr>
                        <th scope="row">${myList[key].name}</th>
                        <td>${myList[key].typeObject}</td>
                        <td>${myList[key].address}</td>
                        <td>
                          <button id = "open" style="background: none; border: none;" data-toggle="modal" data-target="#see" onclick = "get_data_API_ID(${myList[key].id})"><img
                              style="max-width: 30px; width: 100%;" src="menu/add.svg" title="Добавление новой записи"
                              alt="Добавление записи"></button>
                          <button style="background: none; border: none;" data-toggle="modal" data-target="#edit" onclick = "get_data_edit_API(${myList[key].id})"><img
                              style="max-width: 30px; width: 100%;" src="menu/edit.svg" title="Редактирование записи"
                              alt="Редактирование записи"></button>
                          <button data-toggle="modal" data-target="#delete" style="background: none; border: none;" onclick = "delete_data_API_ID(${myList[key].id})">
                            <img style="max-width: 30px; width: 100%;" src="menu/delete.svg" title="Удаление записи"
                              alt="Удаление записи">
                          </button>
                        </td>
                      </tr>`;
	}
	pageButtons(data.pages);
}

// EVENTS


// получение и генерация в модальном окна информации о заведении
async function get_data_API_ID(id) {
	let API_RESPONSE = DATA_API_ID + id;

	let response = await fetch(API_RESPONSE);
	let content = await response.json();

	let list = document.querySelector(".info-body");

	list.innerHTML = `<div class="container">
                      <div class="row justify-content-between">
                        <p>Наименование:</p>
                        <p>${content.name}</p>
                      </div>
                      <div class="row justify-content-between">
                        <p>Является сетевым:</p>
                        <p>${content.isNetObject}</p>
                      </div>
                      <div class="row justify-content-between">
                        <p>Название управляюещй компании:</p>
                        <p>${content.operatingCompany}</p>
                      </div>
                      <div class="row justify-content-between">
                        <p>Вид объекта:</p>
                        <p>${content.typeObject}</p>
                      </div>
                      <div class="row justify-content-between">
                        <p>Административный округ:</p>
                        <p>${content.admArea}</p>
                      </div>
                      <div class="row justify-content-between">
                        <p>Район:</p>
                        <p>${content.district}</p>
                      </div>
                      <div class="row justify-content-between">
                        <p>Адрес:</p>
                        <p>${content.address}</p>
                      </div>
                      <div class="row justify-content-between">
                        <p>Число посадочных мест:</p>
                        <p>${content.seatsCount}</p>
                      </div>
                      <div class="row justify-content-between">
                        <p>Показатель социальных льгот:</p>
                        <p>${content.socialPrivileges}</p>
                      </div>
                      <div class="row justify-content-between">
                        <p>Контактные телефон:</p>
                        <p>${content.publicPhone}</p>
                      </div>
                      <div class="row justify-content-between">
                        <p>Географические координаты:</p>
                        <p>-</p>
                      </div>
                    </div>`;
}
// ДЛЯ ВНЕШНЕЙ КНОПКИ

// НАЧАЛО УДАЛЕНИЯ
// модальное окно для удаление записи
function delete_data_API_ID(id) {

	let list = document.querySelector(".delete-info");
	let button = document.querySelector(".delete-button");

	button.innerHTML = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                      <button type="button" class="btn btn-danger" onclick = "delete_from_API(${id})" data-dismiss="modal">Удалить</button>`;
	list.innerHTML = `<p>Вы уверены, что хотите удалить запись под номером: ${id}</p><input type = "hidden" value = "${id}">`;

	console.log();
}

fill_adm();
fill_ra();
fill_type();

//функция выводит перечисление административных округов
function fill_adm() {
	let data = data_for_fill;
	let adm = document.querySelector("#admdis");
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
	let adm = document.querySelector("#zone");
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
	let adm = document.querySelector("#obj");
	var array = [];

	for (var i = 0; i < data.length; i++) {
		if (!array.includes(data[i]["typeObject"])) {
			array.push(data[i]["typeObject"]);
			adm.innerHTML += `<option selected value = "${data[i]["typeObject"]}">${data[i]["typeObject"]}</option>`;
		}
	}
}
// ДЛЯ КНОПКИ В ФОРМЕ
// ajax запрос к api для удаления данных
function delete_from_API(id) {
	let API_RESPONSE = DATA_API_ID + id + "?api_key=" + UUID; // генерация ссылки
	$.ajax({
		type: "DELETE",
		url: API_RESPONSE,
		response: "text",
	});
}
// КОНЕЦ УДАЛЕНИЯ

// НАЧАЛО РЕДАКТИРОВАНИЯ
async function get_data_edit_API(id) {
	let API_RESPONSE = DATA_API_ID + id;

	let response = await fetch(API_RESPONSE);
	let content = await response.json();

	let net_yes;
	let net_no;

	let social_yes;
	let social_no;

	// проверка на активированность значений в записи json по id

	if (content.isNetObject == 0) {
		net_no = "checked";
	} else {
		net_yes = "checked";
	}

	if (content.socialPrivileges == 0) {
		social_no = "checked";
	} else {
		social_yes = "checked";
	}

	let list = document.querySelector(".form_edit");
	let button = document.querySelector(".modal_edit");

	button.innerHTML = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                      <button type="button" class="btn btn-primary" onclick = "send_edited_data_to_API(${id})" data-dismiss="modal">Соханить</button>`;
	// генерация формы с добавлением значений в модальное окно
	list.innerHTML = `<div class="form-group">
                      <label for="exampleInputPassword1">Наименование</label>
                      <input type="text" class="form-control" id="exampleInputPassword1" value = "${content.name}" name = "name">
                      </div>
                      <fieldset class="form-group">
                      <legend class="col-form-label col-sm-5 pt-0">Является сетевым:</legend>
                      <div class="row">
                        <div class="col-sm-10">
                          <div class="form-check">
                            <input class="form-check-input" type="radio" name="isNetObject" id="gridRadios1" value="1"
                              ${net_yes}>
                            <label class="form-check-label" for="gridRadios1">
                              Да
                            </label>
                          </div>
                          <div class="form-check">
                            <input class="form-check-input" type="radio" name="isNetObject" id="gridRadios2" value="0"
                            ${net_no}>
                            <label class="form-check-label" for="gridRadios2">
                              Нет
                            </label>
                          </div>
                        </div>
                      </div>
                      </fieldset>
                      <div class="form-group">
                      <label for="exampleInputPassword1">Название управляющей компании:</label>
                      <input type="text" class="form-control" id="exampleInputPassword1" value = "${content.operatingCompany}" name = "operatingCompany">
                      </div>
                      <div class="form-group">
                      <label for="validationCustom04">Вид объекта</label>
                      <select class="custom-select" id="kindofobj" name = "typeObject" required>
                        <option selected value = "${content.typeObject}">${content.typeObject}</option>
                      </select>
                      </div>
                      <div class="form-group">
                      <label for="validationCustom04">Административный округ</label>
                      <select class="custom-select" id="admindis" name = "admArea" required>
                        <option selected value = "${content.admArea}">${content.admArea}</option>
                      </select>
                      </div>
                      <div class="form-group">
                      <label for="validationCustom04">Район</label>
                      <select class="custom-select" id="validationCustom04" name = "district" required>
                        <option selected value = "${content.district}">${content.district}</option>
                      </select>
                      </div>
                      <div class="form-group">
                      <label for="exampleFormControlTextarea1">Адрес</label>
                      <textarea class="form-control" id="exampleFormControlTextarea1" name = "address" rows="3">${content.address}</textarea>
                      </div>
                      <div class="form-group">
                      <label for="exampleInputPassword1">Число посадочных мест:</label>
                      <input type="text" class="form-control" id="exampleInputPassword1" name = "seatsCount" value = "${content.seatsCount}">
                      </div>
                      <fieldset class="form-group">
                      <legend class="col-form-label col-sm-5 pt-0">Показатель социальных льгот:</legend>
                      <div class="row">
                        <div class="col-sm-10">
                          <div class="form-check">
                            <input class="form-check-input" type="radio" name="socialPrivileges" id="gridRadios1" value="1"
                              ${social_yes}>
                            <label class="form-check-label" for="gridRadios1">
                              Есть
                            </label>
                          </div>
                          <div class="form-check">
                            <input class="form-check-input" type="radio" name="socialPrivileges" id="gridRadios2" value="0"
                            ${social_no}>
                            <label class="form-check-label" for="gridRadios2">
                              Нет
                            </label>
                          </div>
                        </div>
                      </div>
                      </fieldset>
                      <div class="form-group">
                      <label for="exampleInputPassword1">Телефон:</label>
                      <input type="text" class="form-control" id="exampleInputPassword1" value = "${content.publicPhone}" name = "publicPhone">
                      </div>
                      <label for="exampleInputPassword1">Географические координаты:</label>
                      <div class="form-row">
                      <div class="col">
                        <label for="exampleInputPassword1">Широта:</label>
                        <input type="text" class="form-control" id="exampleInputPassword1">
                      </div>
                      <div class="col">
                        <label for="exampleInputPassword1">Долгота:</label>
                        <input type="text" class="form-control" id="exampleInputPassword1">
                      </div>
                      </div>`;
}
// отправка отредактированных данных на api
function send_edited_data_to_API(id) {
	let API_RESPONSE = DATA_API_ID + id + "?api_key=" + UUID; // генерация ссылки
	console.log(API_RESPONSE)
	let data = $("#editing").serialize(); // формирование ключей со значениями из формы в модальном окне
	console.log(data);
	$.ajax({ // отпрвка данных на api
		type: "PUT",
		url: API_RESPONSE,
		data: data,
	});
}
// КОНЕЦ РЕДАКТИРОВАНИЯ
// ДОБАВЛНЕИЕ ДАННЫХ
function create_DATA_API() {
	let button = document.querySelector(".modal_create");

	button.innerHTML = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                      <button type="button" class="btn btn-primary" onclick = "add_data()" data-dismiss="modal">Добавить</button>`; // формирование кнопок с функцией для отправки данных на api
}
// добавление данных на Api
function add_data() {
	let data = $("#create_form").serialize();
	$.ajax({
		type: "POST",
		url: DATA_API + "?api_key=" + UUID,
		data: data,
	});
}
// КОНЕЦ ДОБАВЛЕНИЯ ДАННЫХ


function filter() {
	let data = $("#filter_form").serializeArray();
	console.log(data);
	let new_meta = data_for_fill;
	let arr1 = [];
	let arr2 = [];
	let arr3 = [];
	let arr4 = [];
	let arr5 = [];
	let arr6 = [];
	let arr7 = [];
	let arr8 = [];
	for (var i = 0; i < new_meta.length; i++) {
		if (
			data[0]["value"] != "" &&
			new_meta[i]["name"].includes(data[0]["value"])
		) {
			arr1.push(new_meta[i]);
		} else if (data[0]["value"] == "") {
			arr1.push(new_meta[i]);
		}
	}
	for (var i = 0; i < arr1.length; i++) {
		if (data[1]["value"] != "" && arr1[i]["admArea"] == data[1]["value"]) {
			arr2.push(arr1[i]);
		} else if (data[1]["value"] == "") {
			arr2.push(arr1[i]);
		}
	}
	for (var i = 0; i < arr2.length; i++) {
		if (
			data[2]["value"] != "" &&
			data[3]["value"] != "" &&
			Number(data[2]["value"]) <= Number(arr2[i]["seatsCount"]) &&
			Number(arr2[i]["seatsCount"]) <= Number(data[3]["value"])
		) {
			arr3.push(arr2[i]);
		} else if (data[2]["value"] == "" || data[3]["value"] == "") {
			arr3.push(arr2[i]);
		}
	}
	for (var i = 0; i < arr3.length; i++) {
		if (data[4]["value"] != "" && arr3[i]["isNetObject"] == data[4]["value"]) {
			arr4.push(arr3[i]);
		} else if (data[4]["value"] == "") {
			arr4.push(arr3[i]);
		}
	}
	for (var i = 0; i < arr4.length; i++) {
		if (data[5]["value"] != "" && arr4[i]["district"] == data[5]["value"]) {
			arr5.push(arr4[i]);
		} else if (data[5]["value"] == "") {
			arr5.push(arr4[i]);
		}
	}
	for (var i = 0; i < arr5.length; i++) {
		// console.log(new Date(data[6]["value"]).valueOf() < new Date(arr5[i]["created_at"]).valueOf() && new Date(arr5[i]["created_at"]).valueOf() < new Date(data[7]["value"]).valueOf());
		if (
			data[6]["value"] != "" &&
			data[7]["value"] != "" &&
			new Date(data[6]["value"]).valueOf() <
			new Date(arr5[i]["created_at"]).valueOf() &&
			new Date(arr5[i]["created_at"]).valueOf() <
			new Date(data[7]["value"]).valueOf()
		) {
			arr6.push(arr5[i]);
		} else if (data[6]["value"] == "" || data[7]["value"] == "") {
			arr6.push(arr5[i]);
		}
	}
	for (var i = 0; i < arr6.length; i++) {
		if (
			data[8]["value"] != "" &&
			arr6[i]["socialPrivileges"] == data[8]["value"]
		) {
			arr7.push(arr6[i]);
		} else if (data[8]["value"] == "") {
			arr7.push(arr6[i]);
		}
	}
	for (var i = 0; i < arr7.length; i++) {
		if (data[9]["value"] != "" && arr7[i]["typeObject"] == data[9]["value"]) {
			arr8.push(arr7[i]);
		} else if (data[9]["value"] == "") {
			arr8.push(arr7[i]);
		}
	}
	state.querySet = arr8;
	state.page = 1;
	state.rows = 10;
	state.window = 5;
	let list = document.querySelector(".info");
	list.innerHTML = ``;
	get_data_API();

	event.preventDefault();
}