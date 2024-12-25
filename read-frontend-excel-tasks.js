const XLSX = require('xlsx');

module.exports = function readFrontendExcelTasks(path) {
  // 读取 Excel 文件
  const workbook = XLSX.readFile(path || '/Users/xiaokyo/Downloads/前端任务表.xlsx');

  // 获取第一个工作表
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // 将工作表转换为 JSON
  const data = XLSX.utils.sheet_to_json(worksheet);

  const mineTask = data.filter(item => item['__EMPTY_6'] === '小K' && ['进行中', '未开始'].includes(item['__EMPTY_7'])).map(item => {
    const { __EMPTY_2: name, __EMPTY: startDate, __EMPTY_1: endDate, __EMPTY_4: level, __EMPTY_3: jiraUrl, __EMPTY_8: remark } = item;

    return {
      name,
      startDate,
      endDate,
      level,
      jiraUrl,
      remark
    }
  });

  return mineTask
}