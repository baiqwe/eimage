CREATE TABLE `credit_ledger` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`balance_after` integer NOT NULL,
	`batch_id` text,
	`task_id` text,
	`payment_id` text,
	`reason` text,
	`idempotency_key` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`batch_id`) REFERENCES `generation_batches`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`task_id`) REFERENCES `generation_tasks`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`payment_id`) REFERENCES `payment`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `credit_ledger_user_id_idx` ON `credit_ledger` (`user_id`);--> statement-breakpoint
CREATE INDEX `credit_ledger_batch_id_idx` ON `credit_ledger` (`batch_id`);--> statement-breakpoint
CREATE INDEX `credit_ledger_task_id_idx` ON `credit_ledger` (`task_id`);--> statement-breakpoint
CREATE INDEX `credit_ledger_idempotency_idx` ON `credit_ledger` (`idempotency_key`);--> statement-breakpoint
CREATE TABLE `generation_batches` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`project_id` text NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`locale` text DEFAULT 'zh' NOT NULL,
	`task_count` integer NOT NULL,
	`completed_task_count` integer DEFAULT 0 NOT NULL,
	`failed_task_count` integer DEFAULT 0 NOT NULL,
	`reserved_credits` integer DEFAULT 0 NOT NULL,
	`spent_credits` integer DEFAULT 0 NOT NULL,
	`provider` text,
	`idempotency_key` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `product_projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `generation_batches_user_id_idx` ON `generation_batches` (`user_id`);--> statement-breakpoint
CREATE INDEX `generation_batches_project_id_idx` ON `generation_batches` (`project_id`);--> statement-breakpoint
CREATE INDEX `generation_batches_status_idx` ON `generation_batches` (`status`);--> statement-breakpoint
CREATE INDEX `generation_batches_idempotency_idx` ON `generation_batches` (`idempotency_key`);--> statement-breakpoint
CREATE TABLE `generation_outputs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`project_id` text NOT NULL,
	`batch_id` text NOT NULL,
	`task_id` text NOT NULL,
	`storage_tier` text DEFAULT 'original' NOT NULL,
	`r2_key` text NOT NULL,
	`thumbnail_r2_key` text,
	`public_url` text,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`alt_text` text NOT NULL,
	`expires_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `product_projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`batch_id`) REFERENCES `generation_batches`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`task_id`) REFERENCES `generation_tasks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `generation_outputs_user_id_idx` ON `generation_outputs` (`user_id`);--> statement-breakpoint
CREATE INDEX `generation_outputs_project_id_idx` ON `generation_outputs` (`project_id`);--> statement-breakpoint
CREATE INDEX `generation_outputs_batch_id_idx` ON `generation_outputs` (`batch_id`);--> statement-breakpoint
CREATE INDEX `generation_outputs_task_id_idx` ON `generation_outputs` (`task_id`);--> statement-breakpoint
CREATE INDEX `generation_outputs_expires_at_idx` ON `generation_outputs` (`expires_at`);--> statement-breakpoint
CREATE TABLE `generation_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`project_id` text NOT NULL,
	`batch_id` text NOT NULL,
	`kind` text NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`style` text NOT NULL,
	`aspect_ratio` text NOT NULL,
	`resolution` text NOT NULL,
	`prompt` text NOT NULL,
	`negative_prompt` text,
	`reasoning` text,
	`reference_file_id` text,
	`provider_task_id` text,
	`provider_payload` text,
	`credit_cost` integer NOT NULL,
	`error_message` text,
	`started_at` integer,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `product_projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`batch_id`) REFERENCES `generation_batches`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reference_file_id`) REFERENCES `user_files`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `generation_tasks_user_id_idx` ON `generation_tasks` (`user_id`);--> statement-breakpoint
CREATE INDEX `generation_tasks_project_id_idx` ON `generation_tasks` (`project_id`);--> statement-breakpoint
CREATE INDEX `generation_tasks_batch_id_idx` ON `generation_tasks` (`batch_id`);--> statement-breakpoint
CREATE INDEX `generation_tasks_status_idx` ON `generation_tasks` (`status`);--> statement-breakpoint
CREATE INDEX `generation_tasks_provider_task_id_idx` ON `generation_tasks` (`provider_task_id`);--> statement-breakpoint
CREATE TABLE `product_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`locale` text DEFAULT 'zh' NOT NULL,
	`base_description` text NOT NULL,
	`source_file_id` text,
	`source_r2_key` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_file_id`) REFERENCES `user_files`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `product_projects_user_id_idx` ON `product_projects` (`user_id`);--> statement-breakpoint
CREATE INDEX `product_projects_source_file_id_idx` ON `product_projects` (`source_file_id`);--> statement-breakpoint
CREATE INDEX `product_projects_user_status_idx` ON `product_projects` (`user_id`,`status`);