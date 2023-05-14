/**
 * Title: user.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Interface for the User schema
 * References: See references.log: line 1
*/

import { SelectedSecurityQuestion } from '../models/selected-security-question';
import { Role } from "./role";

export interface User {
  _id?: string;
  hubId?: string;
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: Role;
  selectedSecurityQuestions?: SelectedSecurityQuestion[];
}
