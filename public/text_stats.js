const textStats = (e) => {
    e.preventDefault();
    const review = document.getElementById('review').value;
    const options = {
      method: 'POST',
      body: JSON.stringify({ review }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }
  
    const statsSection = document.getElementById('statsSection');
   
   
  
    fetch('/text_stats', options)
      .then(res => res.json())
      .then (({ ans_m }) => {
       
       
       ans_m = ans_m.replace("[","");
        ans_m = ans_m.replace("]","");
        ans_m = ans_m.split(",");
          statsSection.innerHTML = '<p>'+ans_m[0]+'</p> -- ' + ans_m[4];
       
      
       
      })
      .catch(err => {
        emojiSection.innerHTML = 'There was an error processing your request!'
      })
  }
  
  document.getElementById('review').addEventListener('keyup', textStats);
  // document.getElementById('reviewForm').addEventListener('submit', submitReview);