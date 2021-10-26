const express = require('express');
const app = express();
const body = require('body-parser');
var encoder = body.urlencoded();
const {render} = require('ejs');
const bodyparser = require('body-parser');
const OpenAI = require('openai-api');
const OPENAI_API_KEY = "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";
const got = require('got');
const googleTrends = require('google-trends-api');
const  googleIt = require('google-it');
const spawn = require('child_process').spawn;

const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');
const cullKeywords = require('cull-keywords');
const fs = require('fs');
const download = require('download');
app.set('view engine' , 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));
app.use(bodyparser.urlencoded({extended : true })); 
app.use(express.json());

var nlpRouter = require('./routes/senti');

app.use('/sentiments/api/nlp', nlpRouter);


app.get('/' , (req , res)=>{

    res.render('home');

})

function removeByteOrderMark(str){
  return str.replace(/^\ufeff/g,"")
}


app.post("/download" , encoder , function(req , res){

  fs.writeFile('content.txt', 'Hello World!', function (err) {
    if (err) return console.log(err);
  

const file = 'content.txt';
const filePath = `${__dirname}/files`;

download(file,filePath)
.then(() => {
	console.log('Download Completed');
}).catch((err)=>{
console.log(err);
})
  });
  

});

app.post("/text_stats" , encoder , function(req , res){

  const { review } = req.body;

console.log("%%--" + review);
console.log(typeof review);

  var ans = [];

  const process = spawn('python', ['./text_stat.py', review]);
  process.stdout.on('data', data => {

    ans.push(data); 

    });

      process.on('close', (code) => {

         var ans_m = ans.join("");
         console.log("--"+ans_m);
       
         res.status(200).json({ ans_m });
       
       });



});

app.post("/more_tags" , encoder , function(req , res){

  const { review } = req.body;

  const lexedReview = aposToLexForm(review);

  const prompt = "Text " + lexedReview + " Keywords  ";

  ////

  cullKeywords(prompt, 'format')
  .then(results => {
  
    var key_arr = results.keyphrases;

    console.log(key_arr);
    let done_req= async () => {
    var ans = [];

    
     for(var i = 0 ; i<key_arr.length ; i++){


      //////
     
      await googleTrends.relatedTopics({keyword: key_arr[i] , geo : 'IN'})
        .then((restr) => {

        const result = JSON.parse(restr);

            var cap = Math.min(result.default.rankedList[0].rankedKeyword.length,8);
        
            for(var i = 0 ; i<cap ; i++){
              console.log(result.default.rankedList[0].rankedKeyword[i].topic.title);
              ans.push(result.default.rankedList[0].rankedKeyword[i].topic.title);
            }
           
          
        })
      .catch((err) => {
           console.log(err);
          res.render('pad' , {value : ['title 1' , 'title 2' , 'title 3','title 1' , 'title 2' , 'title 3'] , title : "Hello" , desc : "Hello"});
         
        })

     


      }
  
      return [...new Set(ans)].join(" % ");
    };

    done_req().then((value)=>
    res.status(200).json({ value })
      )

      /////

  })
  .catch(err => {console.log(err);})

  ////

 

});

app.post("/title" , encoder , function(req , res){

    var tag = req.body.country;

    googleTrends.dailyTrends({
        trendDate: new Date(),
        geo: tag,
      }, function(err, results) {
        if (err) {
          console.log(err);
        }else{

            const result =JSON.parse(results);
            res.render('title' , {result});
         
        }
      });

});

var topic_main = "";
var desc_main  = "";

app.post("/ai_title" , encoder , function(req , res){

    var desc  = req.body.des;
    var seedw  = req.body.ran;

    var prompt = "This is a article name generator\n\Article description: An article about Indian people and their culture and the country's history.\nSeed words: Nation , pride , Valour , Unity , Indian , Peace \n Article names: India on Fire , The Ultimate Nation , The country of love , Growing Nation , The Great Indian History \n\n Article description: "+ desc + "\n Seed words:"+ seedw + "\n Article names:";

    (async () => {
        const url = 'https://api.openai.com/v1/engines/davinci/completions';
        const params = {
            "prompt": prompt,
            "temperature": 0.8,
            "max_tokens": 100,
            "top_p": 1.0,
            "frequency_penalty": 0.0,
            "presence_penalty": 0.0,
            "stop": ["\n"]
        };
        const headers = {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        };
      
        try {
          const response = await got.post(url, { json: params, headers: headers }).json();
          output = `${response.choices[0].text}`;
          console.log(response);
          res.render('ai_title' , {output})
        } catch (err) {
          console.log(err);
        }
      })();

});


