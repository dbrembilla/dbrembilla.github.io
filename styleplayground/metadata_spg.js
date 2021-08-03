String.prototype.sub = function(o) { //funzione che serve a inserire gli elementi nella lista dei documenti
            var r = this ; 
            for (var i in o) { 
                r = r.replace(new RegExp("\\$"+i, 'g'),o[i])  
            } 
            return r 
        }
        
        var listItemTpl = `<li><a href='#' onclick='topicManager("$topic","$url")'>$label</a></li>` //elemento che serve ad aggiungere documenti. label è la descrizione del doc e url la cipolla
        
        $(document).ready(main); //al caricamento del documento esegui main

        function main() { //recupera gli html
            getArticles("list_workfromhome.json", "#topic1", "topic1") 
            getArticles("list_space.json", "#topic2", "topic2") 
            getArticles("list_inclusivelanguage.json", "#topic3", "topic3") 

        }
        function getArticles(url, ref, mytopic){
            $.ajax({
                method: 'GET',
                url: url,
                success: function(d) { //ciascun elemento nel json viene recuperato
                    for (var i=0; i<d.length; i++) {
                        $(ref).append(listItemTpl.sub({url:d[i].url, label: d[i].label, topic: mytopic}))
                    }   
                },
                error: function() {
                    alert('No document to show')
                }
            });
        }
        
        function load(topic, file) { //carica il file html del documento desiderato. es. articolo.html viene caricato. 
            $.ajax({
                method: 'GET',
                url: file,
                success: function(d) {
                    $("#article-"+columnListener[topic]).html(d) //aggiunge un div con id file (il documento)
                    $('#title-'+ columnListener[topic]).html($("col-num-" + columnListener[topic] + " h1")) //aggiunge un div con id title scegliendo l'elemento h1 nel div con id file
                    //$('.show').prop("checked", false)
                    addIds()
                    filltabs(topic)
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

        function filltabs(topic){
            fillInfo("#article-" +columnListener[topic], "#info-" + columnListener[topic]);
            filltab("#file-" + columnListener[topic] + " .person","#person-view-"+columnListener[topic]);
            filltab("#file-" +columnListener[topic] +" .place","#place-view-"+columnListener[topic]);
            filltab("#file-" +columnListener[topic] +" .institution","#institution-view-"+columnListener[topic]);
            filltab("#file- "+ columnListener[topic] +" .event","#event-view-" + columnListener[topic]);
            filltab("#file- " + columnListener[topic] +" .event","#date-view" + columnListener[topic]);
            basefilltab("#file-"+columnListener[topic] +" .quote","#quotations-" + columnListener[topic]);
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
                    $("#tmp").after(listSecond.sub({
                    place: elements[i].id, //qui non c'è # perché ha automaticamente id # e quindi veniva ##ref
                    content: elements[i].innerHTML,
                    thisclass: referenceClass
                }))
                    $("#tmp").removeAttr("id");
                }
                else {
                    $(where).append(listFirst.sub({
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
                $(where).append(list.sub({
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

            $(where).append(item.sub( {
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