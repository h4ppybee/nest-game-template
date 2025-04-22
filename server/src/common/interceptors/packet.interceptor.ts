import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { ColorCode } from '../common.define';
import { CommonUtil } from '../common.util';

@Injectable()
export class PacketLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PacketLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((responseBody) => {
        this.writeLog(context, responseBody);
      }),
    );
  }

  private writeLog(context: ExecutionContext, responseBody: any) {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const requestBody = request.body;

    let msg = `\n[${method}] ${url} \n`;
    msg += ` Req: ${JSON.stringify(requestBody)}\n`;
    msg += ` Res: ${JSON.stringify(responseBody)}`;
    this.logger.log(`${CommonUtil.setConsoleColor(msg, ColorCode.WHITE)}`);
  }
}
