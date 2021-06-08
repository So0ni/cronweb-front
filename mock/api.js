export default {
  // 支持值为 Object 和 Array
  'GET /api/jobs': {
    response: [
      {
        uuid: 'ee5141b095d0426dbd3b375aa00de533',
        cron_exp: '*/1 * * * *',
        command: 'python -c "import time;time.sleep(30);print(\'done\')"',
        param: '',
        name: '睡眠',
        date_create: '2021-06-01 00:46:39.090237',
        date_update: '2021-06-01 00:46:39.090237',
      },
    ],
    code: 0,
  },

  'GET /api/logs': {
    response: [
      {
        shot_id: '676389e11bf04195a8c4ac3537b640ac',
        uuid: 'ee5141b095d0426dbd3b375aa00de533',
        state: 'DONE',
        log_path: 'logs\\1622479620020-676389e11bf04195a8c4ac3537b640ac.log',
        date_start: '2021-06-01 00:47:00.020000',
        date_end: '2021-06-01 00:47:30.067080',
      },
    ],
    code: 0,
  },
};
