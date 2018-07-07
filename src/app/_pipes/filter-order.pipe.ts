import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOrder'
})
export class FilterOrderPipe implements PipeTransform {

  transform(orders: any, searchTerm: any): any {
    // check if search term is undefined
    if (searchTerm === undefined || searchTerm === '') { return orders };

    // return updated supplies array
    return orders.filter(function(order){
        return order.kitchenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.kitchenWhatsappNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.eventName.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.eventWhatsappNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.customerName.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerContactNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())
    });

  }

}
