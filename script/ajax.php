<?php
/**
 * Server functions to receive AJAX requests
 *
 * Copyright (c) 2012 https://about.me/bhassenfratz
 * Licensed under MIT license http://opensource.org/licenses/MIT
 **/


if(isset($_POST["script"]))
{
	$base = 0; // vérifier si l'accès à base.php se fait bien par la voie normale (pas de contournement possible)
	include("base.php");
	$base = new Base();
	
	new Ajax($base);
}
else {
	echo "Echec"; // Possibilité de personnaliser le message dans le cas ou les données n'auraient pas été reçues correctement (ex. contournement de l'envoi par la méthode GET)
}

class Ajax
{
	private $base;
	
	public function Ajax($base)
	{
		$this->base = $base;
		
		$script = $_POST["script"];
		
		$reference = $_POST["reference"];
		
		if($script == "correct" || $script == "insert") {
			$ptGauche = json_decode($_POST["repGauche"]); // Convertit les chaînes de caractères (format JSON) en tableau
			$ptDroite = json_decode($_POST["repDroite"]); // Utilisation de la méthode POST uniquement ($GET -> Accès depuis URL / $REQUEST -> Accès depuis POST ou GET)
		}
		if($script == "insert") {
			$txtGauche = json_decode($_POST["motGauche"]);
			$txtDroite = json_decode($_POST["motDroite"]);
		}
		
		switch($script)
		{
			case "correct":
				$this->correct($reference, $ptGauche, $ptDroite);
				break;
			case "insert":
				$this->insert($reference, $ptGauche, $ptDroite, $txtGauche, $txtDroite);
				break;
			case "delete":
				$this->delete($reference);
				break;
		}
	}
	
	private function correct($reference, $ptGauche, $ptDroite)
	{
		if($reference && $ptGauche && $ptDroite) // Si les données ont bien été reçues
		{
			$query_result = $this->base->selectAllQuery($reference);
			
			foreach($query_result as $row)
			{
				$txtGauche = json_decode($row["TexteGauche"]);
				$txtDroite = json_decode($row["TexteDroite"]);
				$ReponseGauche = json_decode($row["ReponseGauche"]);
				$ReponseDroite = json_decode($row["ReponseDroite"]);
			}
			
			if($ReponseGauche && $ReponseDroite)
			{
				$ptFaux = array(); // Création du tableau d'erreurs à retourner au module
				
				// Algorithme permettant de remplir un tableau d'erreurs en comparant les points reliés par l'utilisateur avec la correction du serveur
				// Le contenu du tableau d'erreurs est du type [pointGauche, pointDroite, pointGauche, point Droite...])
				
				if(count($txtGauche) >= count($txtDroite)) // si il y a plus de mots à gauche qu'à droite ou bien égalité, c'est le tableau de points gauche qui est utilisé comme référence pour créer un tableau d'erreurs
				{
					for($i = 0; $i < count($ReponseGauche); $i++) { // On parcours le tableau de correction des points GAUCHE
						for($j = 0; $j < count($ptGauche); $j++) { // On parcours le tableau rempli des points GAUCHE
							if($ReponseGauche[$i] == $ptGauche[$j]) // On part du même point GAUCHE pour le tableau rempli (l'utilisateur ne relie pas forcément les points dans l'ordre)
							{
								if($ReponseDroite[$i] != $ptDroite[$j]) // Si point DROITE du tableau de correction n'est pas égal au point DROITE du tableau rempli
								{
									$ptFaux[] = $ptGauche[$j]; // On ajoute le point GAUCHE du tableau rempli dans celui des erreurs
									$ptFaux[] = $ptDroite[$j]; // On ajoute le point DROITE du tableau rempli dans celui des erreurs
								}
								break; // On passe au point GAUCHE suivant, inutile de chercher plus loin
							}
						}
					}
				}
				else // si il y a plus de mots à droite, c'est le tableau de points droite qui est utilisé comme référence pour créer un tableau d'erreurs
				{
					for($i = 0; $i < count($ReponseDroite); $i++) {
						for($j = 0; $j < count($ptDroite); $j++) {
							if($ReponseDroite[$i] == $ptDroite[$j])
							{
								if($ReponseGauche[$i] != $ptGauche[$j])
								{
									$ptFaux[] = $ptGauche[$j];
									$ptFaux[] = $ptDroite[$j];
								}
								break;
							}
						}
					}
				}
				
				echo json_encode($ptFaux); // Retourne le tableau d'erreurs sous format JSON (string) pour pouvoir être traité en Javascript
			}
			else {
				echo 1;
			}
		}
		else {
			echo "Données corrompues";
		}
	}
	
