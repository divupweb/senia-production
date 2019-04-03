import { Component } from "@angular/core";
import { Analytics } from "app/services";

@Component({
    selector:'catering',
    styleUrls:['../home.scss','./catering.scss'],
    templateUrl:'./catering.html'

})

export class HomeCateringComponent{
    public currentAccount: any = {};
    private filters_column_1 = [
        {label:"filter label 1",options:["option 1","option 2","option 3","option 4","option 5"],activeElement:"default"},
        {label:"filter label 2",options:["option 1","option 2","option 3","option 4","option 5"],activeElement:"default"},
    ]
    private filters_column_2 = [
        {label:"filter label 3",options:["option 1","option 2","option 3","option 4","option 5"],activeElement:"default"},
        {label:"filter label 4",options:["option 1","option 2","option 3","option 4","option 5"],activeElement:"default"},
    ]
    private filters_column_3 = [
        {label:"filter label 5",options:["option 1","option 2","option 3","option 4","option 5"],activeElement:"default"},
    ]
    private filters= [
        this.filters_column_1,
        this.filters_column_2,
        this.filters_column_3
     ];
    private caterings = [
        {
            companyName:"Naust bla bla bla",
            cateringTitle:"Hash House Brunch Catering",
            cateringDescription:"Cuisine:  ",
            cateringDescriptionSpan:"Vegitarian  Brazilian",
            cateringItemCountRight:"48h",
            cateringItemTextRight:"Order Lead time",
            cateringItemCountLeft:"610,-",
            cateringItemTextLeft:"Minimum order"
        },
        {
            companyName:"Naust bla bla bla",
            cateringTitle:"Hash House Brunch Catering",
            cateringDescription:"Cuisine:  ",
            cateringDescriptionSpan:"Vegitarian  Brazilian",
            cateringItemCountRight:"48h",
            cateringItemTextRight:"Order Lead time",
            cateringItemCountLeft:"610,-",
            cateringItemTextLeft:"Minimum order"
        },
        {
            companyName:"Naust bla bla bla",
            cateringTitle:"Hash House Brunch Catering",
            cateringDescription:"Cuisine:  ",
            cateringDescriptionSpan:"Vegitarian  Brazilian",
            cateringItemCountRight:"48h",
            cateringItemTextRight:"Order Lead time",
            cateringItemCountLeft:"610,-",
            cateringItemTextLeft:"Minimum order"
        },
        {
            companyName:"Naust bla bla bla",
            cateringTitle:"Hash House Brunch Catering",
            cateringDescription:"Cuisine:  ",
            cateringDescriptionSpan:"Vegitarian  Brazilian",
            cateringItemCountRight:"48h",
            cateringItemTextRight:"Order Lead time",
            cateringItemCountLeft:"610,-",
            cateringItemTextLeft:"Minimum order"
        },
        {
            companyName:"Naust bla bla bla",
            cateringTitle:"Hash House Brunch Catering",
            cateringDescription:"Cuisine:  ",
            cateringDescriptionSpan:"Vegitarian  Brazilian",
            cateringItemCountRight:"48h",
            cateringItemTextRight:"Order Lead time",
            cateringItemCountLeft:"610,-",
            cateringItemTextLeft:"Minimum order"
        },
        {
            companyName:"Naust bla bla bla",
            cateringTitle:"Hash House Brunch Catering",
            cateringDescription:"Cuisine:  ",
            cateringDescriptionSpan:"Vegitarian  Brazilian",
            cateringItemCountRight:"48h",
            cateringItemTextRight:"Order Lead time",
            cateringItemCountLeft:"610,-",
            cateringItemTextLeft:"Minimum order"
        },
        {
            companyName:"Naust bla bla bla",
            cateringTitle:"Hash House Brunch Catering",
            cateringDescription:"Cuisine:  ",
            cateringDescriptionSpan:"Vegitarian  Brazilian",
            cateringItemCountRight:"48h",
            cateringItemTextRight:"Order Lead time",
            cateringItemCountLeft:"610,-",
            cateringItemTextLeft:"Minimum order"
        },
        {
            companyName:"Naust bla bla bla",
            cateringTitle:"Hash House Brunch Catering",
            cateringDescription:"Cuisine:  ",
            cateringDescriptionSpan:"Vegitarian  Brazilian",
            cateringItemCountRight:"48h",
            cateringItemTextRight:"Order Lead time",
            cateringItemCountLeft:"610,-",
            cateringItemTextLeft:"Minimum order"
        },
    ]
    private popUpToggle(event:Event){
        (<HTMLDivElement>(<HTMLDivElement>event.currentTarget).getElementsByClassName("filter__popup")[0]).classList.toggle("filter__popup_show");
    }
    private filterValueChange(obj,option:string){
        obj.activeElement = option;
    }
    private blurChange(event:Event){
        (<HTMLDivElement>(<HTMLDivElement>event.currentTarget).getElementsByClassName("filter__popup")[0]).classList.remove("filter__popup_show");
    }
}