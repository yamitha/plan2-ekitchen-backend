import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterKitchen'
})
export class FilterKitchenPipe implements PipeTransform {

  transform(kitchens: any, searchTerm: any): any {
    // check if search term is undefined
    if (searchTerm === undefined || searchTerm === '') { return kitchens };

    // return updated supplies array
    return kitchens.filter(function(kitchen){
        return kitchen.kitchenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kitchen.whatsappNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        kitchen.email.toLowerCase().includes(searchTerm.toLowerCase())
    });

  }

}
