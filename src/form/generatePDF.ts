import { PDFDocument, rgb } from 'pdf-lib';
import { Form } from './form.entity';
import fetch from 'node-fetch';
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
    size: 16,
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
      const text = `${fieldName}: ${fieldValue}`;
      const lines = breakText(text, customFont, 12, 500);
      lines.forEach((line, lineIndex) => {
        page.drawText(line, {
          x: 50,
          y: yPosition - lineIndex * 12,
          size: 12,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      });
      yPosition -= (lines.length + 1) * 12; // Extra space after each line
    }
  });

  return pdfDoc.save();
}

function breakText(
  text: string,
  font: any,
  fontSize: number,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  let currentLine = '';
  const words = text.split(' ');
  for (const word of words) {
    //const width = font.widthOfTextAtSize(word, fontSize);
    if (
      font.widthOfTextAtSize(currentLine + ' ' + word, fontSize) <= maxWidth
    ) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}
