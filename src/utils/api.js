import { getCurrentLogin, delCurrentLogin, getItem, setItem } from './storage';
import moment from 'moment';

const URI = {
  sysConnChk: {
    uri: (server) => `${server}/api/sys/connection`,
    method: 'GET',
    auth: false,
  },
  sysSecretChk: {
    uri: (server, secret) => `${server}/api/sys/secret?secret=${secret}`,
    method: 'GET',
    auth: false,
  },
  sysCodeExp: {
    uri: (server) => `${server}/api/sys/code`,
    method: 'GET',
    auth: false,
  },
  addJob: {
    uri: (server) => `${server}/api/job`,
    method: 'POST',
    auth: true,
  },
  delJob: {
    uri: (server, uuid) => `${server}/api/job/${uuid}`,
    method: 'DELETE',
    auth: true,
  },
  getAllJobs: {
    uri: (server) => `${server}/api/jobs`,
    method: 'GET',
    auth: true,
  },
  getAllRunningRecords: {
    uri: (server) => `${server}/api/running_jobs`,
    method: 'GET',
    auth: true,
  },
  getAllRecords: {
    uri: (server) => `${server}/api/logs`,
    method: 'GET',
    auth: true,
  },
  getRecordsByUUID: {
    uri: (server, uuid) => `${server}/api/job/${uuid}/logs`,
    method: 'GET',
    auth: true,
  },
  getLogByShotId: {
    uri: (server, shot_id) => `${server}/api/log/${shot_id}`,
    method: 'GET',
    auth: true,
  },
};

String.prototype.format = function () {
  let i = 0,
    args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};

function APIError(msg, code) {
  this.type = 'APIError';
  this.message = msg || '连接正常但是返回Code并非0';
  this.code = code;
}

APIError.prototype = Object.create(Error.prototype);
APIError.prototype.constructor = APIError;

async function request(url, method, secret, data) {
  let headerSecret = {};
  // 假设不允许空密码
  if (secret) {
    headerSecret = { Authorization: `Bearer ${secret}` };
  }
  let bodyRequest = {};
  if (data !== undefined) {
    bodyRequest = { body: JSON.stringify(data) };
  }

  //此处不要catch异常 留给上级处理
  const resp = await fetch(url, {
    ...bodyRequest,
    headers: {
      'content-type': 'application/json',
      ...headerSecret,
    },
    method: method,
    mode: 'cors',
  });
  const respObj = await resp.json();
  if (respObj.code !== 0) {
    console.error(respObj);
    throw new APIError(respObj.response, respObj.code);
  }
  return respObj.response;
}

async function checkConnection(server) {
  try {
    const resp = await request(
      URI.sysConnChk.uri(server),
      URI.sysConnChk.method,
    );
    return resp === 'hello';
  } catch (err) {
    return false;
  }
}

async function checkSecret(server, secret) {
  try {
    const resp = await request(
      URI.sysSecretChk.uri(server, secret),
      URI.sysSecretChk.method,
    );
    return resp === 'hello';
  } catch (err) {
    return false;
  }
}

async function getAllJobs(setLogin) {
  const { server, secret } = getCurrentLogin();
  try {
    const resp = await request(
      URI.getAllJobs.uri(server),
      URI.getAllJobs.method,
      secret,
    );
    setItem('jobList', resp);
    console.log('获取到', resp.length, '条job数据');
    return resp;
  } catch (e) {
    console.error(e);
    if (e.type !== 'APIError') {
      // 非APIError则是网络错误
      delCurrentLogin();
      setLogin(false);
    }
    return null;
  }
}

async function recordNameJoin(recordList) {
  let jobList = getItem('jobList', []);
  let flagOutdated = 0; // 当record中的uuid并未出现在job中时flag置未1，证明job已过期需要更新
  if (recordList.length === 0 && jobList.length === 0) {
    // 没有任何任务和记录
    return;
  }
  if (recordList.length !== 0 && jobList.length === 0) {
    jobList = await getAllJobs();
  }
  const uuidMapping = {};
  jobList.map((value) => {
    uuidMapping[value.uuid] = value.name;
  });
  for (let record of recordList) {
    if (!uuidMapping.hasOwnProperty(record.uuid)) {
      console.log(
        'record中的uuid信息不存在于job中，job信息可能已过期',
        record.uuid,
      );
      flagOutdated = 1;
      break;
    }
    record['name'] = uuidMapping[record.uuid];
  }
  if (flagOutdated === 1) {
    console.log('job信息已过期，重新获取');
    await getAllJobs();
    await recordNameJoin(recordList);
  }
}

async function getAllRecords(setLogin) {
  const { server, secret } = getCurrentLogin();
  try {
    const resp = await request(
      URI.getAllRecords.uri(server),
      URI.getAllRecords.method,
      secret,
    );
    console.log('获取到', resp.length, '条record数据');
    await recordNameJoin(resp);
    setItem('recordList', resp);
    return resp;
  } catch (e) {
    console.error(e);
    if (e.type !== 'APIError') {
      // 非APIError则是网络错误
      delCurrentLogin();
      if (setLogin) setLogin(false);
    }
    return null;
  }
}

async function updateTables(setLogin, setJobList, setRecordList, setBreadInfo) {
  const jobList = await getAllJobs(setLogin);
  setJobList(jobList);
  const recordList = await getAllRecords(setLogin);
  setRecordList(recordList);

  const breadInfo = {
    totalJobCount: 0,
    todayRecordCount: 0,
    todayFailedCount: 0,
  };
  breadInfo.totalJobCount = jobList.length;

  const nowString = moment().format('YYYY-MM-DD');
  const todayStart = moment(nowString);
  const todayEnd = moment(nowString).add(moment.duration(24, 'hours'));
  console.log(todayStart.format(), '\n', todayEnd.format());

  for (let record of recordList) {
    let dateStart = moment(record.date_start);
    if (dateStart.isAfter(todayStart) && dateStart.isBefore(todayEnd)) {
      breadInfo.todayRecordCount += 1;
      if (record.state === 'ERROR' || record.state === 'KILLED') {
        breadInfo.todayFailedCount += 1;
      }
    }
  }
  setBreadInfo(breadInfo);
}

async function addJob(data) {
  const { server, secret } = getCurrentLogin();
  try {
    await request(URI.addJob.uri(server), URI.addJob.method, secret, data);
    return 0;
  } catch (e) {
    if (e.type === 'APIError') {
      // 2 为cron表达式无效
      return e.code;
    }
  }
}

async function deleteJobs(uuidList) {
  const { server, secret } = getCurrentLogin();
  try {
    for (let uuid of uuidList) {
      await request(URI.delJob.uri(server, uuid), URI.delJob.method, secret);
    }
    return 0;
  } catch (e) {
    if (e.type === 'APIError') {
      return e.code;
    }
  }
}

async function getLog(shotId) {
  const { server, secret } = getCurrentLogin();
  try {
    const resp = await fetch(URI.getLogByShotId.uri(server, shotId), {
      headers: { Authorization: `Bearer ${secret}` },
    });
    return await resp.text();
  } catch (e) {
    if (e.type === 'APIError') {
      return e.response;
    }
  }
}

export {
  checkConnection,
  checkSecret,
  updateTables,
  addJob,
  getAllRecords,
  deleteJobs,
  getLog,
};
