import { Subjects } from '../subjects/subjects.enum';

export interface Event {
  subject: Subjects;
  data: any;
}
