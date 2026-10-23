ALTER TABLE `learnerProfiles` ADD COLUMN IF NOT EXISTS `personalId` varchar(80);--> statement-breakpoint
ALTER TABLE `learnerProfiles` ADD COLUMN IF NOT EXISTS `phone` varchar(40);--> statement-breakpoint
ALTER TABLE `learnerProfiles` ADD COLUMN IF NOT EXISTS `bio` text;--> statement-breakpoint
ALTER TABLE `learnerProfiles` ADD COLUMN IF NOT EXISTS `professionalRole` varchar(160);--> statement-breakpoint
ALTER TABLE `learnerProfiles` ADD COLUMN IF NOT EXISTS `education` varchar(180);--> statement-breakpoint
ALTER TABLE `learnerProfiles` ADD COLUMN IF NOT EXISTS `learningGoal` varchar(240);--> statement-breakpoint
ALTER TABLE `learnerProfiles` ADD COLUMN IF NOT EXISTS `courseSpeed` varchar(40);
