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
    uri: () => '/api/running_jobs',
    method: 'get',
    auth: true,
  },
  getAllRecords: {
    uri: () => '/api/logs',
    method: 'get',
    auth: true,
  },
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

function APIError(msg) {
  this.name = 'APIError';
  this.message = msg || '连接正常但是返回Code并非0';
}

APIError.prototype = Object.create(Error.prototype);
APIError.prototype.constructor = APIError;

async function request(url, method, data, secret) {
  let headerSecret = {};
  if (secret !== undefined) {
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
    throw new APIError(respObj.response);
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

export { checkConnection, checkSecret };
