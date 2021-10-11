var future = false
var loading = false
function addHover(){
    $('.person').attr('onmouseover',
        `$('#class-show').empty();
            $('#class-show').append('<img src="assets/show/person.ico"  class="img-responsive" style="height:100%;width:auto;">');
           `
        )
    $('.event').attr('onmouseover',
        `$('#class-show').empty();
        $('#class-show').append('<img src="assets/show/event.ico"  class="img-responsive" style="height:100%;width:auto;">');
        `
        )
    $('.institution').attr('onmouseover',
        `
        $('#class-show').empty();
        $('#class-show').append('<img src="assets/show/institution.png" class="img-responsive"  style="height:100%;width:auto;">');`
        )
    $('.quote').attr('onmouseover',
        `
        $('#class-show').empty();
        $('#class-show').append('<img src="assets/show/quote.png" class="img-responsive" style="height:100%;width:auto;">');`
        )
    $('.date').attr('onmouseover',
        `
        $('#class-show').empty();
        $('#class-show').append('<img src="assets/show/date.png" class="img-responsive"  style="height:100%;width:auto;">');
    `
        )
    $('.place').attr('onmouseover',
        `
        $('#class-show').empty();
        $('#class-show').append('<img src="assets/show/place.png" class="img-responsive"  style="height:100%;width:auto;">');
    `
        )

}
function removeHover(){
    $('.person, .event, .institution, .quote, .date, .place').removeAttr('onmouseover')
}
// Style changer
function changeStyle(ref){
            target=$(ref).attr("href");
            var downloadButton = `
                            <button id='download-button' data-bs-toggle="modal" data-bs-target="#download-page" onclick="setTimeout(function(){
                                document.getElementById('archiveDownload').style.display = 'inherit';
                            }, 5000);" >    <!--Attiva il download dopo 5 secondi-->
                            <div class="sign">
                                        Download our Archive
                            </div>                              
                        </button>`
            switch ($('#default').attr('href')){
                case "assets/future_style.css": //inserire qui tutti i casi se avete bisogno di eseguire funzioni js. Qui mettere per eliminare elementi
                console.log('changed from future'); 
            
                future = false
                $('#download-button').replaceWith(downloadButton)
                $('#footer-icons').empty()
                $('#footer-icons').append(`<img style='width:20px;height: auto;' src="assets/icon/bbc.png">
                        <img style='width:20px;height: auto;' src="assets/icon/atlantic.png">
                        <img style='width:20px;height: auto;' src="assets/icon/cnbc.png">
                        <img style='width:20px;height: auto;' src="assets/icon/guardian.png"> 
                        <img style='width:20px;height: auto;' src="assets/icon/indipendent.png">
                        <img style='width:20px;height: auto;' src="assets/icon/nationalgeo.png">
                        <img style='width:20px;height: auto;' src="assets/icon/unibo.png">"`)
                
                removeHover()
                break
                case 'assets/style_1800.css':
                console.log('changed from 1800');
                $('#download-button').replaceWith(downloadButton)
                break

                default:
                console.log('set to default');
                            }
            switch (ref){
                case "#future": //inserire qui tutti i casi se avete bisogno di eseguire funzioni js. Qui mettere per aggiungere elementi
                console.log('changed to future'); 
                alert('This webpage has been approved by the Nostalgia Communist Party of the World. 本网页已得到世界怀旧共产党的批准。 Эта веб-страница была одобрена Всемирной коммунистической партией ностальгии. このウェブページは、「懐かしの世界共産党」が承認したものです。')
                $('#download-button').empty()
                $('#download-button').replaceWith('<div id="download-button"><div id="class-show"></div></div>')
                $('#footer-icons').empty()
                $('#footer-icons').append('<img src="assets/nostalgia-logo.png" style="height:50px!important;width:50px!important;">')
                addHover()
                future = true
                break
                case '#1800':
                console.log('Change to 1800');
                $('#download-button').empty()
                $('#download-button').append('<h2 id="bologna-adv">Bologna Advertiser</h2>')
                break
                default:
                console.log('set to default');
                break}

            $("#default").attr("href", target);

        }
