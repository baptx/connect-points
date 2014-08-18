		<div id="content">
			<h1>Relier des points</h1>
			<p>Bienvenue sur l'accueil du module <b>ELAN</b>, <b><i>relier des points</i></b>.</p>
			<p>Vous pouvez créer un <a href="?edit">nouvel exercice</a> ou en sélectionner un déjà existant pour l'utiliser ou le modifier.</p>
<?php
	$query_result = $base->listQuery();
	
	if($query_result)
	{
		echo "			<p><ul>";
		foreach($query_result as $row)
		{
			$ref = $row["Reference"];
			$ref_html = htmlspecialchars($ref, ENT_QUOTES, "UTF-8");
			$ref_url = rawurlencode($ref); // on encode l'URL pour accéder à une référence si elle contient des caractères spéciaux comme '#' ou '&'
			// rawurlencode() est le standard d'encodage d'URL qui remplace l'ancienne fonction PHP urlencode() qui convertissait les espaces avec des '+' au lieu de '%20'
			echo "<li>".$ref_html." <a href=\"?reference=".$ref_url."\">lancer</a> <a href=\"?reference=".$ref_url."&edit\">éditer</a></li><br>\n			";
		}
		echo "</ul></p>\n		</div>\n";
	}
?>
