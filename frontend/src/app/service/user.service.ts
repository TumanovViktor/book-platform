import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from "../model/user";
import {prettyPrint} from '../helper/Utils';
import {Observable} from 'rxjs';


@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`/admin/users`);
  }

  register(user: User) {
    return this.http.post(`user/register`, {
      "username": user.username,
      "first_name": user.firstName,
      "last_name": user.lastName,
      "email": user.email,
      "password": user.password
    });
  }

  update(user: any): Observable<User> {
    return this.http.post<User>('user/update-user', {
      "username": user.username,
      "first_name": user.firstName,
      "last_name": user.lastName,
      "email": user.email,
      "password": user.password,
      "image": user.image,
      "userId": user.userId
    });
  }

  delete(id: number) {
    return this.http.delete(`users/${id}`);
  }
}
