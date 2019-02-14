const url = '../docs/elssponsorshippackage.pdf';

// global variables
let pdfDoc = null,
    pageNum = 1,
    pageIssRendering = false,
    pageNumIsPending = null;



const scale = 2,
    canvas = document.querySelector('#pdf-render'),
    ctx = canvas.getContext('2d');


const renderPage = (num) => {
    pageIssRendering = true;

    // get page
    pdfDoc.getPage(num).then(page => {
        //scale
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        }
        page.render(renderCtx).promise.then(() => {
            pageIssRendering = false;
            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });
        document.querySelector('#page-num').textContent = num;
    });

}

// check for pages rendering

const queueRenderPage = num => {
    if (pageIssRendering) {
        pageNumIsPending = num;

    } else {
        renderPage(num);
    }
}


// show previous page 
const showPrevPage = () => {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum)
}

const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum)
}

// get documention

pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    console.log(pdfDoc); //used to find out the number of pages\
    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);

});


// button events for page render
document.querySelector('#prev-page').addEventListener('click', showPrevPage)
document.querySelector('#next-page').addEventListener('click', showNextPage)