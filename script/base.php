<?php
/**
 * Database connection and requests
 *
 * Copyright (c) 2012 https://www.linkedin.com/in/bhassenfratz
 * Licensed under MIT license http://opensource.org/licenses/MIT
 **/


if(isset($base)) // on vérifie si l'accès à base.php se fait bien par la voie normale (pas de contournement possible)
{
	class Base
	{
		private $con;
		
		public function __construct()
		{
			// Activer mode debug du serveur
			/*ini_set('display_errors', 'On');
			error_reporting(E_ALL | E_STRICT);*/
			
			// Déboguage avec FirePHP
			/*require_once('/var/www/FirePHPCore/FirePHP.class.php');
			ob_start();
			$firephp = FirePHP::getInstance(true);*/
			
			
			// utilisation de l'extension PDO (PHP Data Objects) pour la connexion à la base de données (inclu dans PHP 5.1+, paramètre encodage UTF-8 à partir de 5.3.6)
			$this->con = new PDO("mysql:host=localhost;dbname=elan;charset=utf8", "username", "password", array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
																								   PDO::ATTR_EMULATE_PREPARES => false));
																								   
			// création d'un objet PDO pour la connexion à la BDD (MySQL sur serveur local en utilisant la base elan avec encodage UTF-8, utilisateur, mot de passe)
			// PDO::ERRMODE_EXCEPTION -> tenir compte des erreurs de communications PDO, mauvaises requêtes SQL avec la base (try/catch)
		}
		
		public function __destruct()
		{
			$this->con = null;
		}
		
		private function preparedStmt($sql, $array) // Si l'utilisateur injecte des données dans la requête SQL
		{
			try
			{
				$stmt = $this->con->prepare($sql); // le serveur recoit la requête préparée (prepared statement), sécurité, évite injection SQL
				$stmt->execute($array); // on insère les variables dans la requête préparée
				
				//$select_query = $base->query("SELECT Reference, TexteGauche, TexteDroite FROM relier_points WHERE Reference = '$reference'");// injection SQL possible
				// si "index.php?reference=demo'" signale qu'il y a une erreur dans la syntaxe SQL, il est possible d'exploiter la base
				// exemple si index.php?reference=' OR (SELECT COUNT(*) FROM personnes)>10 AND ''=' affiche un exercice, le serveur confirme que qu'il y a plus de 10 utilisateurs dans la base de données
				// on peut s'amuser à chercher le mot de pase de Bob index.php?reference=' OR EXISTS(SELECT * FROM personnes WHERE nom = 'bob' AND motdepasse LIKE '%123%') AND ''='
				
				return $stmt;
			}
			catch(PDOException $ex) {
				echo -1; // Affiche un message s'il y a une erreur de connexion à la base, traitement du code de réponse côté client, en Javascript
				//echo $ex->getMessage(); // Renvoie une erreur classique
			}
		}
		
		private function savedQuery($sql) // Si la requête SQL est écrite en dur dans le code PHP et doit retourner un résultat
		{
			try
			{
				$stmt = $this->con->query($sql);
				
				return $stmt;
			}
			catch(PDOException $ex) {
				echo -1;
			}
		}
		
		private function savedExec($sql) // Si la requête SQL est écrite en dur dans le code PHP et ne retourne pas de résultat
		{
			try
			{
				$stmt = $this->con->exec($sql);
				
				return $stmt;
			}
			catch(PDOException $ex) {
				echo -1;
			}
		}
		
		public function selectTxtQuery($reference)
		{
			$sql = "SELECT Reference, TexteGauche, TexteDroite FROM relier_points WHERE Reference=?";
			$array = array($reference);
			$result = $this->preparedStmt($sql, $array);
			
			return $result;
		}
		
		public function selectAllQuery($reference)
		{
			$sql = "SELECT Reference, TexteGauche, TexteDroite, ReponseGauche, ReponseDroite FROM relier_points WHERE Reference=?";
			$array = array($reference);
			$result = $this->preparedStmt($sql, $array);
			
			return $result;
		}
		
		public function insertQuery($reference, $txtGauche, $txtDroite, $new_ptGauche, $new_ptDroite)
		{
			// INSERT ... ON DUPLICATE KEY UPDATE (fonction spécifique MySQL, compatible MySQL 4.1+)
			// on ajoute un nouvel exercice, s'il existe déjà on le modifie (nécessite d'avoir définit l'attribut UNIQUE pour le champ Reference)
			
			$sql = "INSERT INTO relier_points VALUES(:ref,:txtg,:txtd,:ptg,:ptd)
					ON DUPLICATE KEY UPDATE TexteGauche=:txtg2,TexteDroite=:txtd2,ReponseGauche=:ptg2,ReponseDroite=:ptd2";
			$array = array(':ref'=>$reference,':txtg'=>$txtGauche,':txtg2'=>$txtGauche,':txtd'=>$txtDroite,':txtd2'=>$txtDroite,
						   ':ptg'=>$new_ptGauche,':ptg2'=>$new_ptGauche,':ptd'=>$new_ptDroite,':ptd2'=>$new_ptDroite);
			$result = $this->preparedStmt($sql, $array);
			
			return $result;
		}
		
		public function deleteQuery($reference)
		{
			$sql = "DELETE FROM relier_points WHERE Reference=?";
			$array = array($reference);
			$result = $this->preparedStmt($sql, $array);
			
			return $result;
		}
		
		public function listQuery()
		{
			$sql = "SELECT Reference FROM relier_points";
			$result = $this->savedQuery($sql);
			
			return $result;
		}
	}
}
else {
	echo "Echec";
}
?>
