const
    fs              = require('file-system'),
    // path            = require("path"),
    dropbox         = require("dropbox")
    // { PDFDocument, StandardFonts, rgb } = require('pdf-lib'),
    // Dropbox         = require('dropbox').Dropbox,
    // $fetch          = require('isomorphic-fetch'),
    // axios           = require('axios').default,
    // btoa            = require('btoa')

const experimental = () => {
  const
      pdfs = [],
      directoryPath = path.join(__dirname, 'data');


  try {
    console.log(fs.existsSync(directoryPath))

    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
      pdfs.push(
          path.join(__dirname, 'data', file)
      );
    });

  }
  catch(e) { console.error(e) }

  const mergePdfs = async (pdfsToMerge) => {

    const mergedPdf = await PDFDocument.create();

    for (const pdfCopyDoc of pdfsToMerge) {

      console.log(
          path.basename(pdfCopyDoc),
          path.extname(pdfCopyDoc)
      )

      if (path.extname(pdfCopyDoc) !== '.pdf') continue;

      const
          pdfBytes    = fs.readFileSync(pdfCopyDoc),
          pdf         = await PDFDocument.load(pdfBytes),
          copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices()),
          displayFont = await pdf.embedFont(StandardFonts.HelveticaBold)

      copiedPages.forEach((page) => {

        const
            { width, height } = page.getSize(),
            fontSize = (Math.floor(width) * 72) * 0.25;

        page.drawText(
            "FOO", // path.basename(pdfCopyDoc),
            {
              x: 0,
              y: 0,
              size: 72,
              font : displayFont,
              color: rgb(1, 0, 0)
            }
        );

        mergedPdf.addPage(page);
      });
    }
    const mergedPdfFile = await mergedPdf.save();
    return mergedPdfFile;
  }

  mergePdfs(pdfs)
      .then((result) => {
        fs.writeFileSync('./merged.pdf', result);
      })
      .catch(error => console.error(error))
}

exports.handler = function(event, context, callback) {

  // experimental();

  callback(null, {
    statusCode: 200,
    body: "Hola, World"
  });
};