function getGoogle(que) {
  return new Promise(function (resolve, reject) {
    googleIt({'query': que  , 'limit': 100}).then(resultss => {
      // console.log(typeof results);
      // resultss = JSON.parse(resultss);
      var resq = resultss[0].link;
      resolve(resq);
      // console.log();
    }).catch(ee => {
      reject(ee);
    })
  });
}

app.post("/pad" , encoder , function(req , res){

  var title = req.body.heading;
  var desc = req.body.des;

  topic_main = title;
  desc_main = desc;

  desc = desc.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  title = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  var prompt = title + " " + desc; 
 
  cullKeywords(prompt, 'format')
  .then(results => {
  
    var key_arr = results.keyphrases;

    console.log(key_arr);
    let done_req= async () => {
    var ans = [];

    
     for(var i = 0 ; i<key_arr.length ; i++){


      //////
     
      await googleTrends.relatedTopics({keyword: key_arr[i] , geo : 'IN'})
        .then((restr) => {

        const result = JSON.parse(restr);

            var cap = Math.min(result.default.rankedList[0].rankedKeyword.length,8);
        
            for(var i = 0 ; i<cap ; i++){
              console.log(result.default.rankedList[0].rankedKeyword[i].topic.title);
              ans.push(result.default.rankedList[0].rankedKeyword[i].topic.title);
            }
           
          
        })
      .catch((err) => {
           console.log(err);
          res.render('pad' , {value : ['title 1' , 'title 2' , 'title 3','title 1' , 'title 2' , 'title 3'] , title : "Hello" , desc : "Hello"});
         
        })

     


      }
  
      return [...new Set(ans)];
    };

    done_req().then((value)=>
    res.render('pad' , { value , title, desc})     
      )

      /////

  })
  .catch(err => {console.log(err);})

});

var vis_links = [];
app.get("/related_tag/:r_tag" , function(req , res){

 var rt = req.params.r_tag;

 googleIt({'query': req.params.r_tag , 'limit': 10}).then(results => {
  vis_links.push(results[2].link);
  
  res.redirect(results[2].link);
}).catch(e => {
  console.log(e);
})

});

app.get("/print_vis_links" , function(req , res){

  console.log("--: " + vis_links);
 
 });


app.get("/ai_generate" , function(req , res){

  res.render('ai_text');
 
 });


 app.post("/ai_generate" , encoder ,function(req , res){

  var desc  = req.body.des;
  

  var prompt = `${desc} + \n Introduction`;

  (async () => {
      const url = 'https://api.openai.com/v1/engines/davinci/completions';
      const params = {
          "prompt": prompt,
          "temperature": 0.7,
          "max_tokens": 200,
          "top_p": 1.0,
          "frequency_penalty": 0.0,
          "presence_penalty": 0.0
      };
      const headers = {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      };
    
      try {
        const response = await got.post(url, { json: params, headers: headers }).json();
        output2 = `${response.choices[0].text}`;
        console.log(response);
        res.render('ai_text' , {output2})
      } catch (err) {
        console.log(err);
      }
    })();

 
 });



 app.post("/report" , encoder ,function(req , res){

  var article_data  = req.body.review;
  

  var prompt = `My second grader asked me what this passage means:
  """ \n ${article_data}  \n """
  I rephrased it for him, in plain language a second grader can understand:
  """`;


  var prompt2 = "Text " + article_data + " Keywords";

  (async () => {
      const url = 'https://api.openai.com/v1/engines/davinci/completions';
      const params = {
          "prompt": prompt,
          "temperature": 0,
          "max_tokens": 60,
          "top_p": 1.0,
          "frequency_penalty": 0.0,
          "presence_penalty": 0.0,
          "stop": ["\"\"\""]
      };
      const headers = {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      };
    
      try {
        const response = await got.post(url, { json: params, headers: headers }).json();
        summary_out = `${response.choices[0].text}`;
        // console.log(response);
        // res.render('ai_text' , {output2})

        ///

        (async () => {
         

          cullKeywords(article_data, 'format')
        .then(keywords_out => {
          const process = spawn('python', ['./plag_check.py', article_data, [...new Set(vis_links)]]);
          process.stdout.on('data', data => {

            ans.push(data); 

            });

              process.on('close', (code) => {

                 var ans_m = ans.join("");
                 ans_m = ans_m.split("}");
               
                 res.render('report' , {summary_out , keywords_out, ans_m , article_data});
              })
            })
           .catch(err => console.log(err) );
           
            ////////

        
        })();

        ////


      } catch (err) {
        console.log(err);
      }
    })();

 
 });

app.listen(6969);