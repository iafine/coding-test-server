import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { get } from 'lodash'
import { Response } from 'express'
import { getCode, getErrorMessage } from 'src/common/utils/error.util'

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(HttpExceptionsFilter.name)

  async catch(exception, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp()
    const request: Request = ctx.getRequest()
    const response: Response = ctx.getResponse()
    let status: number

    console.log(exception)

    if (exception instanceof HttpException) {
      status = exception.getStatus()
    } else {
      // Case of a PayloadTooLarge
      const type: string | undefined = get(exception, 'type')
      status =
        type === 'entity.too.large'
          ? HttpStatus.PAYLOAD_TOO_LARGE
          : HttpStatus.INTERNAL_SERVER_ERROR
    }

    let code: string =
      exception instanceof HttpException
        ? getCode(exception.getResponse())
        : HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR]
    let message: string =
      exception instanceof HttpException
        ? getErrorMessage(exception.getResponse())
        : 'An internal server error occurred, please contact us at iafineden@gmail.com'

    if (status === HttpStatus.PAYLOAD_TOO_LARGE) {
      code = HttpStatus[HttpStatus.PAYLOAD_TOO_LARGE]
      message = `
        Your request entity size is too big for the server to process it:
          - request size: ${get(exception, 'length')};
          - request limit: ${get(exception, 'limit')}.`
    }
    const exceptionStack: string = 'stack' in exception ? exception.stack : ''
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        {
          message: `${status} [${request.method} ${request.url}] has thrown a critical error`,
          headers: request.headers,
        },
        exceptionStack,
      )
    } else if (status >= HttpStatus.BAD_REQUEST) {
      this.logger.warn({
        message: `${status} [${request.method} ${request.url}] has thrown an HTTP client error`,
        exceptionStack,
        headers: request.headers,
      })
    }

    response.status(status)
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.send({
      code,
      message,
      status,
    })
  }
}
