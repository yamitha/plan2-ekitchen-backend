import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterItem'
})
export class FilterItemPipe implements PipeTransform {

    transform(items: any, searchTerm: any): any {
        // check if search term is undefined
        if (searchTerm === undefined || searchTerm === '') { return items };
        // return updated supplies array
        return items.filter(function(item){
            return item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.kitchenName.toString().toLowerCase().includes(searchTerm.toLowerCase())
        });
    }

}