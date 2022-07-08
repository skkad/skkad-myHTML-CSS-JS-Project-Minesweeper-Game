document.addEventListener('DOMContentLoaded',()=>{

    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const result = document.querySelector('#result');

    let width =10;
    let flags = 0;
    let squares = [];
    let bombAmount = 20;
    let isGameOver = false;

// create Board
    function createBoard(){
        flagsLeft.innerHTML = bombAmount;


        // get suffled array with random bomb
        const bombArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array((width*width)-bombAmount).fill('valid');
        // console.log(bombArray);
        // console.log(emptyArray);
        const gameArray = emptyArray.concat(bombArray);
        const shuffledArray = gameArray.sort(()=> Math.random() - 0.5);
        // console.log(shuffledArray);

        for(let i=0;i<width*width;i++){
            const square = document.createElement("div")
            square.setAttribute('id',i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            //normal click
            square.addEventListener('click',function(e) {
                clickSquareAction(square)
            })

            //ctrl and left click
            square.oncontextmenu = function(e){
                e.preventDefault()
                addFlag(square)
            }
        }

        // add numbers
        for(let i=0;i<squares.length;i++){
            let total = 0;
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width-1);

            // if(squares[i].classList.contains('valid')){
            //     if(i>0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) total++
            //     if(i>9 && !isRightEdge && squares[i+1-width].classList.contains('bomb'))total++
            //     if(i>10 && squares[i-width].classList.contains('bomb')) total++
            //     if(i>11 && !isLeftEdge && squares[i-1-width].classList.contains('bomb'))total++
            //     if(i<98 && !isRightEdge && squares[i+1].classList.contains('bomb')) total++
            //     if(i<90 && !isLeftEdge && squares[i-1+width].classList.contains('bomb')) total++
            //     if(i<88 && !isRightEdge && squares[i+1+width].classList.contains('bomb')) total++
            //     if(i<89 && squares[i+width].classList.contains('bomb')) total++

            //     squares[i].setAttribute('data',total)   
            // }

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) {
                    total ++
                }
                if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) {
                    total ++
                }
                if (i > 10 && squares[i -width].classList.contains('bomb')) {
                    total ++
                }
                if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) {
                    total ++
                }
                if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) {
                    total ++
                }
                if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) {
                    total ++ 
                }
                if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) {
                    total ++
                }
                if (i < 89 && squares[i +width].classList.contains('bomb')) {
                    total ++ 
                }
                squares[i].setAttribute('data', total)
            }
        }
    }

    createBoard()

    // add flag with right click
    function addFlag(square){
        if(isGameOver) return
        if(!square.classList.contains('checked') && (flags<bombAmount)){
            if(!square.classList.contains('flag')){
                square.classList.add('flag')
                square.innerHTML = ' 🚩'
                flags++
                flagsLeft.innerHTML = bombAmount-flags
                checkForWin()
                
            }else{
                square.classList.remove('flag')
                square.innerHTML = ""
                flags--
                flagsLeft.innerHTML = bombAmount-flags
            }
        }
    }

    // click on square action
    function clickSquareAction(square){
        let currId = square.id
        if(isGameOver) return
        if(square.classList.contains('checked') || square.classList.contains('flag')) return
        if(square.classList.contains('bomb')){
            gameOver(square)
        }else{
            let total = square.getAttribute('data')
            if(total != 0){
                square.classList.add('checked')
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                square.innerHTML = total
                // result.innerHTML = "Score : " + total;
                return
            }
            checkSquare(square,currId)
        }
        square.classList.add('checked')
    }


    //check neighboring squares once square is clicked
    function checkSquare(square,currId){
        const isLeftEdge = (currId % width ===0)
        const isRightEdge = (currId % width === width-1)

        setTimeout(()=>{
            if(currId>0 && !isLeftEdge){
                const newId = squares[parseInt(currId) -1].id
                const newSquare = document.getElementById(newId)
                clickSquareAction(newSquare)
            }

            if(currId>9 && !isRightEdge){
                const newId = squares[parseInt(currId) +1-width].id
                const newSquare = document.getElementById(newId)
                clickSquareAction(newSquare)  
            }
            if(currId>10 ){
                const newId = squares[parseInt(currId-width) ].id
                const newSquare = document.getElementById(newId)
                clickSquareAction(newSquare)
            }
            if(currId>11 && !isLeftEdge){
                const newId = squares[parseInt(currId) -1-width].id
                const newSquare = document.getElementById(newId)
                clickSquareAction(newSquare)
            }
            if(currId<98 && !isRightEdge){
                const newId = squares[parseInt(currId)+1].id
                const newSquare = document.getElementById(newId)
                clickSquareAction(newSquare)
            }
            if(currId<90 && !isLeftEdge){
                const newId = squares[parseInt(currId)-1+width].id
                const newSquare = document.getElementById(newId)
                clickSquareAction(newSquare)
            }
            if(currId<88 && !isRightEdge){
                const newId = squares[parseInt(currId)+1+width].id
                const newSquare = document.getElementById(newId)
                clickSquareAction(newSquare)
            }
            if(currId<89){
                const newId = squares[parseInt(currId)+width].id
                const newSquare = document.getElementById(newId)
                clickSquareAction(newSquare)
            }
        },10)
    }

    //game over
    function gameOver(square){
        // console.log("BOOM! game ovr")
        result.innerHTML = "BOOM! Game Over"
        isGameOver = true
        
        //show all bombs
        squares.forEach(square => {
            if(square.classList.contains('bomb')){
                square.innerHTML = '💣'
                square.classList.remove('bomb')
                square.classList.add('checked')
            }
        })
    }


    function checkForWin(){
        let matches = 0
        for(let i=0;i<squares.length;i++){
            if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                matches++
            }
            if(matches === bombAmount){
                // console.log("you win")
                result.innerHTML = "You Win!"
                isGameOver = true
            }
        }
    }
})