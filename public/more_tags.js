const moreTags = (e) => {
    e.preventDefault();
    const review = document.getElementById('review').value;
    const options = {
      method: 'POST',
      body: JSON.stringify({ review }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }
  
    const Tagss = document.getElementById('Tagss');
  
  
    fetch('/more_tags', options)
      .then(res => res.json())
      .then (({ value }) => {

        
          // Tagss.innerHTML = '<p>'+analysis+'</p>';
        
       console.log(typeof value);

         value = value.split(" % ");
      

          for(var i = 0 ; i < value.length ; i++){
          
          // Tagss.innerHTML += "<p>"+ll_c[i]+"</p>"
              var k = value[i].trim();
             k[0] = k[0].toUpperCase();
               Tagss.innerHTML += `<p><a href = "/related_tag/${k}" target = "_blank">${k}</a></p>`
          //'<p><a href = "/related_tag/'+value[i]+' "' + 'target = "_blank">'+value[i]+'</a></p>';


          }

      


      })
      .catch(err => {
        Tagss.innerHTML += 'There was an error processing your request!'
      })
  }
  
  document.getElementById('getTags').addEventListener('click', moreTags);
  // document.getElementById('reviewForm').addEventListener('submit', submitReview);