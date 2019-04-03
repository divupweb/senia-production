import { Observable } from "rxjs";
export interface GenerateInvoice {

  generateInvoice(id, period): Observable<any>;
}
