
module.exports = (server/* , options */) => {
  // handle http request
  server.on('request', (req, res) => {
    const { ruleValue } = req.originalReq;
    // const { url } = req.originalReq;
  if (/^(prepend|append):([\s\S]+)$/.test(ruleValue)) {
      const cmd = RegExp.$1;
      const value = RegExp.$2
      const client = req.request((svrRes) => {
        // 由于内容长度可能有变，删除长度自动改成 chunked
        delete svrRes.headers['content-length'];
        res.writeHead(svrRes.statusCode, svrRes.headers);
        if (cmd === 'prepend') {
          res.write(value);
          svrRes.pipe(res);
        } else {
          svrRes.on('data', data => res.write(data));
          svrRes.on('end', () => res.end(value));
        }
      });
      req.pipe(client);
    } else {
      req.passThrough();
    }
  });

  // handle websocket request
  server.on('upgrade', (req/*, socket*/) => {
    // 修改 websocket 请求用，
    req.passThrough(); // 直接透传
  });

  // handle tunnel request
  server.on('connect', (req/*, socket*/) => {
    // 修改普通 tcp 请求用
    req.passThrough(); // 直接透传
  });
};
