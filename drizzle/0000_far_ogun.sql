CREATE TABLE `skips` (
	`id` text PRIMARY KEY NOT NULL,
	`wish_id` text NOT NULL,
	`visitor_id` text NOT NULL,
	`reason` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `one_skip` ON `skips` (`wish_id`,`visitor_id`);--> statement-breakpoint
CREATE TABLE `visitors` (
	`id` text PRIMARY KEY NOT NULL,
	`last_seen` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wishes` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`text` text NOT NULL,
	`mood` text NOT NULL,
	`night` text NOT NULL,
	`created_at` integer NOT NULL,
	`reveal_at` integer NOT NULL,
	`recipient_id` text,
	`assigned_at` integer,
	`reply` text,
	`replied_at` integer,
	`thanked` integer DEFAULT 0 NOT NULL,
	`sleeping` integer DEFAULT 0 NOT NULL,
	`bloomed` integer DEFAULT 0 NOT NULL,
	`outcome` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wish_per_night` ON `wishes` (`owner_id`,`night`);--> statement-breakpoint
CREATE INDEX `wish_recipient` ON `wishes` (`recipient_id`);--> statement-breakpoint
CREATE INDEX `wish_pool` ON `wishes` (`reply`,`recipient_id`);