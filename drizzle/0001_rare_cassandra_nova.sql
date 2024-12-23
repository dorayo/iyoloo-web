CREATE TABLE `i_user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`clerk_id` varchar(50),
	`account` int,
	`nickname` varchar(50),
	`first_letter` varchar(50),
	`avatar` varchar(255),
	`region` varchar(100),
	`language` varchar(20),
	`e_mail` varchar(100),
	`password` varchar(100),
	`status` int DEFAULT 1,
	`online_state` int DEFAULT 0,
	`type` int DEFAULT 2,
	`invitee_user_id` int DEFAULT 0,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`last_login_time` timestamp,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	`last_ip` varchar(255),
	`platform` int,
	`ip_attribution` varchar(50),
	`is_pay_msg` int DEFAULT 1,
	`is_burn_pay_msg` int DEFAULT 1,
	CONSTRAINT `i_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_user_account` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`user_id` int,
	`gold_coin` decimal(10,2) DEFAULT '0.00',
	`character` int DEFAULT 0,
	`total_amount` decimal(10,2) DEFAULT '0.00',
	`vip_level` int DEFAULT 0,
	`vip_open` timestamp,
	`vip_expiration` timestamp,
	`vip_character` int DEFAULT 0,
	`free_msg` int DEFAULT 0,
	`free_img_msg` int DEFAULT 0,
	`fictitious_gift` int DEFAULT 0,
	`vague_num` int DEFAULT 0,
	`match_count` int DEFAULT 0,
	`version` bigint DEFAULT 0,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_user_account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_user_album` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`user_id` int,
	`url` varchar(255),
	`top` int,
	`ip` varchar(50),
	`ip_attribution` varchar(60),
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_user_album_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_user_black_list` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`admin_id` int,
	`user_id` int,
	`remark` varchar(255),
	`join_time` timestamp,
	`relieve_time` timestamp,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_user_black_list_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_user_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`user_id` int,
	`visitor` int DEFAULT 0,
	`fans` int DEFAULT 0,
	`follow` int DEFAULT 0,
	`friend` int DEFAULT 0,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_user_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_user_fans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`user_id` int,
	`fans_user_id` int,
	`type` int,
	`is_read` int DEFAULT 0,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_user_fans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_user_friend` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`user_id` int,
	`friend_user_id` int,
	`remark_name_id` int,
	`status` int,
	`remark` varchar(500),
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_user_friend_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_user_friend_name` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`user_id` int,
	`friend_user_id` int,
	`friend_remark_name` varchar(255),
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_user_friend_name_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_user_friend_profit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`user_id` int,
	`friend_user_id` int,
	`status` int,
	`profit_amount` decimal(10,2) DEFAULT '0.01',
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_user_friend_profit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_user_info` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`user_id` int,
	`birthday` timestamp,
	`age` int,
	`gender` int,
	`interest` varchar(255),
	`height` decimal(5,2),
	`weight` decimal(5,2),
	`occupation` varchar(50),
	`personal_sign` varchar(3000),
	`personal_sign_id` varchar(255),
	`back` varchar(255),
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_user_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_user_inquiry` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`user_id` int,
	`content` varchar(500),
	`reply` varchar(255),
	`status` int DEFAULT 0,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_user_inquiry_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_user_interact` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`user_id` int,
	`type` int,
	`other_user_id` int,
	`is_read` int DEFAULT 0,
	`record_id` int,
	`remark` varchar(500),
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_user_interact_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_user_set` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`user_id` int,
	`add_friend` int DEFAULT 1,
	`publish_support` int DEFAULT 1,
	`publish_comment` int DEFAULT 1,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_user_set_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_user_visitor` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`user_id` int,
	`visitor_user_id` int,
	`visitor_nickname` varchar(50),
	`visitor_avatar` varchar(255),
	`is_read` int DEFAULT 0,
	`date` timestamp,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_user_visitor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `i_user_account` ADD CONSTRAINT `i_user_account_user_id_i_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_album` ADD CONSTRAINT `i_user_album_user_id_i_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_black_list` ADD CONSTRAINT `i_user_black_list_user_id_i_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_data` ADD CONSTRAINT `i_user_data_user_id_i_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_fans` ADD CONSTRAINT `i_user_fans_user_id_i_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_fans` ADD CONSTRAINT `i_user_fans_fans_user_id_i_user_id_fk` FOREIGN KEY (`fans_user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_friend` ADD CONSTRAINT `i_user_friend_user_id_i_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_friend` ADD CONSTRAINT `i_user_friend_friend_user_id_i_user_id_fk` FOREIGN KEY (`friend_user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_friend_name` ADD CONSTRAINT `i_user_friend_name_user_id_i_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_friend_name` ADD CONSTRAINT `i_user_friend_name_friend_user_id_i_user_id_fk` FOREIGN KEY (`friend_user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_friend_profit` ADD CONSTRAINT `i_user_friend_profit_user_id_i_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_friend_profit` ADD CONSTRAINT `i_user_friend_profit_friend_user_id_i_user_id_fk` FOREIGN KEY (`friend_user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_info` ADD CONSTRAINT `i_user_info_user_id_i_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_inquiry` ADD CONSTRAINT `i_user_inquiry_user_id_i_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_interact` ADD CONSTRAINT `i_user_interact_user_id_i_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_interact` ADD CONSTRAINT `i_user_interact_other_user_id_i_user_id_fk` FOREIGN KEY (`other_user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_set` ADD CONSTRAINT `i_user_set_user_id_i_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_visitor` ADD CONSTRAINT `i_user_visitor_user_id_i_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `i_user_visitor` ADD CONSTRAINT `i_user_visitor_visitor_user_id_i_user_id_fk` FOREIGN KEY (`visitor_user_id`) REFERENCES `i_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `nickname_idx` ON `i_user` (`nickname`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `i_user` (`e_mail`);--> statement-breakpoint
CREATE INDEX `account_idx` ON `i_user` (`account`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `i_user` (`type`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `i_user_account` (`user_id`);--> statement-breakpoint
CREATE INDEX `vip_level_idx` ON `i_user_account` (`vip_level`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `i_user_album` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `i_user_black_list` (`user_id`);--> statement-breakpoint
CREATE INDEX `admin_id_idx` ON `i_user_black_list` (`admin_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `i_user_data` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `i_user_fans` (`user_id`);--> statement-breakpoint
CREATE INDEX `fans_user_id_idx` ON `i_user_fans` (`fans_user_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `i_user_friend` (`user_id`);--> statement-breakpoint
CREATE INDEX `friend_user_id_idx` ON `i_user_friend` (`friend_user_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `i_user_friend` (`status`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `i_user_friend_name` (`user_id`);--> statement-breakpoint
CREATE INDEX `friend_user_id_idx` ON `i_user_friend_name` (`friend_user_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `i_user_friend_profit` (`user_id`);--> statement-breakpoint
CREATE INDEX `friend_user_id_idx` ON `i_user_friend_profit` (`friend_user_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `i_user_info` (`user_id`);--> statement-breakpoint
CREATE INDEX `gender_idx` ON `i_user_info` (`gender`);--> statement-breakpoint
CREATE INDEX `age_idx` ON `i_user_info` (`age`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `i_user_inquiry` (`user_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `i_user_inquiry` (`status`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `i_user_interact` (`user_id`);--> statement-breakpoint
CREATE INDEX `other_user_id_idx` ON `i_user_interact` (`other_user_id`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `i_user_interact` (`type`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `i_user_set` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `i_user_visitor` (`user_id`);--> statement-breakpoint
CREATE INDEX `visitor_user_id_idx` ON `i_user_visitor` (`visitor_user_id`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `i_user_visitor` (`date`);