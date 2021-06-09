import React from 'react';

const cronString = ` ┌───────────── minute (0 - 59)
 │ ┌───────────── hour (0 - 23)
 │ │ ┌───────────── day of the month (1 - 31)
 │ │ │ ┌───────────── month (1 - 12)
 │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday;
 │ │ │ │ │                                   7 is also Sunday on some systems)
 │ │ │ │ │
 │ │ │ │ │
 * * * * * `;

export function CronIntro(props) {
  return (
    <div style={{ width: '50vw', height: '50vh', overflow: 'scroll' }}>
      <pre dangerouslySetInnerHTML={{ __html: cronString }} />
    </div>
  );
}
