const mysql = require('mysql')

const createTableQuery = `create table if not exists geographies
	(id primary key auto_increment not null,
		file_id varchar(10),
		file varchar(255),
		state varchar(2), 
		logrecno varchar(255),

