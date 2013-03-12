<!DOCTYPE html>
<html>
<head>
	<title>Flickr Search</title>

	<link rel="stylesheet" href="assets/css/font-awesome.css" />
	<link rel="stylesheet" href="assets/main.css" />

	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1">
	<meta charset="utf-8">

	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDdyjevpAJkYAptqACVqbaZQjDXN-YwPc8&v=3&sensor=false"></script>
	<script src="assets/js/modernizr.js"></script>
	<script src="assets/jquery.js"></script>
	<script src="assets/main.js"></script>
</head>
<body>

	<div id="search">
		<h1><span class="pink"><i class="icon-heart"></i></span> Flickr</h1>

		<form method="POST" action="api.php">
			<div class="letter-container"></div>
			<input name="query" autocomplete="off" type="text" id="search_query" data-fill="Go on, search!" />
			<a href="#advanced">Show Options</a>
			<div class="advanced clearfix">
				<span class="input">
					<label for="geo">Only geotagged photos?</label>
					<input type="checkbox" name="geo" value="0" />
				</span>
				<span class="input">
					<label for="userid">Query is a flickr User ID</label>
					<input type="checkbox" name="userid" value="0" />
				</span>
				<span class="input">
					<label for="sort">Sort By</label>
					<select name="sort">
						<option val="0">Date Posted (Desc)</option>
						<option val="1">Date Posted (Asc)</option>
						<option val="2">Relevance</option>
						<option val="3">Date Taken (Desc)</option>
						<option val="4">Date Taken (Asc)</option>
						<option val="5">Interestingness (Desc)</option>
						<option val="6">Interestingness (Asc)</option>
					</select>
				</span>
				<span class="input">
					<label for="license">License:</label>
					<select name="license">
						<option val="0">Any</option>
						<option val="1">Attribution-NonCommercial-ShareAlike</option>
						<option val="2">Attribution-NonCommercial</option>
						<option val="3">Attribution-NonCommercial-NoDerivs</option>
						<option val="4">Attribution</option>
						<option val="5">Attribution-ShareAlike</option>
						<option val="6">Attribution-NoDerivs License</option>
						<option val="7">No Restrictions</option>
					</select>
				</span>
			</div>
			<button id="query" class="btn"><i class="icon-search"></i>Search</button>
		</form>

	</div>

	<div class="overlay"></div>
	<div class="images"></div>

	<div class="overlay-photo">
		<div class="loading">
			<div class="loadingbar"></div>
			<div class="loadingbar"></div>
			<div class="loadingbar"></div>
			<p>Loading...</p>
		</div>
		<div class="main-photo-container">
			<div class="main-photo"></div>
			<div class="photo-details">
				<h3 class="photo-title"></h3>
				<p class="photo-author"></p>
				<p class="photo-location"></p>
				<p class="photo-taken"></p>
				<p class="photo-camera"></p>
				<p class="photo-settings"></p>
				<a target="_blank" class="photo-link">View sizes on Flickr</a>
			</div>
			<div id="map" style="width:300px;height:300px;"></div>
			<a class="close" href="#">Close</a>
		</div>
	</div>

	<div class="loading_bottom"><span class="success">Loading More Photos...</span><span class="error">No more photos avaliable :(</span></div>

</body>
</html>