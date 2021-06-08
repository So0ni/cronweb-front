const URI = {
  sysConnChk: { uri: () => '/api/sys/connection', method: 'get', auth: false },
  sysSecretChk: { uri: () => '/api/sys/secret', method: 'get', auth: false },
  sysCodeExp: { uri: () => '/api/sys/code', method: 'get', auth: false },
  addJob: { uri: () => '/api/job', method: 'post', auth: true },
  delJob: { uri: (uuid) => `/api/job/${uuid}`, method: 'delete', auth: true },
  getAllJobs: { uri: () => '/api/jobs', method: 'get', auth: true },
  getAllRunningRecords: {
    uri: () => '/api/running_jobs',
    method: 'get',
    auth: true,
  },
  getAllRecords: { uri: () => '/api/logs', method: 'get', auth: true },
  getRecordsByUUID: {
    uri: (uuid) => `/api/job/${uuid}/logs`,
    method: 'get',
    auth: true,
  },
  getLogByShotId: {
    uri: (shot_id) => `/api/log/${shot_id}`,
    method: 'get',
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

async function request(url, method, data) {
  try {
    // const resp = await fetch()
    // const respObj = await resp.json()
  } catch {}
}
