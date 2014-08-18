		<script>
<?php
	if(isset($reference)) // Si l'utilisateur demande à éditer le module (professeur)
	{
		echo "			(function() {\n";
		//echo '			var reference = "'.$reference.'";'."\n";
		echo "			var reference = $reference;\n"; // impression de la variable sous format JSON, pas besoin de guillements autour de la variable
		echo "			var txtGauche = $txtGauche;\n"; // impression d'un tableau impossible, on laisse au format JSON (notation automatiquement prise comme tableau par Javascript)
		echo "			var txtDroite = $txtDroite;\n";
		echo "			var repGauche = $repGauche;\n";
		echo "			var repDroite = $repDroite;\n";
		echo '			window.addEventListener("load", drawLoader = function(){draw.Loader(false, reference, txtGauche, txtDroite, repGauche, repDroite);});'."\n";
		// ajout énénement addEventListener load pour l'initialisation (window pour la fênetre entière != document) car window.onload ne peut être appelé qu'une seule fois
		echo "			})();\n";
	}
	else // Si l'utilisateur souhaite créer un nouvel exercice (sans en modifier un existant)
	{
		echo '			window.addEventListener("load", drawLoader = function(){draw.Loader(false);});'."\n";
	}
?>
		</script>
		<noscript>Vous devez avoir Javascript activé pour utiliser ce module</noscript>
		<div id="infoTop">
			<div id="exo"></div>
<?php
	if(isset($reference)) {
		$ref_url = rawurlencode(json_decode($reference));
		echo "			<p>Revenir à l'<a href=\"./\">accueil</a> - Lancer <a href=\"?reference=".$ref_url."\">cet exercice</a> - Créer <a href=\"./?edit\">nouveau</a> - Recharger l'<a href=\"?reference=".$ref_url."&edit\">exercice</a></p>\n";
	}
	else {
		echo "			<p>Revenir à l'<a href=\"./\">accueil</a> - Créer <a href=\"./?edit\">nouveau</a>\n";
	}
?>
		</div>
		<div id="content">
			<div>
				<div id="divGauche" class="inputText"></div>
				<div>
					<button id="del" class="ToolBtn"><img src="image/scissors_ready.gif"></button>
				</div>
			</div>
			<div>
				<div id="AlertContainer"></div>
				<div>
					<canvas id="canvas" width="300" height="440">
					Votre navigateur ne supporte pas l'élément canvas.
					<!-- message pour les navigateurs ne supportant pas encore canvas -->
					</canvas>
				</div>
				<div>
					<button id="back" class="RestoreBtn"><img src="image/undo.gif"></button>
					<button id="forward" class="RestoreBtn"><img src="image/redo.gif"></button>
				</div>
			</div>
			<div>
				<div id="divDroite" class="inputText"></div>
				<div>
					<button id="connection">Envoyer</button>
				</div>
			</div>
			<div id="count"></div>
		</div>
		<div id="infoBottom">
			<p>Référence exercice : <input type="text" id="Reference"><br><br>
			Exemple : GRAM-01 pour la catégorie grammaire, exercice n°1</p>
			<p>Pour supprimer l'exercice, cliquez sur la gomme <button id="eraser"><img src="image/eraser.gif"></button></p>
		</div>
