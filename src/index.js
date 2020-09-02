const URL = `http://localhost:3000/quotes?_embed=likes`
const quoteUL = document.getElementById("quote-list")
const submitForm = document.getElementById("new-quote-form")
submitForm.addEventListener('submit', handleForm)
let sorted = false 
let quoteCollection = []
fetch(URL)
.then(res => res.json())
.then(quoteArray => quoteArray.forEach(quote => renderQuotes(quote)))

 

let sortBtn = document.createElement('button')
sortBtn.addEventListener('click', sortQuotes)
sortBtn.innerText = "Sort"
document.querySelector('div').prepend(sortBtn)

function renderQuotes(quote) { 
    quoteCollection.push(quote)
  let quotArg = quote
    let quoteLi = document.createElement('li')
    quoteLi.className = "quote-card"
    quoteLi.dataset.id = quote.id
   
     
    let quoteBlock = document.createElement('blockquote')
     quoteBlock.className = "blockquote"
     
     let quoteP = document.createElement('p')
     quoteP.innerText = quote.quote
     quoteP.className = "mb-0"

     let quoteFooter = document.createElement('footer')
     quoteFooter.innerText = quote.author 
     quoteFooter.className = 'blockquote-footer'
     
     let quoteSpan = document.createElement('span')
     quoteSpan.innerText = `${quote.likes.length}`

     let likeBtn = document.createElement('button')
     likeBtn.className = "btn-success"
     likeBtn.innerText = "Likes:"

     let deleteBtn = document.createElement('button')
     deleteBtn.className = "btn-danger" 
    deleteBtn.innerText = "Delete"
    
    
    //Event Listeners 
    deleteBtn.addEventListener('click', (e) => { 
         fetch("http://localhost:3000/quotes/" + `${quote.id}`, { 
             method: "DELETE"
         })
         quoteLi.remove()
    })

    likeBtn.addEventListener('click', (e) => { 
        let configObj = { 
            method: "POST", 
            headers: {
                "Content-Type" : "Application/JSON"
            }, 
            body: JSON.stringify({quoteId: quote.id})
        }
        fetch(`http://localhost:3000/likes`,configObj)
        .then( res => res.json())
        .then( data => console.log(data))
        
        let newLikes = parseInt(quoteSpan.innerText) 
        quoteSpan.innerText = newLikes += 1 
    })

    likeBtn.append(quoteSpan)
    quoteBlock.append(quoteP,quoteFooter,likeBtn,deleteBtn)
    quoteLi.append(quoteBlock)
    quoteUL.append(quoteLi)
    

   


}


function handleForm(e){ 
    e.preventDefault()
   let quote =  e.target[0].value
   let author = e.target[1].value
   let likes =  []
   let configObj = { 
       method: "POST", 
       headers: {
           "Content-Type" : "Application/JSON"
       }, 
       body: JSON.stringify({quote, author, likes})
   }

   fetch("http://localhost:3000/quotes", configObj)
   .then(res => res.json())
   .then(quote => renderQuotes(quote))

}

function sortQuotes(){ 
    if (sorted == false){
 let quoteTestArray = [...quoteCollection]
 
    function compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const quoteA = a.author.toUpperCase();
        const quoteB = b.author.toUpperCase();
      
        let comparison = 0;
        if (quoteA > quoteB) {
          comparison = 1;
        } else if (quoteA < quoteB) {
          comparison = -1;
        }
        return comparison;
      }
      
      quoteTestArray.sort(compare)
      quoteUL.innerHTML = ""
      quoteTestArray.forEach(quote => renderQuotes(quote))
    } 
    else{ 
        quoteUL.innerHTML = ""
         quoteCollection.forEach(quote => renderQuotes(quote))
    }
}

