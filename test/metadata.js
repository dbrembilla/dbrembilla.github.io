String.prototype.tpl = function(o) { //funzione che serve a inserire gli elementi nella lista dei documenti
            var r = this ; 
            for (var i in o) { 
                r = r.replace(new RegExp("\\$"+i, 'g'),o[i])  
            } 
            return r 
        }
        
        var listItemTpl = `<li><a href='#' onclick='load("$url")'>$label</a></li>` //elemento che serve ad aggiungere documenti. label è la descrizione del doc e url la cipolla
        
        $(document).ready(main); //al caricamento del documento esegui main

        function main() { //recupera gli html
            getArticles("list.json", "#topic1") 
        }
        function getArticles(url, ref){
            $.ajax({
                method: 'GET',
                url: url,
                success: function(d) { //ciascun elemento nel json viene recuperato
                    for (var i=0; i<d.length; i++) {
                        $(ref).append(listItemTpl.tpl({url:d[i].url, label: d[i].label}))
                    }   
                },
                error: function() {
                    alert('No document to show')
                }
            });
        }
        
        function load(file) { //carica il file html del documento desiderato. es. articolo.html viene caricato. 
            $.ajax({
                method: 'GET',
                url: file,
                success: function(d) {
                    $('#topic1').html(d) //aggiunge un div con id file (il documento)
                    $('#title').html($('#file h1')) //aggiunge un div con id title scegliendo l'elemento h1 nel div con id file
                    //$('.show').prop("checked", false)
                    addIds()
                    filltabs()
                },
                error: function() {
                    alert('Could not load file '+file)
                }
            });
        }


        function addIds() {
            addId('.person','person')
            addId('.place', 'place')
            addId('.institution', 'institution')
            addId('.quote', 'quote')
        }
        
        function addId(what, prefix) {
            var id = '0';
            var elements = $(what); //aggiunge un id progressivo in modo da identificare ciascun elemento della tabella
            for (var i=0; i<elements.length; i++) {
                elements[i].id = prefix + "-" + id++;
            }
        }

        function filltabs(){
            fillInfo("#file", "#info")
            filltab("#file .person","#person-view")
            filltab("#file .place","#place-view")
            filltab("#file .institution","#institution-view")
            filltab("#file .event","#event-view")

            basefilltab("#file .quote","#quotations")
        }
        


        function filltab(what,where) { //questo riempie le tabelle del metadata viewer
            var listFirst = `<br><a id="$thisclass" href="$place">$content</a>`; //ciascun elemento ha una sua riga, rimanda all'oggetto con href e ha content come l'argomento è chiamato
            var listSecond = ', <a id="$thisclass" href="#$place">$content</a>'; //dal secondo elemento si pone a fianco di quello presente
            var elements = $(what); 
            seenClasses = []; //array che contiene le classi già note
            $(where).empty(); 
            for (var i=0; i<elements.length; i++) {
                referenceClass = elements[i].getAttribute("class").toString(); //prende le classi dell'elemento e le converte a stringa e poi sostituisce gli spazi con -
                referenceClass = referenceClass.replace(/\s/g, "-");
                if (seenClasses.includes(referenceClass)) {
                    $("#" + referenceClass).attr("id", "tmp"); //assegna nome temporaneo all'oggetto noto per aggiungere l'elemento successivo dopo di esso
                    $("#tmp").after(listSecond.tpl({
                    place: elements[i].id, //qui non c'è # perché ha automaticamente id # e quindi veniva ##ref
                    content: elements[i].innerHTML,
                    thisclass: referenceClass
                }))
                    $("#tmp").removeAttr("id");
                }
                else {
                    $(where).append(listFirst.tpl({
                    place: '#'+elements[i].id,
                    content: elements[i].innerHTML,
                    thisclass: referenceClass
                }) )
                    seenClasses.push(referenceClass)
                }
            
            }
        }
        function basefilltab(what,where) { //questo riempie le tabelle del metadata viewer
            var list = `<li class="list quote"><a href="#$place">$content</a></li>`
            var elements = $(what); 
            $(where).empty(); 
            for (var i=0; i<elements.length; i++) {
                $(where).append(list.tpl({
                    place: elements[i].id,
                    content: elements[i].innerHTML
                }) )
            }
        }
        
      
function fillInfo(from, where) {
            var item = `
                <p class="list title"><b>Title: </b> $title</p>
                <p class="list author"><b>Author: </b> $author</p>
                <p class="list publication"><b>Publication: </b> $pub</p>
                          
                ` ; //meta con le keyword
            $(where).empty(); 

            var title = $(from + ' h1')[0].innerText //sceglie elementi h1 nell'elemento indicato
            var author = $(from + ' .auth')[0].innerText //sceglie elemento con byline con autore
            var pub = $(from + ' .pub')[0].innerText

            $(where).append(item.tpl( {
                author: author,
                title: title,
                pub: pub
            }))
        }
        $(function(){
       $("a").each(function(){
               if ($(this).attr("href") == window.location.pathname){
                       $(this).addClass("pulsate-fwd");
               }
       });
});