import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterCustomer'
})
export class FilterCustomerPipe implements PipeTransform {

    transform(customers: any, searchTerm: any): any {
        // check if search term is undefined
        if (searchTerm === undefined || searchTerm === '') { return customers };
        // return updated supplies array
        return customers.filter(function(customer){
            return customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.contactNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.address.toLowerCase().includes(searchTerm.toLowerCase())
        });
      }

}