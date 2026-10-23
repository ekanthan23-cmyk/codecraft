CREATE TABLE `learnerActivityEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventType` varchar(60) NOT NULL,
	`description` varchar(240) NOT NULL,
	`occurredAt` bigint NOT NULL,
	CONSTRAINT `learnerActivityEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learnerProfiles` (
	`userId` int NOT NULL,
	`targetRole` varchar(120),
	`learningStreak` int NOT NULL DEFAULT 0,
	`totalCraftPoints` int NOT NULL DEFAULT 0,
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `learnerProfiles_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `learningPaths` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`courseTitle` varchar(180) NOT NULL,
	`currentLessonTitle` varchar(180),
	`completedLessons` int NOT NULL DEFAULT 0,
	`totalLessons` int NOT NULL DEFAULT 0,
	`progressPercent` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `learningPaths_id` PRIMARY KEY(`id`),
	CONSTRAINT `learning_paths_user_course_unique` UNIQUE(`userId`,`courseSlug`)
);
--> statement-breakpoint
CREATE TABLE `lessonProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(120) NOT NULL,
	`lessonSlug` varchar(150) NOT NULL,
	`lessonTitle` varchar(180) NOT NULL,
	`status` enum('not_started','in_progress','complete') NOT NULL DEFAULT 'not_started',
	`progressPercent` int NOT NULL DEFAULT 0,
	`completedAt` bigint,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `lessonProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `lesson_progress_user_lesson_unique` UNIQUE(`userId`,`lessonSlug`)
);
--> statement-breakpoint
CREATE TABLE `practiceProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`problemSlug` varchar(160) NOT NULL,
	`problemTitle` varchar(220) NOT NULL,
	`topic` varchar(80),
	`difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'easy',
	`status` enum('attempted','solved') NOT NULL DEFAULT 'attempted',
	`attempts` int NOT NULL DEFAULT 0,
	`solvedAt` bigint,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `practiceProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `practice_progress_user_problem_unique` UNIQUE(`userId`,`problemSlug`)
);
--> statement-breakpoint
CREATE TABLE `studentNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`content` text NOT NULL,
	`courseSlug` varchar(120),
	`lessonSlug` varchar(150),
	`tagsJson` text,
	`isPinned` int NOT NULL DEFAULT 0,
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `studentNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `workspaceDrafts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonSlug` varchar(150) NOT NULL,
	`language` varchar(40) NOT NULL,
	`sourceCode` text NOT NULL,
	`outputText` text,
	`lastRunAt` bigint,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `workspaceDrafts_id` PRIMARY KEY(`id`),
	CONSTRAINT `workspace_drafts_user_lesson_unique` UNIQUE(`userId`,`lessonSlug`)
);
--> statement-breakpoint
ALTER TABLE `learnerActivityEvents` ADD CONSTRAINT `learnerActivityEvents_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learnerProfiles` ADD CONSTRAINT `learnerProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learningPaths` ADD CONSTRAINT `learningPaths_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessonProgress` ADD CONSTRAINT `lessonProgress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `practiceProgress` ADD CONSTRAINT `practiceProgress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studentNotes` ADD CONSTRAINT `studentNotes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workspaceDrafts` ADD CONSTRAINT `workspaceDrafts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `learner_activity_user_time_idx` ON `learnerActivityEvents` (`userId`,`occurredAt`);--> statement-breakpoint
CREATE INDEX `learning_paths_user_updated_idx` ON `learningPaths` (`userId`,`updatedAt`);--> statement-breakpoint
CREATE INDEX `lesson_progress_user_course_idx` ON `lessonProgress` (`userId`,`courseSlug`);--> statement-breakpoint
CREATE INDEX `practice_progress_user_status_idx` ON `practiceProgress` (`userId`,`status`);--> statement-breakpoint
CREATE INDEX `student_notes_user_updated_idx` ON `studentNotes` (`userId`,`updatedAt`);--> statement-breakpoint
CREATE INDEX `workspace_drafts_user_updated_idx` ON `workspaceDrafts` (`userId`,`updatedAt`);