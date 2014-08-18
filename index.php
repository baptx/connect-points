<?php
	$base = 0; // permet de vérifier si l'accès à base.php se fait bien par la voie normale (pas de contournement possible)
	include("script/base.php");
	$base = new Base();
	
	if(isset($_GET["reference"])) if($_GET["reference"]) $reference = $_GET["reference"];
	if(isset($_GET["edit"])) $edit = true;
	$param = count($_GET);
	
	
	/** Configuration **/
	/**/
	
	$correction = ""; // spécifier comment doit se passer la correction: "js" (javascript) côté client ou côté serveur en Ajax/PHP si non renseigné ("")
	
	/**/
	/** Fin Configuration **/
	
	
	if(isset($reference))
	{
		if(isset($edit) || $correction == "js") $query_result = $base->selectAllQuery($reference);
		else $query_result = $base->selectTxtQuery($reference);
		
		// On récupère le contenu demandé à la base dans des variables
		foreach($query_result as $row)
		{
			$reference = $row["Reference"]; // on récupère la référence enregistrée dans la BDD pour obtenir les majuscules/minuscules exactes enregistrées
			$txtGauche = $row["TexteGauche"];
			$txtDroite = $row["TexteDroite"];
			if(isset($edit) || $correction == "js")
			{
				$repGauche = $row["ReponseGauche"];
				$repDroite = $row["ReponseDroite"];
			}
		}
	}
?>
<!DOCTYPE html>
<html lang="fr">
	<head>
		<meta charset="utf-8">
<?php
	// Si la demande était la page d'accueil
	if($param == 0)
		include("include/head_relier_points_accueil.inc.php");
	// Si l'utilisateur demande à éditer un exercice ou souhaite créer un nouvel exercice sans en modifier un existant (professeur)
	else if((isset($edit) && !isset($reference) && $param == 1) || (isset($edit) && isset($reference) && isset($txtGauche) && isset($txtDroite) && $param == 2))
		include("include/head_relier_points_admin.inc.php");
	// Si l'utilisateur fait une simple demande d'exercice (élève)
	else if(isset($reference) && isset($txtGauche) && isset($txtDroite) && $param == 1)
		include("include/head_relier_points.inc.php");
	// Si le contenu de la reference n'a pas été trouvée
	else if((isset($reference) && !isset($edit) && $param == 1) || (isset($reference) && isset($edit) && $param == 2))
		{include("include/head_relier_points_erreur.inc.php");}
	// Sinon on redirige à l'accueil
	else
		header("Location: ./");
?>
	</head>
	<body>
<?php
	if($param == 0) {
		include("include/body_relier_points_accueil.inc.php");
	}
	else if((isset($edit) && !isset($reference) && $param == 1) || (isset($edit) && isset($reference) && isset($txtGauche) && isset($txtDroite) && $param == 2)) {
		if(isset($reference)) $reference = json_encode($reference);
		include("include/body_relier_points_admin.inc.php");
		// Valeur de la variable sous format JSON pour eviter les attaques XSS, injection de code Javascript sur utilisateur du site
		// Attaque type index.php?reference=";alert("VIRUS!");var a=" contournée en "échappant" les caractères spéciaux par "\";alert(\"VIRUS!\");var a=\""
		// Dans le cas d'une injection de code HTML, on utilise la fonction PHP htmlspecialchars() ou htmlentities() au lieu de json_encode()
	}
	else if(isset($reference) && isset($txtGauche) && isset($txtDroite) && $param == 1) {
		$reference = json_encode($reference);
		include("include/body_relier_points.inc.php");
	}
	else {
		$reference = htmlspecialchars($reference, ENT_QUOTES, "UTF-8");
		include("include/body_relier_points_erreur.inc.php");
	}
?>
	</body>
</html>
