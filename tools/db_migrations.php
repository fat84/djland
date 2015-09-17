<?php
/**
 * Created by PhpStorm.
 * User: brad
 * Date: 3/5/15
 * Time: 5:34 PM
 */
require_once('../headers/db_header.php');


$cutoff_date = date('04/31/'.idate('Y'));
$year = idate('Y');
$today_date = date('m/d/Y',strtotime("today"));
//Check to see if we are in a this years membership year or not.
if(strtotime($today_date) < strtotime($cutoff_date)){
    $year--;
}
$initial_cutoff_year = $year."/".($year+1);

$queries = array(
    'remove obsolete scheduled_ads table'=>'DROP TABLE IF EXISTS `scheduled_ads`;',
    'remove obsolete ncrc data' => 'DROP TABLE IF EXISTS `ncrcdata`;',
    'change playlists table to playsheets' => 'ALTER TABLE playlists RENAME TO playsheets;',
    'expand shows to hold podcast channel data' => 'ALTER TABLE `shows` 
        ADD COLUMN `podcast_xml` TINYTEXT NULL COMMENT '' AFTER `alerts`,
        ADD COLUMN `podcast_slug` VARCHAR(45) NULL COMMENT '' AFTER `podcast_xml`,
        ADD COLUMN `podcast_title` TINYTEXT NULL COMMENT '' AFTER `podcast_slug`,
        ADD COLUMN `podcast_subtitle` TINYTEXT NULL COMMENT '' AFTER `podcast_title`;',
    'create podcast episodes table'=>'CREATE TABLE IF NOT EXISTS `podcast_episodes` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `playsheet_id` BIGINT(20) UNSIGNED NOT NULL,
        `channel_id` int(11) DEFAULT NULL,
        `title` text,
        `subtitle` text,
        `summary` text,
        `date` text,
        `url` text,
        `length` int(11) DEFAULT NULL,
        `author` text,
        `active` tinyint(1) DEFAULT 0,
        `duration` int(7) DEFAULT 0,
        PRIMARY KEY (`id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
    'add alert field to shows'=>'ALTER TABLE `shows` ADD COLUMN `alerts` TEXT NULL;',
    'create special events table'=>'CREATE TABLE IF NOT EXISTS `special_events` (
                                `id` INT NOT NULL AUTO_INCREMENT,
                                `name` VARCHAR(455) NULL,
                                `show_id` INT NULL,
                                `description` TEXT NULL,
                                `start` INT NULL,
                                `end` INT NULL,
                                `image` VARCHAR(455) NULL,
                                `url` VARCHAR(455) NULL,
                                PRIMARY KEY (`id`));',
    'add edit_date to channel'  => 'ALTER TABLE `podcast_channels` 
                                        ADD COLUMN `UPDATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
                                    ALTER TABLE `djland`.`podcast_episodes` DROP COLUMN `edit_date`;',
    'add edit_date to episode'  => 'ALTER TABLE `podcast_episodes` ADD COLUMN `UPDATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;',
    'rename genre tables to tags' => "ALTER TABLE `shows`
                                  ADD COLUMN `primary_genre_tags` TINYTEXT NULL DEFAULT NULL AFTER `lang_default` ,
                                  CHANGE COLUMN `genre` `secondary_genre_tags` TEXT DEFAULT NULL;",
    'adjust member_show' => 'ALTER TABLE `member_show`
                                  CHANGE COLUMN `member_id` `member_id` INT(11) NOT NULL ,
                                  CHANGE COLUMN `show_id` `show_id` INT(11) NOT NULL ,
                                  ADD COLUMN `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                  DROP PRIMARY KEY,
                                  ADD PRIMARY KEY (`id`);',
    'rename userid to user_id in group_members' => '
                                    ALTER TABLE user
                                        CHANGE COLUMN `userid` `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT ;
                                    ALTER TABLE group_members 
                                        CHANGE COLUMN userid to user_id INT(10) UNSIGNED NOT NULL;
                                        ALTER TABLE group_members 
                                    ADD CONSTRAINT `user_id`
                                    FOREIGN KEY (`user_id`)
                                    REFERENCES user (`id`)
                                        ON DELETE CASCADE
                                        ON UPDATE CASCADE;"',
    'edit membership permissions' => "ALTER TABLE `group_members`
                                    DROP COLUMN `editlibrary`,
                                    DROP COLUMN `membership`,
                                    DROP COLUMN `library`,
                                    DROP COLUMN `editdj`,
                                    DROP COLUMN `addshow`,
                                    DROP COLUMN `adduser`,
                                    CHANGE COLUMN `operator` `operator` VARCHAR(1) NULL DEFAULT '0' AFTER `user_id`,
                                    CHANGE COLUMN `administrator` `administrator` VARCHAR(1) NULL DEFAULT '0' AFTER `operator`,
                                    ADD COLUMN `staff` VARCHAR(1) NULL DEFAULT '0' AFTER `administrator`,
                                    ADD COLUMN `workstudy` VARCHAR(1) NULL DEFAULT '0' AFTER `staff`,
                                    ADD COLUMN `volunteer` VARCHAR(45) NULL DEFAULT '0' AFTER `workstudy`,
                                    CHANGE COLUMN `dj` `dj` VARCHAR(1) NULL DEFAULT '0' AFTER `volunteer`,
                                    CHANGE COLUMN `member` `member` VARCHAR(1) NULL DEFAULT '0'",
    'add foreign key to group members' => 'ALTER TABLE group_members ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES user.(`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    'add training' => "ALTER TABLE `membership`
                          ADD COLUMN `station_tour` VARCHAR(1) NULL DEFAULT '0' AFTER  `exposure`,
                          ADD COLUMN `technical_training` VARCHAR(1) NULL DEFAULT '0' AFTER  `station_tour`,
                          ADD COLUMN `programming_training` VARCHAR(1) NULL DEFAULT '0' AFTER  `technical_training`,
                          ADD COLUMN `production_training` VARCHAR(1) NULL DEFAULT '0' AFTER `programming_training`,
                          ADD COLUMN `spoken_word_training` VARCHAR(1) NULL DEFAULT '0' AFTER `production_training`;",                        
    'create cutoff' => "CREATE TABLE IF NOT EXISTS `year_rollover` (
                            `id` INT NOT NULL AUTO_INCREMENT,
                            `membership_year` VARCHAR(16) NOT NULL DEFAULT $initial_cutoff_year,
                            PRIMARY KEY (`id`));",
    'additional committees' => "ALTER TABLE membership_years 
                                ADD COLUMN `womens_collective` VARCHAR(16) NULL DEFAULT '0' AFTER `other`,
                                ADD COLUMN `indigenous_collective` VARCHAR(16) NULL DEFAULT '0' AFTER `womens_collective`,
                                ADD COLUMN `accessibility_collective` VARCHAR(16) NULL DEFAULT '0' AFTER `indigenous_collective`;",                                    
    'add string based host field' => 'ALTER TABLE `playsheets`
        ADD COLUMN `host` TINYTEXT NULL AFTER `host_id`;',
    'add slug field to channel' => 'ALTER TABLE `podcast_channels`
        ADD COLUMN `slug` TEXT NULL AFTER `xml`;',
    'add timestamps to membership_years & user' => 'ALTER TABLE `membership_years` 
            ADD COLUMN `create_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP AFTER `accessibility_collective`,
            ADD COLUMN `edit_date` TIMESTAMP NULL AFTER `create_date`;
            ALTER TABLE `user` 
            CHANGE COLUMN `create_date` `create_date` TIMESTAMP NULL DEFAULT NULL;',
    'timestamps to membership' => 
            'ALTER TABLE `membership` 
                CHANGE COLUMN `joined` `create_date` TIMESTAMP NOT NULL AFTER `spoken_word_training`,
                ADD COLUMN `edit_date` TIMESTAMP NOT NULL AFTER `create_date`;',
    'fill in membership_year timestamps' => "update membership_years as my inner join membership as m on my.member_id = m.id SET my.create_date = m.create_date;",




);

foreach($queries as $description => $query){
  echo '<hr/>';
  echo 'task - '.$description.': ';

  if($result =   mysqli_query($db,$query) ){
    echo 'complete';
  } else {
    echo 'fail: '. $query;
    echo '<br/>';
    echo mysqli_error($db);
  }
}
