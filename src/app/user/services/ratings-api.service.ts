import { Injectable } from '@angular/core';
import { ApiClientService } from 'app/services';
import { Observable } from "rxjs";

interface IRating {
  rateable_id: number,
  rateable_type: string,
  score: number,
  comment: string
}
@Injectable()
export class RatingsApiService {
  constructor(public apiClient: ApiClientService) {}

  baseUrl: string = '/user/ratings/';

  getDishIds(): Observable<any> {
    return this.apiClient.get(this.baseUrl + 'order_dish_ids').map((responseData) => responseData.json())
  }

  getDishes(ids): Observable<any> {
    return this.apiClient.get(this.baseUrl + 'order_dishes/' + _.join(ids, '-')).map((responseData) => responseData.json())
  }

  create(ratings: IRating[]): Observable<any> {
    return this.apiClient.post(this.baseUrl, this.postData(ratings)).map((responseData) => responseData.json())
  }

  protected postData(ratings: IRating[]) {
    let data = _.map(ratings, (rating: IRating) => {
      let text = rating.comment;
      let score = rating.score;
      if (!text && (isNaN(score) || score == 0)) return null;

      let item = {
        rateable_id: rating.rateable_id,
        rateable_type: rating.rateable_type,
        score: score
      };
      if (text && text.length > 0) {
        item['comment_attributes'] = {text}
      }
      return item;
    });
    data = _.compact(data);

    return JSON.stringify({data});
  }
}
