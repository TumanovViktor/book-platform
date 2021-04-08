import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../model/user';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('/admin/users');
  }

  changeActiveState(user: User) {
      let params = new HttpParams().set("activate", String(user.active));
      return this.http.put(`/admin/users/${user.id}/activate-state`, {}, { params: params } );
  }
}
