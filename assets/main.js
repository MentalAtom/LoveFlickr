$(function(){

	var options =   [						
						"Go on, search!",
						"What are you looking for?",
						"Would you like fries with that?",
						"Photos, eh?",
						"Press that big button, go on!",
						"Please type, I'm lonely."
					]

	var num = Math.floor(Math.random()*6)+1;

	$("#search_query").attr("data-fill",options[num]);

	//history.pushState({overview: "hidden"}, "Flickr Search", null);

	var width = $(".images").width(),
	imageSize = (width/10),
	storedData = {},
	currentPage = 1,
	totalPages,
	triggerRun = false,
	search,
	my_search,
	lastSentData,
	firstSearch = true;
	function getPhotos(query, type, page, geolocation, sort, userid, license){

			$.post("api.php", {query: query, type: type, page: page, geo: geolocation, sort: sort, userid: userid, license: license}, function(data){

					lastSentData = {query: query, type: type, page: page, geo: geolocation, sort: sort, license:license, userid: userid};

					console.log(lastSentData);

					var data = $.parseJSON(data);

					if(data.stat == "ok"){

						storedData[currentPage] = data;

						totalPages = data.photos.pages;

						var offset = 100*(currentPage-1);

						$.each(data.photos.photo, function(i, photo){

							var delay = i;

							if(offset != 0){
								i = i+offset;
							}

							$(".images").append("<div class='image'></div>");
							$(".image").eq(i).append("<img src='http://farm"+photo.farm+".staticflickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+"_q.jpg' />")
								.attr("data-id",photo.id)

							$(".image").eq(i).children("img").bind('load',function(){
								$(this).parent(".image").addClass("fadeIn");
							})
						})

						setTimeout(function(){$(".overlay").css("top","-100%");},500);
						$("#search").addClass("topbar");
						triggerRun = false;

						$("#query").removeAttr("disabled");
						$("#query").css("width","155px");
						$("#query").val("Search");

						//history.pushState({overview: "hidden"}, query+" - Flickr Search",null);

						$(".loading_bottom").css("bottom","-40px");

					}else{

						console.log("An error occured. "+data.message);
						$("#query").removeAttr("disabled");
						$("#query").css("width","148px");
						$("#query").val("Search");

					}

				}

			)

	}

	function getBiggest(one, two){
		if(one > two){
			return one;
		}else{
			return two;
		}
	}

	function getPhotoDetails(photo_id){

		/*First, run a query to get the general photo info (owner, title etc.) */

		$.post("api.php", {query: photo_id, type: "username"}, function(data){
			data = $.parseJSON(data);

			if(data.stat != "fail"){

				var owner = data.photo.owner.username;
				var taken = data.photo.dates.taken;

				$(".overlay-photo .photo-details").children("p").not(".photo-location").text("");
				$(".overlay-photo .photo-details").children("p.photo-author").text("by "+owner);
				$(".overlay-photo .photo-details").children("p.photo-taken").text("Taken: "+taken);

			}else{

				$(".overlay-photo .photo-details").children("p.photo-author").text("We can't find the details for this photo. Sorry about that.");

			}

		});

		/* Get the EXIF Data */

		$.post("api.php", {query: photo_id, type: "exif"}, function(data){
			data = $.parseJSON(data);

			if(data.stat != "fail"){

				var exposure, aperture, flash, focal_length, iso;

				console.log(data);

				$.each(data.photo.exif,function(i,exif){
					if(exif.label == "Exposure"){
						exposure = exif.raw._content;
					}
					if(exif.label == "Aperture"){
						aperture = exif.clean._content;
					}
					if(exif.label == "Flash"){
						flash = exif.raw._content;
					}
					if(exif.label == "Focal Length"){
						if(exif.clean === undefined){
							focal_length = "unknown";
						}else{
							focal_length = exif.clean._content;
						}
					}
					if(exif.tag == "ISO"){
						if(exif.raw === undefined){
							iso = "unknown";
						}else{
							iso = exif.raw._content;
						}
					}
				})

				if(data.photo.camera != ""){
					$(".photo-camera").text("Taken with: "+data.photo.camera);
					$(".photo-settings").text(exposure+" | "+aperture+" | ISO "+iso+" | "+focal_length);
				}

			}else{

				console.log("Exif data FAIL");

			}

		});

		/* Then finally, grab the geolocation data and feed it to google to give us a nicely formatted address. */

		var latitude, longitude;

		$.post("api.php", {query: photo_id, type: "geo"}, function(data){
			data = $.parseJSON(data);

			$(".overlay-photo .photo-details").children("p.photo-location").text("");

			if(data.stat == "fail"){
				$(".overlay-photo .photo-details").children("p.photo-location").text("This photo did not include location information");
			}else{
				latitude = parseFloat(data.photo.location.latitude);
				longitude = parseFloat(data.photo.location.longitude);

				geocoder = new google.maps.Geocoder();
				var latlng = new google.maps.LatLng(latitude, longitude);

				geocoder.geocode({'latLng': latlng}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						var location = results[0].formatted_address;
						$(".overlay-photo .photo-details").children("p.photo-location").text("Location: "+location);
					}
				})
			}

		});
	}

	$("#query").click(function(e){
		e.preventDefault();

		var form = $("#search");
		my_search = $("#search_query").val();
		
		if($("input[name=geo]:checked").length){
			var geo = 1;
		}else{
			var geo = 0;
		}

		if($("input[name=userid]:checked").length){
			var userid = 1;
		}else{
			var userid = 0;
		}

		var sort = $("select[name=sort] option:selected").attr("val");
		var license = $("select[name=license] option:selected").attr("val");

		if(!firstSearch){
			$(".images .image").remove();
			currentPage = 1;
			getPhotos(my_search, "search", 1);
		}else{

			if($("#search_query").val() != "" && $.inArray($("#search_query").val(),options) == -1){

				$(this).attr("disabled","disabled");
				$(this).css("width","220px");
				$(this).val("Searching...");
				getPhotos(my_search, "search", 1, geo, sort, userid, license);
				firstSearch = false;

			}
		}

	});
	

	$(".images").on('click','.image.fadeIn',function(){
		$(".overlay-photo").addClass("is-active");
		$(".images").addClass("blur");
		$("body").addClass("locked");

		$(".overlay-photo > .main-photo").children("img").remove();
		$(".overlay-photo .photo-details").children("dl, h3, p").text("");
		$(".overlay-photo .photo-details").children("a").hide();

		var farm,
			server,
			id = $(this).data("id"),
			secret,
			title, desc, owner;

		$.each(storedData, function(i, data){

			$.each(data.photos.photo, function(i,photo){

				if(photo.id == id){
					title = photo.title;
					desc = photo.desc;
					owner = photo.owner;
					farm = photo.farm;
					secret = photo.secret;
					server = photo.server;
				}

			})

		});

		var src = "http://farm"+farm+".staticflickr.com/"+server+"/"+id+"_"+secret+"_b.jpg";

		$(".overlay-photo .main-photo").append("<img src='"+src+"' />");

		$(".main-photo img").on('load',function(){

			$(".main-photo, .main-photo img").removeAttr("style");

			$(".main-photo img").remove();
			$(".loading").addClass("hide");
			$(".main-photo").css({"background":"url('"+src+"') no-repeat center center","background-size":"contain","width":"70%","height":"70%"});

			if(title != "undefined"){
				$(".overlay-photo .photo-details").children("h3").text(title);
			}else{
				$(".overlay-photo .photo-details").append("<h3>No title given</h3>");
			}

			$(".photo-link").show().attr("href","http://www.flickr.com/photos/"+owner+"/"+id+"/sizes/l/in/photostream/");

			//$(".overlay-photo .photo-details").children("p.photo-author").text("Author details loading");
			
		})

		/* If image fails to load */

		$(".main-photo img").on('error',function(){

			$(".main-photo, .main-photo img").removeAttr("style");

			$(".main-photo img").remove();
			$(".loading").addClass("hide");
			$(".main-photo").css({"width":"70%","height":"70%","background-color":"white"});

			if(title != "undefined"){
				$(".overlay-photo .photo-details").children("h3").text(title);
			}else{
				$(".overlay-photo .photo-details").append("<h3>No title given</h3>");
			}

			$(".overlay-photo .photo-details").children("p.photo-author").text("Author details loading");
			
		})

		getPhotoDetails(id);	

	});

	$(".close").on('click',function(e){

		/*if(history.state.overview != "hidden"){
			history.go(-1);
		}*/

		e.preventDefault();
		$(".overlay-photo").removeClass("is-active");
		$(".loading").removeClass("hide");
		$(".overlay-photo .main-photo img").remove();
		$(".main-photo").css("width","0px").css("height","0px");
		$(".images").removeClass("blur");
		$("body").removeClass("locked");
	})

	/* If scrolled to bottom then GET MOAR PHOTOS */

	$(window).scroll(function () {
	   if ($(window).scrollTop() >= $(document).height() - $(window).height() - 200) {

	   		if(!triggerRun){

	   			triggerRun = true;
	      
	      		if(currentPage != totalPages){
			   		currentPage++;

			   		$(".loading_bottom").css("bottom","0px");

			   		query = lastSentData['query'],
			   		type = lastSentData['search'],
			   		geo = lastSentData['geo'],
			   		sort = lastSentData['sort'],
			   		license = lastSentData['license'],
			   		userid = lastSentData['userid'];

			   		getPhotos(query, "search", currentPage, geo, sort, userid, license);

			   	}else{

			   		$(".loading_bottom").addClass("error").css("bottom","0px");

			   		setTimeout(function(){$(".loading_bottom").css("bottom","-40px").removeClass("error");},3000)

			   	}

		   	}

	   }
	});

	/* Text Input attributes */

	$.each($("input[type=text]"),function(i,input){
		$(input).val($(input).attr("data-fill"));
	})

	$("input[type=text]").focus(function(){
		if($(this).val() == $(this).attr("data-fill")){
			$(this).val("");
		}
	})

	$("input[type=text]").blur(function(){
		if($(this).val() == ""){
			$(this).val($(this).attr("data-fill"));
		}
	})

	$("a[href=#advanced]").click(function(e){
		e.preventDefault();

		$(".advanced").slideToggle(500);

	})

})