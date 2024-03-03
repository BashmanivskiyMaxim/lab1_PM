import { PDFDocument, rgb } from 'pdf-lib';
import { Form } from './form.entity';
import * as fontkit from '@pdf-lib/fontkit';

export async function generatePDF(formData: Form): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { data } = formData;

  const url =
    'https://db.onlinewebfonts.com/t/643e59524d730ce6c6f2384eebf945f8.ttf';
  const fontBytes = await fetch(url).then((res) => res.arrayBuffer());

  pdfDoc.registerFontkit(fontkit);
  const customFont = await pdfDoc.embedFont(fontBytes);

  let yPosition = 800;

  page.drawText('Бриф на розробку сайту', {
    x: 50,
    y: yPosition,
    size: 28,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 50;

  Object.entries(data).forEach(([fieldName, fieldValue]) => {
    if (fieldName === 'competitors-object') {
      const competitorsArray = fieldValue as any[];
      competitorsArray.forEach((competitor, index) => {
        const competitorText = Object.entries(competitor)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        const options = {
          x: 50,
          y: yPosition,
          size: 10,
          font: customFont,
          color: rgb(0, 0, 0),
        };
        page.drawText(`Competitor ${index + 1}:\n${competitorText}`, options);
        yPosition -= 95;
      });
    } else {
      const options = {
        x: 50,
        y: yPosition,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
        maxWidth: 500,
        wrap: true,
      };
      page.drawText(`${fieldName}: ${fieldValue}`, options);
      yPosition -= 30;
    }
  });

  return pdfDoc.save();
}
