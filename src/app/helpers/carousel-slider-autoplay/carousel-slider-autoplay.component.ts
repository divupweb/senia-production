import {Component, OnInit} from '@angular/core';
import {KitchensApiService, ToastService} from "app/services";

@Component({
  selector: 'kitchens-slider-autoplay',
  providers: [KitchensApiService],
  styleUrls: ['carousel-slider-autoplay.scss'],
  templateUrl: './carousel-slider-autoplay.html',
})

export class CarouselSliderAutoplayComponent implements OnInit {

  public collection: Array<{ image: string, name: string }> = [];

  public config: any = {
    // nextButton: '.button-next',
    // prevButton: '.button-prev',
    slidesPerView: 'auto',
    spaceBetween: -7,
    loop: true,
    autoplay: 1000,
    autoplayDisableOnInteraction: false
  };


  constructor(protected service: KitchensApiService,
              protected toast: ToastService,
  ) {
  }

  public ngOnInit(): void {
    this.service.get().subscribe(
      (kitchens) => this.collection = kitchens.map((k) => ({name: k.name, image: k.display_url})),
      (error) => this.toast.error(error)
    );
  }
}
