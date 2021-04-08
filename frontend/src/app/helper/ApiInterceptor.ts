import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../../environments/environment';
import {prettyPrint} from './Utils';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiReq = req.clone({ url: `${environment.baseUrl}/${req.url}` });
    // console.log('Doing request: ' +  prettyPrint(apiReq));
    return next.handle(apiReq);
  }
}
