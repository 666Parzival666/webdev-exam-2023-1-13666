let UUID = "?api_key=cfaebacb-7240-41af-9d68-b704ddb0f4fd";  
let TOUR_API = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=cfaebacb-7240-41af-9d68-b704ddb0f4fd";
let GUIDE_API = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/"

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

function pageButtons(stateWrapper, pages, state) {
	var wrapper = document.getElementById(stateWrapper);
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
		$(state.table).empty();
		state.page = Number($(this).val());
		state.get_API();
	});
}
var state1 = {
	querySet: get_tour(),
	page: 1,
	rows: 10,
	window: 5,
    table: ".route_choose_fill",
	stateWrapper: "pge",
	get_API:
		function get_tour_API() {
			var data = pagination(state1.querySet, state1.page, state1.rows);
			var myList = data.querySet;
			console.log(myList);
			let list = document.querySelector(state1.table);
			var key = 1;
			for (key in myList) {
				list.innerHTML += `<tr>
								<th scope="row">${myList[key].id-1}</th>
								<td>${myList[key].name}</td>
								<td>${myList[key].mainObject}</td>
								<td>
								<button type="button" class="btn btn-primary btn-tour" onclick="select_draw(this, ${myList[key].id})" >Выбрать</button>
								</td>
							</tr>`;
			}
			pageButtons(state1.stateWrapper, data.pages, state1);
		}
};

var state2 = {
	querySet: null,
	page: 1,
	rows: 10,
	window: 5,
    table: ".guide_choose_fill",
	stateWrapper: "pge-guides",
	get_API: 
		function get_guide_API() {
			var data = pagination(state2.querySet, state2.page, state2.rows);
			var myList = data.querySet;
			console.log(myList);
			let list = document.querySelector(state2.table);
			var key = 1;
			for (key in myList) {
				list.innerHTML += `<tr>
								<th scope="row">${myList[key].id}</th>
								<td>${myList[key].name}</td>
								<td>${myList[key].language}</td>
								<td>${myList[key].workExperience} лет</td>
								<td>${myList[key].pricePerHour} рублей</td>
								<td>
								<button type="button" class="btn btn-primary btn-guides" onclick = "selectGuide(this)" selected = "false">Выбрать</button>
								</td>
							</tr>`;
			}
			pageButtons(state2.stateWrapper, data.pages, state2);
		}
};

function get_tour() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", TOUR_API, false); 
	xhr.send();
	if (xhr.status != 200) {
		alert(xhr.status + ": " + xhr.statusText);
	} else {
		return JSON.parse(xhr.responseText);
	}
}

function get_guides(id) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", (GUIDE_API+id+"/guides"+UUID), false); 
	xhr.send();
	if (xhr.status != 200) {
		alert(xhr.status + ": " + xhr.statusText);
	} else {
		return JSON.parse(xhr.responseText);
	}
}

let tour = get_tour();

function select_draw(el, id){
	let all = document.querySelectorAll(".btn-tour");
	for(let i = 0; i < all.length; i++){
		all[i].innerHTML = "Выбрать"
	}
	el.innerHTML = "Выбрано!"
	el.setAttribute("selected", "true");
    let tourName = document.querySelector("#tour-name")
    for (var i = 0; i < tour.length; i++) {
		if (tour[i]["id"] == id) {
			tourName.innerHTML = " " + tour[i].name;
            state2.querySet = get_guides(id);
			state2.get_API();
			break;
		}
	}
}
function selectGuide(el){
	let all = document.querySelectorAll(".btn-guides");
	for(let i = 0; i < all.length; i++){
		all[i].innerHTML = "Выбрать"
	}
	el.innerHTML = "Выбрано!"
	el.setAttribute("selected", "true");
}
window.onload = function () {
	state1.get_API();
};