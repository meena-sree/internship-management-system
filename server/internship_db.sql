CREATE TABLE `applications` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `internship_id` int NOT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `status` enum('applied','interview','rejected','offered') DEFAULT 'applied',
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`application_id`),
  KEY `student_id` (`student_id`),
  KEY `internship_id` (`internship_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`internship_id`) ON DELETE CASCADE
  )
  
  CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `message` text,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
  )
  
  CREATE TABLE `internships` (
  `internship_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `duration` varchar(50) DEFAULT NULL,
  `skills_required` text,
  `company_id` int NOT NULL,
  `posted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`internship_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `internships_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
)

CREATE TABLE `internshipoffers` (
  `offer_id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `offered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`offer_id`),
  KEY `application_id` (`application_id`),
  CONSTRAINT `internshipoffers_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE
)

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','company') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
)

CREATE TABLE `tests` (
  `test_id` int NOT NULL AUTO_INCREMENT,
  `internship_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `time_limit` int DEFAULT '15',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`test_id`),
  KEY `internship_id` (`internship_id`),
  CONSTRAINT `tests_ibfk_1` FOREIGN KEY (`internship_id`) REFERENCES `internships` (`internship_id`) ON DELETE CASCADE
)

CREATE TABLE `testresults` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `test_id` int NOT NULL,
  `student_id` int NOT NULL,
  `score` int DEFAULT '0',
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`result_id`),
  UNIQUE KEY `unique_student_test` (`test_id`,`student_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `testresults_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`) ON DELETE CASCADE,
  CONSTRAINT `testresults_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
)

CREATE TABLE `testquestions` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `test_id` int NOT NULL,
  `question` text NOT NULL,
  `option1` varchar(255) NOT NULL,
  `option2` varchar(255) NOT NULL,
  `option3` varchar(255) NOT NULL,
  `option4` varchar(255) NOT NULL,
  `correct_answer` int NOT NULL,
  PRIMARY KEY (`question_id`),
  KEY `test_id` (`test_id`),
  CONSTRAINT `testquestions_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `tests` (`test_id`) ON DELETE CASCADE
)