import { logger } from '../utils/logger.util';

/**
 * 记录请求时间和处理时长的日志中间件
 */
export const LoggerMiddleware = (req, res, next) => {
  const t = new Date();
  logger.info(
    `>>>>>>>> Started { ${req.method} ${req.url} } ${t.toLocaleString()} [${
      req.ip
    }]`,
  );

  res.on('finish', () => {
    const n = new Date();
    const duration = n.getTime() - t.getTime();

    logger.info(
      `<<<<<<<< Completed { ${req.method} ${req.url} } + (耗时${duration}ms)`,
    );

    // 请求日志打印
    if (res.statusCode === 200 || res.statusCode === 201) {
      logger.info(
        `======== Result { ${req.method} ${req.url} } ${req.method} ${req.originalUrl} ${res.statusCode} [${req.ip}]`,
      );
    } else {
      logger.error(
        `======== Failed { ${req.method} ${req.url} } ${req.method} ${req.originalUrl} ${res.statusCode} [${req.ip}]`,
      );
    }
  });

  next();
};
