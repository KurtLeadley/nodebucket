/***********************************
; Title:  Task Model
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: Model for all our tasks
***************************************************************/
export interface Task {
  id: string;
  title: string;
  content: string;
  done: boolean;
  creator: string;
}
