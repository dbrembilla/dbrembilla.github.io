function showthis(id) {
    displ = document.getElementById(id).style.display
    console.log(displ);
    if (displ === 'none') {
        document.getElementById(id).style.display = "show";
    } else {
        document.getElementById(id).style.display = "none";
    }
    
}