// Adding topics and columns
function topicManager(topic, ref){
    loading = true;
    addTopic(topic);
    columnSetting(topic, ref);
    loading = false;

}
function addTopic(topic){
    $("header").remove()
    $("#topicHeader").replaceWith("<span id='topicHeader'><h3>" + $("#" + topic + "-title").text() + "</h3></span>");}



var column = `
            <div class="col$colwidth" id = "col-num$colnum">
                    <div class="card Meta">
                        <span class="metaTitle">
                                <h3 class="cardTitle">Metaviewer</h3>
                                

                                <img src="assets/close.png" id='close$colnum' title="Close" style="height: 1em; width: 1em; cursor: pointer;" onclick="closeArticle('#col-num$colnum');" class="closeMeta">
                        </span>            
                        <div class="row list overflow" id="metaview$colnum">
                                    <div id="metadata-list$colnum"></div>
                        </div>                         
                    </div> 
                    <div class="card overflow" id="article$colnum">
                        <h2>Art</h2>
                    </div>
                </div>`

columnListener = {}
function columnSetting(topic, ref){
    if (!(topic in columnListener) || columnListener[topic] == "0"){
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
            alert("Impossible to add more columns")
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
        
        var listItemTpl = `<li><a href='#' onclick='if(!loading){topicManager("$topic","$url");}else{alert("Opening articles too fast!")}'>$label</a></li>` //elemento che serve ad aggiungere documenti. label è la descrizione del doc e url la cipolla
        

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
                    console.log(columnListener[topic]);
                    $("#article-"+columnListener[topic]).html(d) //aggiunge un div con id file (il documento)
                    $('#title-'+ columnListener[topic]).html($("col-num-" + columnListener[topic] + " h1")) //aggiunge un div con id title scegliendo l'elemento h1 nel div con id file
                    //$('.show').prop("checked", false)
                    addIds()
                    if (future){
                        addHover()
                    }
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
            addId('.event', 'event')
            addId('.date', 'date')
            addId('.institution', 'institution')
            addId('.quote', 'quote')
            addId('#article-1 h2, #article-1 h3, #article-1 h4, #article-2 h2, #article-2 h3, #article-2 h4, #article-3 h2, #article-3 h3, #article-3 h4', 'section')
           
        }
        
        function addId(what, prefix) {
            var id = '0';
            var elements = $(what); //aggiunge un id progressivo in modo da identificare ciascun elemento della tabella
            for (var i=0; i<elements.length; i++) {
                elements[i].id = prefix + "-" + id++;
            }
        }



        function filltab(what,where) { //questo riempie le tabelle del metadata viewer
            var linkClass = what.replace(/\s/g, "-");
            linkClass = linkClass.replaceAll(".", "");
            var listFirst = `<li class="$classtodelete"><a href="$wikisource">$content</a>[$links]</li>`; //ciascun elemento ha una sua riga, rimanda all'oggetto con href e ha content come l'argomento è chiamato
            if (what.includes('date')) {
                listFirst = `<li class="$classtodelete" value='$dateValue'>$content[$links]</li>`
            }
            var listContent = `<a class="$thisclass" onclick="highlight('$originalClass', '$place')" href="$place">$number</a> `; //dal secondo elemento si pone a fianco di quello presente
            var elements = $("#"+ what); 
            seenClasses = {}; //oggetto che contiene le classi già note
            classNames = {};
            for (var i=0; i<elements.length; i++) {
                referenceClass = elements[i].getAttribute("class").toString(); //prende le classi dell'elemento e le converte a stringa e poi sostituisce gli spazi con -
                referenceClass = referenceClass.replace(/\s/g, "-");
                referenceClass =referenceClass.replace("#", "")
                referenceClass =referenceClass.replace(".", "")
                if (referenceClass in seenClasses) { //questo algoritmo crea un array contenente un elenco di numeri che si riferiscono a quando un elemento è citato
                    len = seenClasses[referenceClass].length + 1;
                    seenClasses[referenceClass].push(
                    listContent.sub({
                    place: "#" + elements[i].id, //qui non c'è # perché ha automaticamente id # e quindi veniva ##ref
                    thisclass: referenceClass,
                    originalClass: elements[i].getAttribute("class").toString(),
                    number:  len
                }))
                }
                else {
                     
                        if (elements[i].id != "#"){
                            classNames[referenceClass] = [$("#" + elements[i].id).text(), $('#' +elements[i].id).attr('source')]
                            if (what.includes('date')) {
                                classNames[referenceClass] = [$("#" + elements[i].id).text(), $('#' +elements[i].id).attr('value')]
                            }
                            seenClasses[referenceClass] = [listContent.sub({ //crea un array che contiene tutti gli elementi trovati
                            place: "#" + elements[i].id,
                            thisclass: referenceClass,
                            originalClass: elements[i].getAttribute("class").toString(),

                            number: 1
                    }
                    ) ]
                }
            

            } }
            for (const [key, value] of Object.entries(seenClasses)) {
                if (what.includes('date')) {
                    $(where).append(listFirst.sub({
                    content: classNames[key][0],
                    links: value,
                    classtodelete: linkClass,
                    dateValue: classNames[key][1]
              }))
                } else{
                    $(where).append(listFirst.sub({
                    content: classNames[key][0],
                    links: value,
                    classtodelete: linkClass,
                    wikisource: classNames[key][1]
              }))
                }
              ;
            }
            //content: elements[i].innerHTML
        }
        function basefilltab(what,where) { //questo riempie le tabelle del metadata viewer
            var list = `<li class="list-sections"><a href="#$place" onclick = "highlight('#','#$place')">$content</a></li>`;
            if (what.includes('quote')){
                list = `<li class="list-quote"><a href="#$place" onclick = "highlight('quote','#$place')">$content</a></li>`;
            }
            var elements = $('#' +what); 
        
            for (var i=0; i<elements.length; i++) {
                var str = elements[i].innerText;
                str = str.substr(0, 30);

                $(where).append(list.sub({
                    place: elements[i].id,
                    content: str + "..."
                }) )
            }
        }
function changeColumn(from, to){
    $('#col-num-' + from).attr("id", 'col-num-' + to);
    $('#article-' + from).attr("id", 'article-' + to);
    $('#metaview-' + from).attr("id", 'metaview-' + to);
    $('#metadata-list-' + from).attr("id", 'metadata-list-' + to);
}
        
function fillInfo(from, where) { //ritornare a solo 1 where
            var title =`
                <li class=$from>$title</li>
                `
            var auth = `
                <li class=$from>$author</li>`
            var pub = `
                <li class=$from>$pub</li>
                          
                ` ; //meta con le keyword
            var titlefill = $("#" + from + ' h1')[0].innerText //sceglie elementi h1 nell'elemento indicato
            var authorfill = $("#" +from + ' .auth')[0].innerText //sceglie elemento con byline con autore
            var pubfill = $("#" +from + ' .pub')[0].innerText
            $(where).append(auth.sub( {
                author: authorfill,
                from: from + "-info"}));
            
            $(where).append(pub.sub( {
                pub: pubfill,
                from: from+ "-info"}));
             $(where).append(title.sub( {
                title: titlefill,
                from: from+ "-info"
            }));
        }
activeUrls = {}
function highlight(originalClass, url){

            originalClass = "." + originalClass.replace(/\s/g, ".");
            if ($(originalClass).attr('class').includes('highlight') && url == activeUrls[originalClass]) {
                $(originalClass + '.highlight').removeClass('highlight');
                $('.pulse').removeClass('pulse');
            } else {
                        $(originalClass).addClass("highlight");
                        $(url).addClass('pulse');
                        activeUrls[originalClass] = url
                           }
}
function sortList(listid) {
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById(listid);
  switching = true;

  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = list.getElementsByTagName("LI");
    // Loop through all list items:
    for (i = 0; i < (b.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Check if the next item should
      switch place with the current item: */
      if (b[i].innerText.toLowerCase() > b[i + 1].innerText.toLowerCase()) {
        /* If next item is alphabetically lower than current item,
        mark as a switch and break the loop: */
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}
function sortDate(listid) {
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById(listid);
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = list.getElementsByTagName("LI");
    console.log(b);
    // Loop through all list items:
    for (i = 0; i < (b.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Check if the next item should
      switch place with the current item: */
      date1= new Date(b[i].value)
      date2= new Date(b[i+1].value)
      if (date1 > date2) {
        /* If next item is alphabetically lower than current item,
        mark as a switch and break the loop: */
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}

