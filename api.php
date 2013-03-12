<?php

$query = $_POST['query'];
$type = $_POST['type'];
$page = $_POST['page'];
$geo = $_POST['geo'];
$sort = $_POST['sort'];
$content_type = $_POST['content_type'];
$userid_specific = $_POST['userid'];
$license = $_POST['license'];

class Flickr { 
	private $apiKey = '83ed3193d7630932f508ae8cb7204c25'; 
 
	public function __construct() {
	} 
 
	public function search($query = null, $page = 1, $geo = 0, $sort = 0, $userid = 0, $license = 0) {

		if($userid == 0){
			$search = 'http://flickr.com/services/rest/?method=flickr.photos.search&api_key=' . $this->apiKey . '&text=' . urlencode($query) . '&page=' . urlencode($page);
		}else{
			$search = 'http://flickr.com/services/rest/?method=flickr.photos.search&api_key=' . $this->apiKey . '&page=' . urlencode($page);
		}

		if($geo == 1){
			$search .= '&has_geo=1';
		};

		if($sort != 0){
			
			if($sort == 1){
				$sort_type = "date-posted-asc";
			}else if($sort == 2){
				$sort_type = "relevance";
			}else if($sort == 3){
				$sort_type = "date-taken-desc";
			}else if($sort == 4){
				$sort_type = "date-taken-asc";
			}else if($sort == 5){
				$sort_type = "interestingness-desc";
			}else if($sort == 6){
				$sort_type = "interestingness-asc";
			};

			$search .= '&sort=' . $sort_type;

		};

		if($content_type == 1 || $content_type == 2){
			$search .= '&content_type=' . $content_type;
		};

		if($userid == 1){
			$search .= '&user_id=' . urlencode($query);
		};
		
		if($license != 0){
			$search .= '&license=' . $license;
		}

		$search .= '&per_page=100&format=json&nojsoncallback=1';

		$result = file_get_contents($search);  
		return $result;
	}

	public function getUsername($id = null){
		$search = 'http://flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=' . $this->apiKey . '&photo_id=' . urlencode($id) . '&format=json&nojsoncallback=1';
		$result = file_get_contents($search);  
		return $result; 
	}

	public function getGeo($id = null){
		$search = 'http://flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=' . $this->apiKey . '&photo_id=' . urlencode($id) . '&format=json&nojsoncallback=1';
		$result = file_get_contents($search);  
		return $result; 
	}

	public function getExif($photo_id){
		$search = 'http://flickr.com/services/rest/?method=flickr.photos.getExif&api_key=' . $this->apiKey . '&photo_id=' . urlencode($photo_id) . '&format=json&nojsoncallback=1';
		$result = file_get_contents($search);  
		return $result; 
	}
}

$mySearch = new Flickr;

if($type == "username"){
	$results = $mySearch -> getUsername($query);
	echo $results;
};

if($type == "search"){
	$results = $mySearch -> search($query,$page,$geo,$sort,$userid_specific,$license);
	echo $results;
};

if($type == "geo"){
	$results = $mySearch -> getGeo($query);
	echo $results;
};

if($type == "exif"){
	$results = $mySearch -> getExif($query);
	echo $results;
};

?>