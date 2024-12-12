CREATE TABLE `i_system_age` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`language` varchar(20),
	`age` varchar(50),
	`lower_limit` int,
	`upper_limit` int,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_age_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_system_brand` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`name` varchar(50),
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_brand_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_system_email_template` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`language` varchar(20),
	`code` int,
	`params` varchar(255),
	`html_txt` varchar(10000),
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_email_template_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_system_height` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`height` varchar(50),
	`language` varchar(20),
	`type` int,
	`lower_limit` int,
	`upper_limit` int,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_height_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_system_hobby` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`hobby` varchar(50),
	`language` varchar(20),
	`type` int,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_hobby_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_system_img_censor` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`url` varchar(300),
	`status` int DEFAULT 0,
	`type` int,
	`record_id` int,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_img_censor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_system_language` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`language` varchar(50),
	`code` varchar(20),
	`baidu_code` varchar(20),
	`chinese` varchar(20),
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_language_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_system_occupation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`occupation` varchar(200),
	`language` varchar(20),
	`type` int,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_occupation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_system_region` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`language` varchar(20),
	`region` varchar(100),
	`type` int,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_region_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_system_reply` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`type` int,
	`language` varchar(20),
	`content` varchar(500),
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_reply_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_system_sensitive` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`type` int,
	`content` varchar(500),
	`solve_type` int,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_sensitive_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_system_status_code` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`language` varchar(20),
	`code` int,
	`msg` varchar(200),
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_status_code_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_system_vip_privilege` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`vip_level` int,
	`type` int,
	`edit` int,
	`name` varchar(50),
	`describe` varchar(255),
	`logic` int,
	`privilege` int,
	`unit` int,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_vip_privilege_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `i_system_weight` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50) DEFAULT 'iyoloo',
	`weight` varchar(50),
	`language` varchar(20),
	`type` int,
	`lower_limit` int,
	`upper_limit` int,
	`insert_time` timestamp DEFAULT CURRENT_TIMESTAMP,
	`update_time` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_delete` int DEFAULT 0,
	`delete_time` timestamp,
	CONSTRAINT `i_system_weight_id` PRIMARY KEY(`id`)
);
