$('.person').mouseover(
    $('#class-show').empty()
    console.log('pass');
    )
$('.event').mouseover(
    $('#class-show').empty()
    )
$('.institution').mouseover(
    $('#class-show').empty()
    )
$('.quote').mouseover(
    $('#class-show').empty()
    )
$('.date').mouseover(
    $('#class-show').empty()
    )
$('person').mouseover(
    $('#class-show').empty()
    )

function topicise() {
    //console.log("analysing "+sentences.length+" sentences...");
    var documents = new Array();
    var f = {};
    var vocab=new Array();
    var docCount=0;
    for(var i=0;i<sentences.length;i++) {
        if (sentences[i]=="") continue;
        var words = sentences[i].split(/[\s,\"]+/);
        if(!words) continue;
        var wordIndices = new Array();
        for(var wc=0;wc<words.length;wc++) {
            var w=words[wc].toLowerCase().replace(/[^a-z\'A-Z0-9 ]+/g, '');
            //TODO: Add stemming
            if (w=="" || w.length==1 || stopwords[w] || w.indexOf("http")==0) continue;
            if (f[w]) { 
                f[w]=f[w]+1;            
            } 
            else if(w) { 
                f[w]=1; 
                vocab.push(w); 
            };  
            wordIndices.push(vocab.indexOf(w));
        }
        if (wordIndices && wordIndices.length>0) {
            documents[docCount++] = wordIndices;
        }
    }
        
    var V = vocab.length;
    var M = documents.length;
    var K = parseInt($( "#slidertopics" ).val());
    var alpha = 0.1;  // per-document distributions over topics
    var beta = .01;  // per-topic distributions over words

    lda.configure(documents,V,10000, 2000, 100, 10);
    lda.gibbs(K, alpha, beta);

    var theta = lda.getTheta();
    var phi = lda.getPhi();

    var text = '';

    //topics
    var topTerms=20;
    var topicText = new Array();
    for (var k = 0; k < phi.length; k++) {
        text+='<canvas id="topic-cloud'+k+'" class="topicbox color'+k+'"><ul>';
        var tuples = new Array();
        for (var w = 0; w < phi[k].length; w++) {
             tuples.push(""+phi[k][w].toPrecision(2)+"_"+vocab[w]);
        }
        tuples.sort().reverse();
        if(topTerms>vocab.length) topTerms=vocab.length;
        topicText[k]='';
        for (var t = 0; t < topTerms; t++) {
            var topicTerm=tuples[t].split("_")[1];
            var prob=parseInt(tuples[t].split("_")[0]*100);
            if (prob<0.0001) continue;
            text+=( '<li><a href="javascript:void(0);" data-weight="'+(prob)+'" title="'+prob+'%">'+topicTerm +'</a></li>' );           
            console.log("topic "+k+": "+ topicTerm+" = " + prob  + "%");
            topicText[k] += ( topicTerm +" ");
        }
        text+='</ul></canvas>';
    }
    $('#topiccloud').html(text);
    
    
    
    for (var k = 0; k < phi.length; k++) {
        if(!$('#topic-cloud'+k).tagcanvas({
              textColour: $('#topic-cloud'+k).css('color'),
              maxSpeed: 0.05,
             initial: [(Math.random()>0.5 ? 1: -1) *Math.random()/2,(Math.random()>0.5 ? 1: -1) *Math.random()/2],  //[0.1,-0.1],
              decel: 0.98,
              reverse: true,
              weightSize:10,
              weightMode:'size',
              weightFrom:'data-weight',
              weight: true
            })) 
        {
            $('#slidertopics'+k).hide();
        } else {
            //TagCanvas.Start('#slidertopics'+k);
        }
    }
}

$(document).ready(function(){
    var select = $( "#slidertopics" );
})

function btnTopiciseClicked() {
    $('#btnTopicise').attr('disabled','disabled');
    sentences = $('#article-1, #article-2, #article-3').text().split("\n");
    topicise();
    $('#btnTopicise').removeAttr('disabled');

    
}

var sentences;
function makeArray(x) {
	var a = new Array();	
	for (var i=0;i<x;i++)  {
		a[i]=0;
	}
	return a;
}

function make2DArray(x,y) {
	var a = new Array();	
	for (var i=0;i<x;i++)  {
		a[i]=new Array();
		for (var j=0;j<y;j++)
			a[i][j]=0;
	}
	return a;
}

var lda = new function() {
	var documents,z,nw,nd,nwsum,ndsum,thetasum,phisum,V,K,alpha,beta; 
    var THIN_INTERVAL = 20;
    var BURN_IN = 100;
    var ITERATIONS = 1000;
    var SAMPLE_LAG;
    var dispcol = 0;
	var numstats=0;
	this.configure = function (docs,v,iterations,burnIn,thinInterval,sampleLag) {
        this.ITERATIONS = iterations;
        this.BURN_IN = burnIn;
        this.THIN_INTERVAL = thinInterval;
        this.SAMPLE_LAG = sampleLag;
		this.documents = docs;
		this.V = v;
		this.dispcol=0;
		this.numstats=0; 
    }
	this.initialState = function (K) {
        var i;
        var M = this.documents.length;
        this.nw = make2DArray(this.V,K); 
        this.nd = make2DArray(M,K); 
        this.nwsum = makeArray(K); 
        this.ndsum = makeArray(M);
        this.z = new Array();	for (i=0;i<M;i++) this.z[i]=new Array();
        for (var m = 0; m < M; m++) {
            var N = this.documents[m].length;
            this.z[m] = new Array();
            for (var n = 0; n < N; n++) {
                var topic = parseInt(""+(Math.random() * K));                 
                this.z[m][n] = topic;
                this.nw[this.documents[m][n]][topic]++;
                this.nd[m][topic]++;
                this.nwsum[topic]++;
            }
            this.ndsum[m] = N;
        }
    }
	
	this.gibbs = function (K,alpha,beta) {
		var i;
        this.K = K;
        this.alpha = alpha;
        this.beta = beta;
        if (this.SAMPLE_LAG > 0) {
            this.thetasum = make2DArray(this.documents.length,this.K);
            this.phisum = make2DArray(this.K,this.V);
            this.numstats = 0;
        }
        this.initialState(K);
        //document.write("Sampling " + this.ITERATIONS
         //   + " iterations with burn-in of " + this.BURN_IN + " (B/S="
         //   + this.THIN_INTERVAL + ").<br/>");
        for (i = 0; i < this.ITERATIONS; i++) {
			for (var m = 0; m < this.z.length; m++) {
                for (var n = 0; n < this.z[m].length; n++) {
			        var topic = this.sampleFullConditional(m, n);
					this.z[m][n] = topic;
                }
            }
            if ((i < this.BURN_IN) && (i % this.THIN_INTERVAL == 0)) {
				//document.write("B");
                this.dispcol++;
            }
            if ((i > this.BURN_IN) && (i % this.THIN_INTERVAL == 0)) {
                //document.write("S");
                this.dispcol++;
            }
            if ((i > this.BURN_IN) && (this.SAMPLE_LAG > 0) && (i % this.SAMPLE_LAG == 0)) {
                this.updateParams();
				//document.write("|");                
                if (i % this.THIN_INTERVAL != 0)
                    this.dispcol++;
            }
            if (this.dispcol >= 100) {
				//document.write("*<br/>");                
                this.dispcol = 0;
            }
        }
    }
	
	
	this.sampleFullConditional = function(m,n) {
        var topic = this.z[m][n];
        this.nw[this.documents[m][n]][topic]--;
        this.nd[m][topic]--;
        this.nwsum[topic]--;
        this.ndsum[m]--;
        var p = makeArray(this.K);
        for (var k = 0; k < this.K; k++) {
            p[k] = (this.nw[this.documents[m][n]][k] + this.beta) / (this.nwsum[k] + this.V * this.beta)
                * (this.nd[m][k] + this.alpha) / (this.ndsum[m] + this.K * this.alpha);
        }
        for (var k = 1; k < p.length; k++) {
            p[k] += p[k - 1];
        }
        var u = Math.random() * p[this.K - 1];
        for (topic = 0; topic < p.length; topic++) {
            if (u < p[topic])
                break;
        }
        this.nw[this.documents[m][n]][topic]++;
        this.nd[m][topic]++;
        this.nwsum[topic]++;
        this.ndsum[m]++;
        return topic;
    }
	
	this.updateParams =function () {
        for (var m = 0; m < this.documents.length; m++) {
            for (var k = 0; k < this.K; k++) {
                this.thetasum[m][k] += (this.nd[m][k] + this.alpha) / (this.ndsum[m] + this.K * this.alpha);
            }
        }
        for (var k = 0; k < this.K; k++) {
            for (var w = 0; w < this.V; w++) {
                this.phisum[k][w] += (this.nw[w][k] + this.beta) / (this.nwsum[k] + this.V * this.beta);
            }
        }
        this.numstats++;
    }
	
	this.getTheta = function() {
        var theta = new Array(); for(var i=0;i<this.documents.length;i++) theta[i] = new Array();
        if (this.SAMPLE_LAG > 0) {
            for (var m = 0; m < this.documents.length; m++) {
                for (var k = 0; k < this.K; k++) {
                    theta[m][k] = this.thetasum[m][k] / this.numstats;
                }
            }
        } else {
            for (var m = 0; m < this.documents.length; m++) {
                for (var k = 0; k < this.K; k++) {
                    theta[m][k] = (this.nd[m][k] + this.alpha) / (this.ndsum[m] + this.K * this.alpha);
                }
            }
        }
        return theta;
    }
	
	this.getPhi = function () {
        var phi = new Array(); for(var i=0;i<this.K;i++) phi[i] = new Array();
        if (this.SAMPLE_LAG > 0) {
            for (var k = 0; k < this.K; k++) {
                for (var w = 0; w < this.V; w++) {
                    phi[k][w] = this.phisum[k][w] / this.numstats;
                }
            }
        } else {
            for (var k = 0; k < this.K; k++) {
                for (var w = 0; w < this.V; w++) {
                    phi[k][w] = (this.nw[w][k] + this.beta) / (this.nwsum[k] + this.V * this.beta);
                }
            }
        }
        return phi;
    }
}