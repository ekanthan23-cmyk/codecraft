CREATE TABLE `projectSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`userId` int NOT NULL,
	`submissionNote` text,
	`attachmentKey` varchar(800),
	`attachmentUrl` varchar(1000),
	`attachmentName` varchar(260),
	`submittedAt` bigint NOT NULL,
	CONSTRAINT `projectSubmissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentProjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`techStackJson` text,
	`repositoryUrl` varchar(700),
	`demoUrl` varchar(700),
	`status` enum('draft','submitted','published') NOT NULL DEFAULT 'draft',
	`submittedAt` bigint,
	`publishedAt` bigint,
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `studentProjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentResourceSaves` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`resourceId` varchar(160) NOT NULL,
	`savedAt` bigint NOT NULL,
	CONSTRAINT `studentResourceSaves_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_resource_saves_user_resource_unique` UNIQUE(`userId`,`resourceId`)
);
--> statement-breakpoint
CREATE TABLE `tutorConversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`topic` varchar(80) NOT NULL DEFAULT 'general',
	`workspaceTool` varchar(40),
	`createdAt` bigint NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `tutorConversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tutorMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('student','assistant') NOT NULL,
	`content` text NOT NULL,
	`createdAt` bigint NOT NULL,
	CONSTRAINT `tutorMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workshopEnrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workshopSlug` varchar(160) NOT NULL,
	`workshopTitle` varchar(220) NOT NULL,
	`workshopDate` bigint NOT NULL,
	`joinedAt` bigint NOT NULL,
	CONSTRAINT `workshopEnrollments_id` PRIMARY KEY(`id`),
	CONSTRAINT `workshop_enrollments_user_workshop_unique` UNIQUE(`userId`,`workshopSlug`)
);
--> statement-breakpoint
ALTER TABLE `projectSubmissions` ADD CONSTRAINT `projectSubmissions_projectId_studentProjects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `studentProjects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectSubmissions` ADD CONSTRAINT `projectSubmissions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studentProjects` ADD CONSTRAINT `studentProjects_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studentResourceSaves` ADD CONSTRAINT `studentResourceSaves_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tutorConversations` ADD CONSTRAINT `tutorConversations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tutorMessages` ADD CONSTRAINT `tutorMessages_conversationId_tutorConversations_id_fk` FOREIGN KEY (`conversationId`) REFERENCES `tutorConversations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tutorMessages` ADD CONSTRAINT `tutorMessages_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workshopEnrollments` ADD CONSTRAINT `workshopEnrollments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `project_submissions_project_time_idx` ON `projectSubmissions` (`projectId`,`submittedAt`);--> statement-breakpoint
CREATE INDEX `project_submissions_user_time_idx` ON `projectSubmissions` (`userId`,`submittedAt`);--> statement-breakpoint
CREATE INDEX `student_projects_user_updated_idx` ON `studentProjects` (`userId`,`updatedAt`);--> statement-breakpoint
CREATE INDEX `student_projects_user_status_idx` ON `studentProjects` (`userId`,`status`);--> statement-breakpoint
CREATE INDEX `student_resource_saves_user_time_idx` ON `studentResourceSaves` (`userId`,`savedAt`);--> statement-breakpoint
CREATE INDEX `tutor_conversations_user_updated_idx` ON `tutorConversations` (`userId`,`updatedAt`);--> statement-breakpoint
CREATE INDEX `tutor_messages_conversation_time_idx` ON `tutorMessages` (`conversationId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `tutor_messages_user_time_idx` ON `tutorMessages` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `workshop_enrollments_user_date_idx` ON `workshopEnrollments` (`userId`,`workshopDate`);