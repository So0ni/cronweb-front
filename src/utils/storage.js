function randomString(e) {
  e = e || 8;
  let t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz12345678',
    a = t.length,
    n = '';
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}

function getServerHistory() {
  let history = localStorage.getItem('history');
  if (history === null) {
    history = [];
  } else {
    history = JSON.parse(history);
  }
  return history;
}

function addServerHistory(server, secret) {
  let history = getServerHistory();
  let key = `${server}-${secret}`;
  if (history.findIndex((value) => value.key === key) !== -1) {
    return;
  }
  history = [
    {
      server,
      secret,
      key,
    },
    ...history,
  ];
  localStorage.setItem('history', JSON.stringify(history));
}

function delServerHistoryByKey(key) {
  let history = getServerHistory();
  history.splice(
    history.findIndex((value) => value.key === key),
    1,
  );
  localStorage.setItem('history', JSON.stringify(history));
}

function getCurrentLogin() {
  let current = localStorage.getItem('currentLogin');
  if (current === null) {
    current = { server: null, secret: null };
  } else {
    current = JSON.parse(current);
  }
  return current;
}

function setCurrentLogin(_server, _secret) {
  let current = getCurrentLogin();
  current = { ...current, server: _server, secret: _secret };
  localStorage.setItem('currentLogin', JSON.stringify(current));
}

function delCurrentLogin() {
  localStorage.removeItem('currentLogin');
}

export {
  getServerHistory,
  addServerHistory,
  delServerHistoryByKey,
  setCurrentLogin,
  getCurrentLogin,
  delCurrentLogin,
};