	private function insert($reference, $ptGauche, $ptDroite, $txtGauche, $txtDroite)
	{
		if($reference && $txtGauche && $txtDroite && $ptGauche && $ptDroite)
		{
			// création des nouveaux tableaux de points gauche et droite
			$new_ptGauche = array();
			$new_ptDroite = array();
			
			// Algorithme permettant de trier les tableaux de points pour que les mots de gauche correspondent à l'ordre des points de gauche enregistrés
			
			if(count($txtGauche) >= count($txtDroite)) // si il y a plus de mots à gauche qu'à droite ou bien égalité, c'est le tableau de points gauche qui est utilisé comme référence, trié dans l'ordre [1,2,3,4...]
			{
				while(count($new_ptGauche) != count($ptGauche)) { // Tant que la taille du tableau de points GAUCHE trié n'est pas égal à la taille du tableau de points GAUCHE
					for($i = 0; $i < count($ptGauche); $i++) { // On parcours le tableau de points GAUCHE
						if($ptGauche[$i] == count($new_ptGauche) + 1) // Si la valeur du point GAUCHE = taille du tableau de points GAUCHE trié + 1 (car taille nulle par défaut et on souhaite commencer le tri par le point 1)
						{
							$new_ptGauche[] = $ptGauche[$i]; // On ajoute le point GAUCHE dans le tableau des points GAUCHE triés
							$new_ptDroite[] = $ptDroite[$i]; // On ajoute le point DROITE dans le tableau des points DROITE triés
						}
					}
				}
			}
			else // si il y a plus de mots à droite, c'est le tableau de points droite qui est utilisé comme référence, trié dans l'ordre [1,2,3,4...]
			{
				while(count($new_ptDroite) != count($ptDroite)) {
					for($i = 0; $i < count($ptDroite); $i++) {
						if($ptDroite[$i] == count($new_ptDroite) + 1)
						{
							$new_ptGauche[] = $ptGauche[$i];
							$new_ptDroite[] = $ptDroite[$i];
						}
					}
				}
			}
			
			// On enregistre les tableaux sous format JSON, ce qui permet de sérialiser les informations (chaînes de caractères) et d'éviter les attaques XSS
			// la chaîne de caractère $reference n'est pas enregistrée sous format JSON afin de faciler les recherches dans la BDD
			// (le champ Reference de la table relier_poins stocke les valeurs sous forme nomdereference au lieu de "nomdereference")
			$txtGauche = json_encode($txtGauche);
			$txtDroite = json_encode($txtDroite);
			$new_ptGauche = json_encode($new_ptGauche);
			$new_ptDroite = json_encode($new_ptDroite);
			
			$query_result = $this->base->insertQuery($reference, $txtGauche, $txtDroite, $new_ptGauche, $new_ptDroite);
			
			if($query_result == true)
				echo "Exercice <span class=\"ref\">".htmlspecialchars($reference, ENT_QUOTES, "UTF-8")."</span> reçu";
			else 
				echo 1;
			// htmlspecialchars() evite l'injection XSS (ex. redirection <img src="a" onerror="window.location = 'http://google.com'">)
			// les balises HTML sont remplacées par leurs entités <> -> &lt;b&gt; (encoder les doubles et simples quotes avec ENT_QUOTES, encodage UTF-8 par défaut depuis PHP 5.4.0)
		}
		else {
			echo "Données corrompues";
		}
	}
	
	private function delete($reference)
	{
		if($reference)
		{
			$query_result = $this->base->deleteQuery($reference);
			
			if($query_result == true)
				echo "Exercice <span class=\"ref\">".htmlspecialchars($reference, ENT_QUOTES, "UTF-8")."</span> supprimé";
			else
				echo 1;
		}
		else {
			echo "Données corrompues";
		}
	}
}
?>
