<?php

//Initialize config arrays.
$enabled = array(); 
$station_info = array();

//Set to false in production
$testing_environment = true;

//Radio station info
$station_info['call_letters'] = 'CiTR';
$station_info['frequency'] = '101.9fm';
$station_info['city'] = 'Vancouver';
$station_info['province']= 'BC';
$station_info['country'] = 'Canada';
$station_info['website'] = 'CiTR.ca';
$station_info['tech_email'] = 'tech_person@station.ca';
$station_info['station ID message'] ="'CiTR 101.9, from unceded Musqueam territory, in Vancouver'";
$station_info['timezone'] = 'America/Vancouver';
// For timezone reference http://ca1.php.net/manual/en/timezones.php

//Enable or disable features of DJLand
$enabled['library'] = true; // searchable music catalog (for physical recordings)
$enabled['shows'] = true; // show information database - used to pre-fill playsheets
$enabled['adscheduler'] = true; // display what ads each programmer should play (only works if using SAM integration)
$enabled['charts'] = true; // Chart week display for the music director - pulls play data from playsheets
$enabled['report'] = true; // CRTC formatted printable report view
$enabled['playsheets'] = true; // DJ's log in to the site from any computer with WWW access to create and edit their playsheets
$enabled['podcast_tools'] = true; // show podcast manager.  Not implemented yet
$enabled['sam_integration'] = true;

//Database Connections
$djland_db_address = '127.0.0.1';
$djland_db_username = 'djland-username';
$djland_db_password = 'djland-password';
$djland_db_dbname = 'djland-databasename';

if($enabled['sam_integration']){
	$samDB_ip = 'ip address of computer running SAM mysql database';
	$samDB_user = 'mysql username of above mysql database with select, insert, etc priveleges';
	$samDB_pass = 'password for that user';
	$samDB_dbname = 'name of SAM table in the db (probably is SAMDB)';
}

//Podcasting tools support
if($enabled['podcast_tools']){
	//Local paths & Remote URLs for use with podcasting
	$path = array();
	$url = array();

	//Podcast paths
	$path['audio_base'] = '/home/podcast/audio';
	$url['audio_base'] = 'http://podcast.hostname.com/audio';
	$path['xml_base'] = '/home/podcast/xml';
	$url['xml_base']= 'http://podcast.hostname.com/xml';

	//Archiver Access
	$url['archiver_tool'] = 'http://archive.citr.ca';
	$url['archive_request'] = $url['archiver_tool'].'/py-test/archbrad/download?archive=%2Fmnt%2Faudio-stor%2Flog';

	//Podcast local_dev paths
	if($testing_environment==true){
		$path['test_audio_base'] = $_SERVER['DOCUMENT_ROOT']."/audio";
		$url['test_audio_base'] = $_SERVER['DOCUMENT_ROOT']."/audio";
		$path['test_xml_base'] = $_SERVER['DOCUMENT_ROOT']."/xml";
		$url['test_xml_base'] = $_SERVER['DOCUMENT_ROOT']."/xml";
	}
}

//The date at which your membership will roll into the next membership year.
$djland_membership_cutoff_month=5;

//Permission levels, their value, and the tooltip shown when you hover over it.
$djland_permission_levels = array(
    'operator'=>array('level'=>'99','name'=>'Operator','tooltip'=>'"Power Overwhelming."'),
    'administrator'=> array('level'=>'98','name'=>'Administrator','tooltip'=>'Administrator: Has all permissions, can create administrators.'),
    'staff'=>array('level'=>'6','name'=>'Staff','tooltip'=>'Staff: Has all permissions, but rollover.'),
    'workstudy'=>array('level'=>'5','name'=>'Workstudy','tooltip'=>'Workstudy: All access, but only email lists in membership.'),
	'volunteer_leader'=>array('level'=>'4','name'=>'Volunteer Leader','tooltip'=>'Volunteer Leader: Access to library, email lists, and schedule overrides.'),
    'volunteer'=>array('level'=>'3','name'=>'Volunteer','tooltip'=>'Volunteer: Access to charts, edit library, ad history.'),
    'dj'=>array('level'=>'2','name'=>'DJ','tooltip'=>'DJ: Access to playsheets, and personalized CRTC report.'),
    'member'=>array('level'=>'1','name'=>'Member','tooltip'=>'Member: Access to my Profile, resources, and help.')
	);
//Possible trainings for members
$djland_training = array(
	'Technical' => 'technical_training',
	'Production'=> 'production_training',
	'Programming'=> 'programming_training',
	'Spoken Word'=> 'spoken_word_training'
	);

//Things people can be interested in/be emailed about around the station
$djland_interests = array(
	'Arts'=>'arts',
	'Ads and PSAs'=>'ads_psa',
	'Digital Library'=>'digital_library',
	'DJ101.9'=>'dj',
	'Illustrate for Discorder'=>'discorder_illustrate',
	'Writing for Discorder'=>'discorder_write',
	'Live Broadcasting'=>'live_broadcast',
	'Music'=>'music',
	'News'=>'news',
	'Photography'=>'photography',
	'Programming Committee'=>'programming_committee',
	'Promos and Outreach'=>'promotions_outreach',
	'Show Hosting'=>'show_hosting',
	'Sports'=>'sports',
	'Tabling'=>'tabling',
	'Web and Tech'=>'tech',
	"Women's Collective"=>'womens_collective',
	"Indigenous Collective"=>"indigenous_collective",
	"Accessibility Collective"=>"accessibility_collective",
	"Other"=>"other");
//Member types
$djland_member_types = array(
	'UBC Student'=>'Student',
	'Community Member'=>'Community',
	'Staff'=>'Staff',
	'Lifetime'=>'Lifetime'
	);
//University Year Listing
$djland_program_years = array(
	'1'=>'1',
	'2'=>'2',
	'3'=>'3',
	'4'=>'4',
	'5+'=>'5'
	);
//University Faculty Listing
$djland_faculties = array(
	"Arts",
	"Applied Science",
	"Architecture",
	"Archival Studies",
	"Audiology",
	"Business",
	"Community Planning",
	"Continuing Studies",
	"Dentistry",
	"Doctoral Studies",
	"Education",
	"Environmental Health",
	"Forestry",
	"Graduate Studies",
	"Journalism",
	"Kinesiology",
	"Land and Food Systems",
	"Law","Medicine",
	"Music",
	"Nursing",
	"Pharmaceutical",
	"Public Health",
	"Science",
	"Social Work",
	"Other"
	);

//Province list
$djland_provinces = array(
	'AB',
	'BC',
	'MAN',
	'NB',
	'NFL',
	'NS',
	'NVT',
	'NWT',
	'ONT',
	'QUE',
	'SASK',
	'YUK'
	);
//Primary genres for show filtering purposes
$djland_primary_genres = array(
	"Electronic",
	"Experimental",
	"Hip Hop / R&B / Soul",
	"International",
	"Jazz / Classical" ,
	"Punk / Hardcore / Metal" ,
	"Rock / Pop / Indie",
	"Roots / Blues / Folk",
	"Talk"
	);
//Upload categories, and their accepted formats.
$djland_upload_categories = array(
	"show_image"=>array('jpg','jpeg','gif','png','tiff'),
	"friend_image"=>array('jpg','jpeg','gif','png','tiff'),
	"special_broadcast_image"=>array('jpg','jpeg','gif','png','tiff'),
	"member_resource"=>array('pdf','jpg','jpeg','gif','png','tiff'),
	"episode_image"=>array('jpg','jpeg','gif','png','tiff'),
	"episode_audio"=>array('mp3'),
	);
