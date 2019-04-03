import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router'
import { SuspendsDataService } from '../services'

@Component({
  selector: 'form-suspend',
  styleUrls: [ 'form-suspends.scss' ],
  templateUrl: './form-suspends.html'
})

export class FormSuspendsComponent implements OnInit {
  public item: any;

  @Output()
  public onSuccess: EventEmitter<any> = new EventEmitter();

  protected itemId: number;

  public constructor(
    private route: ActivatedRoute,
    private data: SuspendsDataService) {}

  public ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.itemId = +params['id'];
      if (this.itemId) {
        this.loadObject(this.itemId);
      }
    });
  }

  protected loadObject(itemId: number): void {
    this.data.get(itemId).subscribe(
      (data) => this.item = data
    )
  }
}
