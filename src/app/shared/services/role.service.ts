/**
 * Title: role.service.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Role service to direct API calls
 * References: See references.log: line 1
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})

export class RoleService {

  constructor(private http: HttpClient) { }

  // findAllRoles
  findAllRoles(): Observable<any> {
    return this.http.get('/api/roles');
  }

  // findRoleById
  findRoleById(roleId: string): Observable<any> {
    return this.http.get(`/api/roles/${roleId}`);
  }

  // createRole
  createRole(role: Role): Observable<any> {
    return this.http.post(`/api/roles`, {
      text: role.text
    });
  }

  // updateRole
  updateRole(roleId: string, role: Role): Observable<any> {
    return this.http.put(`/api/roles/${roleId}`, {
      text: role.text
    });
  }

  // deleteRole
  deleteRole(roleId: string): Observable<any> {
    return this.http.delete(`/api/roles/${roleId}`);
  }

  // findUserRole
  findUserRole(hubId: string): Observable<any> {
    console.log('hubId from the findUserRole API ' + hubId);
    return this.http.get(`/api/users/${hubId}/role`);
  }

}
