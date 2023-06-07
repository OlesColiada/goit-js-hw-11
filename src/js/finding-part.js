export function onClick (e, findThisValue){
    e.preventDefault();
        
    return fetch(`https://pixabay.com/api/?key=37016311-3dc5b9efa70d4a338f2adabe8&q=${findThisValue}&image_type=photo`)
    .then(r=>{console.log(r.json());})
    .catch(error=>console.log(error))
}
