import { notification } from 'antd';

const pdfjsLib = window['pdfjs-dist/build/pdf'];

pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.js';
if (process.env.NODE_ENV === 'production') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `${PUBLICPATH}js/pdf.worker.js`;
}

let pdfLoadingTask;
let pdfDoc;
let pdfCanvas;
let pdfCtWidth;
let pdfCanvasCxt;
let pdfRendering;
let scaleMin;
const scaleMax = 4;
let pdfScale;
let pageNum = 1;

function renderInit(cb) {
    pdfDoc.getPage(pageNum).then(
        page => {

            pdfRendering = true;
            scaleMin = 1;
            let viewport = page.getViewport(1);

            if (pdfCtWidth < viewport.width) {
                scaleMin = pdfCtWidth / viewport.width;
                viewport = page.getViewport(scaleMin);
            }

            pdfScale = scaleMin;
            pdfCanvas.height = viewport.height;
            pdfCanvas.width = viewport.width;

            const renderContext = {
                canvasContext: pdfCanvasCxt,
                viewport
            };
            page.render(renderContext).then(
                () => {
                    pdfRendering = false;
                    if (cb) {
                        cb(pdfDoc.numPages);
                    }
                }
            );
        }
    );

}
// eslint-disable-next-line
function _loadPdf(url, canvas, width, cb) {

    pdfLoadingTask = pdfjsLib.getDocument(url);
    pdfLoadingTask.promise.then(
        r => {
            pdfDoc = r;
            pdfCanvas = canvas;
            pdfCanvasCxt = canvas.getContext('2d');
            pdfCtWidth = width;
            renderInit(cb);
        },
        e => {
            console.log(e);
            notification.error({
                message: 'pdf加载失败',
                description: url,
            });
        }
    );
}
export function loadPdf(url, canvas, width, cb) {
    if (pdfLoadingTask) {
        pdfLoadingTask.destroy().then(() => {
            pdfLoadingTask = null;
            pdfDoc = null;
            pageNum = 1;
            pdfRendering = false;
            _loadPdf(url, canvas, width, cb);
        });
    } else {
        _loadPdf(url, canvas, width, cb);
    }
}
export function renderPage() {
    if (pdfRendering) {
        return;
    }

    pdfDoc.getPage(pageNum).then(
        page => {
            pdfRendering = true;
            const viewport = page.getViewport(pdfScale);
            pdfCanvas.height = viewport.height;
            pdfCanvas.width = viewport.width;

            const renderContext = {
                canvasContext: pdfCanvasCxt,
                viewport
            };
            page.render(renderContext).then(
                () => {
                    pdfRendering = false
                }
            );
        }
    );
}
export function zoomIn() {
    if (pdfScale > scaleMax) {
        return 'stop';
    }
    pdfScale += 0.5;
    renderPage();
    return pdfScale;
}
export function zoomOut() {
    if (pdfScale < scaleMin + 0.1) {
        return 'stop';
    }
    pdfScale -= 0.5;
    renderPage();
    return pdfScale;
}
export function prePage() {
    if (pageNum <= 1) {
        return pageNum;
    }
    pageNum -= 1;
    renderPage();
    return pageNum;
}
export function nextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return pageNum;
    }
    pageNum += 1;
    renderPage();
    return pageNum;
}

export function goTOPage(Num) {
    pageNum = Num;
    if (pageNum >= pdfDoc.numPages) {
        return pageNum;
    }
    renderPage();
    return pageNum;
}