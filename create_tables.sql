-- Create categories table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `color` varchar(7) DEFAULT '#6366f1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('checking','savings','investment','other') NOT NULL,
  `balance` int DEFAULT 0 NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
);

-- Create cards table
CREATE TABLE IF NOT EXISTS `cards` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `lastFourDigits` varchar(4),
  `creditLimit` int DEFAULT 0 NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `date` timestamp NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `categoryId` int NOT NULL,
  `description` text,
  `amount` int NOT NULL,
  `paymentMethod` enum('cash','debit','credit','transfer','other') NOT NULL,
  `accountId` int,
  `cardId` int,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`),
  FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`),
  FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`),
  FOREIGN KEY (`cardId`) REFERENCES `cards`(`id`)
);
