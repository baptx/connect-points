/**
 * Connect points
 * Draw and save data, correction tools
 *
 * Using HTML5 Canvas element & JavaScript
 *
 * Copyright (c) 2012 Baptiste Hassenfratz
 * Licensed under MIT license http://opensource.org/licenses/MIT
 **/


var draw = new Draw();


function Draw() // Constructeur de la classe
{
	// Attributs (privés)
	
	// Attributs permettant l'accès aux éléments du module
	var canvas;
	var context;
	var btnBack;
	var btnForward;
	var btnConnection;
	var btnDelete;
	var btnEraser;
	var divGauche;
	var divDroite;
	var alertContainer;
	// Suppléments débogage
	var divCoordonnees;
	var btnReset;
	
	// Attributs contenant les données du module
	var sens;
	var del;
	var imgParent;
	var msgBox;
	var multisel;
	var canvasClickX;
	var canvasClickY;
	var offsetCanvasX;
	var offsetCanvasY;
	var intervalPtY;
	var offsetPtX;
	var image;
	var ptGauche;
	var ptDroite;
	var ptGaucheBak;
	var ptDroiteBak;
	var coefdir;
	var coefdirBak;
	var tabDataURL;
	var reference;
	var repGauche;
	var repDroite;
	var color;
	var colorError;
	var cursor;
	// Suppléments Elève
	var user;
	var correction;
	var ptFaux;
	// Suppléments Professeur
	var nbGauche;
	var nbDroite;
	var nbMax;
	// Suppléments débogage
	var dbg;
	
	
	// Méthodes (publiques -> this; privées -> variable locale var)
	
	// Fonction permettant d'initialiser tous les éléments et paramètres de la classe (nécessite d'être déclenché sur l'événement load de l'objet window)
	this.Loader = function draw_Loader(usr, ref, txtg, txtd, repg, repd)
	{
		window.removeEventListener("load", drawLoader);
		
		if(usr) // Détecter s'il s'agit de l'interface utilisateur ou administrateur
			user = true;
		else
			user = false;
		
		
		/** Configuration **/
		/**/
		
		// nombres de mots par défaut à gauche et droite pour la création d'un nouvel exercice
		nbGauche = 5;
		nbDroite = 5;
		
		// utilisation du plugin debug.js (console événements, coordonnées canvas, bouton reset)
		if(user) dbg = true; // true ou false pour la page utilisateur
		if (!user) dbg = true // true ou false pour la page administrateur
		
		// couleur tracés + erreurs
		color = "#ff0000";
		colorError = "#000000";
		
		/**/
		/** Fin Configuration **/
		
		
		// on récupère l'accès aux éléments dans des variables
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		btnBack = document.getElementById("back");
		btnForward = document.getElementById("forward");
		btnConnection = document.getElementById("connection");
		btnDelete = document.getElementById("del");
		if(!user) btnEraser = document.getElementById("eraser");
		alertContainer = document.getElementById("AlertContainer");
		
		// messages d'erreurs dans le cas où le canvas ou son contexte n'existent pas
		if(!canvas) {
			alert("Impossible de récupérer le canvas");
			return;
		}
		if(!context) {
			alert("Impossible de récupérer le contexte du canvas");
			return;
		}

		if (window.getComputedStyle(canvas).getPropertyValue("cursor") == "auto")
			cursor = false;
		else
			cursor = true;

		// on récupère le contenu de la connexion au serveur si disponible et on génère les éléments du module
		
		var txtGauche, txtDroite;
		
		if(ref, txtg, txtd)
		{			
			reference = ref;
			txtGauche = txtg;
			txtDroite = txtd;
			
			if(repg, repd) {
				repGauche = repg.slice(0);
				repDroite = repd.slice(0);
				
				if(user) correction = "js";
			}
			
			nbGauche = txtGauche.length;
			nbDroite = txtDroite.length;
		}
		
		// On affiche la référence de l'exercice pour l'utilisateur
		if(reference) document.getElementById("exo").innerHTML = "<p>Exercice <span class=\"ref\">" + htmlspecialchars(reference) + "</span></p>";
		// innerHTML nécessaire au lieu de nodeValue pour que le code HTML <b> soit pris en compte et non affiché seulement (&lt;b&gt;)
		// htmlspecialchars() fonction additionnelle du fichier htmlspecialchars.js car existante sous PHP uniquement, evite l'injection de code XSS
		
		// calcul du nombre maximum de points à gauche ou à droite du canvas
		if(nbGauche >= nbDroite)
			nbMax = nbGauche;
		else
			nbMax = nbDroite;
		
		if(nbGauche != nbDroite)
			multisel = true;
		else
			multisel = false;
		
		intervalPtY = 40; // espace en pixels (axe des ordonnées) entre les différents points du canvas
		offsetPtX = 40; // espace en pixels (axe des abscisses) entre les points et les bords gauche et droit du canvas
		
		// On redimenssionne le canvas en fonction du nombre de points maximum
		canvas.height = nbMax * intervalPtY + intervalPtY;
		
		divGauche = document.getElementById("divGauche");
		divDroite = document.getElementById("divDroite");
		
		if(user)
		{
			for(var i = 1; i <= nbGauche; i++) {
				divGauche.appendChild(document.createElement("div"));
				divGauche.lastChild.setAttribute("id", "Gauche"+i);
				if(txtGauche) divGauche.lastChild.appendChild(document.createTextNode(txtGauche[i-1]));
			}
			for(var i = 1; i <= nbDroite; i++) {
				divDroite.appendChild(document.createElement("div"));
				divDroite.lastChild.setAttribute("id", "Droite"+i);
				if(txtDroite) divDroite.lastChild.appendChild(document.createTextNode(txtDroite[i-1]));
			}
		}
		else
		{
			for(var i = 1; i <= nbGauche; i++) {
				divGauche.appendChild(document.createElement("input"));
				divGauche.lastChild.setAttribute("type", "text");
				divGauche.lastChild.setAttribute("id", "Gauche"+i);
				if(txtGauche) divGauche.lastChild.setAttribute("value", txtGauche[i-1]);
				divGauche.appendChild(document.createElement("br"));
			}
			for(var i = 1; i <= nbDroite; i++) {
				divDroite.appendChild(document.createElement("input"));
				divDroite.lastChild.setAttribute("type", "text");
				divDroite.lastChild.setAttribute("id", "Droite"+i);
				if(txtDroite) divDroite.lastChild.setAttribute("value", txtDroite[i-1]);
				divDroite.appendChild(document.createElement("br"));
			}
			
			if(reference) document.getElementById("Reference").value = reference;
		}
		
		
		// calcul le décalage du canvas par rapport à la partie haute gauche de la page web
		
		offsetCanvasX = canvas.offsetLeft;
		offsetCanvasY = canvas.offsetTop;
		while(canvas = canvas.offsetParent) {
			offsetCanvasX += canvas.offsetLeft;
			offsetCanvasY += canvas.offsetTop;
		}
		canvas = document.getElementById("canvas"); // on réassigne la variable du canvas à la fin du traitement
		
		// initialisation de variables
		
		image = document.createElement("img");
		
		ptGauche = [];
		ptDroite = [];
		coefdir = [];
		tabDataURL = [];
		ptFaux = [];
		
		msgBox = false;
		
		// ajout d'événements
		canvas.addEventListener("click", pointA = function(e){if(!msgBox) PointA(e);});
		btnBack.addEventListener("click", back = function(){if(!msgBox) Restore("back");});
		btnForward.addEventListener("click", forward = function(){if(!msgBox) Restore("forward");});
		if(user) btnConnection.addEventListener("click", connection = function(){if(!msgBox) Connection("correct", ConnectionCallback);});
		else btnConnection.addEventListener("click", connection = function(){if(!msgBox) Connection("insert", ConnectionCallback);});
		btnDelete.addEventListener("click", switchDel = function(){if(!msgBox) SwitchDel();});
		if(!user) btnEraser.addEventListener("click", connectionDel = function(){if(!msgBox) Connection("delete", ConnectionCallback);});
		
		// Détecte si l'accès aux images des boutons et curseur de souris doit se faire par le dossier parent
		// (utile si l'index du module est dans un sous-dossier, comme la demo en local par exemple)
		
		if(btnDelete.firstChild.getAttribute("src").slice(0,3) == "../")
			imgParent = true;
		
		// Détecte si le script debug.js a déjà été inséré dans la page HTML (utilisé pour une démo en local sans serveur)
		
		var scriptTags = document.getElementsByTagName("script");
		
		for(var i = 0; i < scriptTags.length; i++) {
			if(scriptTags[i].attributes.length != 0)
				if((scriptTags[i].attributes[0].value).match("debug.js") == "debug.js") {
					var detectScript = true;
					dbg = true; // les fonctions debug sont activées
				}
		}
		
		if(dbg)
		{
			// Création dynamique de la console de debug et ses outils
			var infoBottom = document.getElementById("infoBottom");
			
			var divExtra = document.createElement("div");
			if(user) divExtra.setAttribute("id", "extraUser");
			else divExtra.setAttribute("id", "extraAdmin");
			var newTextarea = document.createElement("textarea");
			newTextarea.setAttribute("id","console");
			if(user) {
				newTextarea.setAttribute("rows","5");
				newTextarea.setAttribute("cols","50");
			}
			else {
				newTextarea.setAttribute("rows","5");
				newTextarea.setAttribute("cols","25");
			}
			newTextarea.setAttribute("readonly","readonly");
			newTextarea.appendChild(document.createComment("création console d'événements pour tous les navigateurs"));
			divExtra.appendChild(newTextarea);
			var newInput1 = document.createElement("input");
			newInput1.setAttribute("type","text");
			newInput1.setAttribute("id","coordonnees");
			newInput1.setAttribute("size","6");
			newInput1.setAttribute("readonly","readonly");
			divExtra.appendChild(newInput1);
			var newInput2 = document.createElement("input");
			newInput2.setAttribute("type","button");
			newInput2.setAttribute("id","reset");
			newInput2.setAttribute("value","reset");
			divExtra.appendChild(newInput2);
			
			infoBottom.appendChild(divExtra);
			
			// on récupère l'accès aux éléments debug dans des variables
			btnReset = document.getElementById("reset");
			divCoordonnees = document.getElementById("coordonnees");
			
			// si le script debug n'est pas détecté on l'insère dynamiquement en attendant qu'il est chargé pour ajouter des événements
			if(!detectScript)
			{
				var newScript = document.createElement("script");
				newScript.setAttribute("src","script/debug.js");
				var headTag = document.getElementsByTagName("head")[0];
				headTag.appendChild(newScript);
				
				headTag.lastChild.addEventListener("load", loader = function() {
					headTag.lastChild.removeEventListener("load", loader);
					debug.loader("console", 15);
					
					canvas.addEventListener("mousemove", Locate);
					btnReset.addEventListener("click", function(){if(!msgBox) Reset();});
				});
			}
			else if(detectScript) {
				debug.loader("console", 15);
				canvas.addEventListener("mousemove", Locate);
				btnReset.addEventListener("click", function(){if(!msgBox) Reset();});
			}
		}
		
		if(user) Interface("init");
		else NewInput("init");
	};
	
	
	// Dessine l'interface des points sur le canvas
	var Interface = function draw_Interface(info)
	{		
		for(var i = 1; i <= nbGauche; i++)
		{
			context.beginPath();
			context.arc(offsetPtX, i * intervalPtY, 5, 0, Math.PI * 2);
			context.fill();
			context.closePath();
		}
		
		for(var i = 1; i <= nbDroite; i++)
		{
			context.beginPath();
			context.arc(canvas.width - offsetPtX, i * intervalPtY, 5, 0, Math.PI * 2);
			context.fill();
			context.closePath();
		}
		
		if(info == "copy") // info reçue de la fonction NewInput() si on demande à editer une référence déjà existante
		{
			Save("backup"); // On sauvegarde l'interface de l'application et initialise les tableaux de backup
			
			// charge les tableaux de réponses, construction du tableau d'image en dessinant sur le canvas, calcul du coefficient directeur des tracés et création des tableaux de backup
			for(var i = 0; i < repGauche.length; i++)
			{
				ptGauche.push(repGauche[i]);
				ptDroite.push(repDroite[i]);
				
				context.lineWidth = 2;
				context.beginPath();
				context.moveTo(offsetPtX, ptGauche[i] * intervalPtY);
				context.lineTo(canvas.width - offsetPtX, ptDroite[i] * intervalPtY);
				context.strokeStyle = color;
				context.stroke();
				context.closePath();
				
				Coefdir();
				Save("backup");
			}
		}
		
		if(info == "init")
			Save("backup");
	};
	
	// Localiser le clic de la souris sur le canvas
	var Locate = function draw_Locate(e)
	{
		var pageClickX = e.pageX;
		var pageClickY = e.pageY;
		
		canvasClickX = pageClickX - offsetCanvasX;
		canvasClickY = pageClickY - offsetCanvasY;
		
		if(dbg && !msgBox) divCoordonnees.value = canvasClickX + "; " + canvasClickY;
	};
	
	// Afficher une animation après le clic sur un point A
	var Animation = function draw_Animation(e)
	{
		Locate(e);
		Refresh();
		
		context.lineWidth = 2;
		context.beginPath();
		
		if(sens == "gauche")
			context.moveTo(offsetPtX, ptGauche[ptGauche.length - 1] * intervalPtY);
		else if(sens == "droite")
			context.moveTo(canvas.width - offsetPtX, ptDroite[ptDroite.length - 1] * intervalPtY);
		
		context.lineTo(canvasClickX, canvasClickY);
		context.strokeStyle = color;
		context.stroke();
		context.closePath();
	};
	
	// Rafraîchir le canvas
	var Refresh = function draw_Refresh(info)
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(image, 0, 0);
	};
	
	// Sauvegarder l'image du canvas, paramètre "backup" pour effectuer une sauvegarde des tableaux
	var Save = function draw_Save(info)
	{
		if(info == "backup")
		{
			while(tabDataURL.length > coefdir.length) // nouveau backup donc on supprime toutes les anciennes sauvegardes disponibles
				tabDataURL.splice(0, 1); // splice : à la première position du tableau (0) on supprime une valeur (1)
			
			ptGaucheBak = ptGauche.slice(0); // slice : on copie les tableaux actuellement utilisés pour remplacer les anciens tableaux de backup
			ptDroiteBak = ptDroite.slice(0);
			coefdirBak = coefdir.slice(0);
			// tableau.slice(0) -> copie par valeur du début à la fin, différent de référence (tableau = tableau)
		}
		
		image.src = canvas.toDataURL();
		tabDataURL.push(image.src);
	};
	
	// Supprimer les derniers points si le tracé n'a pas aboutit
	var Fix = function draw_Fix()
	{
		if(dbg) debug.log("Tracé annulé");
		
		if(sens == "gauche")
			ptGauche.pop();
		else if(sens == "droite")
			ptDroite.pop();
	};
	
	//Restaurer des points en avant/arrière
	var Restore = function draw_Restore(info)
	{
		var restored = false;
		
		if((info == "back") && (ptGauche.length > 0) && (ptDroite.length > 0))
		{
			// Algorithme de tri des tableaux de backup pour la restauration en arrière
			ptGauche.pop(); // on supprime la dernière valeur du tableau de points gauche
			ptGaucheBak.splice(0, 0, ptGaucheBak[ptGaucheBak.length - 1]); // on ajoute la dernière valeur du tableau gauche de sauvegarde à la première position du tableau (position 0, sans supprimer de valeur: 0)
			ptGaucheBak.pop(); // on supprime la dernière position du tableau gauche de sauvegarde
			
			ptDroite.pop();
			ptDroiteBak.splice(0, 0, ptDroiteBak[ptDroiteBak.length - 1]);
			ptDroiteBak.pop();
			
			coefdir.pop();
			coefdirBak.splice(0, 0, coefdirBak[coefdirBak.length - 1]);
			coefdirBak.pop();
			
			tabDataURL.splice(0, 0, tabDataURL[tabDataURL.length - 1]);
			tabDataURL.pop();
			
			if(dbg) debug.log("Supprimé: pt gauche " + ptGaucheBak[0] + " et pt droite " + ptDroiteBak[0]);
			restored = true;
		}
		else if((info == "forward") && (ptGauche.length < ptGaucheBak.length) && (ptDroite.length < ptDroiteBak.length))
		{
			// Algorithme de tri des tableaux de backup pour la restauration en avant
			ptGauche.push(ptGaucheBak[0]); // on ajoute la première valeur du tableau de sauvegarde de points gauche au tableau de points gauche
			ptGaucheBak.push(ptGaucheBak[0]); // on ajoute la première valeur du tableau de sauvegarde de points gauche à la fin du tableau
			ptGaucheBak.splice(0, 1); // on supprime (1 valeur) la première valeur (position 0) du tableau de sauvegarde de points gauche
			
			ptDroite.push(ptDroiteBak[0]);
			ptDroiteBak.push(ptDroiteBak[0]);
			ptDroiteBak.splice(0, 1);
			
			coefdir.push(coefdirBak[0]);
			coefdirBak.push(coefdirBak[0]);
			coefdirBak.splice(0, 1);
			
			tabDataURL.push(tabDataURL[0]);
			tabDataURL.splice(0, 1);
			
			if(dbg) debug.log("Restauré: pt gauche " + ptGauche[ptGauche.length - 1] + " et pt droite " + ptDroite[ptDroite.length - 1]);
			restored = true;
		}
		
		if(restored)
		{
			image.src = tabDataURL[tabDataURL.length - 1]; // dessine les tracés à restaurer dans une image depuis le tableau de backup
			image.addEventListener("load", refresh = function() {
				image.removeEventListener("load", refresh);
				Refresh();
			});
			// Attendre que les données soient inscritent dans l'image avant son impression sur le contexte du canvas, inutile pour Chrome (Bug?)
		}
	};
	
	// Ajouter des champs dynamiquement en cliquant sur le dernier lors de la création ou édition d'un exercice
	var NewInput = function draw_NewInput(input)
	{
		if(input == "gauche" || input == "init")
		{
			// si il y a + de 4 noeuds à gauche (après initialisation), il y a forcémment un ancien bouton "supprimer" à enlever
			if(input == "gauche" && divGauche.childNodes.length > 4) {
				var removeGauche = document.getElementById("removeGauche");
				divGauche.removeChild(removeGauche);
			}
			
			divGauche.appendChild(document.createElement("input"));
			divGauche.lastChild.setAttribute("type", "text");
			
			if(divGauche.childNodes.length > 4) {
				var btn = document.createElement("button");
				btn.setAttribute("id", "removeGauche");
				btn.setAttribute("class", "inputRemove");
				var img = document.createElement("img");
				if(imgParent)
					img.setAttribute("src", "../image/remove_10x10.gif");
				else
					img.setAttribute("src", "image/remove_10x10.gif");
				btn.appendChild(img);
				divGauche.appendChild(btn);
				document.getElementById("removeGauche").addEventListener("click", rmGauche = function(){if(!msgBox) DelInput("gauche")});
				
				divGauche.appendChild(document.createElement("br"));
				
				divGauche.childNodes[divGauche.childNodes.length - 3].setAttribute("id", "Gauche"+((divGauche.childNodes.length - 1)/2));
				if(input == "gauche") divGauche.childNodes[divGauche.childNodes.length - 5].removeEventListener("focus", newGauche);
				document.getElementById("Gauche"+((divGauche.childNodes.length - 1)/2)).addEventListener("focus", newGauche = function(){if(!msgBox) NewInput("gauche");});
				
				nbGauche = (divGauche.childNodes.length - 1)/2 - 1;
			}
			else {
				divGauche.appendChild(document.createElement("br"));
				
				divGauche.childNodes[divGauche.childNodes.length - 2].setAttribute("id", "Gauche"+((divGauche.childNodes.length)/2));
				if(input == "gauche") divGauche.childNodes[divGauche.childNodes.length - 4].removeEventListener("focus", newGauche);
				document.getElementById("Gauche"+((divGauche.childNodes.length)/2)).addEventListener("focus", newGauche = function(){if(!msgBox) NewInput("gauche");});
				
				nbGauche = (divGauche.childNodes.length)/2 - 1;
			}
		}
		if(input == "droite" || input == "init")
		{
			if(input == "droite" && divDroite.childNodes.length > 4) {
				var removeDroite = document.getElementById("removeDroite");
				divDroite.removeChild(removeDroite);
			}
			
			divDroite.appendChild(document.createElement("input"));
			divDroite.lastChild.setAttribute("type", "text");
			
			if(divDroite.childNodes.length > 4) {
				var btn = document.createElement("button");
				btn.setAttribute("id", "removeDroite");
				btn.setAttribute("class", "inputRemove");
				var img = document.createElement("img");
				if(imgParent)
					img.setAttribute("src", "../image/remove_10x10.gif");
				else
					img.setAttribute("src", "image/remove_10x10.gif");
				btn.appendChild(img);
				divDroite.appendChild(btn);
				document.getElementById("removeDroite").addEventListener("click", rmDroite = function(){if(!msgBox) DelInput("droite")});
				
				divDroite.appendChild(document.createElement("br"));
				
				divDroite.childNodes[divDroite.childNodes.length - 3].setAttribute("id", "Droite"+((divDroite.childNodes.length - 1)/2));
				if(input == "droite") divDroite.childNodes[divDroite.childNodes.length - 5].removeEventListener("focus", newDroite);
				document.getElementById("Droite"+((divDroite.childNodes.length - 1)/2)).addEventListener("focus", newDroite = function(){if(!msgBox) NewInput("droite");});
				
				nbDroite = (divDroite.childNodes.length - 1)/2 - 1;
			}
			else {
				divDroite.appendChild(document.createElement("br"));
				
				divDroite.childNodes[divDroite.childNodes.length - 2].setAttribute("id", "Droite"+((divDroite.childNodes.length)/2));
				if(input == "droite") divDroite.childNodes[divDroite.childNodes.length - 4].removeEventListener("focus", newDroite);
				document.getElementById("Droite"+((divDroite.childNodes.length)/2)).addEventListener("focus", newDroite = function(){if(!msgBox) NewInput("droite");});
				
				nbDroite = (divDroite.childNodes.length)/2 - 1;
			}
		}
		
		if(nbGauche >= nbDroite)
			nbMax = nbGauche;
		else
			nbMax = nbDroite;
		
		if(nbGauche != nbDroite)
			multisel = true;
		else
			multisel = false;
		
		canvas.height = nbMax * intervalPtY + intervalPtY; // le redimensionnement du canvas efface directement le contexte
		Reset("auto"); // reset nécessaire pour remettre à zéro les tableaux de points et d'images si on ajoute de nouveaux champs après avoir déjà dessiné
		if(input == "init" && !user && reference) Interface("copy");
		else Interface("init");
	}
	
	// Supprimer des champs en cliquant sur le bouton supprimer (croix rouge) lors de la création ou édition d'un exercice
	var DelInput = function draw_DelInput(input)
	{
		if(input == "gauche")
		{
			divGauche.removeChild(divGauche.childNodes[divGauche.childNodes.length - 1]);
			divGauche.removeChild(divGauche.childNodes[divGauche.childNodes.length - 1]);
			divGauche.removeChild(divGauche.childNodes[divGauche.childNodes.length - 1]);
			
			if(divGauche.childNodes.length > 4)
			{
				var btn = document.createElement("button");
				btn.setAttribute("id", "removeGauche");
				btn.setAttribute("class", "inputRemove");
				var img = document.createElement("img");
				if(imgParent)
					img.setAttribute("src", "../image/remove_10x10.gif");
				else
					img.setAttribute("src", "image/remove_10x10.gif");
				btn.appendChild(img);
				divGauche.insertBefore(btn, divGauche.childNodes[divGauche.childNodes.length - 1]);
				document.getElementById("removeGauche").addEventListener("click", rmGauche = function(){if(!msgBox) DelInput("gauche")});
				
				document.getElementById("Gauche"+((divGauche.childNodes.length - 1)/2)).addEventListener("focus", newGauche = function(){if(!msgBox) NewInput("gauche");});
				nbGauche = (divGauche.childNodes.length - 1)/2 - 1;
			}
			else {
				document.getElementById("Gauche"+((divGauche.childNodes.length)/2)).addEventListener("focus", newGauche = function(){if(!msgBox) NewInput("gauche");});
				nbGauche = (divGauche.childNodes.length)/2 - 1;
			}
		}
		else if (input == "droite")
		{
			divDroite.removeChild(divDroite.childNodes[divDroite.childNodes.length - 1]);
			divDroite.removeChild(divDroite.childNodes[divDroite.childNodes.length - 1]);
			divDroite.removeChild(divDroite.childNodes[divDroite.childNodes.length - 1]);
			
			if(divDroite.childNodes.length > 4)
			{
				var btn = document.createElement("button");
				btn.setAttribute("id", "removeDroite");
				btn.setAttribute("class", "inputRemove");
				var img = document.createElement("img");
				if(imgParent)
					img.setAttribute("src", "../image/remove_10x10.gif");
				else
					img.setAttribute("src", "image/remove_10x10.gif");
				btn.appendChild(img);
				divDroite.insertBefore(btn, divDroite.childNodes[divDroite.childNodes.length - 1]);
				document.getElementById("removeDroite").addEventListener("click", rmDroite = function(){if(!msgBox) DelInput("droite")});
				
				document.getElementById("Droite"+((divDroite.childNodes.length - 1)/2)).addEventListener("focus", newDroite = function(){if(!msgBox) NewInput("droite");});
				nbDroite = (divDroite.childNodes.length - 1)/2 - 1;
			}
			else {
				document.getElementById("Droite"+((divDroite.childNodes.length)/2)).addEventListener("focus", newDroite = function(){if(!msgBox) NewInput("droite");});
				nbDroite = (divDroite.childNodes.length)/2 - 1;
			}
		}
		
		if(nbGauche >= nbDroite)
			nbMax = nbGauche;
		else
			nbMax = nbDroite;
		
		if(nbGauche != nbDroite)
			multisel = true;
		else
			multisel = false;
		
		canvas.height = nbMax * intervalPtY + intervalPtY;
		Reset("auto");
		Interface("init");
	}
	
	// Permet de basculer entre le mode dessin (crayon) et correction (ciseaux)
	var SwitchDel = function draw_SwitchDel()
	{
		if(!del) // Si le mode dessin est activé, on passe au mode correction
		{
			del = true;
			
			// Curseur par défaut, ciseaux ouverts
			if(imgParent) {
				if (cursor) canvas.style.cursor = "url(../image/scissors_ready.gif)5 5, auto";
				btnDelete.firstChild.setAttribute("src", "../image/pen_red_ff0000.gif");
			} else {
				if (cursor) canvas.style.cursor = "url(image/scissors_ready.gif)5 5, auto";
				btnDelete.firstChild.setAttribute("src", "image/pen_red_ff0000.gif");
			}
			
			canvas.removeEventListener("click", pointA);
			
			// On change le curseur de la souris lorsque le clic est enfoncé (ciseaux fermés)
			canvas.addEventListener("mousedown", cut = function(ev){
				if (cursor) {
					if(imgParent)
						canvas.style.cursor = "url(../image/scissors_cut.gif)5 5, auto";
					else
						canvas.style.cursor = "url(image/scissors_cut.gif)5 5, auto";
				}
				
				// On lance la fonction permettant de supprimer le tracé
				Delete(ev);
			});
			
			// Changer le curseur de la souris lorsque le clic est relâché (ciseaux ouverts)
			if (cursor) {
				canvas.addEventListener("mouseup", ready = function(){
					if(imgParent)
						canvas.style.cursor = "url(../image/scissors_ready.gif)5 5, auto";
					else
						canvas.style.cursor = "url(image/scissors_ready.gif)5 5, auto";
				});
			}
		}
		else
		{ // Si le mode correction est activé, on passe au mode dessin
			del = false;
			
			if(imgParent) {
				if (cursor) canvas.style.cursor = "url(../image/pen_red_ff0000.gif)0 20, auto";
				btnDelete.firstChild.setAttribute("src", "../image/scissors_ready.gif");
			} else {
				if (cursor) canvas.style.cursor = "url(image/pen_red_ff0000.gif)0 20, auto";
				btnDelete.firstChild.setAttribute("src", "image/scissors_ready.gif");
			}
			
			canvas.removeEventListener("mousedown", cut);
			if (cursor) canvas.removeEventListener("mouseup", ready);
			
			// On lance la fonction permettant de relier les points
			canvas.addEventListener("click", pointA = function(e){if(!msgBox) PointA(e);});
		}
	}
	
	// Calculer le coefficient directeur du dernier tracé
	var Coefdir = function draw_Coefdir()
	{
		var a;
		var xA, yA, xB, yB;
		
		xA = 0; // l'abscisse du point de gauche est définie comme étant 0
		xB = (canvas.width - offsetPtX) - offsetPtX; // l'abscisse du point de droite est égale à l'abscisse du point droite sur le canvas, moins l'abscisse du point gauche sur le canvas
		
		// calcul des ordonnées des points gauche et droite
		yA = (nbGauche * intervalPtY) - (ptGauche[ptGauche.length - 1] * intervalPtY);
		yB = (nbDroite * intervalPtY) - (ptDroite[ptDroite.length - 1] * intervalPtY);
		
		a = (yB - yA)/(xB - xA); // calcul du coefficient directeur
		coefdir.push(a); // javascript est limité à une précision de 16 chiffres (si nombre à virgule infini, le 17ème chiffre est arrondi)
	};
	
	// localiser et supprimer un tracé depuis le clic de la souris
	var Delete = function draw_Delete(e)
	{
		Locate(e);
		
		if(dbg) debug.log("Cherche point sur tracé à supprimer" + " (" + canvasClickX + "; " + canvasClickY + ")");
		
		 // Pour supprimer des tracés uniquement si le clic se situe sur le tracé ou un point du tracé
		 // (clic pris en compte sur ce segment uniquement et pas sur toute la droite du tracé, rayon du point de 5 pixels pris en compte)
		if(canvasClickX >= offsetPtX - 5 && canvasClickX <= (canvas.width - offsetPtX) + 5)
		{
			var index, nb;
			
			nb = 0;
			
			// recalcul de x/y afin de pouvoir utiliser l'équation y = ax + b
			var y = nbGauche * intervalPtY - canvasClickY;
			var x = canvasClickX - offsetPtX;
			
			for(var i = 0; i < coefdir.length; i++)
			{
				var a = coefdir[i];
				var b = nbGauche * intervalPtY - ptGauche[i] * intervalPtY;
				
				// localiser clic sur droite avec marge d'erreur de 2x5 pixels (2 côtés de la droite) sur axe x ou bien y
				// marge d'erreur minimum de 2x1 pixel obligatoire pour localiser clic car le coefficient directeur peut être un nombre à virgule (réel, théoriquement infini)
				if((y + 5 >= a * x + b && y - 5 <= a * x + b) || (y >= a * (x - 5) + b && y <= a * (x + 5) + b))
				{
					index = i;
					nb++;
				}
			}
			
			if(nb == 1) // n'effectue pas plusieurs suppressions si clic sur droites superposées
			{
				if(dbg) debug.log("Tracé supprimé : " + ptGauche[index] + "-" + ptDroite[index] + " (y = " + Math.round(coefdir[index] * 100) / 100 + " * x + " + (nbGauche * intervalPtY - ptGauche[index] * intervalPtY) + ")");
				
				ptGauche.splice(index, 1); // splice : suppression point gauche du tracé (1 élément du tableau supprimé à la position donnée "index")
				ptDroite.splice(index, 1);
				coefdir.splice(index, 1);
				
				index = index + (coefdirBak.length - coefdir.length - 1); // recalcul de l'index pour les tableaux de backup (-1 car les tableaux de backups n'ont pas encore eu de suppressions de points)
				
				// On respecte l'algorithme de tri des restaurations en avant et arrière
				ptGaucheBak.splice(0, 0, ptGaucheBak[index]); // point gauche du tracé supprimé ajouté au début du tableau si restauration ultérieure souhaitée
				ptGaucheBak.splice(index + 1, 1); // supprime le point gauche du tracé ayant été déplacé au début du tableau (index + 1 car on a ajouté une valeur au début du tableau)
				
				ptDroiteBak.splice(0, 0, ptDroiteBak[index]);
				ptDroiteBak.splice(index + 1, 1);
				
				coefdirBak.splice(0, 0, coefdirBak[index]);
				coefdirBak.splice(index + 1, 1);
				
				// slice : copie uniquement l'interface du canvas suivant sa position dans le tableau tabDataURL, les anciennes données sont remplacées
				tabDataURL = tabDataURL.slice(coefdirBak.length - coefdir.length - 1, coefdirBak.length - coefdir.length);
				
				// On charge l'interface sur le canvas
				image.src = tabDataURL[0];
				image.addEventListener("load", refresh = function()
				{ // Attente du chargement de l'image nécessaire pour la plupart des navigateurs (évite l'impression inachevée du contexte du canvas sur l'image avant nouvelle écriture)
					image.removeEventListener("load", refresh);
					
					Refresh();
					
					for(var i = 0; i < coefdir.length; i++) // reconstruit les tracés à zéro puis indexés dans tableau d'images
					{
						context.lineWidth = 2;
						context.beginPath();
						
						var j = 0;
						while (j < ptFaux.length && (ptGauche[i] != ptFaux[j] || ptDroite[i] != ptFaux[j + 1]))
							j += 2;
						
						context.moveTo(offsetPtX, ptGauche[i] * intervalPtY);
						context.lineTo(canvas.width - offsetPtX, ptDroite[i] * intervalPtY);
						
						j < ptFaux.length ? context.strokeStyle = colorError : context.strokeStyle = color;
						
						context.stroke();
						context.closePath();
						
						Save();
					}
					
					var cvs = document.createElement("canvas"); // création d'un canvas, contexte et image à la volée pour dessiner et enregistrer les tracés supprimés sans les afficher
					cvs.height = canvas.height;
					cvs.width = canvas.width;
					var ctx = cvs.getContext("2d");
					var img = document.createElement("img");
					
					img.src = tabDataURL[tabDataURL.length - 1]; // récupère l'image du canvas actuel avec le tracé supprimé
					img.addEventListener("load", dessin = function() // Attente de fin de chargement nécessaire pour réécrire sur l'image
					{
						img.removeEventListener("load", dessin);
						ctx.drawImage(img, 0, 0);
						
						for(var i = 0; tabDataURL.length <= coefdirBak.length; i++) // sauvegarde les anciens tracés par-dessus l'image actuelle si restauration souhaitée par la suite
						{ // "<=" car tabDataURL contient une valeur en plus que les autres tableaux: l'interface de départ
							ctx.lineWidth = 2;
							ctx.beginPath();
							
							var j = 0;
							while (j < ptFaux.length && (ptGaucheBak[i] != ptFaux[j] || ptDroiteBak[i] != ptFaux[j + 1]))
								j += 2;
							
							ctx.moveTo(offsetPtX, ptGaucheBak[i] * intervalPtY);
							ctx.lineTo(canvas.width - offsetPtX, ptDroiteBak[i] * intervalPtY);
							
							j < ptFaux.length ? ctx.strokeStyle = colorError : ctx.strokeStyle = color;
							
							ctx.stroke();
							ctx.closePath();
							
							// Equivalent méthode Save() mais pour l'image "img" au lieu de "image"
							img.src = cvs.toDataURL();
							tabDataURL.splice(i, 0, img.src); // les premières valeurs des tableaux de points doivent correspondre avec les premières valeurs des tableaux d'images (i)
						}
					});
				});
			}
			else if(nb > 1) {
				if(dbg) debug.log("Droites superposées, supprimez ailleurs");
			}
		}
	};
	
	// Cibler et relier le point de départ
	var PointA = function draw_PointA(e)
	{
		Locate(e);
		
		if(dbg) debug.log("Cherche ptA" + " (" + canvasClickX + "; " + canvasClickY + ")");
		
		sens = null;
		
		for(var i = 1; i <= nbMax; i++)
		{
			if((canvasClickX - 10 <= offsetPtX) && (canvasClickX + 10 >= offsetPtX)
			&& (canvasClickY - 10 <= i * intervalPtY) && (canvasClickY + 10 >= i * intervalPtY)
			&& nbGauche >=  i) // si clic de départ du côté gauche (rayon point 5 pixels avec marge d'erreur de 5 pixels)
			{
				sens = "gauche";
				var clone = false;
				
				if(!multisel) {
					for(var j = 0; j < ptGauche.length; j++) {
						if(ptGauche[j] == i)
							clone = true;
					}
				}
				
				ptGauche.push(i);
				
				if(clone)
				{
					if(dbg) debug.log("Déjà utilisé : pt gauche " + ptGauche[ptGauche.length - 1]);
					
					Fix();
					sens = null;
				}
				else if(!clone)
				{
					if(dbg) debug.log("ptA gauche " + ptGauche[ptGauche.length - 1] + " prêt");
					
					canvas.removeEventListener("click", pointA);
					canvas.addEventListener("click", pointB = function(e){if(!msgBox) PointB(e);});
					canvas.addEventListener("mousemove", animation = function(e){if(!msgBox) Animation(e);});
				}
				break;
			}
			else if((canvasClickX - 10 <= canvas.width - offsetPtX) && (canvasClickX + 10 >= canvas.width - offsetPtX)
			&& (canvasClickY - 10 <= i * intervalPtY) && (canvasClickY + 10 >= i * intervalPtY)
			&& nbDroite >= i) // si clic de départ du côté droit (rayon point 5 pixels avec marge d'erreur de 5 pixels)
			{
				sens = "droite";
				var clone = false;
				
				if(!multisel) {
					for(var j = 0; j < ptDroite.length; j++) {
						if(ptDroite[j] == i)
							clone = true;
					}
				}
				
				ptDroite.push(i);
				
				if(clone)
				{
					if(dbg) debug.log("Déjà utilisé : pt droite " + ptDroite[ptDroite.length - 1]);
					
					Fix();
					sens = null;
				}
				else if(!clone)
				{
					if(dbg) debug.log("ptA droite " + ptDroite[ptDroite.length - 1] + " prêt");
					
					canvas.removeEventListener("click", pointA);
					canvas.addEventListener("click", pointB = function(e){if(!msgBox) PointB(e);});
					canvas.addEventListener("mousemove", animation = function(e){if(!msgBox) Animation(e);});
				}
				break;
			}
		}
	};
	
	 // Cibler et relier le point d'arrivée
	var PointB = function draw_PointB(e)
	{
		Refresh(); // Effacer le dernier tracé de l'animation
		
		Locate(e);
		
		if(dbg) debug.log("Cherche ptB" + " (" + canvasClickX + "; " + canvasClickY + ")");
		
		var found = false;
		
		for(var i = 1; i <= nbMax; i++)
		{
			if((canvasClickX - 10 <= offsetPtX) && (canvasClickX + 10 >= offsetPtX)
			&& (canvasClickY - 10 <= i * intervalPtY) && (canvasClickY + 10 >= i * intervalPtY)
			&& nbGauche >= i && (sens == "droite")) // si clic du côté gauche après clic du côté droit (rayon point 5 pixels avec marge d'erreur de 5 pixels)
			{
				found = true;
				var clone = false;
				
				if(!multisel) {
					for(var j = 0; j < ptGauche.length; j++) {
						if(ptGauche[j] == i)
							clone = true;
					}
				}
				
				if(clone)
				{
					if(dbg) debug.log("Erreur : pt gauche " + ptGauche[ptGauche.length - 1] + " déjà utilisé");
					
					Fix();
				}
				else if(!clone)
				{
					ptGauche.push(i); // ajouter point dans tableau avant de dessiner (données utilisées)
					if(dbg) debug.log("ptB gauche " + ptGauche[ptGauche.length - 1] + " relié");
					
					context.lineWidth = 2;
					context.beginPath();
					context.moveTo(canvas.width - offsetPtX, ptDroite[ptDroite.length - 1] * intervalPtY);
					context.lineTo(offsetPtX, ptGauche[ptGauche.length - 1] * intervalPtY);
					context.strokeStyle = color;
					context.stroke();
					context.closePath();
					
					Coefdir();
					Save("backup");
				}
				break;
			}
			else if((canvasClickX - 10 <= canvas.width - offsetPtX) && (canvasClickX + 10 >= canvas.width - offsetPtX)
			&& (canvasClickY - 10 <= i * intervalPtY) && (canvasClickY + 10 >= i * intervalPtY)
			&& nbDroite >= i && (sens == "gauche")) // si clic du côté droit après clic du côté gauche (rayon point 5 pixels avec marge d'erreur de 5 pixels)
			{
				found = true;
				var clone = false;
				
				if(!multisel) {
					for(var j = 0; j < ptDroite.length; j++) {
						if(ptDroite[j] == i)
							clone = true;
					}
				}
				
				if(clone)
				{
					if(dbg) debug.log("Erreur : pt droite " + ptDroite[ptDroite.length - 1] + " déjà utilisé");
					
					Fix();
				}
				else if(!clone)
				{
					ptDroite.push(i);
					if(dbg) debug.log("ptB droite " + ptDroite[ptDroite.length - 1] + " relié");
					
					context.lineWidth = 2;
					context.beginPath();
					context.moveTo(offsetPtX, ptGauche[ptGauche.length - 1] * intervalPtY);
					context.lineTo(canvas.width - offsetPtX, ptDroite[ptDroite.length - 1] * intervalPtY);
					context.strokeStyle = color;
					context.stroke();
					context.closePath();
					
					Coefdir();
					Save("backup");
					
					if (ptFaux.length > 0)
					{
						ptFaux[ptGauche[ptGauche.length - 1] * 2 - 2] = 0;
						ptFaux[ptGauche[ptGauche.length - 1] * 2 - 1] = 0;
					}
				}
				break;
			}
		}
		if(!found)
		{
			Fix();
		}
		
		sens = null;
		canvas.removeEventListener("click", pointB);
		canvas.removeEventListener("mousemove", animation);
		canvas.addEventListener("click", pointA = function(e){if(!msgBox) PointA(e);});
	};
	
	// Connexion au serveur
	var Connection = function draw_Connection(script, callback)
	{
		var champs = true;
		
		if(script == "insert")
		{
			if(document.getElementById("Reference").value == "")
				champs = false;
			for(var i = 1; i <= nbGauche; i++)
				if(document.getElementById("Gauche"+i).value == "")
					champs = false;
			for(var i = 1; i <= nbDroite; i++)
				if(document.getElementById("Droite"+i).value == "")
					champs = false;
		}
		
		if(((user || champs) && (ptGauche.length >= nbGauche && ptDroite.length >= nbDroite)) || script == "delete")
		{
			if(correction != "js" || !user)
			{
					var xhr = null;
					
					if(window.XMLHttpRequest || window.ActiveXObject)
					{
						if(window.ActiveXObject) // Objets utilisant le contrôle ActiveX, utilisé dans Internet Explorer avant v7
						{
							try {
								xhr = new ActiveXObject("McanvasXml2.XMLHTTP"); 
							} catch(e) {
								xhr = new ActiveXObject("Microsoft.XMLHTTP");
							}
						}
						else {
							xhr = new XMLHttpRequest(); // Objet standard W3C pour communication AJAX
						}
					}
					else
					{
						alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest");
						return;
					}
					
					xhr.onreadystatechange = function() {
						if(xhr.readyState == 4) // A la 4ème étape du traitement de l'objet XMLHttpRequest (réponse serveur), on étudie le résultat
						{
							if(xhr.status == 200 || xhr.status == 0) // Eviter les codes d'erreurs 404/500 (200: OK, 0: pas de réponse, pour tests en local)
								callback(script, xhr.responseText);
							else
								Message("Erreur HTTP " + xhr.status); // On affiche le code d'erreur
						}
					};
					
					switch(script)
					{
						case "correct":
						{
							xhr.open("POST", "script/ajax.php", true);
							xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
							xhr.send("script=" + encodeURIComponent(script) + "&reference=" + encodeURIComponent(reference) + "&repGauche=" + encodeURIComponent(JSON.stringify(ptGauche)) + "&repDroite=" + encodeURIComponent(JSON.stringify(ptDroite)));
							// encodeURIComponent encode tous les caractères spéciaux du lien créé (permet d'envoyer le caractère '&' par exemple, sans qu'il soit prît pour un paramètre du lien (ex. &Droite)
							break;
						}
						case "insert":
						{
							var txtGauche = [];
							var txtDroite = [];
							
							var newReference = document.getElementById("Reference").value;
							
							for(var i = 1; i <= nbGauche; i++)
								txtGauche.push(document.getElementById("Gauche"+i).value);
							for(var i = 1; i <= nbDroite; i++)
								txtDroite.push(document.getElementById("Droite"+i).value);
							
							xhr.open("POST", "script/ajax.php", true);
							xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
							xhr.send("script=" + encodeURIComponent(script) + "&reference=" + encodeURIComponent(newReference)
							+ "&motGauche=" + encodeURIComponent(JSON.stringify(txtGauche))
							+ "&motDroite=" + encodeURIComponent(JSON.stringify(txtDroite))
							+ "&repGauche=" + encodeURIComponent(JSON.stringify(ptGauche))
							+ "&repDroite=" + encodeURIComponent(JSON.stringify(ptDroite)));
							break;
						}
						case "delete":
						{
							if(reference) Message("Supprimer l'exercice <span class=\"ref\">" + htmlspecialchars(reference) + "</span> ?", 1);
							else Message("Votre exercice n'a pas encore été créé");
							
							document.getElementById("AlertYes").addEventListener("click", function() {
								alertContainer.removeChild(alertContainer.firstChild);
								xhr.open("POST", "script/ajax.php", true);
								xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
								xhr.send("script=" + encodeURIComponent(script) + "&reference=" + encodeURIComponent(reference));
								msgBox = false;
							});
							document.getElementById("AlertNo").addEventListener("click", function() {
								alertContainer.removeChild(alertContainer.firstChild);
								msgBox = false;
							});
							break;
						}
					}
			}
			else // Correction Javascript
			{
				ptFaux = [];
				
				for(var i = 0; i < repGauche.length; i++) {
					for(var j = 0; j < ptGauche.length; j++) {
						if(repGauche[i] == ptGauche[j])
						{
							if(repDroite[i] != ptDroite[j])
							{
								ptFaux.push(ptGauche[j]);
								ptFaux.push(ptDroite[j]);
							}
							break;
						}
					}
				}
				
				callback();
			}
		}
		else if(!champs) {
			Message("Veuillez remplir tous les champs");
		}
		else {
			Message("Veuillez relier tous les points");
		}
	};
	
	// Fonction de callback permettant de traiter les informations renvoyées par le serveur
	var ConnectionCallback = function draw_ConnectionCallback(script, data)
	{
		if(data == -1) { // si il y a eu une erreur de connexion à la base, on le signale
			Message("Erreur de connexion à la base");
		}
		else if(data == 1) {
			Message("Contenu indisponible");
		}
		else if(user) // callback utilisateur
		{
			if(correction != "js") // si correction php, on convertit les données JSON reçues en tableau
			{
				ptFaux = JSON.parse(data);
			}
			
			if(ptFaux.length >= 1) // message personnalisé si il y a des erreurs
			{
				Message("Vous avez " + ptFaux.length / 2 + " erreurs à corriger");

				// On charge l'interface sur le canvas
				image.src = tabDataURL[0];
				image.addEventListener("load", refresh = function()
				{ // Attente du chargement de l'image nécessaire pour la plupart des navigateurs (évite l'impression inachevée du contexte du canvas sur l'image avant nouvelle écriture)
					image.removeEventListener("load", refresh);
					
					tabDataURL = [];
					Refresh();
					Save();
					
					for(var i = 0; i < coefdir.length; i++) // reconstruit les tracés à zéro puis indexés dans tableau d'images
					{
						context.lineWidth = 2;
						context.beginPath();
						
						var j = 0;
						while (j < ptFaux.length && (ptGauche[i] != ptFaux[j] || ptDroite[i] != ptFaux[j + 1]))
							j += 2;
						
						context.moveTo(offsetPtX, ptGauche[i] * intervalPtY);
						context.lineTo(canvas.width - offsetPtX, ptDroite[i] * intervalPtY);
						
						j < ptFaux.length ? context.strokeStyle = colorError : context.strokeStyle = color;
						
						context.stroke();
						context.closePath();
						
						Save();
					}
				});
			}
			else { // message s'il n'y a pas d'erreurs
				Message("Toutes vos réponses sont correctes");
				if(user && typeof(count) != "undefined") count.stop();
			}
		}
		else if(!user)  // callback administrateur
		{
			if(script == "delete")
				Message(data, 2);
			else
				Message(data);
		}
	};
	
	// Création d'une boîte de dialogue en HTML/CSS
	var Message = function draw_Message(msg, confirm)
	{
		msgBox = true;
		
		var newDiv = document.createElement("div");
		newDiv.setAttribute("id", "AlertBox");
		var newP = document.createElement("p");
		newP.innerHTML = msg;
		newDiv.appendChild(newP);
		
		if(confirm == 1) // si la MessageBox demande une confirmation
		{
			var newInput1 = document.createElement("input");
			newInput1.setAttribute("type", "button");
			newInput1.setAttribute("id", "AlertYes");
			newInput1.setAttribute("value", "Oui");
			newDiv.appendChild(newInput1);
			
			newDiv.appendChild(document.createTextNode("\u00a0\u00a0")); // &nbsp en Unicode: Non-breaking space (espace insécable, plusieurs à la suite possible)
			
			var newInput2 = document.createElement("input");
			newInput2.setAttribute("type", "button");
			newInput2.setAttribute("id", "AlertNo");
			newInput2.setAttribute("value", "Non");
			newDiv.appendChild(newInput2);
		}
		else { // sinon MessageBox d'avertissement
			var newInput = document.createElement("input");
			newInput.setAttribute("type", "button");
			newInput.setAttribute("id", "AlertButton");
			newInput.setAttribute("value", "OK");
			newDiv.appendChild(newInput);
		}
		
		alertContainer.appendChild(newDiv);
		
		// On remet les événements pour continuer à utiliser le module
		
		if(!confirm || confirm == 2) // si MessageBox d'avertissement simple ou suite à une confirmation (redirection)
		{
			document.getElementById("AlertButton").addEventListener("click", function() {
				alertContainer.removeChild(alertContainer.firstChild);
				msgBox = false;
				if(confirm == 2) window.location = "./";
			}); // événement supprimé automatiquement lors de la suppression de la div*/
		}
	};
	
	// Effectue une remise à zéro de l'application (mode débug uniquement)
	var Reset = function draw_Reset(clear)
	{
		ptGauche = [];
		ptDroite = [];
		ptGaucheBak = [];
		ptDroiteBak = [];
		ptFaux = [];
		tabDataURL = [];
		coefdir = [];
		coefdirBak = [];
		sens = null;
		if(!clear) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			Interface("init");
		}
		if(dbg && !clear) {
			divCoordonnees.value = "";
			debug.reset();
		}
		if(user && typeof(count) != "undefined") count.reset();
	};
}
