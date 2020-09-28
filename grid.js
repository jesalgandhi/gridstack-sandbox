var booksArray = [
    {"ISBN": '0385504209', "bookURL": "https://images.penguinrandomhouse.com/cover/9780767926034"},
    {"ISBN": '0143039431', "bookURL": "https://upload.wikimedia.org/wikipedia/commons/a/ad/The_Grapes_of_Wrath_%281939_1st_ed_cover%29.jpg"},
    {"ISBN": '0743273567', "bookURL": "https://prodimage.images-bn.com/pimages/9780743273565_p0_v8_s550x406.jpg"},
    {"ISBN": '0743297334', "bookURL": "https://upload.wikimedia.org/wikipedia/commons/8/8b/The_Sun_Also_Rises_%281st_ed._cover%29.jpg"},
    {"ISBN": '0553283685', "bookURL": "http://books.google.com/books/content?id=wDVV6y-8YHEC&printsec=frontcover&img=1&zoom=1&source=gbs_api"}
]

// NOT USED:
GridStack.prototype.assign = function() {
    grid.engine.nodes.forEach((node, index) => {

        Object.defineProperty(node, 'ISBN', {
                value: booksArray[index].ISBN, // retrieve this value from DB (books-->book-->ISBN), and call after adding book 
                writable: true // allows ISBN to be written over; might have to change this tbh
        })

        Object.defineProperty(node, 'bookURL', {
            value: booksArray[index].bookURL, 
            writable: true
        })
})
}

var grid = GridStack.init({
    column: 8, 
    animate: true, 
    //kinda wonky -->  float: true,
    removable: true,
    rtl: true,
    alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})

const addBooks = () => {
    grid.batchUpdate()
    booksArray.forEach((book, index) => {
        grid.addWidget(`
        <div>
            <div class="grid-stack-item-content">  
                <img src="${book.bookURL}" class="book-cover" id=${book.ISBN}></img>
                <div class="button-group">
                    <a href="something" class="button4" style="background-color:#f21832"><i class="fa fa-minus-circle"></i></a>

                    <button class="btn button4" data-toggle="modal" data-target="#exampleModalLong" style="background-color:#4f21cf"><i class="fa fa-info-circle"></i></button>
                    
                    <a href="something" class="button4" style="background-color:#18de54"><i class="fa fa-check"></i></a>  
                </div>  
            </div>
        </div>`, {
            width: 2,
            height: 3,
            noResize: true,
            staticGrid: true
        })

        grid.engine.nodes[index].ISBN = book.ISBN
        grid.engine.nodes[index].bookURL = book.bookURL

        console.log(document.querySelector('.book-cover').id)

    })
    grid.commit()  
    console.log(grid.engine.nodes)
}

const saveGrid = () => {
    serializedData = []
    console.log(grid.engine.nodes)
    grid.batchUpdate()
    grid.engine.nodes.forEach((node, index) => {
        console.log(node.el)
        console.log(node.ISBN)
        console.log(node.bookURL)
        serializedData.push({
                x: node.x,
                y: node.y,
                width: 2,
                height: 3,
                noResize: true,
                ISBN: node.ISBN,
                bookURL: node.bookURL
        })
    })
    serializedData.sort()
    grid.commit()
    // STORE serializedData IN the DB at this point
    console.log(JSON.stringify(serializedData, null, '  '))
    console.log(grid.engine.nodes.length)
  }


const loadGrid = () => {
    // empty the grid first:
    grid.removeAll({detachNode:false}) //{detachNode: false}
    // grid.assign()
    console.log(serializedData)
    var items = GridStack.Utils.sort(serializedData)
    console.log(items)
    grid.batchUpdate()
    items.forEach((node, index) => {
        grid.addWidget(`
        <div>
            <div class="grid-stack-item-content">  
                <img src="${node.bookURL}" class="book-cover"></img>
                <div class="button-group">
                    <a href="something" class="button4" style="background-color:#f21832"><i class="fa fa-minus-circle"></i></a>
                    <a href="something" class="button4" style="background-color:#4f21cf"><i class="fa fa-info-circle"></i></a>
                    <a href="something" class="button4" style="background-color:#18de54"><i class="fa fa-check"></i></a>  
                </div>  
            </div>
        </div>`, node)

        grid.engine.nodes[index].ISBN = node.ISBN
        grid.engine.nodes[index].bookURL = node.bookURL

        console.log(node)

    })
    grid.commit()
    console.log(grid.engine.nodes.length)
    console.log(grid.engine.nodes)
  }

// window.onload = loadGrid()
window.onload = addBooks()
window.onload = saveGrid()
// window.onload = loadGrid()