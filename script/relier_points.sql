SET NAMES utf8;

CREATE DATABASE IF NOT EXISTS elan
DEFAULT CHARACTER SET utf8
DEFAULT COLLATE utf8_general_ci;

USE elan;

CREATE TABLE IF NOT EXISTS relier_points (
Reference VARCHAR(50) UNIQUE,
TexteGauche VARCHAR(500),
TexteDroite VARCHAR(500),
ReponseGauche VARCHAR(300),
ReponseDroite VARCHAR(300));

INSERT INTO relier_points VALUES (
'demo',
'["la voiture","l''ordinateur","l''horloge","l''école","le vélo","les devoirs","les amis","la mer","les vacances","la casquette"]',
'["die Uhr","das Fahrrad","das Meer","der Computer","die Schule","die Hausaufgaben","die Ferien","die Freunde","die Mütze","das Auto"]',
'[1,2,3,4,5,6,7,8,9,10]',
'[10,4,1,5,2,6,8,3,7,9]');