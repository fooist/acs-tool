--
-- Database: `census_acs`
--

-- --------------------------------------------------------

--
-- Table structure for table `census_main`
--

DROP TABLE IF EXISTS `census_main`;

CREATE TABLE `census_main` (
  `prikey` bigint(20) AUTO_INCREMENT PRIMARY KEY,
  `file_id` varchar(16) NOT NULL,
  `file_type` varchar(16) NOT NULL,
  `state_abbrev` varchar(2) NOT NULL,
  `data_year` int(11) NOT NULL,
  `logrecno` varchar(8) NOT NULL,
  `geoid` varchar(255) NOT NULL,
  `data_object` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for table `census_main`
--
ALTER TABLE `census_main`
  ADD UNIQUE KEY `complete_logrecno` (`file_id`,`file_type`,`state_abbrev`,`data_year`,`logrecno`),
  ADD UNIQUE KEY `complete_geoid` (`geoid`,`file_id`,`file_type`,`data_year`),
  ADD KEY `geoid` (`geoid`);


