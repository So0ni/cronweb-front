import React from 'react';

const cronString = ` ┌───────────── minute (0 - 59)
 │ ┌───────────── hour (0 - 23)
 │ │ ┌───────────── day of the month (1 - 31)
 │ │ │ ┌───────────── month (1 - 12)
 │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday;
 │ │ │ │ │                                   7 is also Sunday on some systems)
 │ │ │ │ │
 │ │ │ │ │
 * * * * *

 应用示例
 每1分钟          */1 * * * *
 每30分钟         */30 * * * *
 每2小时          * */2 * * *
 每天13:00        0 13 * * *
 每天7:15和19:15  15 7,19 * * *

 错误的用法(歧义): 15,30 7,19 * * *
 `;

export function CronIntro(props) {
  return (
    <div style={{ overflow: 'scroll' }}>
      <pre dangerouslySetInnerHTML={{ __html: cronString }} />
    </div>
  );
}
