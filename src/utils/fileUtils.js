import { read, utils ,writeFile } from 'xlsx';
import { Loading } from 'element-ui';
import message from 'element-ui/packages/message';

export const openFileDialogAndReadExcel = () => {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xls,.xlsx,.csv';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', async (event) => {
      const loading = Loading.service({
        lock: true,
        text: '正在读取文件...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        duration: 1000
      });

      try {
        let data = await event.target['files'][0].arrayBuffer();
        setTimeout(async () => {
          await loading.close();
          message.success('文件读取成功');
          let workbook = read(data);
          let sheet = workbook.Sheets[workbook.SheetNames[0]];
          let header = utils.sheet_to_json(sheet, { header: 1 })[0];
          let resArray = utils.sheet_to_json(sheet, { header, range: 1 }).map(row => {
            let formattedRow = {};
            console.log('row:', row);
            header.forEach(key => {
              formattedRow[key] = row[key] === undefined ? '' : row[key];
            });
            return formattedRow;
          });

          console.log('header:', header);
          console.log('resArray:', resArray);

          resolve({ header: header, data: resArray });
        }, 1000);
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(fileInput);
      }
    });

    document.body.appendChild(fileInput);
    fileInput.click();
  });
};


export const exportExcel = (result, fileName) => {
  console.log('result:', result);
  const header = Object.keys(result[0]);
  const data = result.map(row => header.map(key => row[key]));
  const loading = Loading.service({
    lock: true,
    text: '正在导出文件...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.3)',
    duration: 1000
  });

  // Create a new workbook
  const workbook = utils.book_new();

  // Create a new worksheet
  const worksheetData = [header, ...data];
  const worksheet = utils.aoa_to_sheet(worksheetData);

  // Append the worksheet to the workbook
  utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Write the workbook to a file
  writeFile(workbook, fileName + '.xlsx');
  loading.close();
};
