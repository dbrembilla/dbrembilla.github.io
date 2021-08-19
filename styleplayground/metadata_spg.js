
// Style changer


function changeStyle(ref){
            target=$(ref).attr("href");
            $("#default").attr("href", target);

        }
// Adding topics and columns
function topicManager(topic, ref){
    addTopic(topic);
    columnSetting(topic, ref);

}
function addTopic(topic){
    $("header").replaceWith("<header>" + $("#" + topic + "-title").text() + "</header>");}


var column = `
            <div class="col$colwidth" id = col-num$colnum>
                    <div class="row">
                        <div class="row list" id="metaview$colnum"><h3>Metaviewer</h3>
                        <ul id="metadata-list$colnum"></ul></div> 

                    </div> 
                    <div class="card overflow" id="article$colnum">
                        <h2>Art</h2>
                    </div>
                </div>`
columnListener = {}
function columnSetting(topic, ref){
    if (!(topic in columnListener)){
        Object.keys(columnListener).forEach(key => {delete columnListener[key];});
        $("#row-article").empty();
        $("#row-article").append(column.sub({colwidth: "-12", colnum : "-1"}));
        columnListener[topic] = "1";
        load(topic, ref);
    } else {
        switch (columnListener[topic]) {
            case "1":
            $("#col-num-1").attr("class", "col-6") ;
            $("#row-article").append(column.sub({colwidth: "-6", colnum: "-2"}));
            columnListener[topic] = "2";
            load(topic, ref);
            break
            case "2":
            $("#col-num-1").attr("class", "col-4") ;
            $("#col-num-2").attr("class", "col-4") ;
            $("#row-article").append(column.sub({colwidth: "-4", colnum: "-3"}));
            columnListener[topic] = "3";
            load(topic, ref);
            break
            default:
            console.log("No columns or 3 columns; impossible to add more")
        }
    }
}


String.prototype.sub = function(o) { //funzione che serve a inserire gli elementi nella lista dei documenti
            var r = this ; 
            for (var i in o) { 
                r = r.replace(new RegExp("\\$"+i, 'g'),o[i])  
            } 
            return r 
        }
        
        var listItemTpl = `<li><a href='#' onclick='topicManager("$topic","$url")'>$label</a></li>` //elemento che serve ad aggiungere documenti. label è la descrizione del doc e url la cipolla
        

        function main() { //recupera gli html
            getArticles("list_workfromhome.json", "#topic1"||"#topic1s", "topic1") 
            getArticles("list_workfromhome.json","#topic1s", "topic1")
            getArticles("list_space.json", "#topic2", "topic2")
            getArticles("list_space.json", "#topic2s", "topic2")
            getArticles("list_inclusivelanguage.json", "#topic3", "topic3")
            getArticles("list_inclusivelanguage.json", "#topic3s", "topic3")

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
                    //filltabs(topic)
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

        function filltabs(topic){ //da eliminare
            fillInfo("#article-" +columnListener[topic], "#title-" + columnListener[topic], "#auth-" + columnListener[topic],  "#pub-" + columnListener[topic] );                    
            filltab("#file-" + columnListener[topic] + " .person","#person-view-"+columnListener[topic]);
            filltab("#file-" +columnListener[topic] +" .place","#place-view-"+columnListener[topic]);
            filltab("#file-" +columnListener[topic] +" .institution","#institution-view-"+columnListener[topic]);
            filltab("#file- "+ columnListener[topic] +" .event","#event-view-" + columnListener[topic]);
            filltab("#file- " + columnListener[topic] +" .event","#date-view" + columnListener[topic]);
            basefilltab("#file-"+columnListener[topic] +" .quote","#quotations-" + columnListener[topic]);
        }
        


        function filltab(what,where) { //questo riempie le tabelle del metadata viewer
            var linkClass = what.replace(/\s/g, "-");
            var listFirst = `<li class="$classtodelete">$content[$links]</li>`; //ciascun elemento ha una sua riga, rimanda all'oggetto con href e ha content come l'argomento è chiamato
            var listContent = '<a id="$thisclass" href="$place">$number</a> '; //dal secondo elemento si pone a fianco di quello presente
            var elements = $(what); 
            seenClasses = {}; //array che contiene le classi già note
            for (var i=0; i<elements.length; i++) {
                referenceClass = elements[i].getAttribute("class").toString(); //prende le classi dell'elemento e le converte a stringa e poi sostituisce gli spazi con -
                referenceClass = referenceClass.replace(/\s/g, "-");
                if (referenceClass in seenClasses) { //questo algoritmo crea un array contenente un elenco di numeri che si riferiscono a quando un elemento è citato
                    len = seenClasses[referenceClass].length + 1;
                    seenClasses[referenceClass].push(
                    listContent.sub({
                    place: "#" + elements[i].id, //qui non c'è # perché ha automaticamente id # e quindi veniva ##ref
                    thisclass: referenceClass,
                    number:  len
                }))
                }
                else {
                    seenClasses[referenceClass] = [listContent.sub({ //crea un array che contiene tutti gli elementi trovati
                    place: "#" + elements[i].id,
                    thisclass: referenceClass,
                    number: 1
                }) ]
                }
            

            } 
            console.log(seenClasses.entries);
            for (const [key, value] of Object.entries(seenClasses)) {
              $(where).append(listFirst.sub({
                content: key,
                links: value,
                classtodelete: linkClass
              }));
            }
            //content: elements[i].innerHTML
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
        
function fillInfo(from, where, wherelse, wherever) {
            var title =`
                $title
                `
            var auth = `
                $author`
            var pub = `
                $pub
                          
                ` ; //meta con le keyword
            $(where).empty(); 
            $(wherelse).empty();
            $(wherever).empty();
            var titlefill = $(from + ' h1')[0].innerText //sceglie elementi h1 nell'elemento indicato
            var authorfill = $(from + ' .auth')[0].innerText //sceglie elemento con byline con autore
            var pubfill = $(from + ' .pub')[0].innerText

            $(wherelse).append(auth.sub( {
                author: authorfill}));
            
            $(wherever).append(pub.sub( {
                pub: pubfill}));
            
             $(where).append(title.sub( {
                title: titlefill
            }))
        }
        $(function(){
       $("a").each(function(){
               if ($(this).attr("href") == window.location.pathname){
                       $(this).addClass("pulsate-fwd");
               }
       });
});
