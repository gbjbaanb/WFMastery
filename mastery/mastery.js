WFMastery = (function (srcData) {
	var data = {};
	var categories = {};
	var o = {};
	var config_mastered = false;
	var config_founder = false;
	var mastery_gained = 0;

	o.test = function () { console.log("config_mastered", config_mastered, "config_founder", config_founder);}

	function toggle(e) {
		var result = false;
		var t = e.target;
		var category = t.id.split("_")[1];
		var classes = t.classList;
		if (classes.contains("checked")) {
			classes.remove("checked");
			classes.remove("hide");
		} else {
			classes.add("checked");
			if (config_mastered && !(config_founder && classes.contains("founder"))) {
				classes.add("hide");
			}
			result = true;
		}
		if (!classes.contains("config")) {
			var counter = t.parentElement.children[2];
			var counted = counter.innerText.split("/");
			counted[0] = (counted[0]|0) + (result ? 1 : -1);
			counter.innerText = counted[0] + "/" + counted[1];
		}
		if (category) {
			let e = document.getElementById("mastery_gained");
			e.innerText = (e.innerText|0) + (result ? categories[category] : - categories[category]);
		}
		return result;
	}

	//whee code duplication
	function toggle_founder(e) {
		config_founder = toggle(e);
		let founded = document.getElementsByClassName("founder");
		let I = founded.length;
		for (let i = 0; i < I; i++) {
			if (config_founder && !founded[i].classList.contains("config")) {
				founded[i].classList.add("hide");
			} else if (!(config_mastered && founded[i].classList.contains("checked"))) {
				founded[i].classList.remove("hide");
			}
		}
	}
	function toggle_mastered(e) {
		config_mastered = toggle(e);
		let mastered = document.getElementsByClassName("checked");
		let I = mastered.length;
		for (let i = 0; i < I; i++) {
			if (config_mastered && !mastered[i].classList.contains("config")) {
				mastered[i].classList.add("hide");
			} else if (!(config_founder && mastered[i].classList.contains("founder"))) {
				mastered[i].classList.remove("hide");
			}
		}
	}

	function reset_entries() {
		let checked = document.getElementsByClassName("checked");
		for (let i = checked.length - 1; i >= 0; i--) {
			checked[i].click();
		}
	}
	function save() {
		console.log("save - NYI");
	}
	function load() {
		console.log("load - NYI");
	}
	function export_state() {
		console.log("export_state - NYI");
	}
	function import_state() {
		console.log("import_state - NYI");
	}

	function create_button(category, item) {
		var e = document.getElementById("c_" + category);
		var id = "i_" + category + "_" + item[1];
		var classes = "button";
		if (item[2]) {
			classes += " " + item[2].join(" ");
		}
		e.innerHTML += "<div class=\"" + classes + "\" id=\"" + id + "\">" + item[0] + "</div>";
	}
	function create_category(category, length) {
		document.getElementById("listings").innerHTML += "<div class=\"category\" id=\"c_" + category + "\"><hr><strong class=\"category_name\">" + category + "</strong> <span class=\"category_counter\">" + 0 + "/" + length + "</span><br></div>";
	}
	function initLayout() {
		var mastery_possible = 0;
		let I = data.categories.length;
		for (let i = 0; i < I; i++) {
			categories[data.categories[i].category] = data.categories[i].mastery;
			data.categories[i].items.sort();
			let J = data.categories[i].items.length;
			mastery_possible += data.categories[i].mastery * J;
			create_category(data.categories[i].category, J);
			for (let j = 0; j < J; j++) {
				create_button(data.categories[i].category, data.categories[i].items[j]);
			}
		}
		document.getElementById("mastery_possible").innerText = mastery_possible;
		var buttons = document.getElementsByClassName("button");
		I = buttons.length;
		for (let i = 0; i < I; i++) {
			buttons[i].onclick = toggle;
		}
		document.getElementById("config_founder").onclick = toggle_founder;
		document.getElementById("config_mastered").onclick = toggle_mastered;
		document.getElementById("config_reset").onclick = reset_entries;
		document.getElementById("config_save").onclick = save;
		document.getElementById("config_load").onclick = load;
		document.getElementById("config_export").onclick = export_state;
		document.getElementById("config_import").onclick = import_state;
	}

	function initData() {
		try {
			data = this.response;
			initLayout();
		} catch (e) {
			console.log("Failed to load item lists, panic!");
			console.log(e);
		}
	}

	o.init = function () {
		var request = new XMLHttpRequest();
		request.open("GET", srcData);
		request.responseType = "json";
		request.onload = initData;
		request.send();
	}

	return o;
})("mastery/mastery_data.json");


window.addEventListener("load", () => { WFMastery.init(); });