/*
 * SimpleStore Google Sheets Plugin
 * To use Google spreadsheet as your database, follow the steps below:
 * 1. Use the "DemoSpreadsheet.xlsx" as a starting point
 * 2. Create a new Google spreadsheet
 * 3. Set sharing permissions to either “Public” or set to “Anyone with link can view”
 * 4. Publish the sheet (File -> Publish to the web -> Publish)
 * 5. Add the spreadsheet ID to your 'config.js' ( spreadsheetID : "XXXXXXXXXXXXXXXXXXXXXXX" )
 */

simpleStore.plugins.google = (function() {

	var storeProducts = verifyProducts = [];
	var categories = {};

	function getSpreadsheetData(s, verify, callback) {

		verify = typeof verify !== 'undefined' ? verify : false;

		var hostname = "https://spreadsheets.google.com";
		var format = "json";
		var spreadsheetURL = hostname + "/feeds/worksheets/" + s.spreadsheetID + "/public/full?alt=" + format;
		var mainsheetURL = hostname + "/feeds/list/" + s.spreadsheetID + "/od6/public/values?alt=" + format;
		var settingsSheetName = "Settings";
		var productsSheetName = "Products";
		var categorySheetName = "Categories";
		var sheetIDs = {};

		function getSheetInfo (url, callback) {
			// Need to do this because od6 is default Google Sheet ID
			$.getJSON(url)
				.done(function(data) {

					var sheets = data.feed.entry;

					$(sheets).each(function(i, sheet) {

						var title = sheet.title.$t;
						var id = sheet.id.$t;
						var sheetID = id.substr(id.lastIndexOf('/') + 1);

						if(title == settingsSheetName) {
							sheetIDs.settingsSheetID = sheetID;
						}
						if(title == productsSheetName) {
							sheetIDs.productsSheetID  = sheetID;
						}
						if(title == categorySheetName) {
							sheetIDs.categorySheetID  = sheetID;
						}
					});
					callback(sheetIDs.settingsSheetID);
					loadProductData(sheetIDs.productsSheetID);
					loadCategoryData(sheetIDs.categorySheetID);
				});
		}

		function loadSiteSettings (id, callback) {

			var settingsSheetURL = hostname + "/feeds/list/" + s.spreadsheetID + "/" + id + "/public/values?alt=" + format;

			$.getJSON(settingsSheetURL)
				.done(function(data) {
					var data = data.feed.entry;
					var s = simpleStore.settings;

					if(data[0]) {

						var siteName = data[0].gsx$sitenametextorimagelink.$t;
						var columns = data[0].gsx$columns123.$t;

						if (siteName) {
							s.brand = siteName;
						}
						if (columns) {
							s.numColumns = columns;
						}

						simpleStore.setLayout(s);
					}
				});
		}

		function loadProductData (id) {

			var productsSheetURL = hostname + "/feeds/list/" + s.spreadsheetID + "/" + id + "/public/values?alt=" + format;

			// Get Main Sheet Products data
			$.getJSON(productsSheetURL)
				.done(function(data) {

					var productsData = data.feed.entry;

					// Build products
					$(productsData).each(function(i) {

						var options = this.gsx$options.$t;
						var setOptions = function(options) {
							var productOptions = [];
							if(options) {
								var opts = options.split(";").filter(function(el) {return el.length != 0});
								$(opts).each(function(i, option) {
									var opt = option.trim().split(":"),
										key = opt[0],
										val = opt[1],
										optObj = {};

									optObj[key] = val;
									productOptions.push(optObj);
								});
							}
							return productOptions;
						};
						// Get product values
						var product = {
							category: this.gsx$category.$t,
							name : this.gsx$name.$t,
							price : this.gsx$price.$t,
							description : this.gsx$description.$t,
							options : setOptions(options),
							image : this.gsx$image.$t
						};

						if (verify) {
							verifyProducts.push(product);
						} else {
							storeProducts.push(product);
						}
					});
					callback();
				})
				.fail(function(data){
					if (verify) {
						var errorMsg = 'There was an error validating your cart.';
					} else {
						var errorMsg = 'Error loading spreadsheet data. Make sure the spreadsheet ID is correct.';
					}
					setTimeout(function(){ simpleStore.renderError(s, errorMsg); }, 1000);
				});
		}
		function loadCategoryData (id) {

			var productsSheetURL = hostname + "/feeds/list/" + s.spreadsheetID + "/" + id + "/public/values?alt=" + format;

			// Get Main Sheet Products data
			$.getJSON(productsSheetURL)
				.done(function(data) {

					var catData = data.feed.entry;

					// Build categories
					$(catData).each(function(i) {
						var catName = this.gsx$cat.$t;
						var subcatName = this.gsx$subcat.$t;
						var subsubcatName = this.gsx$subsubcat.$t;
						
						if(catName === "Lampadas LED" && subcatName == "E14 Casquilho fino" && subsubcatName == "Vela"){
							console.log(subsubcatName);
						}
						if(catName in categories){
							if(subcatName in categories[catName]){
								categories[catName][subcatName][subsubcatName] = subsubcatName;
							}else{
								categories[catName][subcatName] = {};
								if(subsubcatName){
									
									categories[catName][subcatName][subsubcatName] = subsubcatName;
								}
							}
						}else{
							categories[catName] = {}
							categories[catName][subcatName] = {};
							if(subsubcatName){
								if(subsubcatName == 'Vela'){
									console.log('Vela is loaded')
								}
								
								categories[catName][subcatName][subsubcatName] = subsubcatName;
							}
						}
					});
					console.log("cats loaded!")
					console.log(categories);
					var cats = categories;

					$('#main_menu').empty();
					var catNames = Object.keys(cats);
					catNames.forEach(function(catName){
						var li = $('<li><span>'+catName+'</span><a href="#" class="expand"><span class="glyphicon glyphicon-chevron-right"></span></a><a href="#" class="collapse"><span class="glyphicon glyphicon-chevron-down"></span></a></li>');
						var subcats = cats[catName];
						var subcatNames = Object.keys(subcats);
						if(catName === "Tubos LED"){
							console.log(subcats);
						}
						if(subcatNames.length > 0){
							var ul = $('<ul />');
							subcatNames.forEach(function(subcatName){
								var subsubCats = cats[catName][subcatName];
								var subsubcatNames = Object.keys(subsubCats)
								var subcatElm = $('<li><span>'+subcatName+'</span></li>');
								var subUl = $('<ul />');
								subcatElm.append(subUl);
								subsubcatNames.forEach(function(subsubcatName){
									
									subUl.append('<li><span>'+subsubcatName+'</span></li>')
									
								})
								ul.append(subcatElm);
							});
							li.append(ul)
						}
						$('#main_menu').append(li);
						
					})
					$('#menu_but').on('click',function(){
						$(this).toggleClass('opened')

						$('#main_menu').toggleClass('opened')
					})
					$('#main_menu li, #main_menu ul li').on('click',function(e){
						$(this).parent().find('li').removeClass('opened');
				
						
						e.stopPropagation();
						var cat = $(this).find('> span').text();
						$(this).addClass('opened');
						simpleStore.filterProductsCat(cat);
					})
					
					
				})
				.fail(function(data){
					if (verify) {
						var errorMsg = 'There was an error validating your cart.';
					} else {
						var errorMsg = 'Error loading spreadsheet data. Make sure the spreadsheet ID is correct.';
					}
					setTimeout(function(){ simpleStore.renderError(s, errorMsg); }, 1000);
				});
		}

		// Get Sheet data
		getSheetInfo(spreadsheetURL, loadSiteSettings);
	}

	function validatePrices(s, checkoutData) {
		verifyProducts = [];

		getSpreadsheetData(s, true, function() {
			if(simpleStore.verifyCheckoutData(checkoutData, verifyProducts, true)) {
        		simpleStore.checkout(s, checkoutData);
			} else {
				var errorMsg = 'There was an error validating your cart.';
				simpleStore.renderError(s, errorMsg);
			}
		});
	}

	return {
		getCategories: function(){
			return categories;
		},
		init: function(callback) {
			var s = simpleStore.settings;

			// Clears out brand to allow for spreadsheet site name
			s.brand = "";
			simpleStore.setLayout(s);

			getSpreadsheetData(s, false, function(){
				callback(storeProducts);
			});
		},
		validate: function(checkoutData) {
			validatePrices(simpleStore.settings, checkoutData);
		}
	};
})();
