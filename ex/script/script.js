function Select(){
	var style = $('input[name=Style]:checked', 'Selection').val()
	$("#SelectedStyle").attr("href", style);
	console.log("Print")
} ;
$(".radio").click(Select())	;