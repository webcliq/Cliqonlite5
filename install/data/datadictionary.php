<?php

$sqla = `CREATE TABLE "dbcollection" (
	"id"			INTEGER PRIMARY KEY AUTOINCREMENT,
	"c_reference"	TEXT NOT NULL DEFAULT 'ref',
	"c_type"		TEXT NOT NULL DEFAULT 'string',
	"c_category"	TEXT,
	"c_document"	TEXT DEFAULT '{}',
	"c_notes"		TEXT
)`;

R::exec($sqla);

$sqlb = `CREATE TABLE "dbitem" (
	"id"			INTEGER PRIMARY KEY AUTOINCREMENT,
	"c_reference"	TEXT NOT NULL DEFAULT 'ref',
	"c_type"		TEXT NOT NULL DEFAULT 'string',
	"c_category"	TEXT,
	"c_document"	TEXT DEFAULT '{}',
	"c_notes"		TEXT
)`;

R::exec($sqlb);

$sqlc = `CREATE TABLE "dbuser" (
	"id"			INTEGER PRIMARY KEY AUTOINCREMENT,
	"c_username"	TEXT NOT NULL DEFAULT 'ref',
	"c_password"	TEXT NOT NULL,
	"c_type"		TEXT NOT NULL DEFAULT 'operator',
	"c_category"	TEXT,
	"c_document"	TEXT DEFAULT '{}',
	"c_notes"		TEXT
)`;

R::exec($sqlc);

$sqld = `CREATE TABLE "dblog" (
	"id"			INTEGER PRIMARY KEY AUTOINCREMENT,
	"c_reference"	text NOT NULL DEFAULT 'log(0)',
	"c_type"		text NOT NULL DEFAULT 'admin:function',
	"c_category"	text NOT NULL DEFAULT 'access',
	"c_document"	TEXT,
	"c_notes"		TEXT
)`;

R::exec($sqld);