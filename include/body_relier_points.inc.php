		<script>
<?php
	if($correction == "js")
	{
		echo "			(function() {\n";
		echo "			var reference = $reference;\n";
		echo "			var txtGauche = $txtGauche;\n";
		echo "			var txtDroite = $txtDroite;\n";
		echo "			var repGauche = $repGauche;\n";
		echo "			var repDroite = $repDroite;\n";
		echo '			window.addEventListener("load", drawLoader = function(){draw.Loader(true, reference, txtGauche, txtDroite, repGauche, repDroite);});'."\n";
		echo "			})();\n";
	}
	else
	{
		echo "			(function() {\n";
		echo "			var reference = $reference;\n";
		echo "			var txtGauche = $txtGauche;\n";
		echo "			var txtDroite = $txtDroite;\n";
		echo '			window.addEventListener("load", drawLoader = function(){draw.Loader(true, reference, txtGauche, txtDroite);});'."\n";
		echo "			})();\n";
	}
?>
		</script>
		<noscript>Vous devez avoir Javascript activé pour utiliser ce module</noscript>
		<div id="infoTop">
			<div id="exo"></div>
<?php
		$ref_url = rawurlencode(json_decode($reference));
		echo "			<p>Revenir à l'<a href=\"./\">accueil</a> - Editer <a href=\"?reference=".$ref_url."&edit\">cet exercice</a> - Créer <a href=\"./?edit\">nouveau</a> - Recharger l'<a href=\"?reference=".$ref_url."\">exercice</a></p>\n";
?>
		</div>
		<div id="content">
			<div>
				<div id="divGauche" class="divText"></div>
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
				<div id="divDroite" class="divText"></div>
				<div>
					<button id="connection">Corriger</button>
				</div>
			</div>
			<div id="count"></div>
		</div>
		<div id="infoBottom"></div>
