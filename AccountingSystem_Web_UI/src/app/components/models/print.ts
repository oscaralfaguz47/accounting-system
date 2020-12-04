import * as html2pdf from 'html2pdf.js';


export class PrintPdf {
    constructor(public name: string, public htmlElement: string) { }

    downloadPDF() {
        const options = {
            margin: [10, 2, 10, 2],
            filename: this.name,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {},
            jsPDF: { orientation: 'portrait' },
            

        }
        const element: Element = document.getElementById(this.htmlElement);

        html2pdf()
            .from(element)
            .set(options)
            .save();
    }
}