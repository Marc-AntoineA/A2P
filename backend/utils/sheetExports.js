'using strict';

const Excel = require('exceljs');

exports.buildApplicantsAnswers = (process, applicants, filename) => {
  console.log('build', process.label);
  return new Promise((resolve, reject) => {
    const label = process.label;

    // First row = user
    const firstRow = ['User information', '', '', '', '', ''];
    const secondRow =  ['Name', 'Mail', 'Phone', 'status', 'Date application', 'Last modification']

    for (let stepIndex = 0; stepIndex < process.steps.length; stepIndex++) {
      const step = process.steps[stepIndex];
      if (step.pages.length === 0) continue;
      firstRow.push(step.label);
      for (let pageIndex=0; pageIndex < step.pages.length-1; pageIndex++) {
        for (let pageIndex=0; pageIndex < step.pages.length; pageIndex++) {
          firstRow.push('');
        }
      }

      for (let pageIndex=0; pageIndex < step.pages.length; pageIndex++) {
        const page = step.pages[pageIndex];
        for (let questionIndex = 0; questionIndex < page.questions.length; questionIndex++) {
          const question = page.questions[questionIndex];
          secondRow.push(question.label);
        }
      }
    }
    /* make worksheet */
    const ws_data = [firstRow, secondRow];

    for (let applicantIndex=0; applicantIndex < applicants.length; applicantIndex++) {
      const applicant = applicants[applicantIndex];
      const applicantAnswers = [applicant.name, applicant.mailAddress, applicant.phoneNumber, applicant.status, applicant.createdAt, applicant.updatedAt];

      for (let stepIndex = 0; stepIndex < applicant.process.steps.length; stepIndex++) {
        const step = applicant.process.steps[stepIndex];
        for (let pageIndex=0; pageIndex < step.pages.length; pageIndex++) {
          const page = step.pages[pageIndex];
          for (let questionIndex = 0; questionIndex < page.questions.length; questionIndex++) {
            const question = page.questions[questionIndex];
            if (question.type === 'radio') {
              applicantAnswers.push(question.choices[question.answer]);
            } else if (question.type === 'date') {
              const date = new Date(question.answer);
              applicantAnswers.push(date);
            } else {
              applicantAnswers.push(question.answer);
            }
          }
        }
      }
      ws_data.push(applicantAnswers);
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(process.label.slice(1, 20));

    // Why it doesn't work anymore???
    worksheet.views = [
      { state: 'frozen', xSplit: 2, ySplit: 2 }
    ];

    ws_data.forEach((row) => { worksheet.addRow(row)});

    // Merging headers cells + header font
    //for (let columnIndex=0; columnIndex)
    worksheet.getRow(1).height = 20;
    first = 0;
    for (let columnIndex = 1; columnIndex < firstRow.length; columnIndex++) {
      if(firstRow[columnIndex] === '') continue;
      if (first + 1 === columnIndex) continue;
      worksheet.mergeCells(1, first + 1, 1, columnIndex);
      worksheet.getCell(1, first + 1).font = {
        size: 15,
        bold: true
      };
      first = columnIndex;
    }

    if (first + 1 !== firstRow.length)
      worksheet.mergeCells(1, first + 1, firstRow.length);
    worksheet.getCell(1, first + 1).font = {
      size: 15,
      bold: true
    };

    // Computing optimal width
    secondRow.forEach((value, index) => {
      worksheet.getColumn(1 + index).width = Math.max(20, value.length);
      worksheet.getCell(2, 1 + index).font = {
        italic: true
      };
    });
    workbook.xlsx.writeFile(filename)
      .then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
  });
}
