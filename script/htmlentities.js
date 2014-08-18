// HTML entities Encode/Decode

function htmlspecialchars(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); // ' -> &apos; for XML only
}
function htmlspecialchars_decode(str) {
    return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, '\'');
}
function htmlentities(str) {
	var textarea = document.createElement("textarea");
	textarea.innerHTML = str;
	return textarea.innerHTML;
}
function htmlentities_decode(str) {
	var textarea = document.createElement("textarea");
	textarea.innerHTML = str;
	return textarea.value;
}
